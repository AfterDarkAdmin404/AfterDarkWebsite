'use client';

import React from 'react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import ReactionBar from './ReactionBar';

interface ThreadCardProps {
  thread: {
    id: string;
    title: string;
    content: string;
    view_count: number;
    reply_count: number;
    created_at: string;
    last_reply_at: string | null;
    forum_categories: {
      name: string;
      slug: string;
      color: string;
    };
    users: {
      username: string;
    };
    last_reply_user?: {
      username: string;
    } | null;
  };
  userId?: string;
}

const ThreadCard: React.FC<ThreadCardProps> = ({ thread, userId }) => {
  const formatDate = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };

  const getContentPreview = (content: string) => {
    return content.length > 150 ? content.substring(0, 150) + '...' : content;
  };

  const reactionIcons = {
    like: '👍',
    love: '❤️',
    laugh: '😂',
    wow: '😮',
    sad: '😢',
    angry: '😠'
  };

  return (
    <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 rounded-xl shadow-lg border border-gray-700/50 hover:shadow-xl hover:shadow-accent/10 transition-all duration-300 backdrop-blur-sm hover:border-accent/30">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            {/* Category Badge */}
            <span 
              className="px-3 py-1 text-xs font-medium rounded-full text-white"
              style={{ backgroundColor: thread.forum_categories.color }}
            >
              {thread.forum_categories.name}
            </span>
            
            {/* Author */}
            <span className="text-sm text-gray-600 dark:text-gray-400">
              by {thread.users.username}
            </span>
          </div>
          
          {/* Time */}
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {formatDate(thread.created_at)}
          </span>
        </div>

        {/* Title and Content */}
        <Link href={`/community/threads/${thread.id}`} className="block group">
          <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-accent transition-colors duration-300">
            {thread.title}
          </h3>
          <p className="text-gray-300 text-sm leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
            {getContentPreview(thread.content)}
          </p>
        </Link>

        {/* Stats and Reactions */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-700/50">
          {/* Stats */}
          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
            <span className="flex items-center space-x-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span>{thread.view_count}</span>
            </span>
            
            <span className="flex items-center space-x-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span>{thread.reply_count}</span>
            </span>
          </div>

          {/* Reactions */}
          <ReactionBar
            contentType="thread"
            contentId={thread.id}
            userId={userId}
          />
        </div>

        {/* Last Reply Info */}
        {thread.last_reply_at && thread.last_reply_user && (
          <div className="mt-3 pt-3 border-t border-gray-700/50">
            <p className="text-xs text-gray-400">
              Last reply by <span className="text-accent font-medium">{thread.last_reply_user.username}</span> {formatDate(thread.last_reply_at)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ThreadCard; 