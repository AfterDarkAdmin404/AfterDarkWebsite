'use client';

import React, { useState, useEffect } from 'react';

interface Reaction {
  emoji: string;
  count: number;
  users: string[];
  userReacted: boolean;
}

interface ReactionButtonProps {
  emoji: string;
  contentType: 'thread' | 'comment';
  contentId: string;
  userId?: string;
  onReactionChange?: () => void;
}

const ReactionButton: React.FC<ReactionButtonProps> = ({
  emoji,
  contentType,
  contentId,
  userId,
  onReactionChange
}) => {
  const [reaction, setReaction] = useState<Reaction | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchReaction();
  }, [contentType, contentId, emoji, userId]);

  const fetchReaction = async () => {
    try {
      const params = new URLSearchParams({
        content_type: contentType,
        content_id: contentId,
        emoji: emoji
      });
      
      if (userId) {
        params.append('user_id', userId);
      }

      const response = await fetch(`/api/forum/reactions?${params}`);
      if (response.ok) {
        const data = await response.json();
        const emojiReaction = data.reactions.find((r: Reaction) => r.emoji === emoji);
        setReaction(emojiReaction || { emoji, count: 0, users: [], userReacted: false });
      }
    } catch (error) {
      console.error('Error fetching reaction:', error);
    }
  };

  const handleReactionClick = async () => {
    if (!userId) {
      alert('Please log in to react');
      return;
    }

    setLoading(true);
    try {
      if (reaction?.userReacted) {
        // Remove reaction
        const response = await fetch('/api/forum/reactions', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: userId,
            content_type: contentType,
            content_id: contentId,
            emoji: emoji,
          }),
        });

        if (response.ok) {
          setReaction(prev => prev ? {
            ...prev,
            count: Math.max(0, prev.count - 1),
            userReacted: false,
            users: prev.users.filter(user => user !== userId)
          } : null);
          onReactionChange?.();
        }
      } else {
        // Add reaction
        const response = await fetch('/api/forum/reactions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: userId,
            content_type: contentType,
            content_id: contentId,
            emoji: emoji,
          }),
        });

        if (response.ok) {
          setReaction(prev => prev ? {
            ...prev,
            count: prev.count + 1,
            userReacted: true,
            users: [...prev.users, userId]
          } : {
            emoji,
            count: 1,
            users: [userId],
            userReacted: true
          });
          onReactionChange?.();
        }
      }
    } catch (error) {
      console.error('Error toggling reaction:', error);
    } finally {
      setLoading(false);
    }
  };

  const isActive = reaction?.userReacted;
  const count = reaction?.count || 0;

  return (
    <button
      onClick={handleReactionClick}
      disabled={loading}
      className={`
        inline-flex items-center space-x-2 px-3 py-2 rounded-full text-sm font-medium transition-all duration-300 relative overflow-hidden group
        ${isActive 
          ? 'bg-gradient-to-r from-accent to-accent-dark text-foreground border border-accent/50 shadow-lg shadow-accent/20' 
          : 'bg-gradient-to-r from-gray-800/50 to-gray-700/50 text-gray-300 border border-gray-600/50 hover:border-accent/30 hover:bg-gradient-to-r hover:from-gray-700/50 hover:to-gray-600/50'
        }
        ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-105 hover:shadow-xl'}
      `}
      title={`${emoji} ${count > 0 ? `(${count})` : ''}`}
    >
      {/* Glow effect for active state */}
      {isActive && (
        <div className="absolute inset-0 bg-gradient-to-r from-accent/20 to-accent-dark/20 rounded-full animate-pulse"></div>
      )}
      
      {/* Hover shine effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
      
      <span className="text-lg relative z-10">{emoji}</span>
      {count > 0 && (
        <span className="text-xs font-bold relative z-10 bg-black/20 px-1.5 py-0.5 rounded-full">
          {count}
        </span>
      )}
    </button>
  );
};

export default ReactionButton; 