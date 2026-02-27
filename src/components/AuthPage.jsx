import React, { useState } from 'react';
import Captcha from './Captcha';

const AuthPage = ({ onLogin }) => {
    const [isLogin, setIsLogin] = useState(false); // Default to register
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [captchaVerified, setCaptchaVerified] = useState(false);
    const [errors, setErrors] = useState({});

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = {};

        if (!email.includes('@')) {
            newErrors.email = 'Adresse email invalide.';
        }
        if (password.length < 6) {
            newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères.';
        }
        if (!isLogin && username.length < 3) {
            newErrors.username = 'Le nom d\'utilisateur doit contenir au moins 3 caractères.';
        }
        if (!isLogin && !captchaVerified) {
            newErrors.captcha = 'Veuillez résoudre le CAPTCHA.';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // Set up the user profile after "registration" or "login"
        const profile = {
            name: isLogin ? (email.split('@')[0] || 'Utilisateur') : username,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email || username}`,
            banner: '#5865F2',
            bio: 'Nouveau membre sur Freedom.',
            status: 'online'
        };

        onLogin(profile);
    };

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            background: 'url("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop") center/cover no-repeat', // Premium abstract background
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            fontFamily: '"Inter", sans-serif'
        }}>
            {/* Overlay for depth */}
            <div style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(17, 18, 20, 0.7)',
                backdropFilter: 'blur(10px)'
            }} />

            <div style={{
                position: 'relative',
                background: '#313338',
                borderRadius: '8px',
                padding: '32px',
                width: '100%',
                maxWidth: '480px',
                boxShadow: '0px 2px 10px 0px rgba(0,0,0,0.2)',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
                color: '#dbdee1',
                animation: 'jump-in 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
            }}>
                <style>
                    {`
                    @keyframes jump-in {
                        0% { opacity: 0; transform: scale(0.95); }
                        100% { opacity: 1; transform: scale(1); }
                    }
                    `}
                </style>
                <div style={{ textAlign: 'center', marginBottom: '8px' }}>
                    <h2 style={{ color: '#f2f3f5', fontSize: '24px', fontWeight: '600', marginBottom: '8px' }}>
                        {isLogin ? 'Bon retour !' : 'Créer un compte'}
                    </h2>
                    <p style={{ color: '#b5bac1', fontSize: '15px' }}>
                        {isLogin ? 'Nous sommes si heureux de vous revoir !' : 'Rejoignez la liberté. Rejoignez Freedom.'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', color: errors.email ? '#fa777c' : '#b5bac1' }}>
                            Email <span style={{ color: '#fa777c' }}>*</span> {errors.email && <span style={{ fontStyle: 'italic', textTransform: 'none', fontWeight: '400' }}>- {errors.email}</span>}
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            style={{
                                background: '#1e1f22',
                                border: 'none',
                                padding: '10px 12px',
                                borderRadius: '4px',
                                color: '#dbdee1',
                                fontSize: '16px',
                                outline: 'none'
                            }}
                        />
                    </div>

                    {!isLogin && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', color: errors.username ? '#fa777c' : '#b5bac1' }}>
                                Nom d'utilisateur <span style={{ color: '#fa777c' }}>*</span> {errors.username && <span style={{ fontStyle: 'italic', textTransform: 'none', fontWeight: '400' }}>- {errors.username}</span>}
                            </label>
                            <input
                                type="text"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                style={{
                                    background: '#1e1f22',
                                    border: 'none',
                                    padding: '10px 12px',
                                    borderRadius: '4px',
                                    color: '#dbdee1',
                                    fontSize: '16px',
                                    outline: 'none'
                                }}
                            />
                        </div>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', color: errors.password ? '#fa777c' : '#b5bac1' }}>
                            Mot de passe <span style={{ color: '#fa777c' }}>*</span> {errors.password && <span style={{ fontStyle: 'italic', textTransform: 'none', fontWeight: '400' }}>- {errors.password}</span>}
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            style={{
                                background: '#1e1f22',
                                border: 'none',
                                padding: '10px 12px',
                                borderRadius: '4px',
                                color: '#dbdee1',
                                fontSize: '16px',
                                outline: 'none'
                            }}
                        />
                    </div>

                    {!isLogin && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', color: errors.captcha ? '#fa777c' : '#b5bac1' }}>
                                Vérification anti-bot <span style={{ color: '#fa777c' }}>*</span> {errors.captcha && <span style={{ fontStyle: 'italic', textTransform: 'none', fontWeight: '400' }}>- {errors.captcha}</span>}
                            </label>
                            <Captcha onVerify={setCaptchaVerified} />
                        </div>
                    )}

                    <button
                        type="submit"
                        style={{
                            background: '#5865F2',
                            color: 'white',
                            border: 'none',
                            padding: '12px',
                            borderRadius: '4px',
                            fontSize: '16px',
                            fontWeight: '600',
                            cursor: (!isLogin && !captchaVerified) ? 'not-allowed' : 'pointer',
                            opacity: (!isLogin && !captchaVerified) ? 0.6 : 1,
                            transition: 'background 0.2s',
                            marginTop: '12px'
                        }}
                        onMouseOver={e => { if (isLogin || captchaVerified) e.target.style.background = '#4752c4'; }}
                        onMouseOut={e => e.target.style.background = '#5865F2'}
                        disabled={!isLogin && !captchaVerified}
                    >
                        {isLogin ? 'Se connecter' : 'S\'inscrire'}
                    </button>

                    <div style={{ fontSize: '14px', color: '#949ba4' }}>
                        {isLogin ? 'Besoin d\'un compte ? ' : 'Tu as déjà un compte ? '}
                        <span
                            style={{ color: '#00a8fc', cursor: 'pointer' }}
                            onClick={() => {
                                setIsLogin(!isLogin);
                                setErrors({});
                            }}
                            onMouseOver={e => e.target.style.textDecoration = 'underline'}
                            onMouseOut={e => e.target.style.textDecoration = 'none'}
                        >
                            {isLogin ? 'S\'inscrire' : 'Se connecter'}
                        </span>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AuthPage;
