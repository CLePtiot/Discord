import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Shield, Key, Camera } from 'lucide-react';
import InlineModal from '../InlineModal';

const MyAccountTab = ({ userProfile, setUserProfile, onLogout }) => {
    const [showEmail, setShowEmail] = useState(false);
    const avatarInputRef = useRef(null);
    const bannerInputRef = useRef(null);

    // Edit Mode State
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [editName, setEditName] = useState(userProfile?.name || '');
    const [editBio, setEditBio] = useState(userProfile?.bio || '');
    const [editStatus, setEditStatus] = useState(userProfile?.status || 'En ligne');

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const objectUrl = URL.createObjectURL(file);
            setUserProfile({ ...userProfile, avatar: objectUrl });
        }
    };

    const handleBannerChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    // Upscale to a minimum banner resolution using canvas bicubic interpolation
                    const minWidth = 960;
                    const minHeight = 540;
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');

                    // Use the larger of: original size or minimum size
                    canvas.width = Math.max(img.width, minWidth);
                    canvas.height = Math.max(img.height, minHeight);

                    // Enable high-quality image smoothing
                    ctx.imageSmoothingEnabled = true;
                    ctx.imageSmoothingQuality = 'high';

                    // Draw the image scaled to fill the canvas
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                    const dataUrl = canvas.toDataURL('image/png');
                    setUserProfile({ ...userProfile, banner: dataUrl });
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
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
        setUserProfile({
            ...userProfile,
            name: editName,
            bio: editBio,
            status: editStatus
        });
        setIsEditingProfile(false);
    };

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h2 style={{ color: 'var(--text-header)', marginBottom: '24px' }}>Mon compte</h2>

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
                    backgroundImage: userProfile?.banner?.startsWith?.('#') ? 'none' : `url("${userProfile.banner}")`,
                    backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat',
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
                    <div className="banner-overlay" style={{
                        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.4)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                        opacity: 0, transition: 'opacity 0.2s', zIndex: 1
                    }}>
                        <Camera color="white" size={24} />
                        <span style={{ color: 'white', fontWeight: 600, fontSize: '14px' }}>Changer la bannière</span>
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
                                    backgroundImage: `url("${userProfile?.avatar || 'https://i.pravatar.cc/150?img=11'}")`,
                                    backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat',
                                    position: 'relative', cursor: 'pointer', flexShrink: 0,
                                    boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
                                }}
                                onClick={() => avatarInputRef.current?.click()}
                            >
                                <div style={{
                                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                                    backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: '50%',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    opacity: 0, transition: 'opacity 0.2s', flexDirection: 'column', gap: '4px'
                                }}
                                    onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                                    onMouseLeave={(e) => e.currentTarget.style.opacity = '0'}
                                >
                                    <Camera color="white" size={24} />
                                    <span style={{ color: 'white', fontSize: '10px', fontWeight: 600, textTransform: 'uppercase' }}>Éditer</span>
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
                                            setEditStatus(userProfile?.status || 'En ligne');
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
                                        Annuler
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
                                        Enregistrer
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => {
                                        setEditName(userProfile?.name || '');
                                        setEditBio(userProfile?.bio || '');
                                        setEditStatus(userProfile?.status || 'En ligne');
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
                                    Modifier le profil
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
                            <div>
                                <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
                                    Statut d'activité
                                </div>
                                {isEditingProfile ? (
                                    <select
                                        value={editStatus}
                                        onChange={(e) => setEditStatus(e.target.value)}
                                        style={{
                                            background: 'var(--bg-tertiary)', color: 'var(--text-normal)', border: '1px solid var(--border-color)',
                                            padding: '8px', borderRadius: '4px', width: '100%', outline: 'none',
                                            appearance: 'none',
                                            cursor: 'pointer',
                                            backgroundImage: 'linear-gradient(45deg, transparent 50%, var(--text-muted) 50%), linear-gradient(135deg, var(--text-muted) 50%, transparent 50%)',
                                            backgroundPosition: 'calc(100% - 20px) calc(1em + 2px), calc(100% - 15px) calc(1em + 2px)',
                                            backgroundSize: '5px 5px, 5px 5px',
                                            backgroundRepeat: 'no-repeat'
                                        }}
                                    >
                                        <option value="En ligne" style={{ backgroundColor: 'var(--bg-secondary)' }}>En ligne</option>
                                        <option value="Occupé" style={{ backgroundColor: 'var(--bg-secondary)' }}>Occupé</option>
                                        <option value="Inactif" style={{ backgroundColor: 'var(--bg-secondary)' }}>Inactif</option>
                                        <option value="Hors ligne" style={{ backgroundColor: 'var(--bg-secondary)' }}>Hors ligne</option>
                                    </select>
                                ) : (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-normal)', fontSize: '14px' }}>
                                        <div style={{
                                            width: '10px', height: '10px', borderRadius: '50%',
                                            backgroundColor: (userProfile?.status === 'En ligne' || !userProfile?.status) ? 'var(--success-color)' :
                                                userProfile?.status === 'Occupé' ? 'var(--danger-color)' :
                                                    userProfile?.status === 'Inactif' ? 'var(--warning-color, #f0b232)' : 'var(--text-muted)'
                                        }}></div>
                                        {userProfile?.status || 'En ligne'}
                                    </div>
                                )}
                            </div>

                            <div>
                                <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
                                    À propos de moi
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
                                    Nom d'utilisateur
                                </div>
                                <div style={{ color: 'var(--text-normal)', fontSize: '14px' }}>
                                    {userProfile?.name?.toLowerCase().replace(/\s/g, '') || 'satoshi'}
                                </div>
                            </div>
                            <button style={{
                                background: 'var(--bg-hover)', color: 'var(--text-normal)', border: 'none',
                                padding: '6px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 500, fontSize: '13px'
                            }} onClick={() => setUsernameModal(true)}>Modifier</button>
                        </div>

                        {/* Email */}
                        <div style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            padding: '12px', borderRadius: '8px', backgroundColor: 'var(--bg-primary)'
                        }}>
                            <div>
                                <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
                                    E-mail
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
                                    {showEmail ? 'Masquer' : 'Révéler'}
                                </button>
                                <button style={{
                                    background: 'var(--bg-hover)', color: 'var(--text-normal)', border: 'none',
                                    padding: '6px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 500, fontSize: '13px'
                                }} onClick={() => setEmailModal(true)}>Modifier</button>
                            </div>
                        </div>

                        {/* Phone */}
                        <div style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            padding: '12px', borderRadius: '8px', backgroundColor: 'var(--bg-primary)'
                        }}>
                            <div>
                                <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
                                    Numéro de téléphone
                                </div>
                                <div style={{ color: userProfile?.phone ? 'var(--text-normal)' : 'var(--text-muted)', fontSize: '14px' }}>
                                    {userProfile?.phone || 'Non renseigné'}
                                </div>
                            </div>
                            <button style={{
                                background: 'var(--bg-hover)', color: 'var(--text-normal)', border: 'none',
                                padding: '6px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 500, fontSize: '13px'
                            }} onClick={() => setPhoneModal(true)}>{userProfile?.phone ? 'Modifier' : 'Ajouter'}</button>
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.06)', margin: '32px 0' }}></div>

            {/* Password & Authentication */}
            <div>
                <h3 style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: 800, marginBottom: '16px', textTransform: 'uppercase' }}>
                    Mot de passe et authentification
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
                                Mot de passe
                            </div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
                                Modifie ton mot de passe actuel pour sécuriser ton compte.
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
                            Modifier
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
                                Authentification à deux facteurs
                            </div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
                                Protège ton compte avec une couche de sécurité supplémentaire.
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
                            Activer
                        </button>
                    </div>
                </div>
            </div>

            <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.06)', margin: '32px 0' }}></div>

            {/* Danger Zone */}
            <div>
                <h3 style={{ color: '#da373c', fontSize: '12px', fontWeight: 800, marginBottom: '16px', textTransform: 'uppercase' }}>
                    Suppression du compte
                </h3>
                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '12px 0'
                }}>
                    <div style={{ flex: 1, paddingRight: '16px' }}>
                        <div style={{ color: 'var(--text-normal)', fontWeight: 500, marginBottom: '4px' }}>
                            Supprimer le compte
                        </div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
                            La suppression de ton compte est irréversible. Toutes tes données seront définitivement effacées.
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
                        Supprimer
                    </button>
                </div>
            </div>

            {/* ===== ALL INLINE MODALS ===== */}

            {/* Username change */}
            <InlineModal
                isOpen={usernameModal}
                onClose={() => setUsernameModal(false)}
                title="Modifier le nom d'utilisateur"
                description="Saisis ton nouveau nom d'utilisateur ci-dessous."
                type="prompt"
                defaultValue={userProfile?.name || ''}
                confirmLabel="Enregistrer"
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
                title="Modifier l'adresse e-mail"
                description="Saisis ta nouvelle adresse e-mail ci-dessous :"
                type="prompt"
                defaultValue={userProfile?.email || 'satoshi@protonmail.com'}
                confirmLabel="Enregistrer"
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
                title="Changer le mot de passe"
                description="Saisis ton nouveau mot de passe ci-dessous :"
                type="prompt"
                defaultValue=""
                confirmLabel="Enregistrer"
                onConfirm={(newPassword) => {
                    if (newPassword && newPassword.trim()) {
                        setSuccessModal({ open: true, title: 'Mot de passe modifié', description: 'Ton mot de passe a été mis à jour avec succès.' });
                    }
                }}
            />

            {/* Phone number */}
            <InlineModal
                isOpen={phoneModal}
                onClose={() => setPhoneModal(false)}
                title="Numéro de téléphone"
                description="Saisis ton numéro de téléphone ci-dessous :"
                type="prompt"
                defaultValue={userProfile?.phone || ''}
                confirmLabel="Enregistrer"
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
                title="Authentification à deux facteurs"
                description="Scanne le QR code ci-dessous avec ton application Authenticator (Google Authenticator, Authy, etc.)."
                type="alert"
                confirmLabel="J'ai scanné le code"
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
                title="Supprimer ton compte"
                description="Es-tu sûr de vouloir supprimer définitivement ton compte ? Cette action est irréversible et toutes tes données locales seront effacées."
                type="confirm"
                danger={true}
                confirmLabel="Supprimer définitivement"
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
