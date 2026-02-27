import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import {
    X, Shield, Users, Hash, Settings, ShieldAlert,
    Crown, Star, Zap, Sword, Award, GripVertical, Plus, Trash2, Check,
    MessageSquare, Mic, MicOff, Headphones, Video, Link, AtSign,
    Eye, EyeOff, Pin, Bell, Volume2, UserPlus, UserMinus, UserX,
    Megaphone, History, Smile, Image, Globe, Lock, Webhook
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

const ServerSettingsModal = ({ isOpen, onClose, serverName, categories, onUpdateCategories, initialRoles, onUpdateRoles, members = [], memberRoles: initialMemberRoles = {}, onUpdateMemberRoles }) => {
    const [activeTab, setActiveTab] = useState('Vue d\'ensemble');
    const { showToast } = useToast();

    // -- State for Vue d'ensemble --
    const [currentServerName, setCurrentServerName] = useState(serverName || '');

    // -- State for Rôles --
    const [roles, setRoles] = useState(initialRoles || []);
    const [selectedRoleId, setSelectedRoleId] = useState(initialRoles?.[0]?.id || 'r1');
    const selectedRole = roles.find(r => r.id === selectedRoleId);

    // -- State for Member Role Assignments --
    const [localMemberRoles, setLocalMemberRoles] = useState(initialMemberRoles || {});

    // -- State for Channels (Drag & Drop) --
    // We flatten the channels for simplified reordering in this demo
    const [draggableChannels, setDraggableChannels] = useState([]);

    useEffect(() => {
        if (isOpen) {
            setCurrentServerName(serverName || '');
            if (initialRoles && initialRoles.length > 0) {
                setRoles(initialRoles);
                setSelectedRoleId(initialRoles[0].id);
            }
            setLocalMemberRoles(initialMemberRoles || {});
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
        if (currentServerName.trim() === '') {
            showToast('Le nom du serveur ne peut pas être vide', 'error');
            return;
        }
        // Save server name
        // The parent doesn't have an `onUpdateServerName` passed, but we can pass one or update AppContext.
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
                // Messages
                sendMessages: true,
                attachFiles: false,
                embedLinks: true,
                addReactions: true,
                useEmojis: true,
                mentionEveryone: false,
                manageMessages: false,
                readMessageHistory: true,
                sendTTSMessages: false,
                pinMessages: false,
                // Voice
                connectVoice: true,
                speakVoice: true,
                videoVoice: false,
                muteMembers: false,
                deafenMembers: false,
                moveMembers: false,
                useVAD: true,
                prioritySpeaker: false,
                // Members
                kickMembers: false,
                banMembers: false,
                timeoutMembers: false,
                createInvites: true,
                changeNickname: true,
                manageNicknames: false,
                // Channels
                viewChannels: true,
                manageChannels: false,
                manageWebhooks: false,
                // Advanced
                manageServer: false,
                manageRoles: false,
                manageEmojis: false,
                viewAuditLog: false,
                administrator: false
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
        if (onUpdateRoles) {
            onUpdateRoles(roles);
        }
        if (onUpdateMemberRoles) {
            onUpdateMemberRoles(localMemberRoles);
        }
        showToast('Rôles mis à jour', 'success');
    };

    const toggleMemberRole = (memberId, roleId) => {
        setLocalMemberRoles(prev => {
            const memberCurrentRoles = prev[memberId] || [];
            const hasRole = memberCurrentRoles.includes(roleId);
            return {
                ...prev,
                [memberId]: hasRole
                    ? memberCurrentRoles.filter(id => id !== roleId)
                    : [...memberCurrentRoles, roleId]
            };
        });
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
                            <h3 className="role-section-title"><MessageSquare size={16} /> PERMISSIONS DE MESSAGES</h3>
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
                            <div className="role-separator"></div>
                            <PermissionToggle
                                label="Intégrer des liens"
                                description="Autorise les liens à afficher un aperçu intégré dans le chat."
                                value={selectedRole.permissions.embedLinks}
                                onChange={(val) => handlePermissionChange('embedLinks', val)}
                            />
                            <div className="role-separator"></div>
                            <PermissionToggle
                                label="Ajouter des réactions"
                                description="Permet d'ajouter des réactions aux messages."
                                value={selectedRole.permissions.addReactions}
                                onChange={(val) => handlePermissionChange('addReactions', val)}
                            />
                            <div className="role-separator"></div>
                            <PermissionToggle
                                label="Utiliser des émojis externes"
                                description="Permet d'utiliser des émojis provenant d'autres serveurs."
                                value={selectedRole.permissions.useEmojis}
                                onChange={(val) => handlePermissionChange('useEmojis', val)}
                            />
                            <div className="role-separator"></div>
                            <PermissionToggle
                                label="Mentionner @everyone et @here"
                                description="Permet de mentionner tous les membres ou les membres en ligne."
                                value={selectedRole.permissions.mentionEveryone}
                                onChange={(val) => handlePermissionChange('mentionEveryone', val)}
                            />
                            <div className="role-separator"></div>
                            <PermissionToggle
                                label="Gérer les messages"
                                description="Permet de supprimer ou d'épingler les messages des autres membres."
                                value={selectedRole.permissions.manageMessages}
                                onChange={(val) => handlePermissionChange('manageMessages', val)}
                            />
                            <div className="role-separator"></div>
                            <PermissionToggle
                                label="Voir l'historique des messages"
                                description="Permet de lire les messages envoyés avant l'arrivée du membre."
                                value={selectedRole.permissions.readMessageHistory}
                                onChange={(val) => handlePermissionChange('readMessageHistory', val)}
                            />
                            <div className="role-separator"></div>
                            <PermissionToggle
                                label="Envoyer des messages TTS"
                                description="Autorise l'envoi de messages text-to-speech."
                                value={selectedRole.permissions.sendTTSMessages}
                                onChange={(val) => handlePermissionChange('sendTTSMessages', val)}
                            />
                            <div className="role-separator"></div>
                            <PermissionToggle
                                label="Épingler des messages"
                                description="Permet d'épingler des messages dans un salon."
                                value={selectedRole.permissions.pinMessages}
                                onChange={(val) => handlePermissionChange('pinMessages', val)}
                            />
                        </div>

                        {/* Permissions: Vocales */}
                        <div className="role-card">
                            <h3 className="role-section-title"><Headphones size={16} /> PERMISSIONS VOCALES</h3>
                            <PermissionToggle
                                label="Se connecter en vocal"
                                description="Permet de rejoindre un salon vocal."
                                value={selectedRole.permissions.connectVoice}
                                onChange={(val) => handlePermissionChange('connectVoice', val)}
                            />
                            <div className="role-separator"></div>
                            <PermissionToggle
                                label="Parler"
                                description="Permet de parler dans les salons vocaux."
                                value={selectedRole.permissions.speakVoice}
                                onChange={(val) => handlePermissionChange('speakVoice', val)}
                            />
                            <div className="role-separator"></div>
                            <PermissionToggle
                                label="Vidéo"
                                description="Permet de partager sa caméra dans les salons vocaux."
                                value={selectedRole.permissions.videoVoice}
                                onChange={(val) => handlePermissionChange('videoVoice', val)}
                            />
                            <div className="role-separator"></div>
                            <PermissionToggle
                                label="Rendre muet des membres"
                                description="Permet de couper le micro d'autres membres en vocal."
                                value={selectedRole.permissions.muteMembers}
                                onChange={(val) => handlePermissionChange('muteMembers', val)}
                            />
                            <div className="role-separator"></div>
                            <PermissionToggle
                                label="Mettre en sourdine des membres"
                                description="Permet de couper le son d'autres membres en vocal."
                                value={selectedRole.permissions.deafenMembers}
                                onChange={(val) => handlePermissionChange('deafenMembers', val)}
                            />
                            <div className="role-separator"></div>
                            <PermissionToggle
                                label="Déplacer des membres"
                                description="Permet de déplacer des membres d'un salon vocal à un autre."
                                value={selectedRole.permissions.moveMembers}
                                onChange={(val) => handlePermissionChange('moveMembers', val)}
                            />
                            <div className="role-separator"></div>
                            <PermissionToggle
                                label="Utiliser la détection vocale"
                                description="Permet d'utiliser la VAD au lieu du push-to-talk."
                                value={selectedRole.permissions.useVAD}
                                onChange={(val) => handlePermissionChange('useVAD', val)}
                            />
                            <div className="role-separator"></div>
                            <PermissionToggle
                                label="Voix prioritaire"
                                description="Permet d'être entendu plus facilement en vocal."
                                value={selectedRole.permissions.prioritySpeaker}
                                onChange={(val) => handlePermissionChange('prioritySpeaker', val)}
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
                            <div className="role-separator"></div>
                            <PermissionToggle
                                label="Exclure temporairement des membres"
                                description="Empêche un membre de parler ou réagir pour une durée définie."
                                value={selectedRole.permissions.timeoutMembers}
                                onChange={(val) => handlePermissionChange('timeoutMembers', val)}
                            />
                            <div className="role-separator"></div>
                            <PermissionToggle
                                label="Créer des invitations"
                                description="Permet de créer un lien d'invitation pour le serveur."
                                value={selectedRole.permissions.createInvites}
                                onChange={(val) => handlePermissionChange('createInvites', val)}
                            />
                            <div className="role-separator"></div>
                            <PermissionToggle
                                label="Changer son pseudo"
                                description="Permet aux membres de changer leur propre pseudo."
                                value={selectedRole.permissions.changeNickname}
                                onChange={(val) => handlePermissionChange('changeNickname', val)}
                            />
                            <div className="role-separator"></div>
                            <PermissionToggle
                                label="Gérer les pseudos"
                                description="Permet de modifier le pseudo des autres membres."
                                value={selectedRole.permissions.manageNicknames}
                                onChange={(val) => handlePermissionChange('manageNicknames', val)}
                            />
                        </div>

                        {/* Permissions: Salons */}
                        <div className="role-card">
                            <h3 className="role-section-title"><Hash size={16} /> PERMISSIONS DES SALONS</h3>
                            <PermissionToggle
                                label="Voir les salons"
                                description="Permet de voir les salons textuels et vocaux du serveur."
                                value={selectedRole.permissions.viewChannels}
                                onChange={(val) => handlePermissionChange('viewChannels', val)}
                            />
                            <div className="role-separator"></div>
                            <PermissionToggle
                                label="Gérer les salons"
                                description="Permet de créer, modifier et supprimer des salons."
                                value={selectedRole.permissions.manageChannels}
                                onChange={(val) => handlePermissionChange('manageChannels', val)}
                            />
                            <div className="role-separator"></div>
                            <PermissionToggle
                                label="Gérer les webhooks"
                                description="Permet de créer, modifier et supprimer les webhooks du serveur."
                                value={selectedRole.permissions.manageWebhooks}
                                onChange={(val) => handlePermissionChange('manageWebhooks', val)}
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
                            <div className="role-separator"></div>
                            <PermissionToggle
                                label="Gérer les émojis et stickers"
                                description="Permet d'ajouter ou supprimer des émojis personnalisés."
                                value={selectedRole.permissions.manageEmojis}
                                onChange={(val) => handlePermissionChange('manageEmojis', val)}
                                isDanger
                            />
                            <div className="role-separator"></div>
                            <PermissionToggle
                                label="Voir le journal d'audit"
                                description="Permet de voir les actions des autres administrateurs."
                                value={selectedRole.permissions.viewAuditLog}
                                onChange={(val) => handlePermissionChange('viewAuditLog', val)}
                                isDanger
                            />
                            <div className="role-separator"></div>
                            <PermissionToggle
                                label="Administrateur"
                                description="Donne toutes les permissions et ignore les restrictions de salon. C'est une permission dangereuse !"
                                value={selectedRole.permissions.administrator}
                                onChange={(val) => handlePermissionChange('administrator', val)}
                                isDanger
                            />
                        </div>

                        <div style={{ marginTop: '16px', marginBottom: '16px' }}>
                            <button className="action-button success" onClick={handleSaveRoles}>
                                Enregistrer les modifications
                            </button>
                        </div>

                        {/* Section: Assign Members */}
                        <div className="role-card" style={{ marginTop: '8px' }}>
                            <h3 className="role-section-title"><Users size={16} /> MEMBRES AVEC CE RÔLE</h3>
                            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '12px' }}>
                                Activez ou désactivez les membres pour leur attribuer ce rôle.
                            </p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {members.map(member => {
                                    const memberCurrentRoles = localMemberRoles[member.id] || [];
                                    const hasRole = memberCurrentRoles.includes(selectedRoleId);
                                    return (
                                        <div
                                            key={member.id}
                                            style={{
                                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                                padding: '8px 12px', borderRadius: '6px',
                                                background: hasRole ? 'rgba(35, 165, 89, 0.08)' : 'transparent',
                                                border: '1px solid ' + (hasRole ? 'rgba(35, 165, 89, 0.2)' : 'rgba(255,255,255,0.04)'),
                                                transition: 'all 0.2s'
                                            }}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <div style={{
                                                    width: '32px', height: '32px', borderRadius: '50%',
                                                    backgroundImage: `url(${member.avatar})`, backgroundSize: 'cover',
                                                    backgroundColor: '#555'
                                                }} />
                                                <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-header)' }}>
                                                    {member.name}
                                                </span>
                                            </div>
                                            <div
                                                onClick={() => toggleMemberRole(member.id, selectedRoleId)}
                                                style={{
                                                    width: '40px', height: '24px', borderRadius: '12px',
                                                    background: hasRole ? '#23a559' : '#80848e',
                                                    position: 'relative', cursor: 'pointer', transition: 'background 0.2s'
                                                }}
                                            >
                                                <div style={{
                                                    position: 'absolute', top: '2px', left: hasRole ? '18px' : '2px',
                                                    width: '20px', height: '20px', borderRadius: '50%',
                                                    background: 'white', transition: 'left 0.2s',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                                }}>
                                                    {hasRole ? <Check size={12} color="#23a559" /> : <X size={12} color="#80848e" />}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
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
