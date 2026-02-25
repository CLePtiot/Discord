import React, { useState } from 'react';
import ServerSidebar from './components/ServerSidebar';
import ChannelSidebar from './components/ChannelSidebar';
import ChatView from './components/ChatView';
import MemberList from './components/MemberList';
import CreateServerModal from './components/CreateServerModal';
import FriendsView from './components/FriendsView';
import SettingsModal from './components/SettingsModal';
import ExploreModal from './components/ExploreModal';
import useLocalStorage from './hooks/useLocalStorage';
import { SERVERS, CHANNELS_BY_SERVER, MOCK_MESSAGES as initialMessages, MOCK_MEMBERS as initialMembers } from './mockData';
import './index.css';

function App() {
  const [activeServerId, setActiveServerId] = useState('s1');
  const [activeChannelId, setActiveChannelId] = useState('c3');
  const [activeVoiceChannelId, setActiveVoiceChannelId] = useState(null);
  const [isServerModalOpen, setIsServerModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isExploreModalOpen, setIsExploreModalOpen] = useState(false);
  const [isMemberListOpen, setIsMemberListOpen] = useState(true);
  const [currentView, setCurrentView] = useState('chat'); // 'chat' or 'friends'
  const [servers, setServers] = useLocalStorage('freedom-servers', SERVERS);
  const [channelsByServer, setChannelsByServer] = useLocalStorage('freedom-channels', CHANNELS_BY_SERVER);

  const [userProfile, setUserProfile] = useLocalStorage('freedom-profile', {
    name: 'Satoshi (Moi)',
    avatar: 'https://i.pravatar.cc/150?img=11',
    banner: '#5865F2',
    bio: 'Développeur passionné par le futur du web.'
  });

  const [preferences, setPreferences] = useLocalStorage('freedom-preferences', {
    theme: 'dark' // can be 'dark' or 'amoled'
  });

  // Lift messages and members state up so App.jsx can handle new messages and bans
  const [messages, setMessages] = useLocalStorage('freedom-messages', initialMessages);
  const [members, setMembers] = useLocalStorage('freedom-members', initialMembers);

  const handleBanUser = (authorName) => {
    // Remove all messages by this user
    setMessages(prev => prev.filter(m => m.author !== authorName));
    // Remove user from the member list
    setMembers(prev => prev.filter(m => m.name !== authorName));
  };

  const handleLogout = () => {
    // Nettoyer uniquement les données de Project Freedom
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('freedom-')) {
        localStorage.removeItem(key);
      }
    });
    window.location.reload();
  };

  const activeServer = servers.find(s => s.id === activeServerId);
  const serverChannels = channelsByServer[activeServerId] || [];

  const handleSendMessage = (content, image = null) => {
    if (!content.trim() && !image) return;

    const now = new Date();
    const timeString = `Aujourd'hui à ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    const newMessage = {
      id: `m${Date.now()}`,
      author: userProfile.name,
      avatar: userProfile.avatar,
      content: content.trim(),
      image: image,
      timestamp: timeString,
      role: 'admin' // User is admin
    };

    setMessages([...messages, newMessage]);
  };

  const handleRemoveMessage = (messageId) => {
    setMessages(messages.filter(m => m.id !== messageId));
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

    setActiveServerId(newServerId);
  };

  return (
    <div className="main-layout">
      {/* Colonne 1 : Serveurs */}
      <ServerSidebar
        servers={servers}
        activeServerId={activeServerId}
        onSelectServer={(id) => {
          setActiveServerId(id);
          setCurrentView('chat');
          // Auto-select first text channel if available
          const firstCategory = channelsByServer[id]?.[0];
          if (firstCategory && firstCategory.channels.length > 0 && firstCategory.channels[0].type === 'text') {
            setActiveChannelId(firstCategory.channels[0].id);
          } else {
            setActiveChannelId(null);
          }
        }}
        onAddServerClick={() => setIsServerModalOpen(true)}
        onExploreClick={() => setIsExploreModalOpen(true)}
      />

      {/* Colonne 2 : Salons et Profil Utilisateur */}
      <ChannelSidebar
        serverName={activeServer?.name || 'Unknown'}
        categories={serverChannels}
        activeChannelId={activeChannelId}
        activeVoiceChannelId={activeVoiceChannelId}
        onSelectChannel={setActiveChannelId}
        onJoinVoiceChannel={setActiveVoiceChannelId}
        onFriendsClick={() => setCurrentView('friends')}
        isFriendsViewActive={currentView === 'friends'}
        userProfile={userProfile}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Colonne 3 : Zone de Chat central ou Amis */}
      {currentView === 'friends' ? (
        <FriendsView />
      ) : (
        <ChatView
          activeChannelId={activeChannelId}
          activeServerId={activeServerId}
          messages={messages}
          onSendMessage={handleSendMessage}
          onRemoveMessage={handleRemoveMessage}
          onBanUser={handleBanUser}
          onToggleMemberList={() => setIsMemberListOpen(!isMemberListOpen)}
        />
      )}

      {/* Colonne 4 : Liste des Membres */}
      {isMemberListOpen && (
        <MemberList members={members} onBanUser={handleBanUser} userProfile={userProfile} />
      )}

      {/* Modals */}
      <CreateServerModal
        isOpen={isServerModalOpen}
        onClose={() => setIsServerModalOpen(false)}
        onCreate={handleCreateServer}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        userProfile={userProfile}
        setUserProfile={setUserProfile}
        preferences={preferences}
        setPreferences={setPreferences}
        onLogout={handleLogout}
      />

      <ExploreModal
        isOpen={isExploreModalOpen}
        onClose={() => setIsExploreModalOpen(false)}
      />
    </div>
  );
}

export default App;
