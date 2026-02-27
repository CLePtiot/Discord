import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

const DeleteChannelModal = ({ isOpen, onClose, onDelete, channelName }) => {
    // Close on Escape key
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'Enter') onDelete();
        };
        if (isOpen) window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose, onDelete]);

    return ReactDOM.createPortal(
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="modal-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{ zIndex: 10000 }}
                    onClick={onClose}
                >
                    <motion.div
                        className="modal-content glass-panel"
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        style={{
                            width: '440px',
                            display: 'flex',
                            flexDirection: 'column',
                            padding: 0
                        }}
                        onClick={e => e.stopPropagation()}
                    >
                        <div style={{ padding: '32px 32px 16px', position: 'relative' }}>
                            <h2 style={{
                                fontSize: '24px',
                                fontWeight: 800,
                                margin: '0',
                                color: 'var(--text-header)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                letterSpacing: '-0.02em'
                            }}>
                                <AlertTriangle size={28} color="var(--danger-color)" />
                                Supprimer le salon
                            </h2>
                        </div>

                        <div style={{ padding: '0 32px 24px', color: 'var(--text-normal)', fontSize: '16px', lineHeight: '1.6' }}>
                            Êtes-vous sûr de vouloir supprimer le salon <strong style={{ color: 'var(--text-header)' }}>#{channelName}</strong> ? Cette action ne peut pas être annulée.
                        </div>

                        {/* Footer buttons */}
                        <div style={{
                            background: 'rgba(0,0,0,0.2)',
                            padding: '24px 32px',
                            display: 'flex',
                            justifyContent: 'flex-end',
                            gap: '16px',
                            borderTop: '1px solid rgba(255,255,255,0.05)'
                        }}>
                            <button
                                onClick={onClose}
                                style={{
                                    background: 'transparent', color: 'white', border: 'none',
                                    padding: '10px 24px', borderRadius: '6px', cursor: 'pointer', fontSize: '15px', fontWeight: 500
                                }}
                            >
                                Annuler
                            </button>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={onDelete}
                                style={{
                                    background: 'var(--danger-color)', color: 'white', border: 'none',
                                    padding: '12px 32px', borderRadius: '6px', cursor: 'pointer',
                                    fontSize: '15px', fontWeight: '700',
                                    boxShadow: '0 4px 12px rgba(218, 55, 60, 0.3)'
                                }}
                            >
                                Supprimer le salon
                            </motion.button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>,
        document.body
    );
};

export default DeleteChannelModal;
