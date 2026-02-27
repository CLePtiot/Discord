import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import {
    X, Shield, Users, Hash, Settings, ShieldAlert,
    Crown, Star, Zap, Sword, Award, GripVertical, Plus, Trash2, Check
} from 'lucide-react';
import { useToast } from './Toast';

const roleBadges = [
    { id: 'shield', icon: Shield, label: 'Bouclier' },
    { id: 'crown', icon: Crown, label: 'Couronne' },
    { id: 'star', icon: Star, label: 'Étoile' },
    { id: 'zap', icon: Zap, label: 'Éclair' },
    { id: 'sword', icon: Sword, label: 'Épée' },
    { id: 'award', icon: Award, label: 'Trophée' }
];

const ServerSettingsModal = ({ isOpen, onClose, serverName, categories, onUpdateCategories }) => {
    const [activeTab, setActiveTab] = useState('Vue d\'ensemble');
    const { showToast } = useToast();

    // -- State for Vue d'ensemble --
    const [currentServerName, setCurrentServerName] = useState(serverName || '');

    // -- State for Rôles --
    const [roles, setRoles] = useState([
        {
            id: 'r1',
            name: 'Administrateur',
            color: '#da373c',
            badge: 'crown',
            permissions: {
                sendMessages: true,
                attachFiles: true,
                kickMembers: true,
                banMembers: true,
                manageServer: true,
                manageRoles: true
            }
        },
        {
            id: 'r2',
            name: 'Membre',
            color: '#949ba4',
            badge: null,
            permissions: {
                sendMessages: true,
                attachFiles: true,
                kickMembers: false,
                banMembers: false,
                manageServer: false,
                manageRoles: false
            }
        }
    ]);
    const [selectedRoleId, setSelectedRoleId] = useState('r1');
    const selectedRole = roles.find(r => r.id === selectedRoleId);

    // -- State for Channels (Drag & Drop) --
    // We flatten the channels for simplified reordering in this demo
    const [draggableChannels, setDraggableChannels] = useState([]);

    useEffect(() => {
        if (isOpen) {
            setCurrentServerName(serverName || '');
            // Flatten categories down to just channels for easy reordering across the board
            const allChannels = [];
            categories?.forEach(cat => {
                cat.channels.forEach(ch => {
                    allChannels.push({ ...ch, categoryName: cat.category });
                });
            });
            setDraggableChannels(allChannels);
        }
    }, [isOpen, serverName, categories]);

    if (!isOpen) return null;

    // -- Handlers --
    const handleSaveOverview = () => {
        showToast('Paramètres du serveur mis à jour', 'success');
    };

    const handleRoleChange = (field, value) => {
        setRoles(prev => prev.map(r => r.id === selectedRoleId ? { ...r, [field]: value } : r));
    };

    const handlePermissionChange = (permId, value) => {
        setRoles(prev => prev.map(r => {
            if (r.id === selectedRoleId) {
                return { ...r, permissions: { ...r.permissions, [permId]: value } };
            }
            return r;
        }));
    };

    const handleAddRole = () => {
        const newRole = {
            id: `r${Date.now()}`,
            name: 'Nouveau Rôle',
            color: '#949ba4',
            badge: null,
            permissions: {
                sendMessages: true,
                attachFiles: false,
                kickMembers: false,
                banMembers: false,
                manageServer: false,
                manageRoles: false
            }
        };
        setRoles([...roles, newRole]);
        setSelectedRoleId(newRole.id);
    };

    const handleDeleteRole = () => {
        if (roles.length <= 1) {
            showToast("Vous ne pouvez pas supprimer le dernier rôle.", "error");
            return;
        }
        const updated = roles.filter(r => r.id !== selectedRoleId);
        setRoles(updated);
        setSelectedRoleId(updated[0].id);
        showToast("Rôle supprimé", "info");
    };

    const handleChannelsReorder = (newOrder) => {
        setDraggableChannels(newOrder);
    };

    const handleSaveChannels = () => {
        // Re-group by category based on current setup (simplified: put them back in their original categories)
        // In a full implementation, you'd allow creating/moving between categories.
        const catsMap = {};
        draggableChannels.forEach(ch => {
            if (!catsMap[ch.categoryName]) {
                catsMap[ch.categoryName] = { category: ch.categoryName, channels: [] };
            }
            catsMap[ch.categoryName].channels.push({ id: ch.id, name: ch.name, type: ch.type });
        });
        const updatedCategories = Object.values(catsMap);

        if (onUpdateCategories) {
            onUpdateCategories(updatedCategories);
        }
        showToast('Ordre des salons sauvegardé', 'success');
    };

    const handleSaveRoles = () => {
        showToast('Rôles mis à jour', 'success');
    };

    // --- Components ---
    const renderSidebar = () => (
        <div className="settings-sidebar">
            <h3 className="settings-sidebar-header">{currentServerName}</h3>

            <div
                className={`settings-tab ${activeTab === 'Vue d\'ensemble' ? 'active' : ''}`}
                onClick={() => setActiveTab('Vue d\'ensemble')}
            >
                Vue d'ensemble
            </div>
            <div
                className={`settings-tab ${activeTab === 'Rôles' ? 'active' : ''}`}
                onClick={() => setActiveTab('Rôles')}
            >
                Rôles
            </div>

            <div className="settings-divider"></div>
            <h4 className="settings-section-title">GESTION</h4>

            <div
                className={`settings-tab ${activeTab === 'Salons' ? 'active' : ''}`}
                onClick={() => setActiveTab('Salons')}
            >
                Salons
            </div>

            <div className="settings-divider"></div>
            <div
                className="settings-tab"
                style={{ color: '#da373c' }}
                onClick={() => {
                    if (window.confirm("Êtes-vous sûr de vouloir quitter ce serveur ?")) {
                        showToast("Vous avez quitté le serveur", "info");
                        onClose();
                    }
                }}
            >
                Quitter le serveur
            </div>

            <div className="settings-divider" style={{ marginTop: 'auto' }}></div>
            <button className="settings-logout" onClick={onClose}>
                Fermer
            </button>
        </div>
    );

    const renderOverview = () => (
        <motion.div
            key="overview"
            className="settings-content-inner"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
        >
            <h2 className="settings-title">Vue d'ensemble du Serveur</h2>

            <div className="settings-field">
                <label>NOM DU SERVEUR</label>
                <input
                    type="text"
                    value={currentServerName}
                    onChange={(e) => setCurrentServerName(e.target.value)}
                    className="settings-input"
                />
            </div>

            <div className="settings-field">
                <label>ICÔNE DU SERVEUR</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '8px' }}>
                    <div style={{
                        width: '100px', height: '100px', borderRadius: '50%',
                        backgroundColor: 'var(--bg-chat)', display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                        fontSize: '32px', fontWeight: 'bold'
                    }}>
                        {currentServerName.charAt(0).toUpperCase()}
                    </div>
                    <button className="action-button primary">Changer l'icône</button>
                </div>
            </div>

            <div style={{ marginTop: '32px' }}>
                <button className="action-button success" onClick={handleSaveOverview}>
                    Enregistrer les modifications
                </button>
            </div>
        </motion.div>
    );

    const renderRoles = () => (
        <motion.div
            key="roles"
            className="settings-content-inner" style={{ display: 'flex', gap: '24px', height: '100%' }}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
        >
            {/* Colonne Liste des Rôles */}
            <div style={{ width: '220px', display: 'flex', flexDirection: 'column', borderRight: '1px solid rgba(255,255,255,0.06)', paddingRight: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3 style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 800 }}>Rôles ({roles.length})</h3>
                    <button onClick={handleAddRole} style={{ background: 'none', border: 'none', color: 'var(--text-normal)', cursor: 'pointer' }} title="Créer un rôle">
                        <Plus size={16} />
                    </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', overflowY: 'auto' }}>
                    {roles.map(role => (
                        <div
                            key={role.id}
                            onClick={() => setSelectedRoleId(role.id)}
                            style={{
                                padding: '8px 12px',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                background: selectedRoleId === role.id ? 'var(--bg-active)' : 'transparent',
                                color: selectedRoleId === role.id ? 'white' : 'var(--text-normal)',
                                transition: 'background 0.2s'
                            }}
                        >
                            <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: role.color }}></div>
                            <span style={{ fontSize: '14px', fontWeight: 500, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{role.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Colonne Édition du Rôle */}
            <div style={{ flex: 1, overflowY: 'auto', paddingRight: '8px' }}>
                {selectedRole ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h2 style={{ fontSize: '20px', fontWeight: 700, margin: 0 }}>Modifier le rôle - {selectedRole.name}</h2>
                            <button onClick={handleDeleteRole} style={{ background: 'none', border: 'none', color: '#da373c', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: 500 }}>
                                <Trash2 size={16} /> Supprimer
                            </button>
                        </div>

                        {/* Identité */}
                        <div className="role-card">
                            <h3 className="role-section-title">IDENTITÉ</h3>
                            <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                                <div className="settings-field" style={{ flex: 1 }}>
                                    <label>NOM DU RÔLE</label>
                                    <input type="text" value={selectedRole.name} onChange={e => handleRoleChange('name', e.target.value)} className="settings-input" />
                                </div>
                                <div className="settings-field" style={{ width: '120px' }}>
                                    <label>COULEUR</label>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-input)', padding: '8px', borderRadius: '4px' }}>
                                        <input type="color" value={selectedRole.color} onChange={e => handleRoleChange('color', e.target.value)} style={{ width: '24px', height: '24px', padding: 0, border: 'none', cursor: 'pointer', background: 'transparent' }} />
                                        <span style={{ fontSize: '14px', fontFamily: 'monospace' }}>{selectedRole.color}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="settings-field">
                                <label>BADGE DE RÔLE (Icône Freedom)</label>
                                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>Cette icône s'affichera à côté du nom des membres dans le chat.</p>
                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                    <button
                                        onClick={() => handleRoleChange('badge', null)}
                                        style={{ width: '40px', height: '40px', borderRadius: '8px', background: selectedRole.badge === null ? 'var(--accent-color)' : 'var(--bg-input)', border: 'none', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
                                        title="Aucun"
                                    >
                                        <X size={20} />
                                    </button>
                                    {roleBadges.map(badge => {
                                        const Icon = badge.icon;
                                        return (
                                            <button
                                                key={badge.id}
                                                onClick={() => handleRoleChange('badge', badge.id)}
                                                style={{ width: '40px', height: '40px', borderRadius: '8px', background: selectedRole.badge === badge.id ? 'var(--accent-color)' : 'var(--bg-input)', border: 'none', color: selectedRole.badge === badge.id ? 'white' : selectedRole.color, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
                                                title={badge.label}
                                            >
                                                <Icon size={20} />
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Permissions: Messages */}
                        <div className="role-card">
                            <h3 className="role-section-title"><Hash size={16} /> PERMISSIONS DE MESSAGES</h3>
                            <PermissionToggle
                                label="Envoyer des messages"
                                description="Autorise les membres à envoyer des messages dans les salons textuels."
                                value={selectedRole.permissions.sendMessages}
                                onChange={(val) => handlePermissionChange('sendMessages', val)}
                            />
                            <div className="role-separator"></div>
                            <PermissionToggle
                                label="Joindre des fichiers"
                                description="Autorise l'envoi d'images et de fichiers locaux."
                                value={selectedRole.permissions.attachFiles}
                                onChange={(val) => handlePermissionChange('attachFiles', val)}
                            />
                        </div>

                        {/* Permissions: Membres */}
                        <div className="role-card">
                            <h3 className="role-section-title"><Users size={16} /> PERMISSIONS DES MEMBRES</h3>
                            <PermissionToggle
                                label="Expulser des membres"
                                description="Permet de retirer un membre du serveur."
                                value={selectedRole.permissions.kickMembers}
                                onChange={(val) => handlePermissionChange('kickMembers', val)}
                            />
                            <div className="role-separator"></div>
                            <PermissionToggle
                                label="Bannir des membres"
                                description="Permet de bannir définitivement un membre."
                                value={selectedRole.permissions.banMembers}
                                onChange={(val) => handlePermissionChange('banMembers', val)}
                            />
                        </div>

                        {/* Permissions: Admin */}
                        <div className="role-card" style={{ borderColor: 'rgba(218,55,60,0.3)' }}>
                            <h3 className="role-section-title" style={{ color: '#da373c' }}><ShieldAlert size={16} /> PERMISSIONS AVANCÉES</h3>
                            <PermissionToggle
                                label="Gérer le serveur"
                                description="Accès total aux paramètres du serveur."
                                value={selectedRole.permissions.manageServer}
                                onChange={(val) => handlePermissionChange('manageServer', val)}
                                isDanger
                            />
                            <div className="role-separator"></div>
                            <PermissionToggle
                                label="Gérer les rôles"
                                description="Créer, modifier ou supprimer des rôles inférieurs."
                                value={selectedRole.permissions.manageRoles}
                                onChange={(val) => handlePermissionChange('manageRoles', val)}
                                isDanger
                            />
                        </div>

                        <div style={{ marginTop: '16px', marginBottom: '16px' }}>
                            <button className="action-button success" onClick={handleSaveRoles}>
                                Enregistrer les modifications
                            </button>
                        </div>
                    </div>
                ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
                        Sélectionnez un rôle pour le modifier.
                    </div>
                )}
            </div>
        </motion.div>
    );

    const renderChannels = () => (
        <motion.div
            key="channels"
            className="settings-content-inner"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
        >
            <h2 className="settings-title">Organisation des Salons</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '24px' }}>
                Glissez-déposez les salons pour changer leur ordre d'affichage.
            </p>

            <Reorder.Group
                axis="y"
                values={draggableChannels}
                onReorder={handleChannelsReorder}
                style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}
            >
                {draggableChannels.map(channel => (
                    <Reorder.Item
                        key={channel.id}
                        value={channel}
                        style={{
                            background: 'var(--bg-chat)',
                            border: '1px solid rgba(255,255,255,0.06)',
                            padding: '12px 16px',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            cursor: 'grab',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }}
                        whileDrag={{ scale: 1.02, boxShadow: '0 8px 24px rgba(0,0,0,0.3)', zIndex: 10, cursor: 'grabbing' }}
                    >
                        <GripVertical size={20} color="var(--text-muted)" style={{ cursor: 'grab' }} />
                        {channel.type === 'text' ? <Hash size={20} color="var(--text-muted)" /> : <Volume2 size={20} color="var(--text-muted)" />}
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-header)' }}>{channel.name}</div>
                            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Catégorie: {channel.categoryName}</div>
                        </div>
                    </Reorder.Item>
                ))}
            </Reorder.Group>

            <div style={{ marginTop: '32px' }}>
                <button className="action-button success" onClick={handleSaveChannels}>
                    Enregistrer l'ordre
                </button>
            </div>
        </motion.div>
    );

    return (
        <AnimatePresence>
            <motion.div
                className="full-screen-modal-overlay glass-panel-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                {/* Structure identique au SettingsModal existant (FullScreen) */}
                <style>{`
                    .glass-panel-overlay {
                        position: fixed; top: 0; left: 0; right: 0; bottom: 0;
                        background: rgba(0, 0, 0, 0.4);
                        backdrop-filter: blur(40px) saturate(150%);
                        z-index: 10000;
                        display: flex;
                    }
                    .settings-layout {
                        display: flex; width: 100%; height: 100%; maxWidth: 1200px; margin: 0 auto;
                    }
                    .settings-sidebar-wrapper {
                        width: 280px; background: rgba(30, 31, 34, 0.3);
                        display: flex; justify-content: flex-end; padding: 60px 20px 60px 0;
                    }
                    .settings-sidebar {
                        width: 218px; display: flex; flexDirection: column; gap: 2px;
                    }
                    .settings-sidebar-header {
                        color: var(--text-muted); font-size: 11px; font-weight: 800;
                        text-transform: uppercase; padding: 6px 10px; margin-bottom: 8px;
                    }
                    .settings-tab {
                        padding: 8px 10px; border-radius: 4px; color: var(--text-normal);
                        font-size: 15px; font-weight: 500; cursor: pointer; transition: all 0.2s;
                    }
                    .settings-tab:hover { background: var(--bg-hover); color: var(--text-header); }
                    .settings-tab.active { background: var(--bg-active); color: var(--text-header); }
                    .settings-section-title {
                        color: var(--text-muted); font-size: 11px; font-weight: 800; uppercase;
                        padding: 16px 10px 6px 10px; margin: 0;
                    }
                    .settings-divider { height: 1px; background: rgba(255,255,255,0.06); margin: 8px 10px; }
                    .settings-logout {
                        padding: 8px 10px; border-radius: 4px; color: var(--text-normal);
                        background: none; border: none; text-align: left; font-size: 15px; font-weight: 500;
                        cursor: pointer; transition: 0.2s; display: flex; align-items: center; justify-content: space-between;
                    }
                    .settings-logout:hover { background: rgba(255,255,255,0.05); }
                    .settings-content-wrapper {
                        flex: 1; padding: 60px 40px; overflow-y: auto; background: transparent; position: relative;
                    }
                    .settings-content-inner { max-width: 740px; position: relative; }
                    .settings-close-btn-abs {
                        position: absolute; top: 60px; right: 40px; width: 36px; height: 36px;
                        border-radius: 50%; border: 2px solid var(--text-muted); display: flex;
                        align-items: center; justify-content: center; cursor: pointer; color: var(--text-muted);
                        background: none; transition: all 0.2s; z-index: 50;
                    }
                    .settings-close-btn-abs:hover { border-color: var(--text-normal); color: var(--text-normal); background: rgba(255,255,255,0.1); }
                    .settings-title { font-size: 20px; font-weight: 700; color: var(--text-header); margin-bottom: 24px; }
                    .settings-field { margin-bottom: 24px; }
                    .settings-field label { display: block; font-size: 12px; font-weight: 700; color: var(--text-muted); margin-bottom: 8px; text-transform: uppercase; }
                    .settings-input { width: 100%; background: var(--bg-input); border: none; border-radius: 4px; padding: 10px; color: var(--text-normal); font-size: 15px; outline: none; }
                    .settings-input:focus { box-shadow: 0 0 0 2px var(--accent-color); }
                    
                    /* Boutons spécifiques */
                    .action-button { padding: 8px 16px; border-radius: 4px; font-size: 14px; font-weight: 500; cursor: pointer; border: none; transition: 0.2s; color: white; }
                    .action-button.primary { background: var(--accent-color); }
                    .action-button.primary:hover { background: var(--accent-hover); }
                    .action-button.success { background: #23a559; }
                    .action-button.success:hover { background: #1f9450; }

                    /* Rôles Cards */
                    .role-card { background: rgba(43,45,49,0.5); border-radius: 8px; padding: 16px; border: 1px solid rgba(255,255,255,0.06); }
                    .role-section-title { font-size: 12px; font-weight: 800; color: var(--text-muted); text-transform: uppercase; display: flex; alignItems: center; gap: 8px; margin-bottom: 16px; }
                    .role-separator { height: 1px; background: rgba(255,255,255,0.06); margin: 16px 0; }
                `}</style>
                <div className="settings-layout">
                    <div className="settings-sidebar-wrapper">
                        {renderSidebar()}
                    </div>
                    <div className="settings-content-wrapper">
                        <AnimatePresence mode="wait">
                            {activeTab === 'Vue d\'ensemble' && renderOverview()}
                            {activeTab === 'Rôles' && renderRoles()}
                            {activeTab === 'Salons' && renderChannels()}
                        </AnimatePresence>
                        <button className="settings-close-btn-abs" onClick={onClose}><X size={18} /></button>
                        <div style={{ position: 'absolute', top: '100px', right: '40px', fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600 }}>ECHAP</div>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

// Toggle component for boolean permissions
const PermissionToggle = ({ label, description, value, onChange, isDanger }) => {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ maxWidth: '400px' }}>
                <div style={{ fontSize: '15px', fontWeight: 500, color: 'var(--text-header)', marginBottom: '4px' }}>{label}</div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.4 }}>{description}</div>
            </div>
            <div
                onClick={() => onChange(!value)}
                style={{
                    width: '40px', height: '24px', borderRadius: '12px',
                    background: value ? (isDanger ? '#da373c' : '#23a559') : '#80848e',
                    position: 'relative', cursor: 'pointer', transition: 'background 0.2s'
                }}
            >
                <div style={{
                    position: 'absolute', top: '2px', left: value ? '18px' : '2px',
                    width: '20px', height: '20px', borderRadius: '50%',
                    background: 'white', transition: 'left 0.2s',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    {value ? <Check size={12} color={isDanger ? '#da373c' : '#23a559'} /> : <X size={12} color="#80848e" />}
                </div>
            </div>
        </div>
    );
};

export default ServerSettingsModal;
