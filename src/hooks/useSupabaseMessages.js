import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '../supabaseClient';

/**
 * Hook to manage messages for a SINGLE channel via Supabase Realtime.
 * For split-view, call this hook once per open channel in ChatView.
 *
 * Falls back to localStorage mock data if Supabase is not configured.
 */
export default function useSupabaseMessages(channelId, serverId) {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const channelRef = useRef(null);

    // ── Fetch existing messages on channel change ──
    useEffect(() => {
        if (!channelId) {
            setMessages([]);
            setLoading(false);
            return;
        }

        // Fallback: no Supabase configured → use localStorage per channel
        if (!supabase) {
            try {
                const storageKey = `freedom-msgs-${serverId}-${channelId}`;
                const raw = localStorage.getItem(storageKey);
                if (raw) {
                    let parsed;
                    try {
                        parsed = JSON.parse(atob(raw));
                    } catch {
                        parsed = JSON.parse(raw);
                    }
                    setMessages(Array.isArray(parsed) ? parsed : []);
                } else {
                    setMessages([]);
                }
            } catch {
                setMessages([]);
            }
            setLoading(false);
            return;
        }

        let cancelled = false;
        setLoading(true);

        const fetchMessages = async () => {
            const { data, error } = await supabase
                .from('messages')
                .select('*')
                .eq('channel_id', channelId)
                .eq('server_id', serverId)
                .order('created_at', { ascending: true })
                .limit(100);

            if (!cancelled) {
                if (error) {
                    console.error('Erreur chargement messages:', error);
                    setMessages([]);
                } else {
                    setMessages(
                        (data || []).map(row => ({
                            id: row.id,
                            author: row.author,
                            avatar: row.avatar,
                            content: row.content,
                            image: row.image,
                            role: row.role,
                            timestamp: formatTimestamp(row.created_at),
                        }))
                    );
                }
                setLoading(false);
            }
        };

        fetchMessages();
        return () => { cancelled = true; };
    }, [channelId, serverId]);

    // ── Persist to localStorage when offline ──
    useEffect(() => {
        if (supabase || !channelId) return;
        const storageKey = `freedom-msgs-${serverId}-${channelId}`;
        if (messages.length > 0) {
            try {
                localStorage.setItem(storageKey, btoa(JSON.stringify(messages)));
            } catch { /* ignore quota errors */ }
        } else {
            localStorage.removeItem(storageKey);
        }
    }, [messages, channelId, serverId]);

    // ── Realtime subscription ──
    useEffect(() => {
        if (!supabase || !channelId) return;

        const realtimeChannel = supabase
            .channel(`messages:${serverId}:${channelId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages',
                    filter: `channel_id=eq.${channelId}`,
                },
                (payload) => {
                    const row = payload.new;
                    // Avoid duplicate from optimistic insert (same id)
                    setMessages(prev => {
                        if (prev.some(m => m.id === row.id)) return prev;
                        return [
                            ...prev,
                            {
                                id: row.id,
                                author: row.author,
                                avatar: row.avatar,
                                content: row.content,
                                image: row.image,
                                role: row.role,
                                timestamp: formatTimestamp(row.created_at),
                            },
                        ];
                    });
                }
            )
            .on(
                'postgres_changes',
                {
                    event: 'DELETE',
                    schema: 'public',
                    table: 'messages',
                    filter: `channel_id=eq.${channelId}`,
                },
                (payload) => {
                    const deletedId = payload.old.id;
                    setMessages(prev => prev.filter(m => m.id !== deletedId));
                }
            )
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'messages',
                    filter: `channel_id=eq.${channelId}`,
                },
                (payload) => {
                    const row = payload.new;
                    setMessages(prev => prev.map(m => m.id === row.id ? { ...m, content: row.content, _isEdited: true } : m));
                }
            )
            .subscribe();

        channelRef.current = realtimeChannel;

        // Cleanup: unsubscribe when channel changes or unmount
        return () => {
            supabase.removeChannel(realtimeChannel);
            channelRef.current = null;
        };
    }, [channelId, serverId]);

    // ── Send message (Optimistic UI) ──
    const sendMessage = useCallback(async (content, image, userProfile) => {
        if (!content?.trim() && !image) return;

        const optimisticId = typeof crypto !== 'undefined' && crypto.randomUUID
            ? crypto.randomUUID()
            : Date.now().toString(36) + Math.random().toString(36).substring(2);
        const now = new Date();
        const timeString = `Aujourd'hui à ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

        const optimisticMsg = {
            id: optimisticId,
            author: userProfile.name,
            avatar: userProfile.avatar,
            content: (content || '').trim(),
            image: image,
            role: 'admin',
            timestamp: timeString,
            _optimistic: true, // marker
        };

        // Instant display (Optimistic UI)
        setMessages(prev => [...prev, { ...optimisticMsg, _optimistic: !!supabase }]);

        if (!supabase) {
            // Offline fallback: persisted via useEffect above
            return;
        }

        const { data, error } = await supabase.from('messages').insert({
            channel_id: channelId,
            server_id: serverId,
            author: userProfile.name,
            avatar: userProfile.avatar,
            content: (content || '').trim(),
            image: image,
            role: 'admin',
        }).select().single();

        if (error) {
            console.error('Erreur envoi message:', error);
            // Remove optimistic message on failure
            setMessages(prev => prev.filter(m => m.id !== optimisticId));
            return;
        }

        // Replace optimistic message with the real server-confirmed one
        if (data) {
            setMessages(prev =>
                prev.map(m =>
                    m.id === optimisticId
                        ? {
                            id: data.id,
                            author: data.author,
                            avatar: data.avatar,
                            content: data.content,
                            image: data.image,
                            role: data.role,
                            timestamp: formatTimestamp(data.created_at),
                        }
                        : m
                )
            );
        }
    }, [channelId, serverId]);

    // ── Delete message ──
    const deleteMessage = useCallback(async (messageId, userProfile) => {
        // Optimistic removal
        setMessages(prev => prev.filter(m => m.id !== messageId));

        if (!supabase) return;

        const { error } = await supabase
            .from('messages')
            .delete()
            .eq('id', messageId);

        if (error) {
            console.error('Erreur suppression message:', error);
        }
    }, []);

    // ── Update message ──
    const updateMessage = useCallback(async (messageId, newContent) => {
        setMessages(prev => prev.map(m => m.id === messageId ? { ...m, content: newContent, _isEdited: true } : m));

        if (!supabase) return;

        const { error } = await supabase
            .from('messages')
            .update({ content: newContent })
            .eq('id', messageId);

        if (error) console.error('Erreur modification message:', error);
    }, []);

    return { messages, setMessages, sendMessage, deleteMessage, updateMessage, loading };
}

// ── Helper ──
function formatTimestamp(isoString) {
    if (!isoString) return '';
    const date = new Date(isoString);
    const now = new Date();
    const isToday =
        date.getDate() === now.getDate() &&
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear();

    const time = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    return isToday ? `Aujourd'hui à ${time}` : `${date.toLocaleDateString('fr-FR')} à ${time}`;
}
