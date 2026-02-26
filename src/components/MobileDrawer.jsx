import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MobileDrawer = ({ isOpen, onClose, children }) => {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 1024);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (isOpen && isMobile) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isOpen, isMobile]);

    return (
        <>
            <AnimatePresence>
                {isOpen && isMobile && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={onClose}
                        className="mobile-drawer-overlay"
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(0, 0, 0, 0.6)',
                            zIndex: 9000,
                            backdropFilter: 'blur(4px)'
                        }}
                    />
                )}
            </AnimatePresence>

            <motion.div
                className="mobile-drawer-content"
                initial={false}
                animate={{ x: isMobile ? (isOpen ? 0 : '-100%') : 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                style={isMobile ? {
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    bottom: 0,
                    width: '85%',
                    maxWidth: '360px', /* typical sidebar sizes combined */
                    backgroundColor: 'var(--bg-app)', /* fallback */
                    zIndex: 9001,
                    display: 'flex',
                    boxShadow: '4px 0 16px rgba(0,0,0,0.5)'
                } : {
                    display: 'contents'
                }}
            >
                {children}
            </motion.div>
        </>
    );
};

export default MobileDrawer;
