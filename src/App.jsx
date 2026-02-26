import React, { useState, useEffect, Suspense, lazy } from 'react';
import ServerSidebar from './components/ServerSidebar';
import ChannelSidebar from './components/ChannelSidebar';
import ChatView from './components/ChatView';
import FriendsView from './components/FriendsView';
import { ToastProvider } from './components/Toast';
import useLocalStorage from './hooks/useLocalStorage';
import useSoundFeedback from './hooks/useSoundFeedback';
import { SERVERS, CHANNELS_BY_SERVER, MOCK_MEMBERS as initialMembers } from './mockData';

// Lazy loaded heavy components
const SettingsModal = lazy(() => import('./components/SettingsModal'));
const ExploreModal = lazy(() => import('./components/ExploreModal'));
const CommandCenter = lazy(() => import('./components/CommandCenter'));
const CreateServerModal = lazy(() => import('./components/CreateServerModal'));
import MobileDrawer from './components/MobileDrawer';
import MemberList from './components/MemberList';
import VoiceCallView from './components/VoiceCallView';
import './index.css';

function App() {
  const [activeServerId, setActiveServerId] = useState('s1');
  const [activeChannelId, setActiveChannelId] = useState('c3');
  const [activeVoiceChannelId, setActiveVoiceChannelId] = useState(null);
  const [isServerModalOpen, setIsServerModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isExploreModalOpen, setIsExploreModalOpen] = useState(false);
  const [isCommandCenterOpen, setIsCommandCenterOpen] = useState(false);
  const [isMemberListOpen, setIsMemberListOpen] = useState(true);
  const [currentView, setCurrentView] = useState('chat'); // 'chat' or 'friends'
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [servers, setServers] = useLocalStorage('freedom-servers', SERVERS);
  const [channelsByServer, setChannelsByServer] = useLocalStorage('freedom-channels', CHANNELS_BY_SERVER);

  // --- Voice & Screen Share State ---
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isDeafened, setIsDeafened] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const mediaStreamRef = React.useRef(null);
  const displayStreamRef = React.useRef(null);

  const [userProfile, setUserProfile] = useLocalStorage('freedom-profile', {
    name: 'Satoshi (Moi)',
    avatar: 'https://i.pravatar.cc/150?img=11',
    banner: '#5865F2',
    bio: 'Développeur passionné par le futur du web.'
  });

  const [preferences, setPreferences] = useLocalStorage('freedom-preferences', {
    theme: 'dark', // can be 'dark' or 'amoled'
    accentColor: '#5865F2',
    blurIntensity: 40,
    fontSize: 16,
    stealthMode: false,
    appSounds: true
  });

  // ── Sound Feedback ──
  const { playMessageSend, playMessageReceive, playCommandOpen } = useSoundFeedback(preferences.appSounds !== false);

  // Apply Theme and Preferences
  useEffect(() => {
    const root = document.documentElement;
    if (preferences.theme === 'amoled') {
      root.style.setProperty('--bg-app', '#000000');
      document.body.style.background = '#000000'; // Override mesh if black
    } else {
      root.style.setProperty('--bg-app', '#111214');
      // Reset to mesh gradient
      document.body.style.background = '';
    }

    // Apply new dynamic properties
    root.style.setProperty('--accent-color', preferences.accentColor || '#5865F2');
    root.style.setProperty('--blur-intensity', `${preferences.blurIntensity ?? 40}px`);
    root.style.setProperty('--chat-font-size', `${preferences.fontSize ?? 16}px`);

  }, [preferences]);

  // Members state for the sidebar
  const [members, setMembers] = useLocalStorage('freedom-members', initialMembers);

  const handleBanUser = (authorName) => {
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

  // Keyboard Shortcuts (Ctrl+K for Command Palette, Ctrl+Shift+P for Panic Mode)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Panic Mode
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        // Redirect to neutral page
        window.location.href = "https://fr.wikipedia.org/wiki/Sp%C3%A9cial:Page_au_hasard";
        return;
      }
      // Command Center
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandCenterOpen(true);
        playCommandOpen();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleCommandAction = (action) => {
    if (action.id === 'dark') {
      setPreferences({ ...preferences, theme: 'dark' });
    } else if (action.id === 'amoled') {
      setPreferences({ ...preferences, theme: 'amoled' });
    } else if (action.id === 'clear-cache') {
      handleLogout();
    } else if (action.id === 'profile') {
      setIsSettingsOpen(true);
    } else if (action.isUser) {
      // Mock opening user profile. In a real app we'd trigger a modal.
      alert(`Ouverture du profil de ${action.label.replace('Profil de ', '')}`);
    } else if (action.command.startsWith('/join')) {
      // Mock joining a channel/server
      alert(`Rejoindre: ${action.command.split(' ')[1]}`);
    }
  };

  const activeServer = servers.find(s => s.id === activeServerId);
  const serverChannels = channelsByServer[activeServerId] || [];

  // --- Voice Handlers ---
  const handleVoiceDisconnect = () => {
    setActiveVoiceChannelId(null);
    setIsMuted(false);
    setIsDeafened(false);
    if (isScreenSharing) handleStopScreenShare();
  };

  const toggleMute = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getAudioTracks().forEach(track => {
        track.enabled = !newMutedState;
      });
    }
  };

  const toggleDeafen = () => {
    const newDeaf = !isDeafened;
    setIsDeafened(newDeaf);
    if (newDeaf) setIsMuted(true);
    else setIsMuted(false);
  };

  const handleStopScreenShare = () => {
    if (displayStreamRef.current) {
      displayStreamRef.current.getTracks().forEach(track => track.stop());
      displayStreamRef.current = null;
    }
    setIsScreenSharing(false);
  };

  const toggleScreenShare = async () => {
    if (isScreenSharing) {
      handleStopScreenShare();
    } else {
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
        displayStreamRef.current = stream;
        setIsScreenSharing(true);

        stream.getVideoTracks()[0].onended = () => {
          handleStopScreenShare();
        };
      } catch (err) {
        console.error("Screen share cancelled or failed", err);
      }
    }
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
    <ToastProvider>
      <div className={`main-layout ${preferences.stealthMode ? 'stealth-active' : ''}`}>
        <MobileDrawer isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)}>
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
            activeChannelIds={activeChannelId ? [activeChannelId] : []}
            activeVoiceChannelId={activeVoiceChannelId}
            onSelectChannel={(id) => {
              setIsMobileMenuOpen(false);
              setActiveChannelId(id);
            }}
            onJoinVoiceChannel={setActiveVoiceChannelId}
            onFriendsClick={() => {
              setCurrentView('friends');
              setIsMobileMenuOpen(false);
            }}
            isFriendsViewActive={currentView === 'friends'}
            userProfile={userProfile}
            onOpenSettings={() => setIsSettingsOpen(true)}
            isSpeaking={isSpeaking}
            setIsSpeaking={setIsSpeaking}
            isMuted={isMuted}
            isDeafened={isDeafened}
            isScreenSharing={isScreenSharing}
            mediaStreamRef={mediaStreamRef}
            handleVoiceDisconnect={handleVoiceDisconnect}
            toggleMute={toggleMute}
            toggleDeafen={toggleDeafen}
            toggleScreenShare={toggleScreenShare}
          />
        </MobileDrawer>

        {/* Colonne 3 : Zone de Chat central ou Amis */}
        {currentView === 'friends' ? (
          <FriendsView />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0, height: '100%' }}>
            {activeVoiceChannelId && (
              <VoiceCallView
                activeVoiceChannelId={activeVoiceChannelId}
                displayStreamRef={displayStreamRef}
                isScreenSharing={isScreenSharing}
                userProfile={userProfile}
                isMuted={isMuted}
                isDeafened={isDeafened}
                isSpeaking={isSpeaking}
                onToggleMute={toggleMute}
                onToggleDeafen={toggleDeafen}
                onToggleScreenShare={toggleScreenShare}
                onDisconnect={handleVoiceDisconnect}
              />
            )}
            <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
              <ChatView
                activeChannelId={activeChannelId}
                activeServerId={activeServerId}
                onBanUser={handleBanUser}
                onToggleMemberList={() => setIsMemberListOpen(!isMemberListOpen)}
                onToggleMobileMenu={() => setIsMobileMenuOpen(true)}
                userProfile={userProfile}
                appSoundsEnabled={preferences.appSounds !== false}
                playMessageSend={playMessageSend}
                style={{ flex: 1, minWidth: 0 }}
              />
            </div>
          </div>
        )}

        {/* Colonne 4 : Liste des Membres */}
        {isMemberListOpen && (
          <MemberList members={members} onBanUser={handleBanUser} userProfile={userProfile} />
        )}

        {/* Modals with Lazy Loading */}
        <Suspense fallback={null}>
          {isServerModalOpen && (
            <CreateServerModal
              isOpen={isServerModalOpen}
              onClose={() => setIsServerModalOpen(false)}
              onCreate={handleCreateServer}
            />
          )}

          {isSettingsOpen && (
            <SettingsModal
              isOpen={isSettingsOpen}
              onClose={() => setIsSettingsOpen(false)}
              userProfile={userProfile}
              setUserProfile={setUserProfile}
              preferences={preferences}
              setPreferences={setPreferences}
              onLogout={handleLogout}
            />
          )}

          {isExploreModalOpen && (
            <ExploreModal
              isOpen={isExploreModalOpen}
              onClose={() => setIsExploreModalOpen(false)}
            />
          )}

          {isCommandCenterOpen && (
            <CommandCenter
              isOpen={isCommandCenterOpen}
              onClose={() => setIsCommandCenterOpen(false)}
              onAction={handleCommandAction}
              members={members}
            />
          )}
        </Suspense>
      </div>
    </ToastProvider>
  );
}

export default App;
