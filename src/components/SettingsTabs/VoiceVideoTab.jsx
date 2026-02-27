import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import InlineModal from '../InlineModal';

const Toggle = ({ value, onChange }) => (
    <div className={`toggle-switch ${value ? 'on' : 'off'}`} onClick={() => onChange(!value)}>
        <div className="toggle-switch-knob"></div>
    </div>
);

const VoiceVideoTab = () => {
    const [isTesting, setIsTesting] = useState(false);
    const [volume, setVolume] = useState(0);
    const [showMicError, setShowMicError] = useState(false);
    const [micErrorMsg, setMicErrorMsg] = useState("");

    // Settings states
    const [echoCancellation, setEchoCancellation] = useState(true);
    const [noiseSuppression, setNoiseSuppression] = useState(true);
    const [autoGain, setAutoGain] = useState(true);

    const audioContextRef = useRef(null);
    const analyserRef = useRef(null);
    const mediaStreamRef = useRef(null);
    const animationFrameRef = useRef(null);

    const startTest = async () => {
        try {
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                setMicErrorMsg("Ton navigateur bloque l'accès au micro car tu n'es pas sur une connexion sécurisée (HTTPS). Pour tester le micro, ouvre l'application directement sur l'ordinateur hôte via http://localhost:5173");
                setShowMicError(true);
                return;
            }

            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: echoCancellation,
                    noiseSuppression: noiseSuppression,
                    autoGainControl: autoGain
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

        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i];
        }
        const avg = sum / dataArray.length;
        const percentage = Math.min(100, (avg / 128) * 100);
        setVolume(percentage);

        if (isTesting) {
            animationFrameRef.current = requestAnimationFrame(updateVolume);
        }
    };

    useEffect(() => {
        return () => { stopTest(); };
    }, []);

    useEffect(() => {
        if (!isTesting) {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        }
    }, [isTesting]);

    const advancedSettings = [
        {
            label: 'Annulation de l\'écho',
            desc: 'Empêche le micro de capter le son des haut-parleurs.',
            value: echoCancellation, onChange: setEchoCancellation
        },
        {
            label: 'Réduction de bruit',
            desc: 'Supprime les bruits de fond constants (ventilateur, clavier).',
            value: noiseSuppression, onChange: setNoiseSuppression
        },
        {
            label: 'Contrôle automatique du gain',
            desc: 'Ajuste automatiquement le volume de ton micro pour un niveau constant.',
            value: autoGain, onChange: setAutoGain
        }
    ];


    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h2 style={{ color: 'var(--text-header)', marginBottom: '24px' }}>Voix & Vidéo</h2>

            <div style={{ marginBottom: '32px' }}>
                <h3 style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: 800, marginBottom: '16px', textTransform: 'uppercase' }}>Test du micro</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '16px' }}>
                    Faisons en sorte de bien t'entendre. Clique sur "Vérifier" et dis quelque chose.
                </p>

                <div style={{
                    display: 'flex', gap: '16px', alignItems: 'center',
                    padding: '16px', background: 'var(--bg-secondary)',
                    borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)'
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

            <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.06)', margin: '24px 0' }}></div>

            <div style={{ marginBottom: '32px' }}>
                <h3 style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: 800, marginBottom: '16px', textTransform: 'uppercase' }}>Paramètres avancés</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {advancedSettings.map((s, i) => (
                        <div key={i} style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            padding: '12px 0', borderBottom: i < advancedSettings.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none'
                        }}>
                            <div style={{ flex: 1, paddingRight: '16px' }}>
                                <div style={{ color: 'var(--text-normal)', fontWeight: 500, marginBottom: '4px' }}>{s.label}</div>
                                <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{s.desc}</div>
                            </div>
                            <Toggle value={s.value} onChange={s.onChange} />
                        </div>
                    ))}
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
