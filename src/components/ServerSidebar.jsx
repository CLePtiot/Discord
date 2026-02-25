import React from 'react';
import { Compass, Plus } from 'lucide-react';

const ServerSidebar = ({ servers, activeServerId, onSelectServer, onAddServerClick, onExploreClick }) => {
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
                title="Add a Server"
                onClick={onAddServerClick}
            >
                <Plus size={24} color="var(--text-normal)" />
            </div>

            {/* Explore */}
            <div
                className="server-icon"
                style={{ backgroundColor: 'transparent', cursor: 'pointer' }}
                title="Explore Discoverable Servers"
                onClick={onExploreClick}
            >
                <Compass size={24} color="var(--text-normal)" />
            </div>
        </div>
    );
};

export default ServerSidebar;
