import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Camera } from 'lucide-react';

const UserProfileTab = ({ userProfile, setUserProfile }) => {
    const avatarInputRef = useRef(null);
    const bannerInputRef = useRef(null);

    const handleFileChange = (e, field) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const objectUrl = URL.createObjectURL(file);
            setUserProfile({ ...userProfile, [field]: objectUrl });
        }
    };

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h2 style={{ color: 'var(--text-header)', marginBottom: '24px' }}>Profil d'utilisateur</h2>

            <div style={{ display: 'flex', gap: '32px' }}>
                <div style={{ flex: 1 }}>
                    {/* Avatar Upload */}
                    <div style={{ marginBottom: '24px' }}>
                        <h3 style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: 800, marginBottom: '8px', textTransform: 'uppercase' }}>Avatar</h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div
                                style={{
                                    width: '80px', height: '80px', borderRadius: '50%',
                                    backgroundImage: `url("${userProfile.avatar}")`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat',
                                    position: 'relative', cursor: 'pointer',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                                }}
                                onClick={() => avatarInputRef.current?.click()}
                            >
                                <div style={{
                                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                                    backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: '50%',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    opacity: 0, transition: 'opacity 0.2s'
                                }}
                                    onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                                    onMouseLeave={(e) => e.currentTarget.style.opacity = '0'}
                                >
                                    <Camera color="white" size={24} />
                                </div>
                            </div>
                            <button
                                onClick={() => avatarInputRef.current?.click()}
                                style={{
                                    background: 'var(--accent-color)', color: 'white', border: 'none',
                                    padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 500
                                }}
                            >
                                Changer l'avatar
                            </button>
                            <input type="file" ref={avatarInputRef} style={{ display: 'none' }} accept="image/*, .jpg, .jpeg, .png, .gif" onChange={(e) => handleFileChange(e, 'avatar')} />
                        </div>
                    </div>

                    <div style={{ height: '1px', backgroundColor: 'var(--border-color)', margin: '24px 0' }}></div>

                    {/* Banner Upload */}
                    <div style={{ marginBottom: '24px' }}>
                        <h3 style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: 800, marginBottom: '8px', textTransform: 'uppercase' }}>Bannière de profil</h3>
                        <div style={{
                            height: '100px', width: '100%', borderRadius: '8px',
                            backgroundColor: userProfile.banner.startsWith('#') ? userProfile.banner : 'transparent',
                            backgroundImage: userProfile.banner.startsWith('#') ? 'none' : `url("${userProfile.banner}")`,
                            backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat',
                            marginBottom: '12px', position: 'relative', cursor: 'pointer',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                        }}
                            onClick={() => bannerInputRef.current?.click()}
                        >
                            <div style={{
                                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                                backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: '8px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                opacity: 0, transition: 'opacity 0.2s'
                            }}
                                onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                                onMouseLeave={(e) => e.currentTarget.style.opacity = '0'}
                            >
                                <Camera color="white" size={32} />
                                <span style={{ color: 'white', marginLeft: '8px', fontWeight: 600 }}>Changer la bannière</span>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                                onClick={() => bannerInputRef.current?.click()}
                                style={{
                                    background: 'var(--accent-color)', color: 'white', border: 'none',
                                    padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 500
                                }}
                            >
                                Importer une image
                            </button>
                            <input
                                type="color"
                                value={userProfile.banner.startsWith('#') ? userProfile.banner : '#5865F2'}
                                onChange={(e) => setUserProfile({ ...userProfile, banner: e.target.value })}
                                style={{
                                    height: '36px',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    background: 'transparent'
                                }}
                            />
                        </div>
                        <input type="file" ref={bannerInputRef} style={{ display: 'none' }} accept="image/*, .jpg, .jpeg, .png, .gif" onChange={(e) => handleFileChange(e, 'banner')} />
                    </div>

                    <div style={{ height: '1px', backgroundColor: 'var(--border-color)', margin: '24px 0' }}></div>

                    {/* À propos de moi */}
                    <div>
                        <h3 style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: 800, marginBottom: '8px', textTransform: 'uppercase' }}>À propos de moi</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '8px' }}>
                            Tu peux utiliser le formatage Markdown.
                        </p>
                        <textarea
                            value={userProfile.bio}
                            onChange={(e) => setUserProfile({ ...userProfile, bio: e.target.value })}
                            style={{
                                width: '100%', minHeight: '120px',
                                backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)',
                                borderRadius: '4px', color: 'var(--text-normal)', padding: '12px',
                                fontSize: '14px', outline: 'none', resize: 'vertical'
                            }}
                            placeholder="Dites bonjour au monde..."
                        />
                    </div>
                </div>

                {/* Live Preview */}
                <div style={{ width: '320px' }}>
                    <h3 style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: 800, marginBottom: '8px', textTransform: 'uppercase' }}>Aperçu</h3>
                    <div style={{
                        borderRadius: '8px', overflow: 'hidden',
                        backgroundColor: 'var(--bg-primary)',
                        border: '1px solid var(--border-color)',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                        position: 'relative'
                    }}>
                        {/* Banner */}
                        <div style={{
                            height: '120px',
                            backgroundColor: userProfile.banner.startsWith('#') ? userProfile.banner : 'transparent',
                            backgroundImage: userProfile.banner.startsWith('#') ? 'none' : `url("${userProfile.banner}")`,
                            backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat'
                        }}></div>

                        {/* Avatar */}
                        <div style={{
                            width: '80px', height: '80px', borderRadius: '50%',
                            backgroundColor: 'var(--bg-primary)',
                            padding: '6px',
                            position: 'absolute', top: '76px', left: '16px'
                        }}>
                            <div style={{
                                width: '100%', height: '100%', borderRadius: '50%',
                                backgroundImage: `url("${userProfile.avatar}")`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat'
                            }}></div>
                        </div>

                        {/* Badges/Nitro demo */}
                        <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '12px 16px' }}>
                            <div style={{ background: 'var(--bg-secondary)', padding: '4px', borderRadius: '6px', display: 'flex', gap: '4px' }}>
                                {/* Fake badge */}
                                <div style={{ width: '22px', height: '22px', borderRadius: '4px', background: 'linear-gradient(45deg, #ff73fa, #5865f2)' }} />
                            </div>
                        </div>

                        {/* Content */}
                        <div style={{ padding: '36px 16px 16px 16px' }}>
                            <h2 style={{ margin: 0, fontSize: '20px', color: 'var(--text-header)' }}>{userProfile.name}</h2>
                            <h4 style={{ margin: '4px 0 16px 0', fontSize: '14px', color: 'var(--text-normal)', fontWeight: 400 }}>{userProfile.name.toLowerCase().replace(' ', '')}</h4>

                            <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '16px 0' }} />

                            <h3 style={{ color: 'var(--text-header)', fontSize: '12px', fontWeight: 800, marginBottom: '8px', textTransform: 'uppercase' }}>À propos de moi</h3>
                            <div style={{ color: 'var(--text-normal)', fontSize: '14px', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
                                {userProfile.bio || 'Aucune biographie...'}
                            </div>

                            <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '16px 0' }} />

                            <h3 style={{ color: 'var(--text-header)', fontSize: '12px', fontWeight: 800, marginBottom: '8px', textTransform: 'uppercase' }}>Membre de Discord depuis</h3>
                            <div style={{ color: 'var(--text-normal)', fontSize: '14px' }}>
                                24 fév. 2026
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default UserProfileTab;
