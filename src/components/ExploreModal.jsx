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
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                    style={{ textAlign: 'center', padding: '40px', maxWidth: '400px' }}
                >
                    <button className="modal-close" onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                        <X size={20} />
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

                    <h2 style={{ marginBottom: '16px', color: 'var(--text-header)' }}>Exploration</h2>
                    <p style={{ color: 'var(--text-muted)', lineHeight: '1.5' }}>
                        L'explorateur de serveurs décentralisés arrive bientôt sur Project Freedom.
                    </p>

                    <button
                        className="btn-primary"
                        onClick={onClose}
                        style={{ marginTop: '32px', width: '100%' }}
                    >
                        J'ai hâte !
                    </button>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default ExploreModal;
