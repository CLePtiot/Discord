import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Key } from 'lucide-react';
import InlineModal from '../InlineModal';

const MyAccountTab = ({ userProfile, setUserProfile, onLogout }) => {
    const [showEmail, setShowEmail] = useState(false);

    // Modal states
    const [usernameModal, setUsernameModal] = useState(false);
    const [emailModal, setEmailModal] = useState(false);
    const [passwordModal, setPasswordModal] = useState(false);
    const [phoneModal, setPhoneModal] = useState(false);
    const [twoFaModal, setTwoFaModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [successModal, setSuccessModal] = useState({ open: false, title: '', description: '' });

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
                    height: '100px',
                    backgroundColor: userProfile?.banner?.startsWith?.('#') ? userProfile.banner : '#5865F2',
                    backgroundImage: userProfile?.banner?.startsWith?.('#') ? 'none' : `url("${userProfile.banner}")`,
                    backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat'
                }}></div>

                <div style={{ padding: '0 16px 16px 16px', position: 'relative' }}>
                    {/* Avatar */}
                    <div style={{
                        width: '80px', height: '80px', borderRadius: '50%',
                        border: '6px solid var(--bg-secondary)',
                        backgroundImage: `url("${userProfile?.avatar || 'https://i.pravatar.cc/150?img=11'}")`,
                        backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat',
                        marginTop: '-40px', marginBottom: '8px'
                    }}></div>

                    <h3 style={{ color: 'var(--text-header)', fontSize: '20px', fontWeight: 700, marginBottom: '16px' }}>
                        {userProfile?.name || 'Satoshi'}
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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

                <button style={{
                    background: 'var(--accent-color)', color: 'white', border: 'none',
                    padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: 600, fontSize: '14px',
                    marginBottom: '24px'
                }} onClick={() => setPasswordModal(true)}>
                    Changer le mot de passe
                </button>

                <div style={{
                    display: 'flex', alignItems: 'center', gap: '16px',
                    padding: '16px', borderRadius: '8px', backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid rgba(255,255,255,0.06)'
                }}>
                    <Shield size={40} color="var(--text-muted)" />
                    <div style={{ flex: 1 }}>
                        <div style={{ color: 'var(--text-header)', fontWeight: 600, marginBottom: '4px' }}>
                            Authentification à deux facteurs
                        </div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
                            Protège ton compte avec une couche de sécurité supplémentaire.
                        </div>
                    </div>
                    <button style={{
                        background: 'var(--accent-color)', color: 'white', border: 'none',
                        padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 500, fontSize: '13px'
                    }} onClick={() => setTwoFaModal(true)}>Activer</button>
                </div>
            </div>

            <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.06)', margin: '32px 0' }}></div>

            {/* Danger Zone */}
            <div>
                <h3 style={{ color: '#da373c', fontSize: '12px', fontWeight: 800, marginBottom: '16px', textTransform: 'uppercase' }}>
                    Suppression du compte
                </h3>
                <div className="danger-zone">
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '16px' }}>
                        La suppression de ton compte est une action irréversible. Toutes tes données seront définitivement effacées.
                    </p>
                    <button className="danger-btn-outline" onClick={() => setDeleteModal(true)}>
                        Supprimer le compte
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
                description="Un e-mail de réinitialisation a été envoyé à ton adresse. Consulte ta boîte de réception pour définir un nouveau mot de passe."
                type="alert"
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
