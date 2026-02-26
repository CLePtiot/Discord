import React, { useState, useEffect, useRef } from 'react';
import { Search, Moon, Sun, Monitor, Trash2, User, UserPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CommandCenter = ({ isOpen, onClose, onAction, members }) => {
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            setQuery('');
            setSelectedIndex(0);
            setTimeout(() => inputRef.current?.focus(), 50);
        }
    }, [isOpen]);

    const baseActions = [
        { id: 'dark', label: 'Thème Sombre', icon: <Moon size={16} />, command: '/dark' },
        { id: 'amoled', label: 'Thème AMOLED', icon: <Monitor size={16} />, command: '/amoled' },
        { id: 'clear-cache', label: 'Vider le cache', icon: <Trash2 size={16} />, command: '/clear-cache' },
        { id: 'profile', label: 'Mon Profil', icon: <User size={16} />, command: '/profile' }
    ];

    // Filter members for search
    const memberActions = members ? members.map(m => ({
        id: `user-${m.name}`,
        label: `Profil de ${m.name}`,
        icon: <UserPlus size={16} />,
        command: `/profile ${m.name}`,
        isUser: true,
        avatar: m.avatar
    })) : [];

    const allActions = [...baseActions, ...memberActions];

    const filteredActions = allActions.filter(action =>
        action.label.toLowerCase().includes(query.toLowerCase()) ||
        action.command.toLowerCase().includes(query.toLowerCase())
    );

    useEffect(() => {
        setSelectedIndex(0);
    }, [query]);

    const handleKeyDown = (e) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev => (prev < filteredActions.length - 1 ? prev + 1 : prev));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => (prev > 0 ? prev - 1 : 0));
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (filteredActions[selectedIndex]) {
                handleSelectAction(filteredActions[selectedIndex]);
            }
        } else if (e.key === 'Escape') {
            e.preventDefault();
            onClose();
        }
    };

    const handleSelectAction = (action) => {
        onAction(action);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="modal-overlay" onClick={onClose} style={{ alignItems: 'flex-start', paddingTop: '15vh' }}>
                <motion.div
                    className="modal-content glass-panel"
                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    onClick={(e) => e.stopPropagation()}
                    style={{
                        padding: 0,
                        width: '500px',
                        overflow: 'hidden',
                        backgroundColor: 'var(--bg-chat)', // Or a slightly transparent version
                        boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                        border: '1px solid rgba(255,255,255,0.15)'
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                        <Search size={20} color="var(--text-muted)" style={{ marginRight: '12px' }} />
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder="Rechercher une commande (/dark, /amoled) ou un membre..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={handleKeyDown}
                            style={{
                                width: '100%',
                                background: 'transparent',
                                border: 'none',
                                color: 'var(--text-normal)',
                                fontSize: '16px',
                                outline: 'none'
                            }}
                        />
                    </div>

                    <div style={{ maxHeight: '300px', overflowY: 'auto', padding: '8px' }}>
                        {filteredActions.length > 0 ? (
                            filteredActions.map((action, index) => (
                                <div
                                    key={action.id}
                                    onClick={() => handleSelectAction(action)}
                                    onMouseEnter={() => setSelectedIndex(index)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        padding: '12px 16px',
                                        cursor: 'pointer',
                                        borderRadius: '8px',
                                        backgroundColor: index === selectedIndex ? 'var(--accent-color)' : 'transparent',
                                        color: index === selectedIndex ? 'white' : 'var(--text-normal)',
                                        transition: 'background-color 0.1s'
                                    }}
                                >
                                    {action.isUser && action.avatar ? (
                                        <div style={{
                                            width: '24px', height: '24px', borderRadius: '50%',
                                            backgroundImage: `url(${action.avatar})`, backgroundSize: 'cover',
                                            marginRight: '12px'
                                        }}></div>
                                    ) : (
                                        <div style={{ marginRight: '12px', opacity: index === selectedIndex ? 1 : 0.7 }}>
                                            {action.icon}
                                        </div>
                                    )}
                                    <div style={{ flex: 1, fontWeight: 500 }}>{action.label}</div>
                                    <div style={{
                                        fontSize: '12px',
                                        color: index === selectedIndex ? 'rgba(255,255,255,0.7)' : 'var(--text-muted)',
                                        backgroundColor: index === selectedIndex ? 'rgba(0,0,0,0.2)' : 'var(--bg-modifier-active)',
                                        padding: '2px 6px',
                                        borderRadius: '4px',
                                        fontFamily: 'monospace'
                                    }}>
                                        {action.command}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
                                Aucun résultat trouvé pour "{query}"
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default CommandCenter;
