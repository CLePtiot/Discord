import React from 'react';
import { motion } from 'framer-motion';

/**
 * Skeleton loader that mimics the shape of chat messages.
 * Shows 4 shimmer placeholders for avatar + text.
 */
const MessageSkeleton = ({ count = 4 }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '16px 0' }}>
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="message-skeleton" style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                    {/* Avatar */}
                    <div className="skeleton-shimmer" style={{
                        width: '40px', height: '40px', borderRadius: '50%', flexShrink: 0,
                    }} />
                    {/* Text lines */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '4px' }}>
                        {/* Author + time */}
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <div className="skeleton-shimmer" style={{
                                width: `${70 + Math.random() * 50}px`, height: '14px', borderRadius: '4px',
                            }} />
                            <div className="skeleton-shimmer" style={{
                                width: '60px', height: '10px', borderRadius: '4px', opacity: 0.5,
                            }} />
                        </div>
                        {/* Content lines */}
                        <div className="skeleton-shimmer" style={{
                            width: `${55 + Math.random() * 40}%`, height: '14px', borderRadius: '4px',
                        }} />
                        {i % 3 === 0 && (
                            <div className="skeleton-shimmer" style={{
                                width: `${30 + Math.random() * 30}%`, height: '14px', borderRadius: '4px',
                            }} />
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default MessageSkeleton;
