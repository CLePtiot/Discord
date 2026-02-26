import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Trash2, ShieldAlert, Eye, EyeOff, Download, Upload } from 'lucide-react';
import InlineModal from '../InlineModal';
import { useToast } from '../Toast';

const Toggle = ({ value, onChange }) => (
    <div className={`toggle-switch ${value ? 'on' : 'off'}`} onClick={() => onChange(!value)}>
        <div className="toggle-switch-knob"></div>
    </div>
);

const PrivacyTab = ({ onLogout, preferences, setPreferences }) => {
    const [dmFromMembers, setDmFromMembers] = useState(true);
    const [friendRequests, setFriendRequests] = useState(true);
    const [activityStatus, setActivityStatus] = useState(true);
    const [dataCollection, setDataCollection] = useState(false);
    const [showConfirmClear, setShowConfirmClear] = useState(false);
    const [showClearModal, setShowClearModal] = useState(false);

    const { showToast } = useToast();
    const fileInputRef = useRef(null);

    const settings = [
        {
            label: 'Messages privés de membres du serveur',
            desc: 'Autorise les membres des serveurs à t\'envoyer des messages privés.',
            value: dmFromMembers, onChange: setDmFromMembers
        },
        {
            label: 'Demandes d\'amis de tous',
            desc: 'Autorise n\'importe qui à t\'envoyer une demande d\'ami.',
            value: friendRequests, onChange: setFriendRequests
        },
        {
            label: 'Afficher le statut d\'activité',
            desc: 'Permet aux autres de voir à quel jeu ou activité tu joues.',
            value: activityStatus, onChange: setActivityStatus
        },
        {
            label: 'Collecte de données d\'utilisation',
            desc: 'Partage des données anonymes pour améliorer Project Freedom.',
            value: dataCollection, onChange: setDataCollection
        },
        {
            label: 'Mode Furtif (Stealth Mode)',
            desc: 'Rend flous les noms et avatars des autres utilisateurs jusqu\'au survol. Idéal pour streamer ou dans les lieux publics.',
            value: preferences?.stealthMode || false,
            onChange: (val) => setPreferences({ ...preferences, stealthMode: val })
        }
    ];

    const handleClearData = () => {
        if (!showConfirmClear) {
            setShowConfirmClear(true);
            return;
        }
        if (onLogout) {
            onLogout();
        } else {
            // Fallback clear all localStorage items related to freedom
            const keys = Object.keys(localStorage);
            keys.forEach(key => {
                if (key.startsWith('freedom-')) {
                    localStorage.removeItem(key);
                }
            });
            setShowClearModal(true);
        }
    };

    const handleExportData = () => {
        try {
            const profileData = localStorage.getItem('freedom-profile');
            if (!profileData) {
                showToast("Aucun profil à exporter", "error");
                return;
            }
            // Encode in base64
            const encodedData = btoa(encodeURIComponent(profileData));

            // Create a blob and trigger download
            const blob = new Blob([encodedData], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `freedom-key.txt`;
            a.click();
            URL.revokeObjectURL(url);
            showToast("Clé de session exportée !", "success");
        } catch (e) {
            showToast("Erreur lors de l'exportation", "error");
        }
    };

    const handleImportData = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const encodedData = event.target.result;
                const decodedData = decodeURIComponent(atob(encodedData));

                // Simple validation to check if it's JSON
                JSON.parse(decodedData);

                localStorage.setItem('freedom-profile', decodedData);
                showToast("Clé importée, rechargement...", "success");
                setTimeout(() => window.location.reload(), 1500);
            } catch (error) {
                console.error("Import error", error);
                showToast("Fichier de clé invalide", "error");
            }
        };
        reader.readAsText(file);

        // Reset input
        e.target.value = null;
    };

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h2 style={{ color: 'var(--text-header)', marginBottom: '24px' }}>Confidentialité & Sécurité</h2>

            {/* Privacy settings */}
            <div style={{ marginBottom: '32px' }}>
                <h3 style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: 800, marginBottom: '16px', textTransform: 'uppercase' }}>
                    Paramètres de confidentialité
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {settings.map((s, i) => (
                        <div key={i} style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            padding: '12px 0', borderBottom: i < settings.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none'
                        }}>
                            <div style={{ flex: 1, paddingRight: '16px' }}>
                                <div style={{ color: 'var(--text-normal)', fontWeight: 500, marginBottom: '4px' }}>{s.label}</div>
                                <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{s.desc}</div>
                            </div>
                            <Toggle value={s.value} onChange={s.onChange} />
                        </div>
                    ))}
                </div>
            </div>

            <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.06)', margin: '24px 0' }}></div>

            {/* Project Freedom - Data Control */}
            <div style={{ marginBottom: '32px' }}>
                <h3 style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: 800, marginBottom: '8px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ShieldAlert size={14} />
                    Contrôle de tes données — Project Freedom
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '16px', lineHeight: 1.6 }}>
                    Chez Project Freedom, ta vie privée est notre priorité. Tes données sont stockées <strong style={{ color: 'var(--text-normal)' }}>localement sur ton appareil</strong> et ne sont jamais envoyées à des serveurs tiers.
                    Tu peux à tout moment effacer l'ensemble de tes données.
                </p>

                <div className="danger-zone" style={{ marginBottom: '16px', borderColor: 'rgba(255,255,255,0.1)', background: 'var(--bg-secondary)' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                        <div style={{ flex: 1 }}>
                            <div style={{ color: 'var(--text-header)', fontWeight: 600, marginBottom: '4px' }}>
                                Portabilité des données
                            </div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '16px' }}>
                                Exporte ton profil (avatar, pseudo) sous forme de clé chiffrée (.txt) pour le restaurer plus tard ou sur un autre appareil.
                            </div>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button className="voice-control-btn" style={{ background: 'var(--bg-app)' }} onClick={handleExportData}>
                                    <Download size={16} /> Exporter ma clé de session
                                </button>
                                <button className="voice-control-btn" style={{ background: 'var(--bg-app)' }} onClick={() => fileInputRef.current?.click()}>
                                    <Upload size={16} /> Importer une clé
                                </button>
                                <input type="file" accept=".txt" ref={fileInputRef} style={{ display: 'none' }} onChange={handleImportData} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="danger-zone">
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                        <Trash2 size={24} color="#da373c" style={{ flexShrink: 0, marginTop: '2px' }} />
                        <div style={{ flex: 1 }}>
                            <div style={{ color: 'var(--text-header)', fontWeight: 600, marginBottom: '4px' }}>
                                Effacer toutes mes données locales
                            </div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '16px' }}>
                                Cette action supprimera tous tes messages, profil, serveurs personnalisés et préférences stockés dans ce navigateur. Cette action est irréversible.
                            </div>
                            <button
                                className={showConfirmClear ? 'danger-btn' : 'danger-btn-outline'}
                                onClick={handleClearData}
                            >
                                {showConfirmClear ? '⚠ Confirmer la suppression' : 'Effacer toutes mes données'}
                            </button>
                            {showConfirmClear && (
                                <button
                                    style={{
                                        background: 'transparent', color: 'var(--text-muted)', border: 'none',
                                        padding: '10px 16px', cursor: 'pointer', fontWeight: 500, fontSize: '13px', marginLeft: '8px'
                                    }}
                                    onClick={() => setShowConfirmClear(false)}
                                >
                                    Annuler
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Clear Data Success Modal */}
            <InlineModal
                isOpen={showClearModal}
                onClose={() => window.location.reload()}
                title="Données effacées"
                description="Toutes tes données locales ont été supprimées avec succès. La page va se recharger."
                type="alert"
            />
        </motion.div>
    );
};

export default PrivacyTab;
