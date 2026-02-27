import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, X } from 'lucide-react';

const ExploreModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                className="modal-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                style={{ zIndex: 1000 }}
            >
                <motion.div
                    className="modal-content glass-panel"
                    initial={{ scale: 0.9, opacity: 0, y: 30 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 30 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    onClick={(e) => e.stopPropagation()}
                    style={{ textAlign: 'center', padding: '48px 32px' }}
                >
                    <button className="modal-close" onClick={onClose} style={{
                        position: 'absolute',
                        top: '20px',
                        right: '20px',
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

                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
                        <div style={{
                            width: '64px', height: '64px',
                            borderRadius: '50%',
                            backgroundColor: 'rgba(88, 101, 242, 0.1)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'var(--accent-color)'
                        }}>
                            <Compass size={32} />
                        </div>
                    </div>

                    <h2 style={{
                        marginBottom: '12px',
                        color: 'var(--text-header)',
                        fontSize: '28px',
                        fontWeight: '800',
                        letterSpacing: '-0.02em'
                    }}>
                        Exploration
                    </h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '16px', lineHeight: '1.6', marginBottom: '8px' }}>
                        L'explorateur de serveurs décentralisés arrive bientôt sur Project Freedom.
                    </p>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="btn-primary"
                        onClick={onClose}
                        style={{
                            marginTop: '32px',
                            width: '100%',
                            padding: '14px',
                            background: 'var(--accent-color)',
                            border: 'none',
                            color: 'white',
                            borderRadius: '8px',
                            fontWeight: '700',
                            fontSize: '16px',
                            cursor: 'pointer',
                            boxShadow: '0 8px 16px rgba(88, 101, 242, 0.2)'
                        }}
                    >
                        J'ai hâte !
                    </motion.button>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default ExploreModal;
