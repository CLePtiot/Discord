import React, { createContext, useState, useContext, useEffect } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { SERVERS, CHANNELS_BY_SERVER, MOCK_MEMBERS } from '../mockData';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [activeServerId, setActiveServerId] = useState('s1');
    const [activeChannelId, setActiveChannelId] = useState('c3');
    const [isServerModalOpen, setIsServerModalOpen] = useState(false);
    const [isServerSettingsOpen, setIsServerSettingsOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isExploreModalOpen, setIsExploreModalOpen] = useState(false);
    const [isCommandCenterOpen, setIsCommandCenterOpen] = useState(false);
    const [isMemberListOpen, setIsMemberListOpen] = useState(true);
    const [currentView, setCurrentView] = useState('chat'); // 'chat' or 'friends'
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const [servers, setServers] = useLocalStorage('freedom-servers', SERVERS);
    const [channelsByServer, setChannelsByServer] = useLocalStorage('freedom-channels', CHANNELS_BY_SERVER);
    const [members, setMembers] = useLocalStorage('freedom-members', MOCK_MEMBERS);
    const [mutedServers, setMutedServers] = useLocalStorage('freedom-muted-servers', {});
    const [rolesByServer, setRolesByServer] = useLocalStorage('freedom-roles', {});
    const [memberRolesByServer, setMemberRolesByServer] = useLocalStorage('freedom-member-roles', {});
    const [userVolumes, setUserVolumes] = useLocalStorage('freedom-user-volumes', {}); // { [userName]: volume }
    const [localMutedUsers, setLocalMutedUsers] = useLocalStorage('freedom-local-mutes', []); // [userName]

    const [userProfile, setUserProfile] = useLocalStorage('freedom-profile', null);

    // Robust normalization and fixing corrupt profile data
    useEffect(() => {
        if (!userProfile) return;

        let updated = false;
        const cleanProfile = { ...userProfile };

        // 1. Map legacy or localized statuses to standardized keys
        const statusMap = {
            'En ligne': 'online', 'online': 'online',
            'Occupé': 'dnd', 'dnd': 'dnd', 'busy': 'dnd',
            'Inactif': 'idle', 'idle': 'idle',
            'Hors ligne': 'offline', 'offline': 'offline', 'invisible': 'invisible'
        };

        const currentStatus = cleanProfile.status;
        const standardizedStatus = statusMap[currentStatus] || 'online';

        if (currentStatus !== standardizedStatus) {
            cleanProfile.status = standardizedStatus;
            updated = true;
        }

        // 2. Fix stale blob URLs (black screen prevention)
        if (cleanProfile.avatar && typeof cleanProfile.avatar === 'string' && cleanProfile.avatar.startsWith('blob:')) {
            cleanProfile.avatar = 'https://i.pravatar.cc/150?img=11';
            updated = true;
        }
        if (cleanProfile.banner && typeof cleanProfile.banner === 'string' && cleanProfile.banner.startsWith('blob:')) {
            cleanProfile.banner = '#5865F2';
            updated = true;
        }

        if (updated) {
            setUserProfile(cleanProfile);
        }
    }, [userProfile, setUserProfile]);

    const [preferences, setPreferences] = useLocalStorage('freedom-preferences', {
        theme: 'dark',
        accentColor: '#5865F2',
        blurIntensity: 40,
        fontSize: 16,
        stealthMode: false,
        appSounds: true
    });

    const handleBanUser = (authorName) => {
        setMembers(prev => prev.filter(m => m.name !== authorName));
    };

    const handleKickUser = (authorName) => {
        // Kick is essentially a soft ban in this mock - it removes from member list
        setMembers(prev => prev.filter(m => m.name !== authorName));
    };

    const toggleLocalMute = (userName) => {
        setLocalMutedUsers(prev =>
            prev.includes(userName)
                ? prev.filter(u => u !== userName)
                : [...prev, userName]
        );
    };

    const setUserVolume = (userName, volume) => {
        setUserVolumes(prev => ({
            ...prev,
            [userName]: volume
        }));
    };

    const handleLogout = () => {
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
            if (key.startsWith('freedom-')) {
                localStorage.removeItem(key);
            }
        });
        window.location.reload();
    };

    const handleCreateServer = (serverName) => {
        const newServerId = `s${Date.now()}`;
        const newServer = {
            id: newServerId,
            name: serverName,
            icon: serverName.charAt(0).toUpperCase()
        };

        setServers([...servers, newServer]);
        setChannelsByServer({
            ...channelsByServer,
            [newServerId]: [
                { category: 'Général', channels: [{ id: `c_${Date.now()}`, name: 'général', type: 'text' }] },
                { category: 'Vocal', channels: [{ id: `cv_${Date.now()}`, name: 'Discussion', type: 'voice' }] }
            ]
        });
        setRolesByServer({
            ...rolesByServer,
            [newServerId]: [
                {
                    id: 'r1',
                    name: 'Administrateur',
                    color: '#da373c',
                    badge: 'crown',
                    permissions: {
                        sendMessages: true, attachFiles: true, embedLinks: true, addReactions: true, useEmojis: true,
                        mentionEveryone: true, manageMessages: true, readMessageHistory: true, sendTTSMessages: true, pinMessages: true,
                        connectVoice: true, speakVoice: true, videoVoice: true, muteMembers: true, deafenMembers: true,
                        moveMembers: true, useVAD: true, prioritySpeaker: true,
                        kickMembers: true, banMembers: true, timeoutMembers: true, createInvites: true, changeNickname: true, manageNicknames: true,
                        viewChannels: true, manageChannels: true, manageWebhooks: true,
                        manageServer: true, manageRoles: true, manageEmojis: true, viewAuditLog: true, administrator: true
                    }
                },
                {
                    id: 'r2',
                    name: 'Membre',
                    color: '#949ba4',
                    badge: null,
                    permissions: {
                        sendMessages: true, attachFiles: true, embedLinks: true, addReactions: true, useEmojis: true,
                        mentionEveryone: false, manageMessages: false, readMessageHistory: true, sendTTSMessages: false, pinMessages: false,
                        connectVoice: true, speakVoice: true, videoVoice: false, muteMembers: false, deafenMembers: false,
                        moveMembers: false, useVAD: true, prioritySpeaker: false,
                        kickMembers: false, banMembers: false, timeoutMembers: false, createInvites: true, changeNickname: true, manageNicknames: false,
                        viewChannels: true, manageChannels: false, manageWebhooks: false,
                        manageServer: false, manageRoles: false, manageEmojis: false, viewAuditLog: false, administrator: false
                    }
                }
            ]
        });

        setActiveServerId(newServerId);
    };

    const updateServer = (serverId, updates) => {
        setServers(prev => prev.map(s => s.id === serverId ? { ...s, ...updates } : s));
    };

    const activeServer = servers.find(s => s.id === activeServerId);
    const serverChannels = channelsByServer[activeServerId] || [];

    const updateProfile = (updates) => {
        setUserProfile(prev => ({ ...prev, ...updates }));
    };

    const value = {
        activeServerId, setActiveServerId,
        activeChannelId, setActiveChannelId,
        isServerModalOpen, setIsServerModalOpen,
        isServerSettingsOpen, setIsServerSettingsOpen,
        isSettingsOpen, setIsSettingsOpen,
        isExploreModalOpen, setIsExploreModalOpen,
        isCommandCenterOpen, setIsCommandCenterOpen,
        isMemberListOpen, setIsMemberListOpen,
        currentView, setCurrentView,
        isMobileMenuOpen, setIsMobileMenuOpen,
        servers, setServers,
        channelsByServer, setChannelsByServer,
        members, setMembers,
        handleBanUser,
        mutedServers, setMutedServers,
        rolesByServer, setRolesByServer,
        memberRolesByServer, setMemberRolesByServer,
        userVolumes, setUserVolume,
        localMutedUsers, toggleLocalMute,
        userProfile, setUserProfile,
        updateProfile,
        preferences, setPreferences,
        handleLogout, handleCreateServer,
        handleKickUser, updateServer,
        activeServer, serverChannels
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => useContext(AppContext);
