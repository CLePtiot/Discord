import React, { useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Headphones, HeadphoneOff, PhoneOff, Monitor, Maximize2 } from 'lucide-react';

const VoiceCallView = ({
    activeVoiceChannelId,
    displayStreamRef,
    isScreenSharing,
    userProfile,
    isMuted,
    isDeafened,
    isSpeaking,
    onToggleMute,
    onToggleDeafen,
    onToggleScreenShare,
    onDisconnect
}) => {
    // Callback ref: called when the <video> element mounts in the DOM
    const videoCallbackRef = useCallback((videoEl) => {
        if (videoEl && displayStreamRef.current) {
            videoEl.srcObject = displayStreamRef.current;
        }
    }, [displayStreamRef]);

    return (
        <div className="call-view-container">
            <div className="call-content-area">
                <AnimatePresence mode="wait">
                    {isScreenSharing ? (
                        <motion.div
                            key="screen-share"
                            className="video-player-wrapper"
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: -20 }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        >
                            <video
                                ref={videoCallbackRef}
                                autoPlay
                                playsInline
                                className="screen-share-video"
                            />
                            <div className="video-overlay-info">
                                <Monitor size={16} />
                                <span>Partage d'écran en cours</span>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="avatar-grid"
                            className="avatar-grid-wrapper"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            {/* Grille des participants (pour l'instant, juste l'utilisateur) */}
                            <div className="participant-card">
                                <div className={`participant-avatar ${isSpeaking ? 'speaking-pulse' : ''}`} style={{ backgroundImage: `url(${userProfile?.avatar || 'https://i.pravatar.cc/150?img=11'})` }}></div>
                                <div className="participant-info">
                                    <span className="participant-name">{userProfile?.name || 'Satoshi'}</span>
                                    <div className="participant-status-icons">
                                        {isMuted && <MicOff size={14} className="status-icon-muted" />}
                                        {isDeafened && <HeadphoneOff size={14} className="status-icon-deafened" />}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Floating Toolbar with Intense Blur */}
            <div className="floating-call-toolbar">
                <button
                    className={`toolbar-btn ${isMuted ? 'btn-danger' : 'btn-normal'}`}
                    onClick={onToggleMute}
                    title={isMuted ? 'Réactiver le micro' : 'Couper le micro'}
                >
                    {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
                </button>
                <button
                    className={`toolbar-btn ${isDeafened ? 'btn-danger' : 'btn-normal'}`}
                    onClick={onToggleDeafen}
                    title={isDeafened ? 'Réactiver le son' : 'Couper le son'}
                >
                    {isDeafened ? <HeadphoneOff size={24} /> : <Headphones size={24} />}
                </button>
                <button
                    className={`toolbar-btn ${isScreenSharing ? 'btn-active' : 'btn-normal'}`}
                    onClick={onToggleScreenShare}
                    title={isScreenSharing ? 'Arrêter le partage' : 'Partager l\'écran'}
                >
                    <Monitor size={24} />
                </button>
                <div className="toolbar-separator"></div>
                <button
                    className="toolbar-btn btn-danger btn-disconnect"
                    onClick={onDisconnect}
                    title="Se déconnecter"
                >
                    <PhoneOff size={24} />
                </button>
            </div>
        </div>
    );
};

export default VoiceCallView;
