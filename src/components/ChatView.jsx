import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Hash, Search, Bell, BellOff, Users, PlusCircle, Smile, Gift, Image as ImageIcon, Crown, Trash, Ban, X, Menu, Download, Pencil, MessageSquare, CornerDownRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MOCK_CHANNEL_NAMES } from '../mockData';
import { useToast } from './Toast';
import useSupabaseMessages from '../hooks/useSupabaseMessages';
import MessageSkeleton from './MessageSkeleton';
import { useAppContext } from '../contexts/AppContext';

const ChatView = ({
    playMessageSend,
    playNotificationSound,
    style
}) => {
    const {
        activeChannelId,
        activeServerId,
        handleBanUser,
        isMemberListOpen, setIsMemberListOpen,
        setIsMobileMenuOpen,
        userProfile,
        preferences,
        mutedServers,
        setMutedServers
    } = useAppContext();

    const onBanUser = handleBanUser;
    const appSoundsEnabled = preferences.appSounds !== false;
    const onToggleMemberList = () => setIsMemberListOpen(!isMemberListOpen);
    const onToggleMobileMenu = () => setIsMobileMenuOpen(true);
    // ── Supabase Realtime: each ChatView instance gets its own subscription ──
    const { messages, sendMessage, deleteMessage, updateMessage, loading } = useSupabaseMessages(activeChannelId, activeServerId);
    const [inputValue, setInputValue] = useState('');
    const [replyingToMessage, setReplyingToMessage] = useState(null);
    const [editingMessageId, setEditingMessageId] = useState(null);
    const [editInputValue, setEditInputValue] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [contextMenu, setContextMenu] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [isDragging, setIsDragging] = useState(false);

    // ── Lightbox state ──
    const [lightboxSrc, setLightboxSrc] = useState(null);

    const { showToast } = useToast();

    const messagesEndRef = useRef(null);
    const messageHistoryRef = useRef(null);
    const fileInputRef = useRef(null);
    const prevLoadingRef = useRef(true);
    const prevMessageCount = useRef(0);

    // ── Auto-scroll & Message Incoming Sound ──
    useEffect(() => {
        if (prevLoadingRef.current && !loading) {
            // Just finished loading → snap to bottom instantly
            if (messageHistoryRef.current) {
                messageHistoryRef.current.scrollTop = messageHistoryRef.current.scrollHeight;
            }
        } else if (!loading) {
            // New message arrived while already loaded
            if (messages.length > prevMessageCount.current) {
                const lastMsg = messages[messages.length - 1];
                // Play notification if the message is from someone else, we are not muted, and it's not an optimistic local insert.
                const isServerMuted = activeServerId && mutedServers[activeServerId];
                if (lastMsg.author !== userProfile.name && !isServerMuted && !lastMsg._optimistic) {
                    if (playNotificationSound) playNotificationSound();
                }
            }
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
        prevLoadingRef.current = loading;
        prevMessageCount.current = messages.length;
    }, [messages, loading, mutedServers, activeServerId, userProfile.name, playNotificationSound]);

    // Close context menu on outside click
    useEffect(() => {
        const handleClickOutside = () => setContextMenu(null);
        window.addEventListener('click', handleClickOutside);
        return () => window.removeEventListener('click', handleClickOutside);
    }, []);

    // ── Lightbox keyboard close ──
    useEffect(() => {
        if (!lightboxSrc) return;
        const handleKey = (e) => {
            if (e.key === 'Escape') setLightboxSrc(null);
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [lightboxSrc]);

    const channelName = activeChannelId ? MOCK_CHANNEL_NAMES[activeChannelId] : 'sélectionnez-un-salon';
    const isDirectMessage = activeServerId === 'home';

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const objectUrl = URL.createObjectURL(file);
            setSelectedImage(objectUrl);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && (inputValue.trim() || selectedImage)) {
            let finalContent = inputValue;
            if (replyingToMessage) {
                // Remove Markdown bold for the stored format to avoid parsing issues later, keep it simple.
                const truncated = replyingToMessage.content.substring(0, 50).replace(/\n/g, ' ');
                finalContent = `> @${replyingToMessage.author} : _${truncated}${replyingToMessage.content.length > 50 ? '...' : ''}_\n\n${inputValue}`;
            }

            sendMessage(finalContent, selectedImage, userProfile);
            setInputValue('');
            setSelectedImage(null);
            setReplyingToMessage(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
            // Play send sound
            if (playMessageSend) playMessageSend();
        }
    };

    const handleEditKeyDown = (e, msgId) => {
        if (e.key === 'Enter' && editInputValue.trim()) {
            updateMessage(msgId, editInputValue);
            setEditingMessageId(null);
            setEditInputValue('');
        } else if (e.key === 'Escape') {
            setEditingMessageId(null);
            setEditInputValue('');
        }
    };

    const renderMessageContent = (msg) => {
        if (msg.content && msg.content.startsWith('> @')) {
            const parts = msg.content.split('\n\n');
            if (parts.length >= 2) {
                const quote = parts[0].substring(2); // remove "> "
                const actualMsg = parts.slice(1).join('\n\n');
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div className="message-reply-preview" style={{ borderLeft: '3px solid var(--text-muted)', paddingLeft: '8px', opacity: 0.7, fontSize: '0.9em', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <CornerDownRight size={14} color="var(--accent-color)" />
                            <span>{quote}</span>
                        </div>
                        <div>{actualMsg}</div>
                    </div>
                );
            }
        }
        return <div>{msg.content}</div>;
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            const objectUrl = URL.createObjectURL(file);
            setSelectedImage(objectUrl);
        }
    };

    const handleMuteToggle = () => {
        if (!activeServerId) return;
        const isServerMuted = mutedServers[activeServerId];
        const newMutedState = !isServerMuted;

        setMutedServers({
            ...mutedServers,
            [activeServerId]: newMutedState
        });

        showToast(!newMutedState ? 'Notifications activées pour ce serveur' : 'Notifications désactivées pour ce serveur', !newMutedState ? 'success' : 'info');
    };

    const handleSendCookie = () => {
        sendMessage("Voici un cookie 🍪 !", null, userProfile);
        showToast("Cookie envoyé !", "success");
        if (playMessageSend) playMessageSend();
    };

    const handleAddEmoji = () => {
        const emojis = ['😂', '😎', '🔥', '🎉', '💡', '🚀', '❤️', '🤔'];
        const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
        setInputValue(prev => prev + randomEmoji);
    };

    const handleDownloadImage = useCallback((src) => {
        const a = document.createElement('a');
        a.href = src;
        a.download = `image_${Date.now()}.png`;
        a.target = '_blank';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }, []);

    const filteredMessages = messages.filter(msg =>
        msg.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        msg.author.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (isDirectMessage) {
        return (
            <div className="chat-view" style={{ justifyContent: 'center', alignItems: 'center', color: 'var(--text-muted)' }}>
                <h2>Messages Directs</h2>
                <p>Sélectionnez un serveur pour voir les salons.</p>
            </div>
        );
    }

    return (
        <div
            className="chat-view"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            style={{ position: 'relative' }}
        >
            {/* Drag & Drop Overlay */}
            {isDragging && (
                <div style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    zIndex: 2000,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '8px',
                    border: '2px dashed var(--accent-color)',
                    margin: '16px'
                }}>
                    <h2 style={{ color: 'white' }}>Glissez et déposez l'image ici</h2>
                </div>
            )}

            <div className="chat-header">
                {onToggleMobileMenu && (
                    <Menu
                        className="mobile-menu-btn"
                        size={24}
                        color="var(--text-header)"
                        cursor="pointer"
                        onClick={onToggleMobileMenu}
                        style={{ marginRight: '12px' }}
                    />
                )}
                <Hash size={24} color="var(--text-muted)" />
                <span className="chat-title">{channelName}</span>
                <span className="chat-topic">Discussion dans {channelName}</span>

                <div style={{ flex: 1 }}></div>

                <div style={{ display: 'flex', gap: '16px', color: 'var(--text-muted)' }}>
                    {mutedServers[activeServerId] ? (
                        <BellOff size={20} cursor="pointer" color="var(--danger-color)" onClick={handleMuteToggle} title="Réactiver les notifications" />
                    ) : (
                        <Bell size={20} cursor="pointer" onClick={handleMuteToggle} title="Mettre en sourdine" />
                    )}
                    <Users size={20} cursor="pointer" onClick={onToggleMemberList} title="Afficher/Masquer la liste des membres" />
                    <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'var(--bg-app)', padding: '2px 8px', borderRadius: '4px' }}>
                        <input
                            type="text"
                            placeholder="Rechercher"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{ background: 'none', border: 'none', color: 'white', width: '120px', outline: 'none', fontSize: '14px' }}
                        />
                        {searchQuery ? (
                            <X size={16} cursor="pointer" onClick={() => setSearchQuery('')} />
                        ) : (
                            <Search size={16} />
                        )}
                    </div>
                </div>
            </div>

            <div className="message-history" ref={messageHistoryRef}>
                {loading ? (
                    <MessageSkeleton count={5} />
                ) : activeChannelId ? (
                    <>
                        {filteredMessages.length > 0 ? filteredMessages.map((msg) => (
                            <motion.div
                                className="message"
                                key={msg.id}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.2 }}
                                style={{ opacity: msg._optimistic ? 0.6 : 1 }}
                                onContextMenu={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();

                                    const menuWidth = 200;
                                    const menuHeight = 100;
                                    let x = e.pageX;
                                    let y = e.pageY;

                                    if (x + menuWidth > window.innerWidth) {
                                        x = window.innerWidth - menuWidth - 10;
                                    }
                                    if (y + menuHeight > window.innerHeight) {
                                        y = window.innerHeight - menuHeight - 10;
                                    }

                                    setContextMenu({
                                        x,
                                        y,
                                        messageId: msg.id,
                                        author: msg.author
                                    });
                                }}
                            >
                                <div
                                    className="message-avatar"
                                    style={{ backgroundImage: `url(${msg.avatar})`, backgroundSize: 'cover' }}
                                ></div>
                                <div>
                                    <div className="message-header">
                                        <span
                                            className="message-author"
                                            style={{
                                                color: msg.role === 'admin' ? 'var(--danger-color)' :
                                                    msg.role === 'moderator' ? 'var(--success-color)' : 'var(--text-header)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '6px'
                                            }}
                                        >
                                            {msg.author}
                                            {msg.role === 'admin' && <Crown size={14} color="var(--accent-color)" />}
                                        </span>
                                        <span className="message-time">{msg.timestamp}</span>
                                    </div>
                                    <div className="message-content">
                                        {editingMessageId === msg.id ? (
                                            <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '6px' }}>
                                                <input
                                                    type="text"
                                                    value={editInputValue}
                                                    onChange={e => setEditInputValue(e.target.value)}
                                                    onKeyDown={e => handleEditKeyDown(e, msg.id)}
                                                    style={{ background: 'var(--bg-active)', border: 'none', color: 'var(--text-normal)', padding: '8px 12px', borderRadius: '4px', outline: 'none' }}
                                                    autoFocus
                                                />
                                                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Échap pour annuler, Entrée pour sauvegarder</span>
                                            </div>
                                        ) : (
                                            msg.content && <div style={{ marginBottom: msg.image ? '8px' : '0' }}>{renderMessageContent(msg)}</div>
                                        )}
                                        {msg.image && (
                                            <img
                                                src={msg.image}
                                                alt="Attachement"
                                                onClick={() => setLightboxSrc(msg.image)}
                                                style={{
                                                    maxHeight: '300px',
                                                    maxWidth: '100%',
                                                    objectFit: 'contain',
                                                    borderRadius: '8px',
                                                    marginTop: '4px',
                                                    cursor: 'pointer',
                                                    transition: 'filter 0.2s',
                                                }}
                                                onMouseEnter={e => e.currentTarget.style.filter = 'brightness(0.85)'}
                                                onMouseLeave={e => e.currentTarget.style.filter = 'brightness(1)'}
                                            />
                                        )}
                                    </div>
                                </div>
                                {/* Message Contextual Actions */}
                                <div className="message-actions" style={{
                                    position: 'absolute', top: '-12px', right: '16px', display: 'flex', background: 'var(--bg-secondary)',
                                    border: '1px solid var(--bg-modifier-accent)', borderRadius: '4px', padding: '2px', opacity: 0, transition: 'opacity 0.2s'
                                }}>
                                    {(msg.author === userProfile.name || userProfile.role === 'admin') && (
                                        <>
                                            <button className="msg-action-btn" onClick={() => { setEditingMessageId(msg.id); setEditInputValue(msg.content.replace(/^> @.*\n\n/, '')); }} title="Modifier">
                                                <Pencil size={16} />
                                            </button>
                                            <button className="msg-action-btn" onClick={() => deleteMessage(msg.id, userProfile)} style={{ color: 'var(--danger-color)' }} title="Supprimer">
                                                <Trash size={16} />
                                            </button>
                                        </>
                                    )}
                                    <button className="msg-action-btn" onClick={() => { setReplyingToMessage(msg); document.querySelector('.chat-input').focus(); }} title="Répondre">
                                        <MessageSquare size={16} />
                                    </button>
                                </div>
                            </motion.div>
                        )) : (
                            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                                {searchQuery ? `Aucun message trouvé pour "${searchQuery}".` : 'Aucun message dans ce salon. Soyez le premier à écrire !'}
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </>
                ) : (
                    <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                        Aucun salon sélectionné.
                    </div>
                )}
            </div>

            <div className="chat-input-area" style={{ position: 'relative' }}>
                <AnimatePresence>
                    {replyingToMessage && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, height: 0 }}
                            animate={{ opacity: 1, y: 0, height: 'auto' }}
                            exit={{ opacity: 0, y: 10, height: 0 }}
                            style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                background: 'var(--bg-active)', padding: '8px 16px', borderTopLeftRadius: '8px', borderTopRightRadius: '8px',
                                borderBottom: '1px solid var(--bg-modifier-accent)', color: 'var(--text-muted)', fontSize: '13px'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <CornerDownRight size={14} color="var(--text-muted)" />
                                <span>Réponse à <span style={{ color: 'var(--text-normal)', fontWeight: 600 }}>@{replyingToMessage.author}</span></span>
                            </div>
                            <button onClick={() => setReplyingToMessage(null)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}><X size={14} /></button>
                        </motion.div>
                    )}
                </AnimatePresence>
                {selectedImage && (
                    <div style={{
                        padding: '12px',
                        backgroundColor: 'var(--bg-active)',
                        borderRadius: replyingToMessage ? '0' : '8px 8px 0 0',
                        display: 'flex',
                        gap: '12px',
                        alignItems: 'center',
                        position: 'relative'
                    }}>
                        <img
                            src={selectedImage}
                            alt="Preview"
                            style={{ height: '80px', borderRadius: '4px', objectFit: 'contain' }}
                        />
                        <button
                            onClick={() => {
                                if (selectedImage && selectedImage.startsWith('blob:')) {
                                    URL.revokeObjectURL(selectedImage);
                                }
                                setSelectedImage(null);
                                if (fileInputRef.current) fileInputRef.current.value = '';
                            }}
                            style={{
                                position: 'absolute', top: '8px', right: '8px',
                                background: 'rgba(0,0,0,0.5)', border: 'none', color: 'white',
                                borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}
                        >
                            ✕
                        </button>
                    </div>
                )}
                <div className="chat-input-wrapper" style={{ borderRadius: (selectedImage || replyingToMessage) ? '0 0 8px 8px' : 'var(--radius-md)' }}>
                    <PlusCircle
                        size={24}
                        color="var(--text-muted)"
                        cursor="pointer"
                        onClick={() => fileInputRef.current?.click()}
                    />
                    <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                    />
                    <input
                        type="text"
                        className="chat-input"
                        placeholder={`Envoyer un message ${activeChannelId ? 'dans #' + channelName : ''}`}
                        disabled={!activeChannelId}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <Gift size={24} color="var(--text-muted)" cursor="pointer" title="Envoyer un cookie 🍪" onClick={handleSendCookie} />
                    <ImageIcon size={24} color="var(--text-muted)" cursor="pointer" title="Joindre une image" onClick={() => fileInputRef.current?.click()} />
                    <Smile size={24} color="var(--text-muted)" cursor="pointer" title="Emoji aléatoire" onClick={handleAddEmoji} />
                </div>
            </div>

            {/* Context Menu */}
            {contextMenu && (
                <div
                    className="context-menu glass-panel"
                    style={{
                        position: 'fixed',
                        top: contextMenu.y,
                        left: contextMenu.x,
                        zIndex: 1000,
                        backgroundColor: 'var(--bg-secondary)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        padding: '8px 0',
                        minWidth: '200px',
                        boxShadow: '0 8px 16px rgba(0,0,0,0.5)'
                    }}
                >
                    {(contextMenu.author === userProfile.name || userProfile.role === 'admin') && (
                        <div className="context-menu-item danger" onClick={(e) => {
                            e.stopPropagation();
                            deleteMessage(contextMenu.messageId, userProfile);
                            setContextMenu(null);
                        }}>
                            <span>Supprimer le message</span>
                            <Trash size={16} />
                        </div>
                    )}
                    <div className="context-menu-item danger" onClick={(e) => {
                        e.stopPropagation();
                        if (onBanUser) onBanUser(contextMenu.author);
                        setContextMenu(null);
                    }}>
                        <span>Bannir {contextMenu.author}</span>
                        <Ban size={16} />
                    </div>
                </div>
            )}

            {/* ── Image Lightbox ── */}
            <AnimatePresence>
                {lightboxSrc && (
                    <motion.div
                        key="lightbox"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={() => setLightboxSrc(null)}
                        style={{
                            position: 'fixed', inset: 0,
                            background: 'rgba(0,0,0,0.85)',
                            backdropFilter: 'blur(8px)',
                            WebkitBackdropFilter: 'blur(8px)',
                            zIndex: 9999,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'zoom-out',
                        }}
                    >
                        {/* Close btn */}
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => { e.stopPropagation(); setLightboxSrc(null); }}
                            style={{
                                position: 'absolute', top: '20px', right: '20px',
                                background: 'rgba(255,255,255,0.1)', border: 'none',
                                color: 'white', width: '44px', height: '44px',
                                borderRadius: '50%', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                backdropFilter: 'blur(12px)',
                            }}
                        >
                            <X size={22} />
                        </motion.button>

                        {/* Download btn */}
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => { e.stopPropagation(); handleDownloadImage(lightboxSrc); }}
                            style={{
                                position: 'absolute', top: '20px', right: '76px',
                                background: 'rgba(255,255,255,0.1)', border: 'none',
                                color: 'white', width: '44px', height: '44px',
                                borderRadius: '50%', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                backdropFilter: 'blur(12px)',
                            }}
                        >
                            <Download size={20} />
                        </motion.button>

                        {/* Image */}
                        <motion.img
                            initial={{ scale: 0.85, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.85, opacity: 0 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                            src={lightboxSrc}
                            alt="Lightbox"
                            onClick={(e) => e.stopPropagation()}
                            style={{
                                maxWidth: '90vw', maxHeight: '85vh',
                                objectFit: 'contain',
                                borderRadius: '12px',
                                boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
                                cursor: 'default',
                            }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ChatView;
