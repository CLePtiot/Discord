import React, { createContext, useState, useContext, useRef } from 'react';
import { useAppContext } from './AppContext';
import { playSound } from '../utils/soundUtils';


const VoiceContext = createContext();

export const VoiceProvider = ({ children }) => {
    const { setCurrentView, setActiveServerId, setActiveChannelId } = useAppContext();
    const [activeVoiceChannelId, setActiveVoiceChannelId] = useState(null);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [isDeafened, setIsDeafened] = useState(false);
    const [isScreenSharing, setIsScreenSharing] = useState(false);
    const [screenShareResolution, setScreenShareResolution] = useState('1080p');
    const [screenShareFps, setScreenShareFps] = useState(30);

    const mediaStreamRef = useRef(null);
    const displayStreamRef = useRef(null);

    const handleVoiceDisconnect = () => {
        setActiveVoiceChannelId(null);
        setIsMuted(false);
        setIsDeafened(false);
        if (isScreenSharing) handleStopScreenShare();
        if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach(track => track.stop());
            mediaStreamRef.current = null;
        }
    };

    const startDirectCall = (friendId) => {
        setActiveServerId('home');
        setActiveChannelId(`dm_${friendId}`);
        setCurrentView('chat');
        setActiveVoiceChannelId(`call-${friendId}`);
    };

    const toggleMute = () => {
        const newMutedState = !isMuted;
        setIsMuted(newMutedState);

        // Play sound
        if (newMutedState) {
            // No-op
        } else {
            // No-op
        }

        if (mediaStreamRef.current) {
            mediaStreamRef.current.getAudioTracks().forEach(track => {
                track.enabled = !newMutedState;
            });
        }
    };


    const toggleDeafen = () => {
        const newDeaf = !isDeafened;
        setIsDeafened(newDeaf);

        // Play sound
        if (newDeaf) {
            setIsMuted(true);
        } else {
            setIsMuted(false);
        }
    };


    const handleStopScreenShare = () => {
        if (displayStreamRef.current) {
            displayStreamRef.current.getTracks().forEach(track => track.stop());
            displayStreamRef.current = null;
        }
        setIsScreenSharing(false);
    };

    const toggleScreenShare = async () => {
        if (isScreenSharing) {
            handleStopScreenShare();
        } else {
            // Check if getDisplayMedia is available (requires HTTPS or localhost)
            if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
                alert("Le partage d'écran n'est pas disponible.\n\nCette fonctionnalité nécessite un accès via localhost ou HTTPS.\nEssayez d'ouvrir : http://localhost:5173");
                return;
            }
            try {
                const resolutionMap = {
                    '480p': { width: 854, height: 480 },
                    '720p': { width: 1280, height: 720 },
                    '1080p': { width: 1920, height: 1080 },
                    '1440p': { width: 2560, height: 1440 },
                    '4K': { width: 3840, height: 2160 }
                };

                const targetRes = resolutionMap[screenShareResolution] || resolutionMap['1080p'];

                const stream = await navigator.mediaDevices.getDisplayMedia({
                    video: {
                        width: { ideal: targetRes.width, max: targetRes.width },
                        height: { ideal: targetRes.height, max: targetRes.height },
                        frameRate: { ideal: screenShareFps, max: screenShareFps }
                    },
                    audio: true
                });
                displayStreamRef.current = stream;
                setIsScreenSharing(true);

                stream.getVideoTracks()[0].onended = () => {
                    handleStopScreenShare();
                };
            } catch (err) {
                console.error("Screen share cancelled or failed", err);
                if (err.name === 'NotAllowedError') {
                    alert("Partage d'écran annulé ou refusé par l'utilisateur.");
                } else {
                    alert("Erreur lors du partage d'écran : " + err.message);
                }
            }
        }
    };

    const value = {
        activeVoiceChannelId, setActiveVoiceChannelId,
        isSpeaking, setIsSpeaking,
        isMuted, toggleMute,
        isDeafened, toggleDeafen,
        isScreenSharing, toggleScreenShare,
        screenShareResolution, setScreenShareResolution,
        screenShareFps, setScreenShareFps,
        mediaStreamRef, displayStreamRef,
        handleVoiceDisconnect, startDirectCall, handleStopScreenShare
    };

    return (
        <VoiceContext.Provider value={value}>
            {children}
        </VoiceContext.Provider>
    );
};

export const useVoiceContext = () => useContext(VoiceContext);
