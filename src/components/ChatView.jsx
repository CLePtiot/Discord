import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Hash, Search, Bell, BellOff, Users, PlusCircle, Smile, Gift, Image as ImageIcon, Crown, Trash, Ban, X, Menu, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MOCK_CHANNEL_NAMES } from '../mockData';
import { useToast } from './Toast';
import useSupabaseMessages from '../hooks/useSupabaseMessages';
import MessageSkeleton from './MessageSkeleton';

const ChatView = ({ activeChannelId, activeServerId, onBanUser, onToggleMemberList, onToggleMobileMenu, userProfile, appSoundsEnabled, playMessageSend }) => {
    // ── Supabase Realtime: each ChatView instance gets its own subscription ──
    const { messages, sendMessage, deleteMessage, loading } = useSupabaseMessages(activeChannelId, activeServerId);
    const [inputValue, setInputValue] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [contextMenu, setContextMenu] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isMuted, setIsMuted] = useState(false);

    // ── Lightbox state ──
    const [lightboxSrc, setLightboxSrc] = useState(null);

    const { showToast } = useToast();

    const messagesEndRef = useRef(null);
    const messageHistoryRef = useRef(null);
    const fileInputRef = useRef(null);
    const prevLoadingRef = useRef(true);

    // ── Auto-scroll: smooth for new messages, instant after loading finishes ──
    useEffect(() => {
        if (prevLoadingRef.current && !loading) {
            // Just finished loading → snap to bottom instantly
            if (messageHistoryRef.current) {
                messageHistoryRef.current.scrollTop = messageHistoryRef.current.scrollHeight;
            }
        } else if (!loading) {
            // New message arrived while already loaded → smooth scroll
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
        prevLoadingRef.current = loading;
    }, [messages, loading]);

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
            sendMessage(inputValue, selectedImage, userProfile);
            setInputValue('');
            setSelectedImage(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
            // Play send sound
            if (playMessageSend) playMessageSend();
        }
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
        const newMutedState = !isMuted;
        setIsMuted(newMutedState);
        showToast(newMutedState ? 'Notifications désactivées pour ce salon' : 'Notifications activées pour ce salon', newMutedState ? 'info' : 'success');
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
                    {isMuted ? (
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
                                        {msg.content && <div style={{ marginBottom: msg.image ? '8px' : '0' }}>{msg.content}</div>}
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

            <div className="chat-input-area">
                {selectedImage && (
                    <div style={{
                        padding: '12px',
                        backgroundColor: 'var(--bg-active)',
                        borderRadius: '8px 8px 0 0',
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
                <div className="chat-input-wrapper" style={{ borderRadius: selectedImage ? '0 0 8px 8px' : 'var(--radius-md)' }}>
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
                    <div className="context-menu-item danger" onClick={(e) => {
                        e.stopPropagation();
                        deleteMessage(contextMenu.messageId, userProfile);
                        setContextMenu(null);
                    }}>
                        <span>Supprimer le message</span>
                        <Trash size={16} />
                    </div>
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
