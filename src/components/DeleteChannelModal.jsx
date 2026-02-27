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
                    className="modal-overlay glass-panel-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: 'rgba(0,0,0,0.75)', zIndex: 10000,
                        backdropFilter: 'blur(8px)'
                    }}
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
                            background: 'var(--bg-secondary)',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            boxShadow: '0 10px 40px rgba(0,0,0,0.8)',
                            display: 'flex', flexDirection: 'column'
                        }}
                        onClick={e => e.stopPropagation()}
                    >
                        <div style={{ padding: '24px 24px 16px', position: 'relative' }}>
                            <h2 style={{ fontSize: '20px', fontWeight: 700, margin: '0', color: 'var(--text-header)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <AlertTriangle size={24} color="var(--danger-color)" />
                                Supprimer le salon
                            </h2>
                        </div>

                        <div style={{ padding: '0 24px 24px', color: 'var(--text-normal)', fontSize: '15px', lineHeight: '1.5' }}>
                            Êtes-vous sûr de vouloir supprimer le salon <strong>#{channelName}</strong> ? Cette action ne peut pas être annulée.
                        </div>

                        {/* Footer buttons */}
                        <div style={{ background: 'var(--bg-secondary-alt)', padding: '16px 24px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                            <button
                                onClick={onClose}
                                style={{
                                    background: 'transparent', color: 'var(--text-normal)', border: 'none',
                                    padding: '10px 24px', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', fontWeight: 500,
                                    transition: 'text-decoration 0.2s'
                                }}
                                onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                                onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
                            >
                                Annuler
                            </button>
                            <button
                                onClick={onDelete}
                                style={{
                                    background: 'var(--danger-color)', color: 'white', border: 'none',
                                    padding: '10px 24px', borderRadius: '4px', cursor: 'pointer',
                                    fontSize: '14px', fontWeight: 500,
                                    transition: 'background 0.2s'
                                }}
                                onMouseEnter={(e) => e.target.style.background = '#a12d31'}
                                onMouseLeave={(e) => e.target.style.background = 'var(--danger-color)'}
                            >
                                Supprimer le salon
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>,
        document.body
    );
};

export default DeleteChannelModal;
