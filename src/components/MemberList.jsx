import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Crown, Ban } from 'lucide-react';
import { MOCK_MEMBERS } from '../mockData';
import UserPopoutCard from './UserPopoutCard';

const MemberList = ({ members = [], onBanUser, userProfile }) => {
    const [contextMenu, setContextMenu] = useState(null);

    // Close context menu on outside click
    useEffect(() => {
        const handleClickOutside = () => setContextMenu(null);
        window.addEventListener('click', handleClickOutside);
        return () => window.removeEventListener('click', handleClickOutside);
    }, []);
    const [selectedUser, setSelectedUser] = useState(null);
    const [popoutPos, setPopoutPos] = useState({ top: 0, left: 0 });
    // Use passed members instead of MOCK_MEMBERS directly
    const groupedMembers = members.reduce((acc, member) => {
        if (!acc[member.group]) acc[member.group] = [];
        acc[member.group].push(member);
        return acc;
    }, {});

    const groupOrder = ['Admin', 'Modérateur', 'En ligne', 'Hors ligne'];

    const handleUserClick = (e, member) => {
        const rect = e.currentTarget.getBoundingClientRect();

        let targetUser = { ...member };
        // Merge userProfile if it's the current user "Satoshi (Moi)"
        if (member.name === 'Satoshi (Moi)' && userProfile) {
            targetUser = { ...targetUser, ...userProfile };
        }

        setPopoutPos({ top: rect.top, left: rect.left - 330 }); // open to the left of member list
        setSelectedUser(targetUser);
    };

    return (
        <div className="member-list-sidebar glass-panel" style={{ borderRight: 'none', borderLeft: '1px solid rgba(255, 255, 255, 0.05)' }}>
            {groupOrder.map(groupName => {
                const membersInGroup = groupedMembers[groupName];
                if (!membersInGroup || membersInGroup.length === 0) return null;

                return (
                    <div className="role-group" key={groupName}>
                        <div className="role-title">{groupName} — {membersInGroup.length}</div>

                        {membersInGroup.map(member => {
                            const avatar = member.name === 'Satoshi (Moi)' && userProfile ? userProfile.avatar : member.avatar;
                            return (
                                <div
                                    className="member-item"
                                    key={member.id}
                                    style={{ opacity: member.status === 'offline' ? 0.5 : 1, cursor: 'pointer', position: 'relative' }}
                                    onClick={(e) => handleUserClick(e, member)}
                                    onContextMenu={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();

                                        const menuWidth = 150; // estimated width
                                        const menuHeight = 50; // estimated height
                                        let x = e.pageX;
                                        let y = e.pageY;

                                        if (x + menuWidth > window.innerWidth) {
                                            x = window.innerWidth - menuWidth - 10;
                                        }
                                        if (y + menuHeight > window.innerHeight) {
                                            y = window.innerHeight - menuHeight - 10;
                                        }

                                        setContextMenu({
                                            x,
                                            y,
                                            memberName: member.name
                                        });
                                    }}
                                >
                                    <div
                                        className="member-avatar"
                                        style={{ backgroundImage: `url(${avatar})`, backgroundSize: 'cover' }}
                                    >
                                        <div
                                            className={`status-indicator ${member.status === 'offline' || member.status === 'Hors ligne' ? 'offline' : ''}`}
                                            style={{
                                                backgroundColor: (member.name === 'Satoshi (Moi)' ?
                                                    (userProfile?.status === 'Occupé' ? 'var(--danger-color)' :
                                                        userProfile?.status === 'Inactif' ? 'var(--warning-color, #f0b232)' :
                                                            userProfile?.status === 'Hors ligne' ? 'transparent' : 'var(--success-color)')
                                                    :
                                                    (member.status === 'Occupé' ? 'var(--danger-color)' :
                                                        member.status === 'Inactif' ? 'var(--warning-color, #f0b232)' :
                                                            (member.status === 'offline' || member.status === 'Hors ligne') ? 'transparent' : '')),
                                                ...((member.name === 'Satoshi (Moi)' && userProfile?.status === 'Hors ligne') || member.status === 'offline' || member.status === 'Hors ligne' ? { border: '3px solid var(--text-muted)' } : {})
                                            }}
                                        ></div>
                                    </div>
                                    <span
                                        className="member-name"
                                        style={{
                                            color: groupName === 'Admin' ? 'var(--danger-color)' :
                                                groupName === 'Modérateur' ? 'var(--success-color)' : 'inherit',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px'
                                        }}
                                    >
                                        {member.name}
                                        {groupName === 'Admin' && <Crown size={14} color="var(--accent-color)" />}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                );
            })}

            {/* Popout Card */}
            {selectedUser && createPortal(
                <UserPopoutCard
                    user={selectedUser}
                    position={popoutPos}
                    onClose={() => setSelectedUser(null)}
                />,
                document.body
            )}

            {/* Context Menu for Members */}
            {contextMenu && createPortal(
                <div
                    className="context-menu glass-panel"
                    style={{
                        position: 'fixed',
                        top: contextMenu.y,
                        left: contextMenu.x,
                        zIndex: 9999,
                        backgroundColor: 'var(--bg-secondary)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        padding: '8px 0',
                        minWidth: '150px',
                        boxShadow: '0 8px 16px rgba(0,0,0,0.5)'
                    }}
                >
                    <div className="context-menu-item danger" onClick={(e) => {
                        e.stopPropagation();
                        if (onBanUser) onBanUser(contextMenu.memberName);
                        setContextMenu(null);
                    }}>
                        <span>Bannir {contextMenu.memberName}</span>
                        <Ban size={16} />
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

export default MemberList;
