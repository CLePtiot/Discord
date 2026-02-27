import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Palette, Mic, Bell, Shield, Accessibility, Keyboard, LogOut } from 'lucide-react';
import { useTranslation } from '../contexts/LanguageContext';
import UserProfileTab from './SettingsTabs/UserProfileTab';
import VoiceVideoTab from './SettingsTabs/VoiceVideoTab';
import AppearanceTab from './SettingsTabs/AppearanceTab';
import MyAccountTab from './SettingsTabs/MyAccountTab';
import NotificationsTab from './SettingsTabs/NotificationsTab';
import PrivacyTab from './SettingsTabs/PrivacyTab';
import AccessibilityTab from './SettingsTabs/AccessibilityTab';
import KeybindsTab from './SettingsTabs/KeybindsTab';
import TextImagesTab from './SettingsTabs/TextImagesTab';
import LanguageTab from './SettingsTabs/LanguageTab';
import AdvancedTab from './SettingsTabs/AdvancedTab';

const SettingsModal = ({ isOpen, onClose, userProfile, setUserProfile, preferences, setPreferences, onLogout }) => {
    const [activeTab, setActiveTab] = useState('my-account');
    const { t } = useTranslation();

    const tabSections = [
        {
            title: t('settings.user_settings'),
            tabs: [
                { id: 'my-account', label: t('settings.my_account') },
                { id: 'user-profile', label: t('settings.user_profile') },
                { id: 'privacy', label: t('settings.privacy') },
            ]
        },
        {
            title: t('settings.app_settings'),
            tabs: [
                { id: 'appearance', label: t('settings.appearance') },
                { id: 'accessibility', label: t('settings.accessibility') },
                { id: 'voice-video', label: t('settings.voice_video') },
                { id: 'text-images', label: t('settings.text_images') },
                { id: 'notifications', label: t('settings.notifications') },
                { id: 'keybinds', label: t('settings.keybinds') },
                { id: 'language', label: t('settings.language') },
                { id: 'advanced', label: t('settings.advanced') },
            ]
        }
    ];

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && isOpen) {
                // Don't close settings if a child InlineModal is open (z-index 10000)
                const topModal = document.querySelector('[style*="z-index: 10000"]') ||
                    document.querySelector('[style*="zIndex: 10000"]');
                if (topModal) return; // Let InlineModal handle it
                e.preventDefault();
                e.stopPropagation();
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
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
            case 'text-images':
                return <TextImagesTab />;
            case 'notifications':
                return <NotificationsTab />;
            case 'keybinds':
                return <KeybindsTab />;
            case 'language':
                return <LanguageTab preferences={preferences} setPreferences={setPreferences} />;
            case 'advanced':
                return <AdvancedTab />;
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
                                        </div>
                                    ))}
                                </React.Fragment>
                            ))}

                            <div className="settings-separator"></div>

                            {/* Logout button */}
                            <button className="settings-logout-btn" onClick={onLogout}>
                                <LogOut size={16} />
                                <span>{t('settings.logout')}</span>
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
                            <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600 }}>{t('settings.escape')}</span>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default SettingsModal;
