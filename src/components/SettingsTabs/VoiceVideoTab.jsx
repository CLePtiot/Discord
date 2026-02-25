import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import InlineModal from '../InlineModal';

const VoiceVideoTab = () => {
    const [isTesting, setIsTesting] = useState(false);
    const [volume, setVolume] = useState(0);
    const [showMicError, setShowMicError] = useState(false);
    const audioContextRef = useRef(null);
    const analyserRef = useRef(null);
    const mediaStreamRef = useRef(null);
    const animationFrameRef = useRef(null);

    const startTest = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
            mediaStreamRef.current = stream;

            const AudioContext = window.AudioContext || window.webkitAudioContext;
            audioContextRef.current = new AudioContext();

            analyserRef.current = audioContextRef.current.createAnalyser();
            analyserRef.current.fftSize = 256;

            const source = audioContextRef.current.createMediaStreamSource(stream);
            source.connect(analyserRef.current);

            setIsTesting(true);
            updateVolume();
        } catch (err) {
            console.error("Microphone access denied or error occurred", err);
            setShowMicError(true);
        }
    };

    const stopTest = () => {
        setIsTesting(false);
        setVolume(0);

        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
        }

        if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach(track => track.stop());
        }

        if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
            audioContextRef.current.close();
        }
    };

    const updateVolume = () => {
        if (!analyserRef.current) return;

        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(dataArray);

        // Calculate average volume
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i];
        }
        const avg = sum / dataArray.length;

        // Map average volume (0-255) to percentage (0-100)
        // With a little boost so normal speaking hits ~50-80%
        const percentage = Math.min(100, (avg / 128) * 100);
        setVolume(percentage);

        if (isTesting) {
            animationFrameRef.current = requestAnimationFrame(updateVolume);
        }
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            stopTest();
        };
    }, []);

    // Also stop test when toggled off
    useEffect(() => {
        if (!isTesting) {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        }
    }, [isTesting]);


    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h2 style={{ color: 'var(--text-header)', marginBottom: '24px' }}>Voix & Vidéo</h2>

            <div style={{ marginBottom: '32px' }}>
                <h3 style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: 800, marginBottom: '16px', textTransform: 'uppercase' }}>Test du micro</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '16px' }}>
                    Faisons en sorte de bien t'entendre. Clique sur "Vérifier" et dis quelque chose.
                </p>

                <div style={{
                    display: 'flex', gap: '16px', alignItems: 'center',
                    padding: '16px', background: 'var(--bg-secondary)',
                    borderRadius: '8px', border: '1px solid var(--border-color)'
                }}>
                    <button
                        onClick={isTesting ? stopTest : startTest}
                        style={{
                            background: isTesting ? 'transparent' : 'var(--accent-color)',
                            color: isTesting ? 'var(--text-normal)' : 'white',
                            border: isTesting ? '1px solid var(--text-muted)' : 'none',
                            padding: '8px 24px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontWeight: 500,
                            minWidth: '120px'
                        }}
                    >
                        {isTesting ? 'Arrêter' : 'Vérifier'}
                    </button>

                    <div style={{ flex: 1, height: '8px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{
                            height: '100%',
                            width: `${volume}%`,
                            backgroundColor: 'var(--success-color)',
                            transition: 'width 0.1s ease-out'
                        }}></div>
                    </div>
                </div>
            </div>

            <div style={{ height: '1px', backgroundColor: 'var(--border-color)', margin: '24px 0' }}></div>

            <div>
                <h3 style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: 800, marginBottom: '8px', textTransform: 'uppercase' }}>Paramètres Avancés</h3>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <div>
                        <div style={{ color: 'var(--text-normal)', fontWeight: 500, marginBottom: '4px' }}>Annulation de l'écho</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Empêche le micro de capter le son des haut-parleurs.</div>
                    </div>
                    {/* Fake toggle switch */}
                    <div style={{
                        width: '40px', height: '24px', borderRadius: '12px',
                        backgroundColor: 'var(--success-color)', position: 'relative', cursor: 'pointer'
                    }}>
                        <div style={{
                            width: '20px', height: '20px', borderRadius: '50%', backgroundColor: 'white',
                            position: 'absolute', top: '2px', right: '2px', boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                        }}></div>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                        <div style={{ color: 'var(--text-normal)', fontWeight: 500, marginBottom: '4px' }}>Réduction de bruit</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Supprime les bruits de fond constants (ventillé, clavier).</div>
                    </div>
                    {/* Fake toggle switch */}
                    <div style={{
                        width: '40px', height: '24px', borderRadius: '12px',
                        backgroundColor: 'var(--success-color)', position: 'relative', cursor: 'pointer'
                    }}>
                        <div style={{
                            width: '20px', height: '20px', borderRadius: '50%', backgroundColor: 'white',
                            position: 'absolute', top: '2px', right: '2px', boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                        }}></div>
                    </div>
                </div>
            </div>

            {/* Mic Permission Error Modal */}
            <InlineModal
                isOpen={showMicError}
                onClose={() => setShowMicError(false)}
                title="Accès au microphone refusé"
                description="Veuillez autoriser l'accès au microphone dans les paramètres de votre navigateur pour utiliser le test vocal."
                type="alert"
            />
        </motion.div>
    );
};

export default VoiceVideoTab;
