import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const CreateServerModal = ({ isOpen, onClose, onCreate }) => {
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
                        <h2>Créer un serveur</h2>
                        <button className="icon-button" onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                            <X size={24} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '12px', textTransform: 'uppercase', fontWeight: 'bold' }}>
                                Nom du serveur
                            </label>
                            <input
                                type="text"
                                className="chat-input"
                                placeholder="Ex: Mon Super Serveur"
                                value={serverName}
                                onChange={(e) => setServerName(e.target.value)}
                                autoFocus
                                style={{ width: '100%', boxSizing: 'border-box' }}
                            />
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                            <button
                                type="button"
                                onClick={onClose}
                                style={{
                                    padding: '10px 16px',
                                    background: 'transparent',
                                    border: 'none',
                                    color: 'white',
                                    cursor: 'pointer',
                                    borderRadius: '4px'
                                }}
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                style={{
                                    padding: '10px 24px',
                                    background: 'var(--accent-color)',
                                    border: 'none',
                                    color: 'white',
                                    cursor: 'pointer',
                                    borderRadius: '4px',
                                    fontWeight: 'bold'
                                }}
                                disabled={!serverName.trim()}
                            >
                                Créer
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default CreateServerModal;
