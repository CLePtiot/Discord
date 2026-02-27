import React, { useState, useEffect, useRef } from 'react';
import { Hash, Volume2, Mic, MicOff, Headphones, HeadphoneOff, Settings, ChevronDown, Users, PhoneOff, Monitor, PlusCircle, Trash2, Lock } from 'lucide-react';
import { useToast } from './Toast';
import { useAppContext } from '../contexts/AppContext';
import { useVoiceContext } from '../contexts/VoiceContext';
import CreateChannelModal from './CreateChannelModal';
import DeleteChannelModal from './DeleteChannelModal';

const ChannelSidebar = () => {
    const {
        activeServer, serverChannels, activeChannelId, setActiveChannelId,
        currentView, setCurrentView, setIsMobileMenuOpen,
        userProfile, setIsSettingsOpen, setIsServerSettingsOpen,
        channelsByServer, setChannelsByServer, activeServerId
    } = useAppContext();

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
                            const isText = channel.type === 'text';
                            const isActiveText = isText && activeChannelId === channel.id;
                            const isActiveVoice = !isText && channel.id === activeVoiceChannelId;
                            const Icon = isText ? Hash : Volume2;

                            return (
                                <React.Fragment key={channel.id}>
                                    <div
                                        className={`channel-item ${isActiveText || isActiveVoice ? 'active' : ''}`}
                                        onClick={() => {
                                            setIsMobileMenuOpen(false);
                                            isText ? setActiveChannelId(channel.id) : setActiveVoiceChannelId(channel.id);
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
                                                backgroundImage: `url(${userProfile?.avatar || 'https://i.pravatar.cc/150?img=11'})`,
                                                backgroundSize: 'cover',
                                                boxShadow: isSpeaking ? '0 0 0 2px var(--success-color)' : 'none',
                                                transition: 'box-shadow 0.1s'
                                            }}></div>
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
            <div className="user-controls">
                <div className="user-avatar" style={{ backgroundImage: `url(${userProfile?.avatar || 'https://i.pravatar.cc/150?img=11'})`, backgroundSize: 'cover' }}></div>
                <div className="user-info">
                    <div className="user-name">{userProfile?.name || 'Satoshi'}</div>
                    <div className="user-status" style={{
                        color: (userProfile?.status === 'En ligne' || !userProfile?.status) ? 'var(--success-color)' :
                            userProfile?.status === 'Occupé' ? 'var(--danger-color)' :
                                userProfile?.status === 'Inactif' ? 'var(--warning-color, #f0b232)' : 'var(--text-muted)'
                    }}>
                        {userProfile?.status || 'En ligne'}
                    </div>
                </div>
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
