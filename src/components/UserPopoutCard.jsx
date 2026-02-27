import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const UserPopoutCard = ({ user, position, onClose }) => {
    const popoutRef = useRef(null);

    // Close on click outside or escape key
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (popoutRef.current && !popoutRef.current.contains(e.target)) {
                onClose();
            }
        };

        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        // Small delay to prevent the click that opened the popout from closing it immediately
        setTimeout(() => {
            window.addEventListener('click', handleClickOutside);
            window.addEventListener('keydown', handleKeyDown);
        }, 10);

        return () => {
            window.removeEventListener('click', handleClickOutside);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose]);

    if (!user) return null;

    // Use customized banner/bio if available (mainly for current user), otherwise fallbacks
    const banner = user.banner || '#5865F2';
    const avatar = user.avatar || 'https://i.pravatar.cc/150';
    const name = user.name || 'Utilisateur';

    return (
        <AnimatePresence>
            <motion.div
                ref={popoutRef}
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ duration: 0.15 }}
                style={{
                    position: 'fixed',
                    top: position.top,
                    left: position.left,
                    width: '320px',
                    backgroundColor: 'var(--bg-primary)',
                    borderRadius: '8px',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.5)',
                    border: '1px solid var(--border-color)',
                    overflow: 'hidden',
                    zIndex: 1000
                }}
            >
                {/* Banner */}
                <div style={{
                    height: '120px',
                    backgroundColor: banner.startsWith('#') ? banner : 'transparent',
                    position: 'relative', overflow: 'hidden'
                }}>
                    {!banner.startsWith('#') && (
                        <img
                            src={banner}
                            alt="Banner"
                            draggable={false}
                            style={{
                                position: 'absolute', top: 0, left: 0,
                                width: '100%', height: '100%', objectFit: 'cover',
                                transform: 'scale(1.05)',
                                filter: 'blur(0.5px)',
                                imageRendering: 'auto'
                            }}
                        />
                    )}
                </div>

                {/* Avatar */}
                <div style={{
                    position: 'absolute', top: '76px', left: '16px',
                    width: '80px', height: '80px', borderRadius: '50%',
                    backgroundColor: 'var(--bg-primary)', padding: '6px'
                }}>
                    <div style={{
                        width: '100%', height: '100%', borderRadius: '50%',
                        backgroundImage: `url("${avatar}")`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat',
                        position: 'relative'
                    }}>
                        <div style={{
                            position: 'absolute', bottom: -2, right: -2,
                            width: '16px', height: '16px', borderRadius: '50%',
                            backgroundColor: (user?.status === 'Occupé' ? 'var(--danger-color)' :
                                user?.status === 'Inactif' ? 'var(--warning-color, #f0b232)' :
                                    (user?.status === 'Hors ligne' || user?.status === 'offline') ? 'transparent' : 'var(--success-color)'),
                            border: '3px solid var(--bg-primary)',
                            ...((user?.status === 'Hors ligne' || user?.status === 'offline') ? { border: '3px solid var(--text-muted)', backgroundColor: 'var(--bg-primary)' } : {})
                        }}></div>
                    </div>
                </div>

                {/* Nitra Badge fake */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '12px 16px' }}>
                    <div style={{ background: 'var(--bg-secondary)', padding: '4px', borderRadius: '6px' }}>
                        <div style={{ width: '22px', height: '22px', borderRadius: '4px', background: 'linear-gradient(45deg, #ff73fa, #5865f2)' }} />
                    </div>
                </div>

                {/* Content */}
                <div style={{ padding: '36px 16px 16px 16px' }}>
                    <h2 style={{ margin: 0, fontSize: '20px', color: 'var(--text-header)' }}>{name}</h2>
                    <h4 style={{ margin: '4px 0 16px 0', fontSize: '14px', color: 'var(--text-normal)', fontWeight: 400 }}>{name.toLowerCase().replace(' ', '')}#1337</h4>

                    <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '16px 0' }} />

                    <h3 style={{ color: 'var(--text-header)', fontSize: '12px', fontWeight: 800, marginBottom: '8px', textTransform: 'uppercase' }}>À propos de moi</h3>
                    <div style={{ color: 'var(--text-normal)', fontSize: '14px', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
                        {user.bio || 'Un utilisateur mystérieux...'}
                    </div>

                    <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '16px 0' }} />

                    <input
                        type="text"
                        placeholder={`Envoyer un message à @${name.toLowerCase().replace(' ', '')}`}
                        style={{
                            width: '100%',
                            backgroundColor: 'var(--bg-tertiary)',
                            border: '1px solid var(--border-color)',
                            color: 'var(--text-normal)',
                            padding: '10px 12px',
                            borderRadius: '4px',
                            outline: 'none',
                            fontSize: '14px'
                        }}
                    />
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default UserPopoutCard;
