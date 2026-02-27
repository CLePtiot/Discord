import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import InlineModal from '../InlineModal';
import ToggleSwitch from '../ToggleSwitch';

const VoiceVideoTab = () => {
    const [isTesting, setIsTesting] = useState(false);
    const [volume, setVolume] = useState(0);
    const [showMicError, setShowMicError] = useState(false);
    const [micErrorMsg, setMicErrorMsg] = useState("");

    // Settings states
    const [echoCancellation, setEchoCancellation] = useState(true);
    const [noiseSuppression, setNoiseSuppression] = useState(true);

    const audioContextRef = useRef(null);
    const analyserRef = useRef(null);
    const mediaStreamRef = useRef(null);
    const animationFrameRef = useRef(null);

    const startTest = async () => {
        try {
            // Check if mediaDevices API is available (it's removed entirely on insecure HTTP contexts)
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                setMicErrorMsg("Ton navigateur bloque l'accès au micro car tu n'es pas sur une connexion sécurisée (HTTPS). Pour tester le micro, ouvre l'application directement sur l'ordinateur hôte via http://localhost:5173");
                setShowMicError(true);
                return;
            }

            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: echoCancellation,
                    noiseSuppression: noiseSuppression,
                    autoGainControl: true
                },
                video: false
            });
            mediaStreamRef.current = stream;

            const AudioContext = window.AudioContext || window.webkitAudioContext;
            audioContextRef.current = new AudioContext();

            analyserRef.current = audioContextRef.current.createAnalyser();
            analyserRef.current.fftSize = 256;

            const source = audioContextRef.current.createMediaStreamSource(stream);
            source.connect(analyserRef.current);

            // Connect analyser to destination so user can hear themselves
            analyserRef.current.connect(audioContextRef.current.destination);

            setIsTesting(true);
            updateVolume();
        } catch (err) {
            console.error("Microphone access denied or error occurred", err);
            if (err.name === 'NotAllowedError' || err.name === 'SecurityError') {
                setMicErrorMsg("L'accès au microphone a été refusé. Vérifie les permissions de ton navigateur.");
            } else {
                setMicErrorMsg("Impossible d'accéder au microphone. Erreur : " + err.message);
            }
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
            mediaStreamRef.current = null;
        }

        if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
            audioContextRef.current.close();
            audioContextRef.current = null;
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
                    <div style={{ paddingRight: '16px' }}>
                        <div style={{ color: 'var(--text-normal)', fontWeight: 500, marginBottom: '4px' }}>Annulation de l'écho</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Empêche le micro de capter le son des haut-parleurs.</div>
                    </div>
                    <ToggleSwitch checked={echoCancellation} onChange={() => setEchoCancellation(!echoCancellation)} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ paddingRight: '16px' }}>
                        <div style={{ color: 'var(--text-normal)', fontWeight: 500, marginBottom: '4px' }}>Réduction de bruit</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Supprime les bruits de fond constants (ventillateur, clavier).</div>
                    </div>
                    <ToggleSwitch checked={noiseSuppression} onChange={() => setNoiseSuppression(!noiseSuppression)} />
                </div>
            </div>

            {/* Mic Permission Error Modal */}
            <InlineModal
                isOpen={showMicError}
                onClose={() => setShowMicError(false)}
                title="Accès au microphone refusé"
                description={micErrorMsg || "Veuillez autoriser l'accès au microphone dans les paramètres de votre navigateur pour utiliser le test vocal."}
                type="alert"
            />
        </motion.div>
    );
};

export default VoiceVideoTab;
