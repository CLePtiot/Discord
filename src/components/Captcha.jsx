import React, { useRef, useEffect, useState } from 'react';

const Captcha = ({ onVerify }) => {
    const canvasRef = useRef(null);
    const [captchaText, setCaptchaText] = useState('');
    const [userInput, setUserInput] = useState('');
    const [error, setError] = useState(false);

    const generateCaptcha = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Background
        ctx.fillStyle = '#1e1f22'; // Discord dark theme bg
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Random string
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
        let text = '';
        for (let i = 0; i < 6; i++) {
            text += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setCaptchaText(text);

        // Draw text
        ctx.font = 'bold 30px "Inter", sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Add text with slight distortion
        for (let i = 0; i < text.length; i++) {
            ctx.save();
            const x = 30 + (i * 28);
            const y = canvas.height / 2;
            ctx.translate(x, y);
            const angle = Math.random() * 0.4 - 0.2;
            ctx.rotate(angle);
            ctx.fillStyle = `hsl(${Math.random() * 360}, 70%, 70%)`;
            ctx.fillText(text[i], 0, 0);
            ctx.restore();
        }

        // Add noise lines
        for (let i = 0; i < 6; i++) {
            ctx.beginPath();
            ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
            ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
            ctx.strokeStyle = `rgba(255, 255, 255, ${Math.random() * 0.4})`;
            ctx.lineWidth = 1.5;
            ctx.stroke();
        }

        // Add dots
        for (let i = 0; i < 40; i++) {
            ctx.beginPath();
            ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, Math.random() * 2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.4})`;
            ctx.fill();
        }

        setUserInput('');
        setError(false);
        onVerify(false);
    };

    useEffect(() => {
        generateCaptcha();
    }, []);

    const handleChange = (e) => {
        const val = e.target.value;
        setUserInput(val);
        if (val.length === captchaText.length) {
            if (val.toLowerCase() === captchaText.toLowerCase()) {
                setError(false);
                onVerify(true);
            } else {
                setError(true);
                onVerify(false);
            }
        } else {
            setError(false);
            onVerify(false);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <canvas
                    ref={canvasRef}
                    width="200"
                    height="60"
                    style={{ borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)', userSelect: 'none' }}
                />
                <button
                    type="button"
                    onClick={generateCaptcha}
                    style={{
                        background: '#2b2d31',
                        border: 'none',
                        color: '#b5bac1',
                        cursor: 'pointer',
                        padding: '10px',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'background 0.2s',
                        height: '60px',
                        width: '60px'
                    }}
                    onMouseOver={e => e.currentTarget.style.background = '#313338'}
                    onMouseOut={e => e.currentTarget.style.background = '#2b2d31'}
                    title="Actualiser le CAPTCHA"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z" />
                    </svg>
                </button>
            </div>
            <input
                type="text"
                value={userInput}
                onChange={handleChange}
                placeholder="Entrez les caractères ci-dessus"
                style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '4px',
                    border: 'none',
                    background: '#1e1f22',
                    color: 'white',
                    outline: error ? '2px solid #ed4245' : 'none',
                    fontFamily: 'inherit',
                    transition: 'all 0.2s'
                }}
            />
            {error && <span style={{ color: '#fa777c', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                CAPTCHA incorrect.
            </span>}
            {userInput.length > 0 && !error && userInput.length === captchaText.length && (
                <span style={{ color: '#23a559', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                    CAPTCHA validé.
                </span>
            )}
        </div>
    );
};

export default Captcha;
