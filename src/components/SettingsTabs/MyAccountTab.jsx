import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Shield, Key, Camera } from 'lucide-react';
import InlineModal from '../InlineModal';
import { useTranslation } from '../../contexts/LanguageContext';

const MyAccountTab = ({ userProfile, setUserProfile, updateProfile, onLogout }) => {
    const { t } = useTranslation();
    const [showEmail, setShowEmail] = useState(false);
    const avatarInputRef = useRef(null);
    const bannerInputRef = useRef(null);

    // Edit Mode State
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [editName, setEditName] = useState(userProfile?.name || '');
    const [editBio, setEditBio] = useState(userProfile?.bio || '');
    const [editStatus, setEditStatus] = useState(userProfile?.status || 'online');

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    const size = 256;
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    canvas.width = size;
                    canvas.height = size;
                    const minDim = Math.min(img.width, img.height);
                    const startX = (img.width - minDim) / 2;
                    const startY = (img.height - minDim) / 2;
                    ctx.imageSmoothingEnabled = true;
                    ctx.imageSmoothingQuality = 'high';
                    ctx.drawImage(img, startX, startY, minDim, minDim, 0, 0, size, size);
                    const dataUrl = canvas.toDataURL('image/png');
                    if (updateProfile) {
                        updateProfile({ avatar: dataUrl });
                    } else {
                        setUserProfile({ ...userProfile, avatar: dataUrl });
                    }
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
            e.target.value = '';
        }
    };

    const handleBannerChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    const minWidth = 960;
                    const minHeight = 540;
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    canvas.width = Math.max(img.width, minWidth);
                    canvas.height = Math.max(img.height, minHeight);
                    ctx.imageSmoothingEnabled = true;
                    ctx.imageSmoothingQuality = 'high';
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                    const dataUrl = canvas.toDataURL('image/png');
                    if (updateProfile) {
                        updateProfile({ banner: dataUrl });
                    } else {
                        setUserProfile({ ...userProfile, banner: dataUrl });
                    }
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
            e.target.value = '';
        }
    };

    // Modal states
    const [usernameModal, setUsernameModal] = useState(false);
    const [emailModal, setEmailModal] = useState(false);
    const [passwordModal, setPasswordModal] = useState(false);
    const [phoneModal, setPhoneModal] = useState(false);
    const [twoFaModal, setTwoFaModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [successModal, setSuccessModal] = useState({ open: false, title: '', description: '' });

    const handleSaveProfile = () => {
        const updates = {
            name: editName,
            bio: editBio,
            status: editStatus
        };
        if (updateProfile) {
            updateProfile(updates);
        } else {
            setUserProfile({
                ...userProfile,
                ...updates
            });
        }
        setIsEditingProfile(false);
    };

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h2 style={{ color: 'var(--text-header)', marginBottom: '24px' }}>{t('account.title')}</h2>

            {/* Profile Card */}
            <div style={{
                borderRadius: '8px', overflow: 'hidden',
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid rgba(255,255,255,0.06)'
            }}>
                {/* Banner */}
                <div style={{
                    height: '140px',
                    backgroundColor: userProfile?.banner?.startsWith?.('#') ? userProfile.banner : '#5865F2',
                    position: 'relative', cursor: 'pointer',
                    overflow: 'hidden'
                }}
                    onClick={() => bannerInputRef.current?.click()}
                    onMouseEnter={(e) => {
                        const overlay = e.currentTarget.querySelector('.banner-overlay');
                        if (overlay) overlay.style.opacity = '1';
                    }}
                    onMouseLeave={(e) => {
                        const overlay = e.currentTarget.querySelector('.banner-overlay');
                        if (overlay) overlay.style.opacity = '0';
                    }}
                >
                    {userProfile?.banner && !userProfile.banner.startsWith('#') && (
                        <img
                            src={userProfile.banner}
                            alt="Banner"
                            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                        />
                    )}
                    <div className="banner-overlay" style={{
                        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.4)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                        opacity: 0, transition: 'opacity 0.2s', zIndex: 1
                    }}>
                        <Camera color="white" size={24} />
                        <span style={{ color: 'white', fontWeight: 600, fontSize: '14px' }}>{t('account.change_banner')}</span>
                    </div>
                </div>
                <input
                    type="file"
                    ref={bannerInputRef}
                    style={{ display: 'none' }}
                    accept="image/*, .jpg, .jpeg, .png, .gif"
                    onChange={handleBannerChange}
                />

                <div style={{ padding: '0 16px 16px 16px', position: 'relative' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: '-40px', marginBottom: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '16px' }}>
                            {/* Avatar */}
                            <div
                                style={{
                                    width: '100px', height: '100px', borderRadius: '50%',
                                    border: '6px solid var(--bg-secondary)',
                                    backgroundColor: 'var(--bg-chat)',
                                    position: 'relative', cursor: 'pointer', flexShrink: 0,
                                    boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
                                    overflow: 'hidden'
                                }}
                                onClick={() => avatarInputRef.current?.click()}
                            >
                                <img
                                    src={userProfile?.avatar || 'https://i.pravatar.cc/150?img=11'}
                                    alt="Avatar"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                                />
                                <div style={{
                                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                                    backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: '50%',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    opacity: 0, transition: 'opacity 0.2s', flexDirection: 'column', gap: '4px',
                                    zIndex: 2
                                }}
                                    onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                                    onMouseLeave={(e) => e.currentTarget.style.opacity = '0'}
                                >
                                    <Camera color="white" size={24} />
                                    <span style={{ color: 'white', fontSize: '10px', fontWeight: 600, textTransform: 'uppercase' }}>{t('account.edit')}</span>
                                </div>
                            </div>
                            <input
                                type="file"
                                ref={avatarInputRef}
                                style={{ display: 'none' }}
                                accept="image/*, .jpg, .jpeg, .png, .gif"
                                onChange={handleAvatarChange}
                            />

                            {/* Name */}
                            <div style={{ marginBottom: '12px' }}>
                                {isEditingProfile ? (
                                    <input
                                        type="text"
                                        value={editName}
                                        onChange={(e) => setEditName(e.target.value)}
                                        style={{
                                            background: 'var(--bg-tertiary)', color: 'var(--text-header)', border: '1px solid var(--border-color)',
                                            padding: '4px 8px', borderRadius: '4px', fontSize: '20px', fontWeight: 700, width: '200px'
                                        }}
                                    />
                                ) : (
                                    <h3 style={{ color: 'var(--text-header)', fontSize: '24px', fontWeight: 800, margin: 0, lineHeight: 1 }}>
                                        {userProfile?.name || 'Satoshi'}
                                    </h3>
                                )}
                            </div>
                        </div>

                        {/* Edit Buttons */}
                        <div style={{ marginTop: '52px' }}>
                            {isEditingProfile ? (
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button
                                        onClick={() => {
                                            setEditName(userProfile?.name || '');
                                            setEditBio(userProfile?.bio || '');
                                            setEditStatus(userProfile?.status || 'online');
                                            setIsEditingProfile(false);
                                        }}
                                        style={{
                                            background: 'transparent', color: 'var(--text-normal)', border: 'none',
                                            padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 500, fontSize: '14px',
                                            transition: 'background 0.2s'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                    >
                                        {t('account.cancel')}
                                    </button>
                                    <button
                                        onClick={handleSaveProfile}
                                        style={{
                                            background: 'var(--success-color)', color: 'white', border: 'none',
                                            padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 500, fontSize: '14px',
                                            transition: 'background 0.2s'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.background = '#1e8f4c'}
                                        onMouseLeave={(e) => e.currentTarget.style.background = 'var(--success-color)'}
                                    >
                                        {t('account.save')}
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => {
                                        setEditName(userProfile?.name || '');
                                        setEditBio(userProfile?.bio || '');
                                        setEditStatus(userProfile?.status || 'online');
                                        setIsEditingProfile(true);
                                    }}
                                    style={{
                                        background: 'var(--accent-color)', color: 'white', border: 'none',
                                        padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 500, fontSize: '14px',
                                        transition: 'background 0.2s'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = '#4752c4'}
                                    onMouseLeave={(e) => e.currentTarget.style.background = 'var(--accent-color)'}
                                >
                                    {t('account.edit_profile')}
                                </button>
                            )}
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {/* Bio & Status (only shown in edit mode or if they exist, but we will always show for this component to match structure) */}
                        <div style={{
                            display: 'flex', flexDirection: 'column', gap: '12px',
                            padding: '12px', borderRadius: '8px', backgroundColor: 'var(--bg-primary)'
                        }}>
                            {/* Quick Status Dashboard */}
                            <div style={{ marginBottom: '8px' }}>
                                <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '12px' }}>
                                    {t('account.activity_status')}
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                                    {[
                                        { id: 'online', color: 'var(--success-color, #23a559)', glow: 'rgba(35, 165, 89, 0.4)' },
                                        { id: 'idle', color: 'var(--warning-color, #f0b232)', glow: 'rgba(240, 178, 50, 0.4)' },
                                        { id: 'dnd', color: 'var(--danger-color, #da373c)', glow: 'rgba(218, 55, 60, 0.4)' },
                                        { id: 'invisible', color: '#80848e', glow: 'rgba(128, 132, 142, 0.4)' }
                                    ].map(statusObj => {
                                        const isActive = (userProfile?.status || 'online') === statusObj.id;
                                        return (
                                            <motion.button
                                                key={statusObj.id}
                                                whileHover={{ scale: 1.02, backgroundColor: 'var(--bg-tertiary)' }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => {
                                                    setUserProfile({ ...userProfile, status: statusObj.id });
                                                    setEditStatus(statusObj.id);
                                                }}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '12px',
                                                    padding: '12px 16px',
                                                    background: isActive ? 'var(--bg-tertiary)' : 'var(--bg-secondary)',
                                                    border: `1px solid ${isActive ? statusObj.color : 'rgba(255,255,255,0.05)'}`,
                                                    borderRadius: '8px',
                                                    cursor: 'pointer',
                                                    color: isActive ? 'var(--text-header)' : 'var(--text-normal)',
                                                    boxShadow: isActive ? `0 0 12px ${statusObj.glow}` : 'none',
                                                    transition: 'all 0.2s ease',
                                                    textAlign: 'left',
                                                    outline: 'none'
                                                }}
                                            >
                                                <div style={{
                                                    width: '12px', height: '12px', borderRadius: '50%',
                                                    backgroundColor: statusObj.id === 'invisible' && !isActive ? 'transparent' : statusObj.color,
                                                    boxShadow: isActive ? `0 0 8px ${statusObj.color}` : 'none',
                                                    border: statusObj.id === 'invisible' ? `2px solid ${statusObj.color}` : 'none',
                                                    boxSizing: 'border-box',
                                                    flexShrink: 0
                                                }} />
                                                <span style={{ fontSize: '13px', fontWeight: isActive ? 600 : 500 }}>
                                                    {t(`account.status.${statusObj.id}`)}
                                                </span>
                                            </motion.button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div>
                                <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
                                    {t('account.about_me')}
                                </div>
                                {isEditingProfile ? (
                                    <textarea
                                        value={editBio}
                                        onChange={(e) => setEditBio(e.target.value)}
                                        rows={3}
                                        style={{
                                            background: 'var(--bg-tertiary)', color: 'var(--text-normal)', border: '1px solid var(--border-color)',
                                            padding: '8px', borderRadius: '4px', width: '100%', resize: 'vertical', minHeight: '60px'
                                        }}
                                    />
                                ) : (
                                    <div style={{ color: 'var(--text-normal)', fontSize: '14px', whiteSpace: 'pre-wrap' }}>
                                        {userProfile?.bio || '—'}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Username */}
                        <div style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            padding: '12px', borderRadius: '8px', backgroundColor: 'var(--bg-primary)'
                        }}>
                            <div>
                                <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
                                    {t('account.username')}
                                </div>
                                <div style={{ color: 'var(--text-normal)', fontSize: '14px' }}>
                                    {userProfile?.name?.toLowerCase().replace(/\s/g, '') || 'satoshi'}
                                </div>
                            </div>
                            <button style={{
                                background: 'var(--bg-hover)', color: 'var(--text-normal)', border: 'none',
                                padding: '6px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 500, fontSize: '13px'
                            }} onClick={() => setUsernameModal(true)}>{t('account.edit_btn')}</button>
                        </div>

                        {/* Email */}
                        <div style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            padding: '12px', borderRadius: '8px', backgroundColor: 'var(--bg-primary)'
                        }}>
                            <div>
                                <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
                                    {t('account.email')}
                                </div>
                                <div style={{ color: 'var(--text-normal)', fontSize: '14px' }}>
                                    {showEmail ? (userProfile?.email || 'satoshi@protonmail.com') : 's••••••@protonmail.com'}
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button style={{
                                    background: 'var(--bg-hover)', color: 'var(--text-normal)', border: 'none',
                                    padding: '6px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 500, fontSize: '13px'
                                }} onClick={() => setShowEmail(!showEmail)}>
                                    {showEmail ? t('account.hide') : t('account.reveal')}
                                </button>
                                <button style={{
                                    background: 'var(--bg-hover)', color: 'var(--text-normal)', border: 'none',
                                    padding: '6px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 500, fontSize: '13px'
                                }} onClick={() => setEmailModal(true)}>{t('account.edit_btn')}</button>
                            </div>
                        </div>

                        {/* Phone */}
                        <div style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            padding: '12px', borderRadius: '8px', backgroundColor: 'var(--bg-primary)'
                        }}>
                            <div>
                                <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
                                    {t('account.phone')}
                                </div>
                                <div style={{ color: userProfile?.phone ? 'var(--text-normal)' : 'var(--text-muted)', fontSize: '14px' }}>
                                    {userProfile?.phone || t('account.not_set')}
                                </div>
                            </div>
                            <button style={{
                                background: 'var(--bg-hover)', color: 'var(--text-normal)', border: 'none',
                                padding: '6px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 500, fontSize: '13px'
                            }} onClick={() => setPhoneModal(true)}>{userProfile?.phone ? t('account.edit_btn') : t('account.add')}</button>
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.06)', margin: '32px 0' }}></div>

            {/* Password & Authentication */}
            <div>
                <h3 style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: 800, marginBottom: '16px', textTransform: 'uppercase' }}>
                    {t('account.password_auth')}
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                    {/* Change Password Row */}
                    <div style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.04)'
                    }}>
                        <div style={{ flex: 1, paddingRight: '16px' }}>
                            <div style={{ color: 'var(--text-normal)', fontWeight: 500, marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Key size={16} color="var(--accent-color)" />
                                {t('account.password')}
                            </div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
                                {t('account.password_desc')}
                            </div>
                        </div>
                        <button
                            onClick={() => setPasswordModal(true)}
                            style={{
                                background: 'var(--accent-color)', color: 'white', border: 'none',
                                padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 500, fontSize: '13px',
                                transition: 'opacity 0.2s', whiteSpace: 'nowrap', flexShrink: 0
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.85'}
                            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                        >
                            {t('account.edit_btn')}
                        </button>
                    </div>

                    {/* 2FA Row */}
                    <div style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '12px 0'
                    }}>
                        <div style={{ flex: 1, paddingRight: '16px' }}>
                            <div style={{ color: 'var(--text-normal)', fontWeight: 500, marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Shield size={16} color="var(--accent-color)" />
                                {t('account.2fa')}
                            </div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
                                {t('account.2fa_desc')}
                            </div>
                        </div>
                        <button
                            onClick={() => setTwoFaModal(true)}
                            style={{
                                background: 'var(--accent-color)', color: 'white', border: 'none',
                                padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 500, fontSize: '13px',
                                transition: 'opacity 0.2s', whiteSpace: 'nowrap', flexShrink: 0
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.85'}
                            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                        >
                            {t('account.enable')}
                        </button>
                    </div>
                </div>
            </div>

            <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.06)', margin: '32px 0' }}></div>

            {/* Danger Zone */}
            <div>
                <h3 style={{ color: '#da373c', fontSize: '12px', fontWeight: 800, marginBottom: '16px', textTransform: 'uppercase' }}>
                    {t('account.delete_section')}
                </h3>
                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '12px 0'
                }}>
                    <div style={{ flex: 1, paddingRight: '16px' }}>
                        <div style={{ color: 'var(--text-normal)', fontWeight: 500, marginBottom: '4px' }}>
                            {t('account.delete_account')}
                        </div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
                            {t('account.delete_desc')}
                        </div>
                    </div>
                    <button
                        onClick={() => setDeleteModal(true)}
                        style={{
                            background: 'transparent',
                            color: '#da373c',
                            border: '1px solid #da373c',
                            padding: '8px 16px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontWeight: 500,
                            fontSize: '13px',
                            transition: 'all 0.2s ease',
                            whiteSpace: 'nowrap',
                            flexShrink: 0
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = '#da373c'; e.currentTarget.style.color = 'white'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#da373c'; }}
                    >
                        {t('account.delete_btn')}
                    </button>
                </div>
            </div>

            {/* ===== ALL INLINE MODALS ===== */}

            {/* Username change */}
            <InlineModal
                isOpen={usernameModal}
                onClose={() => setUsernameModal(false)}
                title={t('modal.change_username')}
                description={t('modal.change_username_desc')}
                type="prompt"
                defaultValue={userProfile?.name || ''}
                confirmLabel={t('common.save')}
                onConfirm={(newName) => {
                    if (newName && newName.trim()) {
                        setUserProfile({ ...userProfile, name: newName.trim() });
                    }
                }}
            />

            {/* Email change */}
            <InlineModal
                isOpen={emailModal}
                onClose={() => setEmailModal(false)}
                title={t('modal.change_email')}
                description={t('modal.change_email_desc')}
                type="prompt"
                defaultValue={userProfile?.email || 'satoshi@protonmail.com'}
                confirmLabel={t('common.save')}
                onConfirm={(newEmail) => {
                    if (newEmail && newEmail.trim()) {
                        setUserProfile({ ...userProfile, email: newEmail.trim() });
                    }
                }}
            />

            {/* Password change */}
            <InlineModal
                isOpen={passwordModal}
                onClose={() => setPasswordModal(false)}
                title={t('modal.change_password')}
                description={t('modal.change_password_desc')}
                type="prompt"
                defaultValue=""
                confirmLabel={t('common.save')}
                onConfirm={(newPassword) => {
                    if (newPassword && newPassword.trim()) {
                        setSuccessModal({ open: true, title: t('modal.password_changed'), description: t('modal.password_changed_desc') });
                    }
                }}
            />

            {/* Phone number */}
            <InlineModal
                isOpen={phoneModal}
                onClose={() => setPhoneModal(false)}
                title={t('modal.phone')}
                description={t('modal.phone_desc')}
                type="prompt"
                defaultValue={userProfile?.phone || ''}
                confirmLabel={t('common.save')}
                onConfirm={(newPhone) => {
                    if (newPhone !== undefined) {
                        setUserProfile({ ...userProfile, phone: newPhone.trim() });
                    }
                }}
            />

            {/* 2FA */}
            <InlineModal
                isOpen={twoFaModal}
                onClose={() => setTwoFaModal(false)}
                title={t('modal.2fa_title')}
                description={t('modal.2fa_desc')}
                type="alert"
                confirmLabel={t('modal.2fa_confirm')}
            >
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                    <div style={{
                        width: '160px', height: '160px',
                        backgroundColor: 'white',
                        padding: '12px',
                        borderRadius: '8px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                    }}>
                        {/* Placeholder QR Code from api.qrserver.com */}
                        <img
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=otpauth://totp/ProjectFreedom:${encodeURIComponent(userProfile?.name || 'User')}?secret=JBSWY3DPEHPK3PXP&issuer=ProjectFreedom`}
                            alt="QR Code"
                            style={{ width: '100%', height: '100%' }}
                        />
                    </div>
                </div>
            </InlineModal>

            {/* Delete account */}
            <InlineModal
                isOpen={deleteModal}
                onClose={() => setDeleteModal(false)}
                title={t('modal.delete_title')}
                description={t('modal.delete_desc')}
                type="confirm"
                danger={true}
                confirmLabel={t('modal.delete_confirm')}
                onConfirm={() => {
                    if (onLogout) onLogout();
                }}
            />

            {/* Generic success modal */}
            <InlineModal
                isOpen={successModal.open}
                onClose={() => setSuccessModal({ open: false, title: '', description: '' })}
                title={successModal.title}
                description={successModal.description}
                type="alert"
            />
        </motion.div>
    );
};

export default MyAccountTab;
