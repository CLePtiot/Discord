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

    const [userProfile, setUserProfile] = useLocalStorage('freedom-profile', {
        name: 'Satoshi (Moi)',
        avatar: 'https://i.pravatar.cc/150?img=11',
        banner: '#5865F2',
        bio: 'Développeur passionné par le futur du web.',
        status: 'En ligne'
    });

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
                    permissions: { sendMessages: true, attachFiles: true, kickMembers: true, banMembers: true, manageServer: true, manageRoles: true }
                },
                {
                    id: 'r2',
                    name: 'Membre',
                    color: '#949ba4',
                    badge: null,
                    permissions: { sendMessages: true, attachFiles: true, kickMembers: false, banMembers: false, manageServer: false, manageRoles: false }
                }
            ]
        });

        setActiveServerId(newServerId);
    };

    const activeServer = servers.find(s => s.id === activeServerId);
    const serverChannels = channelsByServer[activeServerId] || [];

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
        userProfile, setUserProfile,
        preferences, setPreferences,
        handleLogout, handleCreateServer,
        activeServer, serverChannels
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => useContext(AppContext);
