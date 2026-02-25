import React, { useState } from 'react';
import { Users, UserPlus, MoreVertical, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

const FriendsView = () => {
    const [activeTab, setActiveTab] = useState('En ligne');

    // Mock friends data (could be moved to mockData or localStorage later)
    const [friends, setFriends] = useState([
        { id: 1, name: 'Alice#9999', status: 'En ligne', avatar: 'https://i.pravatar.cc/150?img=1', bio: 'Hello world' },
        { id: 2, name: 'Bob#1234', status: 'Hors ligne', avatar: 'https://i.pravatar.cc/150?img=2', bio: 'Sleeping...' },
        { id: 3, name: 'Charlie#4321', status: 'En ligne', avatar: 'https://i.pravatar.cc/150?img=3', bio: 'Busy coding' },
    ]);

    const tabs = ['En ligne', 'Tous', 'En attente', 'Bloqué'];

    const filteredFriends = friends.filter(friend => {
        if (activeTab === 'En ligne') return friend.status === 'En ligne';
        if (activeTab === 'Tous') return true;
        // Currently empty logic for others to keep it simple
        return false;
    });

    return (
        <div className="friends-view chat-view">
            {/* Header */}
            <div className="chat-header friends-header" style={{ borderBottom: '1px solid var(--border-color)', padding: '0 16px', display: 'flex', alignItems: 'center', height: '48px', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-header)', fontWeight: 600 }}>
                    <Users size={24} />
                    <span>Amis</span>
                </div>

                <div className="friends-tabs" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--border-color)', margin: '0 8px' }}></div>
                    {tabs.map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`friend-tab ${activeTab === tab ? 'active' : ''}`}
                            style={{
                                background: activeTab === tab ? 'var(--bg-active)' : 'transparent',
                                color: activeTab === tab ? 'var(--text-header)' : 'var(--text-muted)',
                                border: 'none',
                                padding: '4px 8px',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: 500,
                                transition: 'all 0.2s'
                            }}
                        >
                            {tab}
                        </button>
                    ))}
                    <button
                        onClick={() => setActiveTab('add')}
                        className={`friend-tab-add ${activeTab === 'add' ? 'active' : ''}`}
                        style={{
                            background: activeTab === 'add' ? 'transparent' : 'var(--success-color)',
                            color: activeTab === 'add' ? 'var(--success-color)' : 'white',
                            border: 'none',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: 500
                        }}
                    >
                        Ajouter un ami
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="friends-content" style={{ padding: '24px', flex: 1, overflowY: 'auto' }}>
                {activeTab === 'add' ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="add-friend-section">
                        <h2 style={{ color: 'var(--text-header)', marginBottom: '8px', fontSize: '16px' }}>AJOUTER UN AMI</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '16px' }}>
                            Vous pouvez ajouter un ami avec son tag Discord. C'est sensible à la casse !
                        </p>
                        <div style={{
                            display: 'flex',
                            background: 'var(--bg-tertiary)',
                            padding: '12px 16px',
                            borderRadius: '8px',
                            border: '1px solid var(--border-color)',
                            alignItems: 'center'
                        }}>
                            <input
                                type="text"
                                placeholder="Vous pouvez ajouter un ami avec son tag Discord."
                                style={{
                                    flex: 1,
                                    background: 'transparent',
                                    border: 'none',
                                    color: 'var(--text-normal)',
                                    outline: 'none',
                                    fontSize: '16px'
                                }}
                            />
                            <button style={{
                                background: 'var(--accent-color)',
                                color: 'white',
                                border: 'none',
                                padding: '8px 16px',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontWeight: 500
                            }}>
                                Envoyer une demande d'ami
                            </button>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="friends-list-container">
                        <div style={{
                            marginBottom: '16px',
                            color: 'var(--text-muted)',
                            fontSize: '12px',
                            fontWeight: 600,
                            textTransform: 'uppercase'
                        }}>
                            {activeTab} — {filteredFriends.length}
                        </div>
                        <div className="friends-list">
                            {filteredFriends.length > 0 ? filteredFriends.map(friend => (
                                <div key={friend.id} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '12px',
                                    borderTop: '1px solid var(--border-color)',
                                    cursor: 'pointer',
                                    transition: 'background 0.2s',
                                    borderRadius: '8px',
                                }} className="friend-item-row">
                                    <div style={{ position: 'relative', marginRight: '12px' }}>
                                        <div style={{
                                            width: '32px', height: '32px', borderRadius: '50%',
                                            backgroundImage: `url(${friend.avatar})`, backgroundSize: 'cover'
                                        }}></div>
                                        <div style={{
                                            position: 'absolute', bottom: -2, right: -2,
                                            width: '12px', height: '12px', borderRadius: '50%',
                                            backgroundColor: friend.status === 'En ligne' ? 'var(--success-color)' : 'var(--text-muted)',
                                            border: '2px solid var(--bg-primary)'
                                        }}></div>
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ color: 'var(--text-header)', fontWeight: 600 }}>{friend.name}</div>
                                        <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{friend.status}</div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button className="friend-action-btn" style={{
                                            background: 'var(--bg-secondary)', border: 'none', color: 'var(--text-muted)',
                                            width: '36px', height: '36px', borderRadius: '50%', display: 'flex',
                                            alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
                                        }}>
                                            <MessageSquare size={18} />
                                        </button>
                                        <button className="friend-action-btn" style={{
                                            background: 'var(--bg-secondary)', border: 'none', color: 'var(--text-muted)',
                                            width: '36px', height: '36px', borderRadius: '50%', display: 'flex',
                                            alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
                                        }}>
                                            <MoreVertical size={18} />
                                        </button>
                                    </div>
                                </div>
                            )) : (
                                <div style={{
                                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                                    justifyContent: 'center', color: 'var(--text-muted)', marginTop: '60px'
                                }}>
                                    <div style={{
                                        width: '120px', height: '120px', background: 'var(--bg-tertiary)',
                                        borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        marginBottom: '20px'
                                    }}>
                                        <Users size={60} color="var(--text-muted)" opacity={0.5} />
                                    </div>
                                    <p>Personne n'est dans les parages pour jouer avec vous.</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default FriendsView;
