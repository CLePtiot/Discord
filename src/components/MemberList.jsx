import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Crown, Ban, Shield, Star, Zap, Sword, Award } from 'lucide-react';
import { MOCK_MEMBERS } from '../mockData';
import UserPopoutCard from './UserPopoutCard';

const roleBadges = {
    'shield': Shield,
    'crown': Crown,
    'star': Star,
    'zap': Zap,
    'sword': Sword,
    'award': Award
};

const MemberList = ({ members = [], roles = [], memberRoles = {}, onBanUser, userProfile }) => {
    const [contextMenu, setContextMenu] = useState(null);

    // Close context menu on outside click
    useEffect(() => {
        const handleClickOutside = () => setContextMenu(null);
        window.addEventListener('click', handleClickOutside);
        return () => window.removeEventListener('click', handleClickOutside);
    }, []);
    const [selectedUser, setSelectedUser] = useState(null);
    const [popoutPos, setPopoutPos] = useState({ top: 0, left: 0 });

    // Group members by their highest assigned role, or fallback to status
    const groupedMembers = members.reduce((acc, member) => {
        const assignedRoleIds = memberRoles[member.id] || [];
        // Find the highest role (earliest in the roles array) that they have
        let groupName = null;
        if (assignedRoleIds.length > 0) {
            for (const role of roles) {
                if (assignedRoleIds.includes(role.id)) {
                    groupName = role.name;
                    break; // Take the highest (first) matching role
                }
            }
        }
        // Fallback: use status-based grouping
        if (!groupName) {
            groupName = (member.status === 'offline' || member.status === 'Hors ligne') ? 'Hors ligne' : 'En ligne';
        }
        if (!acc[groupName]) acc[groupName] = [];
        acc[groupName].push(member);
        return acc;
    }, {});

    // For groupOrder, use custom roles first, then fallbacks.
    const customRoleNames = roles.map(r => r.name);
    const fallbacks = ['En ligne', 'Hors ligne'];
    const groupOrder = [...customRoleNames, ...fallbacks.filter(f => !customRoleNames.includes(f))];

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
                const membersInGroup = groupedMembers[groupName] || [];
                const roleDef = roles.find(r => r.name === groupName);

                // Show role even if 0 members if it's a custom role, to let user see it!
                if (!roleDef && membersInGroup.length === 0) return null;

                const roleColor = roleDef?.color || 'inherit';
                const BadgeIcon = roleDef?.badge ? roleBadges[roleDef.badge] : null;

                return (
                    <div className="role-group" key={groupName}>
                        <div className="role-title" style={{ color: roleColor }}>{groupName} — {membersInGroup.length}</div>

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
                                            color: roleColor,
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px'
                                        }}
                                    >
                                        {member.name}
                                        {BadgeIcon && <BadgeIcon size={14} color={roleColor} />}
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
