import React, { createContext, useState, useContext, useRef } from 'react';
import { useAppContext } from './AppContext';

const VoiceContext = createContext();

export const VoiceProvider = ({ children }) => {
    const { setCurrentView, setActiveServerId, setActiveChannelId } = useAppContext();
    const [activeVoiceChannelId, setActiveVoiceChannelId] = useState(null);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [isDeafened, setIsDeafened] = useState(false);
    const [isScreenSharing, setIsScreenSharing] = useState(false);

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
        if (mediaStreamRef.current) {
            mediaStreamRef.current.getAudioTracks().forEach(track => {
                track.enabled = !newMutedState;
            });
        }
    };

    const toggleDeafen = () => {
        const newDeaf = !isDeafened;
        setIsDeafened(newDeaf);
        if (newDeaf) setIsMuted(true);
        else setIsMuted(false);
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
                const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
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
