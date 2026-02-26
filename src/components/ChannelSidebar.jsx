import React, { useState, useEffect, useRef } from 'react';
import { Hash, Volume2, Mic, MicOff, Headphones, HeadphoneOff, Settings, ChevronDown, Users, PhoneOff, Monitor } from 'lucide-react';
import { useToast } from './Toast';

const ChannelSidebar = ({
    serverName,
    categories,
    activeChannelIds = [],
    activeVoiceChannelId,
    onSelectChannel,
    onJoinVoiceChannel,
    onFriendsClick,
    isFriendsViewActive,
    userProfile,
    onOpenSettings,
    isSpeaking,
    setIsSpeaking,
    isMuted,
    isDeafened,
    isScreenSharing,
    mediaStreamRef,
    handleVoiceDisconnect,
    toggleMute,
    toggleDeafen,
    toggleScreenShare
}) => {
    const audioContextRef = useRef(null);
    const analyserRef = useRef(null);
    const animationFrameRef = useRef(null);
    const { showToast } = useToast();

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

    // The voice connection handlers are passed via props now

    return (
        <div className="channel-sidebar glass-panel">
            <div className="channel-header">
                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{serverName}</span>
                <ChevronDown size={18} />
            </div>

            <div className="channel-list">
                <div
                    className={`channel-item ${isFriendsViewActive ? 'active' : ''}`}
                    onClick={onFriendsClick}
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
                        <div className="category" style={{ marginTop: catIdx > 0 ? '16px' : '0' }}>
                            <ChevronDown size={12} />
                            {category.category}
                        </div>

                        {category.channels.map(channel => {
                            const isText = channel.type === 'text';
                            const isActiveText = isText && activeChannelIds.includes(channel.id);
                            const isActiveVoice = !isText && channel.id === activeVoiceChannelId;
                            const Icon = isText ? Hash : Volume2;

                            return (
                                <React.Fragment key={channel.id}>
                                    <div
                                        className={`channel-item ${isActiveText || isActiveVoice ? 'active' : ''}`}
                                        onClick={() => isText ? onSelectChannel(channel.id) : onJoinVoiceChannel(channel.id)}
                                    >
                                        <Icon size={18} />
                                        <span>{channel.name}</span>
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

            {/* === Voice Connection Panel (like Discord) === */}
            {activeVoiceChannelId && (
                <div className="voice-connection-panel">
                    <div className="voice-connection-header">
                        <div className="voice-connection-info">
                            {/* Connection Quality Bars */}
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
                    <div className="user-status">En ligne</div>
                </div>
                <div className="control-buttons">
                    <button className="control-btn" onClick={activeVoiceChannelId ? toggleMute : () => showToast("Rejoignez un salon vocal d'abord", "info")} style={isMuted && activeVoiceChannelId ? { color: '#da373c' } : {}} title={isMuted ? 'Réactiver le micro' : 'Couper le micro'}>
                        {isMuted && activeVoiceChannelId ? <MicOff size={18} /> : <Mic size={18} />}
                    </button>
                    <button className="control-btn" onClick={activeVoiceChannelId ? toggleDeafen : () => showToast("Rejoignez un salon vocal d'abord", "info")} style={isDeafened && activeVoiceChannelId ? { color: '#da373c' } : {}} title={isDeafened ? 'Réactiver le son' : 'Couper le son'}>
                        {isDeafened && activeVoiceChannelId ? <HeadphoneOff size={18} /> : <Headphones size={18} />}
                    </button>
                    <button className="control-btn" onClick={onOpenSettings} title="Paramètres Utilisateur"><Settings size={18} /></button>
                </div>
            </div>
        </div>
    );
};

export default ChannelSidebar;
