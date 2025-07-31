'use client';

import React from 'react';
import ReactionButton from './ReactionButton';

interface ReactionBarProps {
  contentType: 'thread' | 'comment';
  contentId: string;
  userId?: string;
  onReactionChange?: () => void;
}

const ReactionBar: React.FC<ReactionBarProps> = ({
  contentType,
  contentId,
  userId,
  onReactionChange
}) => {
  const reactions = ['👍', '❤️', '😂', '😮', '😢', '😡'];

  return (
    <div className="flex items-center space-x-3 mt-4 p-3 bg-gradient-to-r from-gray-900/30 to-gray-800/30 rounded-xl border border-gray-700/50 backdrop-blur-sm">
      <span className="text-xs font-medium text-gray-400 mr-2">React:</span>
      {reactions.map((emoji) => (
        <ReactionButton
          key={emoji}
          emoji={emoji}
          contentType={contentType}
          contentId={contentId}
          userId={userId}
          onReactionChange={onReactionChange}
        />
      ))}
    </div>
  );
};

export default ReactionBar; 