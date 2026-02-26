import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Palette, Mic, Bell, Shield, Accessibility, Keyboard, LogOut } from 'lucide-react';
import UserProfileTab from './SettingsTabs/UserProfileTab';
import VoiceVideoTab from './SettingsTabs/VoiceVideoTab';
import AppearanceTab from './SettingsTabs/AppearanceTab';
import MyAccountTab from './SettingsTabs/MyAccountTab';
import NotificationsTab from './SettingsTabs/NotificationsTab';
import PrivacyTab from './SettingsTabs/PrivacyTab';
import AccessibilityTab from './SettingsTabs/AccessibilityTab';
import KeybindsTab from './SettingsTabs/KeybindsTab';

const SettingsModal = ({ isOpen, onClose, userProfile, setUserProfile, preferences, setPreferences, onLogout }) => {
    const [activeTab, setActiveTab] = useState('my-account');

    const tabSections = [
        {
            title: 'PARAMÈTRES UTILISATEUR',
            tabs: [
                { id: 'my-account', label: 'Mon compte' },
                { id: 'user-profile', label: 'Profil d\'utilisateur', badge: 'NITRO' },
                { id: 'privacy', label: 'Confidentialité & Sécurité' },
            ]
        },
        {
            title: 'PARAMÈTRES DE L\'APP',
            tabs: [
                { id: 'appearance', label: 'Apparence' },
                { id: 'accessibility', label: 'Accessibilité' },
                { id: 'voice-video', label: 'Voix & Vidéo' },
                { id: 'notifications', label: 'Notifications' },
                { id: 'keybinds', label: 'Raccourcis clavier' },
            ]
        }
    ];

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && isOpen) {
                e.preventDefault();
                e.stopPropagation();
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown, true);
        return () => window.removeEventListener('keydown', handleKeyDown, true);
    }, [isOpen, onClose]);

    const renderTabContent = () => {
        switch (activeTab) {
            case 'my-account':
                return <MyAccountTab userProfile={userProfile} setUserProfile={setUserProfile} onLogout={onLogout} />;
            case 'user-profile':
                return <UserProfileTab userProfile={userProfile} setUserProfile={setUserProfile} />;
            case 'privacy':
                return <PrivacyTab onLogout={onLogout} preferences={preferences} setPreferences={setPreferences} />;
            case 'appearance':
                return <AppearanceTab preferences={preferences} setPreferences={setPreferences} />;
            case 'accessibility':
                return <AccessibilityTab preferences={preferences} setPreferences={setPreferences} />;
            case 'voice-video':
                return <VoiceVideoTab />;
            case 'notifications':
                return <NotificationsTab />;
            case 'keybinds':
                return <KeybindsTab />;
            default:
                return null;
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="settings-modal-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    style={{
                        position: 'fixed',
                        top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: preferences.theme === 'amoled' ? '#000000' : '#313338',
                        zIndex: 9999,
                        display: 'flex',
                        color: 'var(--text-normal)'
                    }}
                >
                    {/* Sidebar */}
                    <div style={{
                        width: '218px',
                        minWidth: '218px',
                        backgroundColor: preferences.theme === 'amoled' ? '#0a0a0a' : '#2b2d31',
                        display: 'flex',
                        flexDirection: 'column',
                        overflowY: 'auto',
                        flex: '0 0 auto'
                    }}>
                        {/* Spacer to push content right-aligned like Discord */}
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', padding: '60px 8px 20px 20px' }}>
                            {tabSections.map((section, sIdx) => (
                                <React.Fragment key={sIdx}>
                                    {sIdx > 0 && <div className="settings-separator"></div>}
                                    <div className="settings-sidebar-section-title">
                                        {section.title}
                                    </div>
                                    {section.tabs.map(tab => (
                                        <div
                                            key={tab.id}
                                            className={`settings-tab-item ${activeTab === tab.id ? 'active' : ''}`}
                                            onClick={() => setActiveTab(tab.id)}
                                            style={{
                                                color: activeTab === tab.id ? 'var(--text-header)' : 'var(--text-muted)'
                                            }}
                                        >
                                            <span>{tab.label}</span>
                                            {tab.badge && (
                                                <div style={{
                                                    background: 'linear-gradient(90deg, #ff73fa, #5865f2)',
                                                    WebkitBackgroundClip: 'text',
                                                    WebkitTextFillColor: 'transparent',
                                                    fontSize: '10px',
                                                    fontWeight: 800
                                                }}>
                                                    {tab.badge}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </React.Fragment>
                            ))}

                            <div className="settings-separator"></div>

                            {/* Logout button */}
                            <button className="settings-logout-btn" onClick={onLogout}>
                                <LogOut size={16} />
                                <span>Déconnexion</span>
                            </button>

                            <div className="settings-separator"></div>

                            {/* Version info */}
                            <div style={{ padding: '8px 10px', fontSize: '12px', color: 'var(--text-muted)' }}>
                                Project Freedom v0.1.0
                                <br />
                                <span style={{ fontSize: '10px', opacity: 0.6 }}>Build 2026.02.24</span>
                            </div>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div style={{
                        flex: 1,
                        display: 'flex',
                        justifyContent: 'flex-start',
                        backgroundColor: preferences.theme === 'amoled' ? '#000000' : '#313338',
                        overflowY: 'auto',
                        position: 'relative'
                    }}>
                        <div style={{
                            width: '100%',
                            maxWidth: '740px',
                            padding: '60px 40px 60px 40px'
                        }}>
                            {renderTabContent()}
                        </div>

                        {/* Close Button */}
                        <div style={{
                            position: 'sticky',
                            top: '60px',
                            right: '0',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '8px',
                            marginRight: '20px',
                            marginTop: '60px',
                            flexShrink: 0
                        }}>
                            <button className="settings-close-btn" onClick={onClose}>
                                <X size={18} />
                            </button>
                            <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600 }}>ÉCHAP</span>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default SettingsModal;
