import React, { useState, useRef, useEffect } from 'react';
import { Hash, Search, Bell, BellOff, Users, PlusCircle, Smile, Gift, Image as ImageIcon, Crown, Trash, Ban } from 'lucide-react';
import { motion } from 'framer-motion';
import { MOCK_CHANNEL_NAMES } from '../mockData';

const ChatView = ({ activeChannelId, activeServerId, messages, onSendMessage, onRemoveMessage, onBanUser, onToggleMemberList }) => {
    const [inputValue, setInputValue] = useState('');
    const [contextMenu, setContextMenu] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isMuted, setIsMuted] = useState(false);

    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, selectedImage]);

    // Close context menu on outside click
    useEffect(() => {
        const handleClickOutside = () => setContextMenu(null);
        window.addEventListener('click', handleClickOutside);
        return () => window.removeEventListener('click', handleClickOutside);
    }, []);

    const channelName = activeChannelId ? MOCK_CHANNEL_NAMES[activeChannelId] : 'sélectionnez-un-salon';
    const isDirectMessage = activeServerId === 'home';

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setSelectedImage(event.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && (inputValue.trim() || selectedImage)) {
            onSendMessage(inputValue, selectedImage);
            setInputValue('');
            setSelectedImage(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
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
            const reader = new FileReader();
            reader.onload = (event) => {
                setSelectedImage(event.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

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
                <Hash size={24} color="var(--text-muted)" />
                <span className="chat-title">{channelName}</span>
                <span className="chat-topic">Discussion dans {channelName}</span>

                <div style={{ flex: 1 }}></div>

                <div style={{ display: 'flex', gap: '16px', color: 'var(--text-muted)' }}>
                    {isMuted ? (
                        <BellOff size={20} cursor="pointer" color="var(--danger-color)" onClick={() => setIsMuted(false)} title="Réactiver les notifications" />
                    ) : (
                        <Bell size={20} cursor="pointer" onClick={() => setIsMuted(true)} title="Mettre en sourdine" />
                    )}
                    <Users size={20} cursor="pointer" onClick={onToggleMemberList} title="Afficher/Masquer la liste des membres" />
                    <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'var(--bg-app)', padding: '2px 8px', borderRadius: '4px' }}>
                        <input type="text" placeholder="Rechercher" style={{ background: 'none', border: 'none', color: 'white', width: '120px', outline: 'none', fontSize: '14px' }} />
                        <Search size={16} />
                    </div>
                </div>
            </div>

            <div className="message-history">
                {activeChannelId ? (
                    <>
                        {messages.map((msg) => (
                            <motion.div
                                className="message"
                                key={msg.id}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.2 }}
                                onContextMenu={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();

                                    const menuWidth = 200; // estimated width
                                    const menuHeight = 100; // estimated height
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
                                                style={{
                                                    maxHeight: '300px',
                                                    maxWidth: '100%',
                                                    objectFit: 'contain',
                                                    borderRadius: '8px',
                                                    marginTop: '4px'
                                                }}
                                            />
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                        {/* Invisible div to scroll to bottom */}
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
                            onClick={() => setSelectedImage(null)}
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
                    <Gift size={24} color="var(--text-muted)" cursor="pointer" title="Envoyer un cadeau" onClick={() => setInputValue(prev => prev + '🎁 cadeau ')} />
                    <ImageIcon size={24} color="var(--text-muted)" cursor="pointer" title="Joindre une image" onClick={() => fileInputRef.current?.click()} />
                    <Smile size={24} color="var(--text-muted)" cursor="pointer" title="Emoji" onClick={() => setInputValue(prev => prev + '😊 ')} />
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
                        if (onRemoveMessage) onRemoveMessage(contextMenu.messageId);
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
        </div>
    );
};

export default ChatView;
