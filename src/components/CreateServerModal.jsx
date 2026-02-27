import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useTranslation } from '../contexts/LanguageContext';

const CreateServerModal = ({ isOpen, onClose, onCreate }) => {
    const { t } = useTranslation();
    const [serverName, setServerName] = useState('');

    useEffect(() => {
        if (isOpen) {
            setServerName('');
        }
    }, [isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (serverName.trim()) {
            onCreate(serverName.trim());
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="modal-overlay" onClick={onClose}>
                <motion.div
                    className="modal-content glass-panel"
                    onClick={(e) => e.stopPropagation()}
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    transition={{ duration: 0.2 }}
                >
                    <div className="modal-header">
                        <h2>{t('server.create_server') || 'Créer un serveur'}</h2>
                        <button className="icon-button" onClick={onClose} style={{
                            background: 'rgba(255,255,255,0.05)',
                            border: 'none',
                            color: 'var(--text-muted)',
                            cursor: 'pointer',
                            borderRadius: '50%',
                            width: '32px',
                            height: '32px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s'
                        }}>
                            <X size={18} />
                        </button>
                    </div>

                    <p style={{ color: 'var(--text-muted)', fontSize: '15px', marginBottom: '24px', lineHeight: '1.4' }}>
                        Donnez une personnalité à votre serveur avec un nom. Vous pourrez le changer plus tard.
                    </p>

                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '32px' }}>
                            <label style={{
                                display: 'block',
                                marginBottom: '10px',
                                color: 'var(--text-header)',
                                fontSize: '12px',
                                textTransform: 'uppercase',
                                fontWeight: '800',
                                letterSpacing: '0.05em'
                            }}>
                                Nom du serveur
                            </label>
                            <input
                                type="text"
                                className="chat-input"
                                placeholder="Ex: Mon Super Serveur"
                                value={serverName}
                                onChange={(e) => setServerName(e.target.value)}
                                autoFocus
                                style={{
                                    width: '100%',
                                    boxSizing: 'border-box',
                                    backgroundColor: 'var(--bg-app)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    padding: '12px 16px',
                                    borderRadius: '8px',
                                    fontSize: '16px',
                                    transition: 'border-color 0.2s, box-shadow 0.2s'
                                }}
                            />
                        </div>

                        <div style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            gap: '16px',
                            marginTop: '8px',
                            background: 'rgba(0,0,0,0.2)',
                            margin: '0 -32px -32px -32px',
                            padding: '20px 32px'
                        }}>
                            <button
                                type="button"
                                onClick={onClose}
                                style={{
                                    padding: '10px 20px',
                                    background: 'transparent',
                                    border: 'none',
                                    color: 'white',
                                    cursor: 'pointer',
                                    borderRadius: '4px',
                                    fontSize: '14px',
                                    fontWeight: '500'
                                }}
                            >
                                Annuler
                            </button>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                style={{
                                    padding: '10px 28px',
                                    background: 'var(--accent-color)',
                                    border: 'none',
                                    color: 'white',
                                    cursor: 'pointer',
                                    borderRadius: '4px',
                                    fontWeight: '700',
                                    fontSize: '14px',
                                    boxShadow: '0 4px 12px rgba(88, 101, 242, 0.3)'
                                }}
                                disabled={!serverName.trim()}
                            >
                                Créer le serveur
                            </motion.button>
                        </div>
                    </form>
                </motion.div>
            </div >
        </AnimatePresence >
    );
};

export default CreateServerModal;
