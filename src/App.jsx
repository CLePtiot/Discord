import React, { useEffect, Suspense, lazy } from 'react';
import ServerSidebar from './components/ServerSidebar';
import ChannelSidebar from './components/ChannelSidebar';
import ChatView from './components/ChatView';
import FriendsView from './components/FriendsView';
import { ToastProvider } from './components/Toast';
import useSoundFeedback from './hooks/useSoundFeedback';
import { useAppContext } from './contexts/AppContext';
import { LanguageProvider } from './contexts/LanguageContext';

// Lazy loaded heavy components
const SettingsModal = lazy(() => import('./components/SettingsModal'));
const ExploreModal = lazy(() => import('./components/ExploreModal'));
const CommandCenter = lazy(() => import('./components/CommandCenter'));
const CreateServerModal = lazy(() => import('./components/CreateServerModal'));
const ServerSettingsModal = lazy(() => import('./components/ServerSettingsModal'));

import MobileDrawer from './components/MobileDrawer';
import MemberList from './components/MemberList';
import VoiceCallView from './components/VoiceCallView';
import AuthPage from './components/AuthPage';
import './index.css';

function App() {
  const context = useAppContext();

  // Early return if context is not available yet (safety guard)
  if (!context) return <div style={{ background: '#111214', color: 'white', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Initialisation...</div>;

  const {
    isServerModalOpen = false, setIsServerModalOpen,
    isServerSettingsOpen = false, setIsServerSettingsOpen,
    isSettingsOpen = false, setIsSettingsOpen,
    isExploreModalOpen = false, setIsExploreModalOpen,
    isCommandCenterOpen = false, setIsCommandCenterOpen,
    isMemberListOpen = false, currentView,
    isMobileMenuOpen = false, setIsMobileMenuOpen,
    preferences = {}, userProfile, setUserProfile, setPreferences, handleLogout,
    handleCreateServer, activeServer, serverChannels,
    activeServerId, servers, setServers, channelsByServer, setChannelsByServer, members, handleBanUser,
    rolesByServer, setRolesByServer,
    memberRolesByServer, setMemberRolesByServer
  } = context || {};

  const { playMessageSend, playNotificationSound, playCommandOpen } = useSoundFeedback(preferences?.appSounds !== false);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', preferences.theme || 'dark');

    if (preferences.theme === 'amoled') {
      document.body.style.background = '#000000';
    } else if (preferences.theme === 'light') {
      document.body.style.background = '#f2f3f5';
    } else {
      document.body.style.background = '';
    }

    root.style.setProperty('--accent-color', preferences.accentColor || '#5865F2');
    root.style.setProperty('--blur-intensity', `${preferences.blurIntensity ?? 40}px`);
    root.style.setProperty('--chat-font-size', `${preferences.fontSize ?? 16}px`);
  }, [preferences]);

  // If user is not authenticated, show Auth Page
  if (!userProfile) {
    return (
      <LanguageProvider language={preferences?.language || 'fr'}>
        <ToastProvider>
          <AuthPage onLogin={(profile) => setUserProfile(profile)} />
        </ToastProvider>
      </LanguageProvider>
    );
  }

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Panic Mode
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'p') {
        e.preventDefault();
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
  }, [playCommandOpen, setIsCommandCenterOpen]);

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
      alert(`Ouverture du profil de ${action.label.replace('Profil de ', '')}`);
    } else if (action.command.startsWith('/join')) {
      alert(`Rejoindre: ${action.command.split(' ')[1]}`);
    }
  };

  return (
    <LanguageProvider language={preferences.language || 'fr'}>
      <ToastProvider>
        <div
          className={`main-layout ${preferences.stealthMode ? 'stealth-active' : ''}`}
          style={{
            gridTemplateColumns: `var(--servers-width) var(--channels-width) 1fr ${isMemberListOpen ? 'var(--members-width)' : '0px'}`
          }}
        >
          <MobileDrawer isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)}>
            {/* Colonne 1 : Serveurs */}
            <ServerSidebar />

            {/* Colonne 2 : Salons et Profil Utilisateur */}
            <ChannelSidebar />
          </MobileDrawer>

          {/* Colonne 3 : Zone de Chat central ou Amis */}
          {currentView === 'friends' ? (
            <FriendsView />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0, height: '100%', position: 'relative' }}>
              <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
                <ChatView
                  playMessageSend={playMessageSend}
                  playNotificationSound={playNotificationSound}
                  style={{ flex: 1, minWidth: 0 }}
                />
              </div>
              <VoiceCallView />
            </div>
          )}

          {/* Colonne 4 : Liste des Membres */}
          {isMemberListOpen && (
            <MemberList
              members={members}
              roles={rolesByServer[activeServerId] || [
                { id: 'r1', name: 'Administrateur', color: '#da373c', badge: 'crown' },
                { id: 'r2', name: 'Membre', color: '#949ba4', badge: null }
              ]}
              memberRoles={memberRolesByServer[activeServerId] || {}}
              onBanUser={handleBanUser}
              userProfile={userProfile}
            />
          )}

          {/* Modals with Lazy Loading */}
          <Suspense fallback={<div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', background: '#111214', zIndex: 9999 }}>Chargement des composants...</div>}>
            {isServerModalOpen && (
              <CreateServerModal
                isOpen={isServerModalOpen}
                onClose={() => setIsServerModalOpen(false)}
                onCreate={handleCreateServer}
              />
            )}

            {isServerSettingsOpen && (
              <ServerSettingsModal
                isOpen={isServerSettingsOpen}
                onClose={() => setIsServerSettingsOpen(false)}
                serverName={activeServer?.name || 'Serveur Inconnu'}
                serverIcon={activeServer?.icon || ''}
                categories={serverChannels}
                onUpdateServerInfo={(newName, newIcon) => {
                  context.updateServer(activeServerId, { name: newName, icon: newIcon });
                }}
                onUpdateCategories={(newCategories) => {
                  setChannelsByServer({
                    ...channelsByServer,
                    [activeServerId]: newCategories
                  });
                }}
                initialRoles={rolesByServer[activeServerId] || [
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
                ]}
                onUpdateRoles={(newRoles) => {
                  setRolesByServer({
                    ...rolesByServer,
                    [activeServerId]: newRoles
                  });
                }}
                members={members}
                memberRoles={memberRolesByServer[activeServerId] || {}}
                onUpdateMemberRoles={(newMemberRoles) => {
                  setMemberRolesByServer({
                    ...memberRolesByServer,
                    [activeServerId]: newMemberRoles
                  });
                }}
              />
            )}

            {isSettingsOpen && (
              <SettingsModal
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
                userProfile={userProfile}
                setUserProfile={setUserProfile}
                updateProfile={context.updateProfile}
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
    </LanguageProvider>
  );
}

export default App;
