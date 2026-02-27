import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

/**
 * InlineModal — Composant réutilisable pour remplacer prompt/alert/confirm
 * Props:
 *   isOpen, onClose, title, description,
 *   type: 'alert' | 'confirm' | 'prompt',
 *   onConfirm(value?), defaultValue (for prompt), confirmLabel, cancelLabel,
 *   danger (boolean) — pour un style rouge
 */
const InlineModal = ({
    isOpen, onClose, title, description,
    type = 'alert',
    onConfirm,
    defaultValue = '',
    confirmLabel = 'Confirmer',
    cancelLabel = 'Annuler',
    danger = false,
    children
}) => {
    const [inputValue, setInputValue] = useState(defaultValue);

    useEffect(() => {
        if (isOpen) setInputValue(defaultValue);
    }, [isOpen, defaultValue]);

    useEffect(() => {
        const handleKey = (e) => {
            if (!isOpen) return;
            if (e.key === 'Escape') onClose();
            if (e.key === 'Enter' && type !== 'alert') {
                e.preventDefault();
                onConfirm?.(type === 'prompt' ? inputValue : undefined);
                onClose();
            }
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [isOpen, inputValue, type, onConfirm, onClose]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    onClick={onClose}
                    style={{
                        position: 'fixed',
                        top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.4)',
                        backdropFilter: 'blur(12px)',
                        WebkitBackdropFilter: 'blur(12px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 10000
                    }}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                        onClick={(e) => e.stopPropagation()}
                        className="modal-content glass-panel"
                        style={{
                            padding: '32px',
                            width: '440px',
                            maxWidth: '90vw'
                        }}
                    >
                        {/* Close button */}
                        <button
                            onClick={onClose}
                            style={{
                                position: 'absolute', top: '12px', right: '12px',
                                background: 'transparent', border: 'none',
                                color: 'var(--text-muted)', cursor: 'pointer',
                                padding: '4px', borderRadius: '4px'
                            }}
                        >
                            <X size={18} />
                        </button>

                        {/* Title */}
                        <h3 style={{
                            color: danger ? 'var(--danger-color)' : 'var(--text-header)',
                            fontSize: '22px',
                            fontWeight: '800',
                            marginBottom: '12px',
                            paddingRight: '24px',
                            letterSpacing: '-0.02em'
                        }}>
                            {title}
                        </h3>

                        {/* Description */}
                        {description && (
                            <p style={{
                                color: 'var(--text-muted)',
                                fontSize: '15px',
                                lineHeight: '1.5',
                                marginBottom: '24px'
                            }}>
                                {description}
                            </p>
                        )}

                        {children}

                        {/* Prompt input */}
                        {type === 'prompt' && (
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                autoFocus
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    backgroundColor: 'rgba(0,0,0,0.2)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '8px',
                                    color: 'var(--text-normal)',
                                    fontSize: '15px',
                                    outline: 'none',
                                    marginBottom: '24px',
                                    boxSizing: 'border-box'
                                }}
                            />
                        )}

                        {/* Buttons */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            gap: '12px',
                            background: 'rgba(0,0,0,0.15)',
                            margin: '8px -32px -32px -32px',
                            padding: '24px 32px'
                        }}>
                            {type !== 'alert' && (
                                <button
                                    onClick={onClose}
                                    style={{
                                        background: 'transparent',
                                        color: 'white',
                                        border: 'none',
                                        padding: '10px 20px',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        fontWeight: '500',
                                        fontSize: '14px'
                                    }}
                                >
                                    {cancelLabel}
                                </button>
                            )}
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => {
                                    if (type === 'prompt') {
                                        onConfirm?.(inputValue);
                                    } else {
                                        onConfirm?.();
                                    }
                                    onClose();
                                }}
                                style={{
                                    background: danger ? 'var(--danger-color)' : 'var(--accent-color)',
                                    color: 'white',
                                    border: 'none',
                                    padding: '10px 24px',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontWeight: '700',
                                    fontSize: '14px',
                                    boxShadow: danger ? '0 4px 12px rgba(218, 55, 60, 0.3)' : '0 4px 12px rgba(88, 101, 242, 0.3)'
                                }}
                            >
                                {type === 'alert' ? 'OK' : confirmLabel}
                            </motion.button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default InlineModal;
