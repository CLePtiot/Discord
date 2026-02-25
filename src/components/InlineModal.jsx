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
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 10000
                    }}
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            backgroundColor: '#2b2d31',
                            borderRadius: '8px',
                            padding: '24px',
                            width: '420px',
                            maxWidth: '90vw',
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)',
                            border: '1px solid rgba(255,255,255,0.06)',
                            position: 'relative'
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
                            color: danger ? '#da373c' : 'var(--text-header)',
                            fontSize: '18px', fontWeight: 700,
                            marginBottom: '8px', paddingRight: '24px'
                        }}>
                            {title}
                        </h3>

                        {/* Description */}
                        {description && (
                            <p style={{
                                color: 'var(--text-muted)',
                                fontSize: '14px', lineHeight: 1.5,
                                marginBottom: '20px'
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
                                    padding: '10px 12px',
                                    backgroundColor: '#1e1f22',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '4px',
                                    color: 'var(--text-normal)',
                                    fontSize: '14px',
                                    outline: 'none',
                                    marginBottom: '20px',
                                    boxSizing: 'border-box'
                                }}
                            />
                        )}

                        {/* Buttons */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            gap: '12px'
                        }}>
                            {type !== 'alert' && (
                                <button
                                    onClick={onClose}
                                    style={{
                                        background: 'transparent',
                                        color: 'var(--text-normal)',
                                        border: 'none',
                                        padding: '10px 20px',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        fontWeight: 500,
                                        fontSize: '14px'
                                    }}
                                >
                                    {cancelLabel}
                                </button>
                            )}
                            <button
                                onClick={() => {
                                    if (type === 'prompt') {
                                        onConfirm?.(inputValue);
                                    } else {
                                        onConfirm?.();
                                    }
                                    onClose();
                                }}
                                style={{
                                    background: danger ? '#da373c' : 'var(--accent-color)',
                                    color: 'white',
                                    border: 'none',
                                    padding: '10px 20px',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontWeight: 600,
                                    fontSize: '14px'
                                }}
                            >
                                {type === 'alert' ? 'OK' : confirmLabel}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default InlineModal;
