import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import InlineModal from '../InlineModal';
import { useVoiceContext } from '../../contexts/VoiceContext';

const Toggle = ({ value, onChange }) => (
    <div className={`toggle-switch ${value ? 'on' : 'off'}`} onClick={() => onChange(!value)}>
        <div className="toggle-switch-knob"></div>
    </div>
);

const VoiceVideoTab = () => {
    const {
        screenShareResolution, setScreenShareResolution,
        screenShareFps, setScreenShareFps
    } = useVoiceContext();

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

    const QualitySelector = ({ options, value, onChange, label }) => (
        <div style={{ flex: 1 }}>
            <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.05em' }}>
                {label}
            </div>
            <div style={{
                display: 'flex',
                gap: '8px',
                background: 'rgba(0,0,0,0.2)',
                padding: '4px',
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.05)',
                position: 'relative'
            }}>
                {options.map((opt) => {
                    const isActive = value === opt.value;
                    return (
                        <button
                            key={opt.value}
                            onClick={() => onChange(opt.value)}
                            style={{
                                flex: 1,
                                padding: '10px 4px',
                                border: 'none',
                                background: 'transparent',
                                color: isActive ? 'white' : 'var(--text-muted)',
                                cursor: 'pointer',
                                fontSize: '13px',
                                fontWeight: 700,
                                borderRadius: '8px',
                                position: 'relative',
                                transition: 'color 0.2s ease',
                                zIndex: 1,
                                outline: 'none',
                                overflow: 'hidden'
                            }}
                        >
                            <AnimatePresence mode="wait">
                                {isActive && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        style={{
                                            position: 'absolute',
                                            inset: 0,
                                            background: 'linear-gradient(135deg, var(--accent-color), #7289da)',
                                            borderRadius: '8px',
                                            zIndex: -1,
                                            boxShadow: '0 4px 12px rgba(88, 101, 242, 0.3)'
                                        }}
                                        transition={{ type: "spring", bounce: 0, duration: 0.3 }}
                                    />
                                )}
                            </AnimatePresence>
                            <span style={{ position: 'relative', zIndex: 2 }}>{opt.label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );


    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h2 style={{ color: 'var(--text-header)', marginBottom: '24px' }}>Voix & Vidéo</h2>

            {/* Screen Share High Quality Settings */}
            <div style={{
                marginBottom: '40px',
                padding: '24px',
                background: 'rgba(255,255,255,0.02)',
                borderRadius: '16px',
                border: '1px solid rgba(255,255,255,0.05)'
            }}>
                <h3 style={{ color: 'var(--text-header)', fontSize: '14px', fontWeight: 700, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '8px', height: '8px', background: 'var(--accent-color)', borderRadius: '50%', boxShadow: '0 0 10px var(--accent-color)' }}></span>
                    Paramètres de partage d'écran
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <QualitySelector
                        label="Qualité de résolution"
                        value={screenShareResolution}
                        onChange={setScreenShareResolution}
                        options={[
                            { label: '480p', value: '480p' },
                            { label: '720p', value: '720p' },
                            { label: '1080p', value: '1080p' },
                            { label: '1440p', value: '1440p' },
                            { label: '4K', value: '4K' }
                        ]}
                    />

                    <QualitySelector
                        label="Fréquence d'image (FPS)"
                        value={screenShareFps}
                        onChange={(val) => setScreenShareFps(parseInt(val))}
                        options={[
                            { label: '15 FPS', value: 15 },
                            { label: '30 FPS', value: 30 },
                            { label: '60 FPS', value: 60 }
                        ]}
                    />
                </div>
            </div>

            <div style={{
                marginBottom: '40px',
                padding: '24px',
                background: 'rgba(255,255,255,0.02)',
                borderRadius: '16px',
                border: '1px solid rgba(255,255,255,0.05)'
            }}>
                <h3 style={{ color: 'var(--text-header)', fontSize: '14px', fontWeight: 700, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '8px', height: '8px', background: 'var(--accent-color)', borderRadius: '50%', boxShadow: '0 0 10px var(--accent-color)' }}></span>
                    Test du micro
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '20px' }}>
                    Faisons en sorte de bien t'entendre. Clique sur "Vérifier" et dis quelque chose.
                </p>

                <div style={{
                    display: 'flex', gap: '16px', alignItems: 'center',
                    padding: '20px', background: 'rgba(0,0,0,0.2)',
                    borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)'
                }}>
                    <button
                        onClick={isTesting ? stopTest : startTest}
                        style={{
                            background: isTesting ? 'transparent' : 'var(--accent-color)',
                            color: 'white',
                            border: isTesting ? '1px solid var(--accent-color)' : 'none',
                            padding: '10px 24px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: 600,
                            minWidth: '120px',
                            transition: 'all 0.2s ease',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px'
                        }}
                    >
                        {isTesting && <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1 }} style={{ width: 8, height: 8, background: 'red', borderRadius: '50%' }} />}
                        {isTesting ? 'Arrêter' : 'Vérifier'}
                    </button>

                    <div style={{ flex: 1, direction: 'column', gap: '8px' }}>
                        <div style={{ flex: 1, height: '10px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '5px', overflow: 'hidden' }}>
                            <motion.div
                                animate={{ width: `${volume}%` }}
                                transition={{ type: "spring", damping: 15, stiffness: 200 }}
                                style={{
                                    height: '100%',
                                    background: 'linear-gradient(90deg, #23a559, #43b581)',
                                    boxShadow: '0 0 10px rgba(35, 165, 89, 0.4)'
                                }}
                            ></motion.div>
                        </div>
                    </div>
                </div>
            </div>

            <div style={{
                marginBottom: '40px',
                padding: '24px',
                background: 'rgba(255,255,255,0.02)',
                borderRadius: '16px',
                border: '1px solid rgba(255,255,255,0.05)'
            }}>
                <h3 style={{ color: 'var(--text-header)', fontSize: '14px', fontWeight: 700, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '8px', height: '8px', background: 'var(--accent-color)', borderRadius: '50%', boxShadow: '0 0 10px var(--accent-color)' }}></span>
                    Paramètres avancés
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {advancedSettings.map((s, i) => (
                        <div key={i} style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            padding: '16px',
                            background: 'rgba(0,0,0,0.1)',
                            borderRadius: '12px',
                            marginBottom: i < advancedSettings.length - 1 ? '4px' : '0',
                            border: '1px solid rgba(255,255,255,0.02)'
                        }}>
                            <div style={{ flex: 1, paddingRight: '16px' }}>
                                <div style={{ color: 'var(--text-header)', fontWeight: 600, marginBottom: '4px', fontSize: '14px' }}>{s.label}</div>
                                <div style={{ color: 'var(--text-muted)', fontSize: '12px', lineHeight: '1.4' }}>{s.desc}</div>
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
