import React from 'react';
import { Compass, Plus } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';

const ServerSidebar = () => {
    const {
        servers,
        activeServerId,
        setActiveServerId,
        setIsServerModalOpen,
        setIsExploreModalOpen,
        setCurrentView,
        channelsByServer,
        setActiveChannelId
    } = useAppContext();

    const onSelectServer = (id) => {
        setActiveServerId(id);
        setCurrentView('chat');
        const firstCategory = channelsByServer[id]?.[0];
        if (firstCategory && firstCategory.channels.length > 0 && firstCategory.channels[0].type === 'text') {
            setActiveChannelId(firstCategory.channels[0].id);
        } else {
            setActiveChannelId(null);
        }
    };

    return (
        <div className="server-sidebar glass-panel">
            {servers.map((server, index) => {
                const isActive = server.id === activeServerId;
                const isHome = server.isHome;

                return (
                    <React.Fragment key={server.id}>
                        <div
                            className={`server-icon ${isActive ? 'active' : ''}`}
                            style={{
                                backgroundColor: isActive ? 'var(--accent-color)' : (isHome ? 'var(--accent-color)' : 'var(--bg-chat)'),
                                color: isActive || isHome ? 'white' : 'var(--text-normal)',
                                borderRadius: isActive ? 'var(--radius-server-hover)' : 'var(--radius-server)'
                            }}
                            onClick={() => onSelectServer(server.id)}
                            title={server.name}
                        >
                            {server.icon}
                        </div>
                        {isHome && <div className="server-separator"></div>}
                    </React.Fragment>
                );
            })}

            <div className="server-separator"></div>

            {/* Add Server */}
            <div
                className="server-icon"
                style={{ backgroundColor: 'transparent', border: '1px dashed var(--text-muted)', cursor: 'pointer' }}
                title="Ajouter un serveur"
                onClick={() => setIsServerModalOpen(true)}
            >
                <Plus size={24} color="var(--text-normal)" />
            </div>

            {/* Explore */}
            <div
                className="server-icon"
                style={{ backgroundColor: 'transparent', cursor: 'pointer' }}
                title="Explorer les serveurs publics"
                onClick={() => setIsExploreModalOpen(true)}
            >
                <Compass size={24} color="var(--text-normal)" />
            </div>
        </div>
    );
};

export default ServerSidebar;
