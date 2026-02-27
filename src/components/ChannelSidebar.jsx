import React, { useState, useEffect, useRef } from 'react';
import { Hash, Volume2, Mic, MicOff, Headphones, HeadphoneOff, Settings, ChevronDown, Users, PhoneOff, Monitor, PlusCircle, Trash2, Lock, Check, Moon, CircleOff, Circle } from 'lucide-react';
import { useToast } from './Toast';
import { useAppContext } from '../contexts/AppContext';
import { useVoiceContext } from '../contexts/VoiceContext';
import { useTranslation } from '../contexts/LanguageContext';
import CreateChannelModal from './CreateChannelModal';
import DeleteChannelModal from './DeleteChannelModal';
import { motion, AnimatePresence } from 'framer-motion';

const ChannelSidebar = () => {
    const {
        activeServer, serverChannels, activeChannelId, setActiveChannelId,
        currentView, setCurrentView, setIsMobileMenuOpen,
        userProfile, setUserProfile, setIsSettingsOpen, setIsServerSettingsOpen,
        channelsByServer, setChannelsByServer, activeServerId
    } = useAppContext();
    const { t } = useTranslation();

    const {
        activeVoiceChannelId, setActiveVoiceChannelId, isSpeaking, setIsSpeaking,
        isMuted, isDeafened, isScreenSharing, mediaStreamRef, handleVoiceDisconnect,
        toggleMute, toggleDeafen, toggleScreenShare
    } = useVoiceContext();

    const audioContextRef = useRef(null);
    const analyserRef = useRef(null);
    const animationFrameRef = useRef(null);
    const { showToast } = useToast();

    const serverName = activeServer?.name || 'Unknown';
    const categories = serverChannels || [];
    const isFriendsViewActive = currentView === 'friends';
    const [createChannelModal, setCreateChannelModal] = useState({ isOpen: false, categoryName: '' });
    const [deleteChannelModal, setDeleteChannelModal] = useState({ isOpen: false, categoryName: '', channelId: '', channelName: '' });
    const [showStatusMenu, setShowStatusMenu] = useState(false);
    const statusMenuRef = useRef(null);
    const statusTriggerRef = useRef(null);

    // Close status menu on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (statusMenuRef.current &&
                !statusMenuRef.current.contains(event.target) &&
                statusTriggerRef.current &&
                !statusTriggerRef.current.contains(event.target)) {
                setShowStatusMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Find the active voice channel name
    const getActiveVoiceChannelName = () => {
        if (!activeVoiceChannelId) return '';
        for (const cat of categories) {
            for (const ch of cat.channels) {
                if (ch.id === activeVoiceChannelId) return ch.name;
            }
        }
        return 'Vocal';
    };

    useEffect(() => {
        if (!activeVoiceChannelId) {
            setIsSpeaking(false);
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
            if (mediaStreamRef.current) mediaStreamRef.current.getTracks().forEach(track => track.stop());
            if (audioContextRef.current && audioContextRef.current.state !== 'closed') audioContextRef.current.close();
            return;
        }

        const startMic = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
                mediaStreamRef.current = stream;

                const AudioContext = window.AudioContext || window.webkitAudioContext;
                audioContextRef.current = new AudioContext();
                analyserRef.current = audioContextRef.current.createAnalyser();
                analyserRef.current.fftSize = 256;

                const source = audioContextRef.current.createMediaStreamSource(stream);
                source.connect(analyserRef.current);

                const checkVolume = () => {
                    if (!analyserRef.current) return;
                    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
                    analyserRef.current.getByteFrequencyData(dataArray);

                    let sum = 0;
                    for (let i = 0; i < dataArray.length; i++) sum += dataArray[i];
                    const avg = sum / dataArray.length;
                    setIsSpeaking(avg > 15);
                    animationFrameRef.current = requestAnimationFrame(checkVolume);
                };
                checkVolume();
            } catch (err) {
                console.error("Mic access denied in sidebar.", err);
            }
        };

        startMic();

        return () => {
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
            if (mediaStreamRef.current) mediaStreamRef.current.getTracks().forEach(track => track.stop());
            if (audioContextRef.current && audioContextRef.current.state !== 'closed') audioContextRef.current.close();
        };
    }, [activeVoiceChannelId, setIsSpeaking, mediaStreamRef]);

    const handleCreateChannel = (channelName, channelType, isPrivate) => {
        const { categoryName } = createChannelModal;

        // Find the category and add the new channel
        const updatedCategories = categories.map(cat => {
            if (cat.category === categoryName) {
                return {
                    ...cat,
                    channels: [
                        ...cat.channels,
                        { id: `c_${Date.now()}`, name: channelName, type: channelType, isPrivate }
                    ]
                };
            }
            return cat;
        });

        // Update global context
        setChannelsByServer({
            ...channelsByServer,
            [activeServerId]: updatedCategories
        });

        setCreateChannelModal({ isOpen: false, categoryName: '' });
        showToast(`Salon ${channelName} créé`, 'success');
    };

    const handleDeleteChannel = (categoryName, channelId) => {
        const updatedCategories = categories.map(cat => {
            if (cat.category === categoryName) {
                return {
                    ...cat,
                    channels: cat.channels.filter(ch => ch.id !== channelId)
                };
            }
            return cat;
        });
        setChannelsByServer({
            ...channelsByServer,
            [activeServerId]: updatedCategories
        });

        setDeleteChannelModal({ isOpen: false, categoryName: '', channelId: '', channelName: '' });
        showToast('Salon supprimé', 'success');

        if (activeChannelId === channelId) setActiveChannelId(null);
        if (activeVoiceChannelId === channelId) handleVoiceDisconnect();
    };

    return (
        <div className="channel-sidebar glass-panel">
            <div className="channel-header" onClick={() => setIsServerSettingsOpen(true)}>
                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{serverName}</span>
                <ChevronDown size={18} />
            </div>

            <div className="channel-list">
                <div
                    className={`channel-item ${isFriendsViewActive ? 'active' : ''}`}
                    onClick={() => {
                        setCurrentView('friends');
                        setIsMobileMenuOpen(false);
                    }}
                    style={{ marginBottom: '16px' }}
                >
                    <Users size={18} />
                    <span>Amis</span>
                </div>

                {categories.length === 0 && (
                    <div style={{ padding: '16px', color: 'var(--text-muted)', textAlign: 'center', fontSize: '14px' }}>
                        Aucun salon
                    </div>
                )}

                {categories.map((category, catIdx) => (
                    <React.Fragment key={catIdx}>
                        <div className="category" style={{ marginTop: catIdx > 0 ? '16px' : '0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <ChevronDown size={12} />
                                {category.category}
                            </div>
                            {/* NEW: Plus button to create channels (not fully wired yet but UI is present as requested in audit) */}
                            <PlusCircle
                                size={14}
                                cursor="pointer"
                                title="Créer un salon"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setCreateChannelModal({ isOpen: true, categoryName: category.category });
                                }}
                                className="add-channel-btn"
                            />
                        </div>

                        {category.channels.map(channel => {
                            const isText = channel.type === 'text' || channel.type === 'announcement' || channel.type === 'forum';
                            const isActiveText = isText && activeChannelId === channel.id;
                            const isActiveVoice = channel.type === 'voice' && channel.id === activeVoiceChannelId;

                            let Icon = Hash;
                            if (channel.type === 'voice') Icon = Volume2;
                            else if (channel.type === 'announcement') Icon = (props) => (
                                <svg {...props} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 11 18-5v12L3 13v-2Z" /><path d="M11.6 16.8 a3 3 0 1 1-5.8-0.8" /></svg>
                            );
                            else if (channel.type === 'forum') Icon = (props) => (
                                <svg {...props} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" /><path d="M3 9h18" /><path d="M9 21V9" /></svg>
                            );

                            return (
                                <React.Fragment key={channel.id}>
                                    <div
                                        className={`channel-item ${isActiveText || isActiveVoice ? 'active' : ''}`}
                                        onClick={() => {
                                            setIsMobileMenuOpen(false);
                                            if (channel.type === 'voice') setActiveVoiceChannelId(channel.id);
                                            else setActiveChannelId(channel.id);
                                        }}
                                        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                                            <Icon size={18} style={{ flexShrink: 0 }} />
                                            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{channel.name}</span>
                                            {channel.isPrivate && <Lock size={12} color="var(--text-muted)" style={{ flexShrink: 0 }} />}
                                        </div>

                                        <div
                                            className="channel-delete-btn"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setDeleteChannelModal({
                                                    isOpen: true,
                                                    categoryName: category.category,
                                                    channelId: channel.id,
                                                    channelName: channel.name
                                                });
                                            }}
                                            style={{ color: 'var(--text-muted)', cursor: 'pointer', opacity: 0.8 }}
                                            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--danger-color)'}
                                            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                                            title="Supprimer le salon"
                                        >
                                            <Trash2 size={14} />
                                        </div>
                                    </div>

                                    {isActiveVoice && (
                                        <div style={{ padding: '4px 12px 12px 32px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <div className={isSpeaking ? 'voice-avatar-speaking' : ''} style={{
                                                width: '28px', height: '28px', borderRadius: '50%',
                                                backgroundColor: 'var(--bg-chat)',
                                                boxShadow: isSpeaking ? '0 0 0 2px var(--success-color)' : 'none',
                                                transition: 'box-shadow 0.1s',
                                                overflow: 'hidden'
                                            }}>
                                                <img
                                                    src={userProfile?.avatar || 'https://i.pravatar.cc/150?img=11'}
                                                    alt="Avatar"
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                                                />
                                            </div>
                                            <span style={{ fontSize: '13px', color: isMuted ? 'var(--text-muted)' : 'var(--text-normal)', textDecoration: isMuted ? 'line-through' : 'none' }}>
                                                {userProfile?.name || 'Satoshi'}
                                            </span>
                                        </div>
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </React.Fragment>
                ))}
            </div>

            {/* === Voice Connection Panel === */}
            {activeVoiceChannelId && (
                <div className="voice-connection-panel">
                    <div className="voice-connection-header">
                        <div className="voice-connection-info">
                            <div className="voice-quality-bars">
                                <div className="voice-quality-bar" style={{ height: '6px' }}></div>
                                <div className="voice-quality-bar" style={{ height: '10px' }}></div>
                                <div className="voice-quality-bar" style={{ height: '16px' }}></div>
                            </div>
                            <div>
                                <div className="voice-status-text">Connecté(e) au vocal</div>
                                <div className="voice-channel-name">{getActiveVoiceChannelName()} / {serverName}</div>
                            </div>
                        </div>
                        <button className="voice-disconnect-btn" onClick={handleVoiceDisconnect} title="Se déconnecter">
                            <PhoneOff size={20} />
                        </button>
                    </div>
                    <div className="voice-controls-row">
                        <button
                            className={`voice-control-btn ${isMuted ? 'active' : ''}`}
                            onClick={toggleMute}
                            title={isMuted ? 'Réactiver le micro' : 'Couper le micro'}
                        >
                            {isMuted ? <MicOff size={18} /> : <Mic size={18} />}
                        </button>
                        <button
                            className={`voice-control-btn ${isDeafened ? 'active' : ''}`}
                            onClick={toggleDeafen}
                            title={isDeafened ? 'Réactiver le son' : 'Couper le son'}
                        >
                            {isDeafened ? <HeadphoneOff size={18} /> : <Headphones size={18} />}
                        </button>
                        <button
                            className="voice-control-btn"
                            onClick={toggleScreenShare}
                            style={{ color: isScreenSharing ? 'var(--success-color)' : 'var(--text-normal)' }}
                            title={isScreenSharing ? 'Arrêter le partage' : 'Partager l\'écran'}
                        >
                            <Monitor size={18} />
                        </button>
                    </div>
                </div>
            )}

            {/* User Controls */}
            <div
                className="user-controls"
                style={{
                    position: 'relative',
                    borderTop: `1px solid ${userProfile?.status === 'dnd' ? 'rgba(242, 63, 67, 0.3)' :
                        userProfile?.status === 'idle' ? 'rgba(240, 178, 50, 0.3)' :
                            userProfile?.status === 'online' ? 'rgba(35, 165, 89, 0.3)' :
                                'rgba(255, 255, 255, 0.06)'
                        }`,
                    background: userProfile?.status === 'dnd' ? 'linear-gradient(to top, rgba(242, 63, 67, 0.05), transparent)' :
                        userProfile?.status === 'idle' ? 'linear-gradient(to top, rgba(240, 178, 50, 0.05), transparent)' :
                            userProfile?.status === 'online' ? 'linear-gradient(to top, rgba(35, 165, 89, 0.05), transparent)' :
                                'rgba(35, 36, 40, 0.7)',
                    transition: 'all 0.3s ease'
                }}
            >
                <div
                    ref={statusTriggerRef}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: 0, cursor: 'pointer', zIndex: 1001 }}
                    onClick={(e) => {
                        e.stopPropagation();
                        setShowStatusMenu(!showStatusMenu);
                    }}
                >
                    <div className="user-avatar-wrapper" style={{ position: 'relative' }}>
                        <div className="user-avatar" style={{ overflow: 'hidden', background: 'var(--bg-chat)' }}>
                            <img
                                src={userProfile?.avatar || 'https://i.pravatar.cc/150?img=11'}
                                alt="Avatar"
                                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                            />
                        </div>
                        <div className="status-indicator-mini" style={{
                            position: 'absolute',
                            bottom: '-2px',
                            right: '-2px',
                            width: '12px',
                            height: '12px',
                            borderRadius: '50%',
                            border: '2px solid var(--bg-secondary)',
                            backgroundColor: (userProfile?.status === 'online' || !userProfile?.status) ? 'var(--success-color)' :
                                userProfile?.status === 'dnd' ? 'var(--danger-color)' :
                                    userProfile?.status === 'idle' ? 'var(--warning-color, #f0b232)' : 'var(--text-muted)'
                        }}></div>
                    </div>

                    <div className="user-info">
                        <div className="user-name">{userProfile?.name || 'Satoshi'}</div>
                        <div className="user-status" style={{
                            color: (userProfile?.status === 'online' || !userProfile?.status) ? 'var(--success-color)' :
                                userProfile?.status === 'dnd' ? 'var(--danger-color)' :
                                    userProfile?.status === 'idle' ? 'var(--warning-color, #f0b232)' : 'var(--text-muted)'
                        }}>
                            {t(`account.status.${userProfile?.status || 'online'}`)}
                        </div>
                    </div>
                </div>

                {/* Status Menu Popover with Animation */}
                <AnimatePresence>
                    {showStatusMenu && (
                        <motion.div
                            ref={statusMenuRef}
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="status-popover glass-panel"
                            style={{
                                position: 'absolute',
                                bottom: 'calc(100% + 12px)',
                                left: '8px',
                                width: '230px',
                                padding: '8px',
                                zIndex: 2000,
                                boxShadow: '0 12px 32px rgba(0,0,0,0.6)',
                                backgroundColor: 'rgba(30, 31, 34, 0.95)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '12px',
                                overflow: 'hidden'
                            }}
                        >
                            <div style={{ padding: '4px 8px 8px 8px', fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                                {t('account.change_status') || 'Changer de statut'}
                            </div>
                            <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', margin: '0 4px 8px 4px' }}></div>
                            {[
                                { id: 'online', label: t('account.status.online'), color: 'var(--success-color)', icon: Circle, desc: 'Fièrement en ligne' },
                                { id: 'idle', label: t('account.status.idle'), color: 'var(--warning-color, #f0b232)', icon: Moon, desc: 'Inactif depuis un moment' },
                                { id: 'dnd', label: t('account.status.dnd'), color: 'var(--danger-color)', icon: CircleOff, desc: 'Ne pas déranger' },
                                { id: 'invisible', label: t('account.status.invisible'), color: 'var(--text-muted)', icon: Circle, desc: 'Invisible pour les autres' }
                            ].map((stat) => (
                                <div
                                    key={stat.id}
                                    className="status-item-premium"
                                    onClick={() => {
                                        setUserProfile({ ...userProfile, status: stat.id });
                                        setShowStatusMenu(false);
                                    }}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        padding: '10px 12px',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                        color: userProfile?.status === stat.id ? 'white' : 'var(--text-normal)',
                                        background: userProfile?.status === stat.id ? 'rgba(255,255,255,0.05)' : 'transparent',
                                        marginBottom: '2px'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)';
                                        e.currentTarget.style.transform = 'translateX(4px)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = userProfile?.status === stat.id ? 'rgba(255,255,255,0.05)' : 'transparent';
                                        e.currentTarget.style.transform = 'translateX(0)';
                                    }}
                                >
                                    <div style={{
                                        width: '24px',
                                        height: '24px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderRadius: '6px',
                                        background: `${stat.color}15`
                                    }}>
                                        <stat.icon size={16} color={stat.color} fill={stat.id === 'invisible' ? 'none' : stat.color} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '14px', fontWeight: 600 }}>{stat.label}</div>
                                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', opacity: 0.8 }}>{stat.desc}</div>
                                    </div>
                                    {userProfile?.status === stat.id && <Check size={16} color="var(--accent-color)" />}
                                </div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="control-buttons">
                    <button className="control-btn" onClick={activeVoiceChannelId ? toggleMute : () => showToast("Rejoignez un salon vocal d'abord", "info")} style={isMuted && activeVoiceChannelId ? { color: '#da373c' } : {}} title={isMuted ? 'Réactiver le micro' : 'Couper le micro'}>
                        {isMuted && activeVoiceChannelId ? <MicOff size={18} /> : <Mic size={18} />}
                    </button>
                    <button className="control-btn" onClick={activeVoiceChannelId ? toggleDeafen : () => showToast("Rejoignez un salon vocal d'abord", "info")} style={isDeafened && activeVoiceChannelId ? { color: '#da373c' } : {}} title={isDeafened ? 'Réactiver le son' : 'Couper le son'}>
                        {isDeafened && activeVoiceChannelId ? <HeadphoneOff size={18} /> : <Headphones size={18} />}
                    </button>
                    <button className="control-btn" onClick={() => setIsSettingsOpen(true)} title="Paramètres Utilisateur"><Settings size={18} /></button>
                </div>
            </div>

            <CreateChannelModal
                isOpen={createChannelModal.isOpen}
                onClose={() => setCreateChannelModal({ isOpen: false, categoryName: '' })}
                onCreate={handleCreateChannel}
                categoryName={createChannelModal.categoryName}
            />

            <DeleteChannelModal
                isOpen={deleteChannelModal.isOpen}
                onClose={() => setDeleteChannelModal({ isOpen: false, categoryName: '', channelId: '', channelName: '' })}
                onDelete={() => handleDeleteChannel(deleteChannelModal.categoryName, deleteChannelModal.channelId)}
                channelName={deleteChannelModal.channelName}
            />
        </div>
    );
};

export default ChannelSidebar;
