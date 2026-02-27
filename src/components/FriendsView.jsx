import React, { useState, useRef, useEffect, useLayoutEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Users, UserPlus, MoreVertical, MessageSquare, X, UserX, Ban, Volume2, Check, Clock, Music, Radio, ShieldOff, Smile } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from './Toast';
import UserPopoutCard from './UserPopoutCard';
import { useVoiceContext } from '../contexts/VoiceContext';
import { useAppContext } from '../contexts/AppContext';

// ── Framer Motion Variants ──────────────────────────────────────────
const listVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
    hidden: { opacity: 0, y: 14 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
};

// ── Main Component ──────────────────────────────────────────────────
const FriendsView = () => {
    const { startDirectCall } = useVoiceContext();
    const { setActiveServerId, setActiveChannelId, setCurrentView, channelsByServer, setChannelsByServer } = useAppContext();
    const [activeTab, setActiveTab] = useState('En ligne');
    const [addInput, setAddInput] = useState('');
    const [contextMenu, setContextMenu] = useState(null);
    const [popoutUser, setPopoutUser] = useState(null);
    const [popoutPosition, setPopoutPosition] = useState({ top: 0, left: 0 });
    const contextMenuRef = useRef(null);
    const [portalEl, setPortalEl] = useState(null);

    // Create portal container on mount
    useEffect(() => {
        const el = document.createElement('div');
        el.id = 'friends-view-portal';
        document.body.appendChild(el);
        setPortalEl(el);
        return () => {
            document.body.removeChild(el);
            setPortalEl(null);
        };
    }, []);
    const { showToast } = useToast();

    // Tab underline refs
    const tabsContainerRef = useRef(null);
    const tabRefs = useRef({});
    const [underlineStyle, setUnderlineStyle] = useState({ left: 0, width: 0 });

    const [friends, setFriends] = useState([
        { id: 1, name: 'Alice', tag: '#9999', status: 'En ligne', avatar: 'https://i.pravatar.cc/150?img=1', bio: 'Hello world', category: 'friend', activity: 'streaming' },
        { id: 2, name: 'Bob', tag: '#1234', status: 'Hors ligne', avatar: 'https://i.pravatar.cc/150?img=2', bio: 'Sleeping...', category: 'friend', activity: null },
        { id: 3, name: 'Charlie', tag: '#4321', status: 'En ligne', avatar: 'https://i.pravatar.cc/150?img=3', bio: 'Busy coding', category: 'friend', activity: 'listening' },
    ]);

    const [pendingRequests, setPendingRequests] = useState([
        { id: 101, name: 'Dave', tag: '#5678', avatar: 'https://i.pravatar.cc/150?img=4', type: 'incoming' },
    ]);

    const [blockedUsers, setBlockedUsers] = useState([
        { id: 201, name: 'Eve', tag: '#0000', avatar: 'https://i.pravatar.cc/150?img=5' },
    ]);

    const tabs = ['En ligne', 'Tous', 'En attente', 'Bloqué'];

    const filteredFriends = friends.filter(friend => {
        if (activeTab === 'En ligne') return friend.status === 'En ligne';
        if (activeTab === 'Tous') return true;
        return false;
    });

    // ── Sliding underline measurement ───────────────────────────────
    const measureUnderline = useCallback(() => {
        const container = tabsContainerRef.current;
        const currentTabEl = tabRefs.current[activeTab];
        if (container && currentTabEl) {
            const containerRect = container.getBoundingClientRect();
            const tabRect = currentTabEl.getBoundingClientRect();
            setUnderlineStyle({
                left: tabRect.left - containerRect.left,
                width: tabRect.width,
            });
        }
    }, [activeTab]);

    useLayoutEffect(() => {
        measureUnderline();
    }, [measureUnderline]);

    useEffect(() => {
        window.addEventListener('resize', measureUnderline);
        return () => window.removeEventListener('resize', measureUnderline);
    }, [measureUnderline]);

    // Close context menu on outside click
    useEffect(() => {
        if (!contextMenu) return;
        const handleClickOutside = (e) => {
            if (contextMenuRef.current && !contextMenuRef.current.contains(e.target)) {
                setContextMenu(null);
            }
        };
        // Use setTimeout to avoid the same click that opened the menu from closing it
        const timer = setTimeout(() => {
            document.addEventListener('mousedown', handleClickOutside);
        }, 0);
        return () => {
            clearTimeout(timer);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [contextMenu]);

    // --- Handlers ---
    const handleSendMessage = (friend) => {
        const homeChannels = channelsByServer['home'] || [];
        const isAlreadyInDMs = homeChannels.some(cat => cat.channels.some(ch => ch.id === `dm_${friend.id}`));

        if (!isAlreadyInDMs) {
            // We need to add them to a "Messages Privés" category
            const newCategories = [...homeChannels];
            let dmCategory = newCategories.find(c => c.category === 'Messages Privés');
            if (!dmCategory) {
                dmCategory = { category: 'Messages Privés', channels: [] };
                newCategories.push(dmCategory);
            }
            dmCategory.channels.push({ id: `dm_${friend.id}`, name: friend.name, type: 'dm', avatar: friend.avatar });
            setChannelsByServer({ ...channelsByServer, 'home': newCategories });
        }

        setActiveServerId('home');
        setActiveChannelId(`dm_${friend.id}`);
        setCurrentView('chat');
    };

    const handleOpenContextMenu = (e, friendId) => {
        e.stopPropagation();
        const rect = e.currentTarget.getBoundingClientRect();
        const menuWidth = 200;
        const menuHeight = 200;
        let x = rect.right - menuWidth;
        let y = rect.bottom + 8;
        // Clamp within viewport
        if (x < 8) x = 8;
        if (x + menuWidth > window.innerWidth - 8) x = window.innerWidth - menuWidth - 8;
        if (y + menuHeight > window.innerHeight - 8) y = rect.top - menuHeight - 8;
        setContextMenu({ friendId, x, y });
    };

    const handleRemoveFriend = (friendId) => {
        const friend = friends.find(f => f.id === friendId);
        setFriends(prev => prev.filter(f => f.id !== friendId));
        setContextMenu(null);
        showToast(`${friend?.name} retiré de vos amis`, 'info');
    };

    const handleBlockFriend = (friendId) => {
        const friend = friends.find(f => f.id === friendId);
        if (friend) {
            setFriends(prev => prev.filter(f => f.id !== friendId));
            setBlockedUsers(prev => [...prev, { id: friend.id, name: friend.name, tag: friend.tag, avatar: friend.avatar }]);
            showToast(`${friend.name} a été bloqué`, 'error');
        }
        setContextMenu(null);
    };

    const handleUnblock = (userId) => {
        const user = blockedUsers.find(u => u.id === userId);
        setBlockedUsers(prev => prev.filter(u => u.id !== userId));
        if (user) {
            setFriends(prev => [...prev, { ...user, status: 'Hors ligne', bio: '', category: 'friend', activity: null }]);
            showToast(`${user.name} a été débloqué`, 'success');
        }
    };

    const handleAcceptRequest = (requestId) => {
        const req = pendingRequests.find(r => r.id === requestId);
        if (req) {
            setPendingRequests(prev => prev.filter(r => r.id !== requestId));
            setFriends(prev => [...prev, { id: req.id, name: req.name, tag: req.tag, status: 'En ligne', avatar: req.avatar, bio: '', category: 'friend', activity: null }]);
            showToast(`${req.name} ajouté comme ami !`, 'success');
        }
    };

    const handleRejectRequest = (requestId) => {
        const req = pendingRequests.find(r => r.id === requestId);
        setPendingRequests(prev => prev.filter(r => r.id !== requestId));
        showToast(`Demande de ${req?.name} refusée`, 'info');
    };

    const handleSendFriendRequest = () => {
        const name = addInput.trim();
        if (!name) {
            showToast("Veuillez entrer un nom d'utilisateur", 'error');
            return;
        }
        showToast(`Demande d'ami envoyée à ${name}`, 'success');
        setAddInput('');
    };

    const handleAddInputKeyDown = (e) => {
        if (e.key === 'Enter') handleSendFriendRequest();
    };

    // --- Shared Styles ---
    const friendRowStyle = {
        display: 'flex',
        alignItems: 'center',
        padding: '12px',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        cursor: 'pointer',
        transition: 'background 0.15s',
        borderRadius: '8px',
    };

    return (
        <div className="friends-view chat-view">
            {/* Header */}
            <div className="chat-header friends-header" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '0 16px', display: 'flex', alignItems: 'center', height: '48px', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-header)', fontWeight: 600 }}>
                    <Users size={24} />
                    <span>Amis</span>
                </div>

                <div className="friends-tabs" ref={tabsContainerRef} style={{ display: 'flex', gap: '8px', alignItems: 'center', position: 'relative' }}>
                    <div style={{ width: '1px', height: '24px', backgroundColor: 'rgba(255,255,255,0.1)', margin: '0 8px' }}></div>
                    {tabs.map(tab => (
                        <button
                            key={tab}
                            ref={el => { tabRefs.current[tab] = el; }}
                            onClick={() => setActiveTab(tab)}
                            style={{
                                background: activeTab === tab ? 'var(--bg-active)' : 'transparent',
                                color: activeTab === tab ? 'var(--text-header)' : 'var(--text-muted)',
                                border: 'none',
                                padding: '4px 8px',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: 500,
                                transition: 'all 0.2s',
                                position: 'relative',
                            }}
                        >
                            {tab}
                            {tab === 'En attente' && pendingRequests.length > 0 && (
                                <span style={{
                                    marginLeft: '6px',
                                    background: '#da373c',
                                    color: 'white',
                                    borderRadius: '50%',
                                    fontSize: '11px',
                                    fontWeight: 700,
                                    width: '18px',
                                    height: '18px',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>{pendingRequests.length}</span>
                            )}
                        </button>
                    ))}
                    {/* ── Animated sliding underline ── */}
                    <motion.div
                        className="tab-underline"
                        layout
                        animate={{ left: underlineStyle.left, width: underlineStyle.width }}
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        style={{
                            position: 'absolute',
                            bottom: '-6px',
                            height: '3px',
                            borderRadius: '3px',
                            background: 'var(--accent-color, #5865F2)',
                        }}
                    />
                    <button
                        onClick={() => setActiveTab('add')}
                        style={{
                            background: activeTab === 'add' ? 'transparent' : 'var(--success-color, #23a559)',
                            color: activeTab === 'add' ? 'var(--success-color, #23a559)' : 'white',
                            border: 'none',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: 500
                        }}
                    >
                        Ajouter un ami
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="friends-content" style={{ padding: '24px', flex: 1, overflowY: 'auto', position: 'relative' }}>
                <AnimatePresence mode="wait">
                    {/* === Add Friend Tab === */}
                    {activeTab === 'add' && (
                        <motion.div key="add" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="add-friend-section">
                            <h2 style={{ color: 'var(--text-header)', marginBottom: '8px', fontSize: '16px' }}>AJOUTER UN AMI</h2>
                            <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '16px' }}>
                                Vous pouvez ajouter un ami avec son tag Discord. C'est sensible à la casse !
                            </p>
                            <div style={{
                                display: 'flex',
                                background: 'rgba(30,31,34,0.7)',
                                padding: '12px 16px',
                                borderRadius: '8px',
                                border: '1px solid rgba(255,255,255,0.1)',
                                alignItems: 'center'
                            }}>
                                <input
                                    type="text"
                                    value={addInput}
                                    onChange={e => setAddInput(e.target.value)}
                                    onKeyDown={handleAddInputKeyDown}
                                    placeholder="Entrez un nom d'utilisateur#0000"
                                    style={{
                                        flex: 1,
                                        background: 'transparent',
                                        border: 'none',
                                        color: 'var(--text-normal)',
                                        outline: 'none',
                                        fontSize: '16px'
                                    }}
                                />
                                <button
                                    onClick={handleSendFriendRequest}
                                    style={{
                                        background: addInput.trim() ? 'var(--accent-color, #5865F2)' : 'rgba(88,101,242,0.4)',
                                        color: 'white',
                                        border: 'none',
                                        padding: '8px 16px',
                                        borderRadius: '4px',
                                        cursor: addInput.trim() ? 'pointer' : 'not-allowed',
                                        fontWeight: 500,
                                        transition: 'background 0.2s',
                                        whiteSpace: 'nowrap',
                                    }}
                                >
                                    Envoyer une demande d'ami
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* === Pending Requests Tab === */}
                    {activeTab === 'En attente' && (
                        <motion.div key="pending" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <div style={{ marginBottom: '16px', color: 'var(--text-muted)', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' }}>
                                En attente — {pendingRequests.length}
                            </div>
                            {pendingRequests.length > 0 ? (
                                <motion.div variants={listVariants} initial="hidden" animate="visible">
                                    {pendingRequests.map(req => (
                                        <motion.div key={req.id} variants={itemVariants} style={friendRowStyle} className="friend-item-row">
                                            <div style={{ position: 'relative', marginRight: '12px' }}>
                                                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundImage: `url(${req.avatar})`, backgroundSize: 'cover' }}></div>
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ color: 'var(--text-header)', fontWeight: 600 }}>{req.name}<span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>{req.tag}</span></div>
                                                <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
                                                    {req.type === 'incoming' ? 'Demande entrante' : 'Demande sortante'}
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                {req.type === 'incoming' && (
                                                    <motion.button
                                                        whileHover={{ scale: 1.08 }}
                                                        whileTap={{ scale: 0.93 }}
                                                        onClick={() => handleAcceptRequest(req.id)} title="Accepter" style={{
                                                            background: 'rgba(35,165,89,0.15)', border: 'none', color: '#23a559',
                                                            width: '36px', height: '36px', borderRadius: '50%', display: 'flex',
                                                            alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                                                            transition: 'background 0.2s',
                                                        }}>
                                                        <Check size={18} />
                                                    </motion.button>
                                                )}
                                                <motion.button
                                                    whileHover={{ scale: 1.08 }}
                                                    whileTap={{ scale: 0.93 }}
                                                    onClick={() => handleRejectRequest(req.id)} title="Refuser" style={{
                                                        background: 'rgba(218,55,60,0.15)', border: 'none', color: '#da373c',
                                                        width: '36px', height: '36px', borderRadius: '50%', display: 'flex',
                                                        alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                                                        transition: 'background 0.2s',
                                                    }}>
                                                    <X size={18} />
                                                </motion.button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            ) : (
                                <StyledEmptyState
                                    icon={<Clock size={80} />}
                                    title="Aucune demande en attente"
                                    subtitle="Les demandes d'ami que vous recevez apparaîtront ici. Invitez vos amis !"
                                    accentColor="var(--accent-color, #5865F2)"
                                />
                            )}
                        </motion.div>
                    )}

                    {/* === Blocked Tab === */}
                    {activeTab === 'Bloqué' && (
                        <motion.div key="blocked" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <div style={{ marginBottom: '16px', color: 'var(--text-muted)', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' }}>
                                Bloqué — {blockedUsers.length}
                            </div>
                            {blockedUsers.length > 0 ? (
                                <motion.div variants={listVariants} initial="hidden" animate="visible">
                                    {blockedUsers.map(user => (
                                        <motion.div key={user.id} variants={itemVariants} style={friendRowStyle} className="friend-item-row">
                                            <div style={{ position: 'relative', marginRight: '12px' }}>
                                                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundImage: `url(${user.avatar})`, backgroundSize: 'cover', filter: 'grayscale(80%)' }}></div>
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ color: 'var(--text-header)', fontWeight: 600 }}>{user.name}<span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>{user.tag}</span></div>
                                                <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Bloqué</div>
                                            </div>
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.93 }}
                                                onClick={() => handleUnblock(user.id)} style={{
                                                    background: 'rgba(218,55,60,0.15)', border: 'none', color: '#da373c',
                                                    padding: '6px 14px', borderRadius: '4px', cursor: 'pointer', fontWeight: 500,
                                                    fontSize: '13px', transition: 'all 0.2s',
                                                }}>
                                                Débloquer
                                            </motion.button>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            ) : (
                                <StyledEmptyState
                                    icon={<ShieldOff size={80} />}
                                    title="Aucun utilisateur bloqué"
                                    subtitle="Tout va bien ! Vous n'avez bloqué personne pour le moment."
                                    accentColor="#23a559"
                                />
                            )}
                        </motion.div>
                    )}

                    {/* === Friends List (En ligne / Tous) === */}
                    {(activeTab === 'En ligne' || activeTab === 'Tous') && (
                        <motion.div key={activeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <div style={{ marginBottom: '16px', color: 'var(--text-muted)', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' }}>
                                {activeTab} — {filteredFriends.length}
                            </div>
                            <motion.div className="friends-list" variants={listVariants} initial="hidden" animate="visible">
                                {filteredFriends.length > 0 ? filteredFriends.map(friend => (
                                    <motion.div
                                        key={friend.id}
                                        variants={itemVariants}
                                        style={friendRowStyle}
                                        className="friend-item-row"
                                        onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)'}
                                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                                        onClick={(e) => {
                                            const rect = e.currentTarget.getBoundingClientRect();
                                            let top = rect.top;
                                            let left = rect.right + 12;
                                            // If popout would overflow right, show to the left
                                            if (left + 320 > window.innerWidth) left = rect.left - 332;
                                            // Clamp vertically
                                            if (top + 400 > window.innerHeight) top = window.innerHeight - 410;
                                            if (top < 8) top = 8;
                                            setPopoutUser({
                                                name: friend.name,
                                                avatar: friend.avatar,
                                                bio: friend.bio,
                                                banner: '#5865F2',
                                                status: friend.status,
                                            });
                                            setPopoutPosition({ top, left });
                                        }}
                                    >
                                        {/* Avatar with status dot + optional activity border */}
                                        <div style={{ position: 'relative', marginRight: '12px' }}>
                                            <div className={friend.activity ? 'friend-avatar-activity' : ''}>
                                                <div style={{
                                                    width: '32px', height: '32px', borderRadius: '50%',
                                                    backgroundImage: `url(${friend.avatar})`, backgroundSize: 'cover',
                                                    position: 'relative', zIndex: 1,
                                                }}></div>
                                            </div>
                                            {/* Status dot — pulsing if online */}
                                            <div
                                                className={friend.status === 'En ligne' ? 'friend-status-dot-online' : ''}
                                                style={{
                                                    position: 'absolute', bottom: -2, right: -2,
                                                    width: '12px', height: '12px', borderRadius: '50%',
                                                    backgroundColor: friend.status === 'En ligne' ? 'var(--success-color, #23a559)' : 'var(--text-muted)',
                                                    border: '2px solid var(--bg-chat, #1e1f22)',
                                                    zIndex: 2,
                                                }}
                                            ></div>
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ color: 'var(--text-header)', fontWeight: 600 }}>
                                                {friend.name}<span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>{friend.tag}</span>
                                            </div>
                                            <div style={{ color: 'var(--text-muted)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                {friend.status}
                                                {friend.activity === 'streaming' && (
                                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', color: '#9146ff', fontSize: '12px' }}>
                                                        <Radio size={12} /> En stream
                                                    </span>
                                                )}
                                                {friend.activity === 'listening' && (
                                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', color: '#1DB954', fontSize: '12px' }}>
                                                        <Music size={12} /> Écoute
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button onClick={(e) => { e.stopPropagation(); handleSendMessage(friend); }} title="Envoyer un message" style={{
                                                background: 'rgba(255,255,255,0.07)', border: 'none', color: 'var(--text-muted)',
                                                width: '36px', height: '36px', borderRadius: '50%', display: 'flex',
                                                alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                                                transition: 'all 0.2s',
                                            }}
                                                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.14)'; e.currentTarget.style.color = 'white'; }}
                                                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
                                            >
                                                <MessageSquare size={18} />
                                            </button>
                                            <button onClick={(e) => handleOpenContextMenu(e, friend.id)} title="Plus d'options" style={{
                                                background: 'rgba(255,255,255,0.07)', border: 'none', color: 'var(--text-muted)',
                                                width: '36px', height: '36px', borderRadius: '50%', display: 'flex',
                                                alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                                                transition: 'all 0.2s',
                                            }}
                                                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.14)'; e.currentTarget.style.color = 'white'; }}
                                                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
                                            >
                                                <MoreVertical size={18} />
                                            </button>
                                        </div>
                                    </motion.div>
                                )) : (
                                    <StyledEmptyState
                                        icon={<Smile size={80} />}
                                        title="Wumpus est tout seul…"
                                        subtitle="Personne n'est dans les parages. Ajoutez des amis pour commencer !"
                                        accentColor="var(--accent-color, #5865F2)"
                                    />
                                )}
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Context Menu + PopoutCard via Portal */}
            {portalEl && createPortal(
                <>
                    <AnimatePresence>
                        {contextMenu && (
                            <motion.div
                                ref={contextMenuRef}
                                initial={{ opacity: 0, scale: 0.95, y: -4 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: -4 }}
                                transition={{ duration: 0.12 }}
                                style={{
                                    position: 'fixed',
                                    top: contextMenu.y,
                                    left: contextMenu.x,
                                    minWidth: '188px',
                                    background: '#111214',
                                    borderRadius: '8px',
                                    border: '1px solid rgba(255,255,255,0.12)',
                                    boxShadow: '0 12px 32px rgba(0,0,0,0.55)',
                                    padding: '6px',
                                    zIndex: 99999,
                                }}
                            >
                                <ContextMenuItem
                                    icon={<MessageSquare size={16} color="var(--text-muted)" />}
                                    label="Envoyer un message"
                                    onClick={() => {
                                        const friend = friends.find(f => f.id === contextMenu.friendId);
                                        if (friend) handleSendMessage(friend);
                                        setContextMenu(null);
                                    }}
                                />
                                <ContextMenuItem
                                    icon={<Volume2 size={16} color="var(--text-muted)" />}
                                    label="Appeler"
                                    onClick={() => {
                                        startDirectCall(contextMenu.friendId);
                                        setContextMenu(null);
                                    }}
                                />
                                <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', margin: '4px 0' }}></div>
                                <ContextMenuItem
                                    icon={<UserX size={16} color="#da373c" />}
                                    label="Retirer l'ami"
                                    danger
                                    onClick={() => handleRemoveFriend(contextMenu.friendId)}
                                />
                                <ContextMenuItem
                                    icon={<Ban size={16} color="#da373c" />}
                                    label="Bloquer"
                                    danger
                                    onClick={() => handleBlockFriend(contextMenu.friendId)}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {popoutUser && (
                        <div style={{ pointerEvents: 'auto' }}>
                            <UserPopoutCard
                                user={popoutUser}
                                position={popoutPosition}
                                onClose={() => setPopoutUser(null)}
                            />
                        </div>
                    )}
                </>,
                portalEl
            )}
        </div>
    );
};

// ── Sub-Components ──────────────────────────────────────────────────

/** Redesigned empty state with rings + icon + encouraging message */
const StyledEmptyState = ({ icon, title, subtitle, accentColor }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', marginTop: '60px', textAlign: 'center',
        }}
    >
        {/* Concentric rings decoration */}
        <div style={{ position: 'relative', width: '160px', height: '160px', marginBottom: '24px' }}>
            {/* Outer ring */}
            <div style={{
                position: 'absolute', inset: 0, borderRadius: '50%',
                border: `2px solid ${accentColor}`, opacity: 0.08,
            }} />
            {/* Middle ring */}
            <div style={{
                position: 'absolute', inset: '16px', borderRadius: '50%',
                border: `2px solid ${accentColor}`, opacity: 0.12,
            }} />
            {/* Inner circle with icon */}
            <div className="friend-empty-breathe" style={{
                position: 'absolute', inset: '32px', borderRadius: '50%',
                background: `linear-gradient(135deg, ${accentColor}10, ${accentColor}08)`,
                border: `1px solid ${accentColor}18`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
                {React.cloneElement(icon, { color: accentColor, opacity: 0.35, size: 48 })}
            </div>
        </div>
        <h3 style={{ color: 'var(--text-header)', fontWeight: 600, fontSize: '18px', marginBottom: '8px' }}>
            {title}
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', maxWidth: '320px', lineHeight: 1.5 }}>
            {subtitle}
        </p>
    </motion.div>
);

/** Context menu item with colored icons for danger actions */
const ContextMenuItem = ({ icon, label, onClick, danger }) => (
    <div
        onClick={onClick}
        style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '8px 10px', borderRadius: '4px', cursor: 'pointer',
            fontSize: '14px', fontWeight: 500,
            color: danger ? '#da373c' : 'var(--text-normal)',
            transition: 'background 0.12s',
        }}
        onMouseEnter={e => {
            e.currentTarget.style.backgroundColor = danger ? 'rgba(218,55,60,0.15)' : 'var(--accent-color, #5865F2)';
            if (!danger) e.currentTarget.style.color = 'white';
        }}
        onMouseLeave={e => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = danger ? '#da373c' : 'var(--text-normal)';
        }}
    >
        {icon}
        <span>{label}</span>
    </div>
);

export default FriendsView;
