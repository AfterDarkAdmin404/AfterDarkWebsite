'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import ReactionBar from '../../../components/forum/ReactionBar';
import { useAuth } from '@/lib/auth-context';

interface Thread {
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
}

interface Comment {
  id: string;
  content: string;
  created_at: string;
  parent_id: string | null;
  users: {
    username: string;
  };
  edited_by_user?: {
    username: string;
  } | null;
}

interface ThreadDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

const ThreadDetailPage: React.FC<ThreadDetailPageProps> = ({ params }) => {
  const { id } = use(params);
  const [thread, setThread] = useState<Thread | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { customUser } = useAuth();
  const userId = customUser?.id;

  useEffect(() => {
    fetchThread();
  }, [id]);

  const fetchThread = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/forum/threads/${id}`);
      if (response.ok) {
        const data = await response.json();
        setThread(data.thread);
        setComments(data.comments || []);
      } else {
        setError('Thread not found');
      }
    } catch (error) {
      console.error('Error fetching thread:', error);
      setError('Failed to load thread');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmitting(true);
    setError('');

    try {
      if (!userId) {
        setError('Please log in to comment');
        return;
      }

      const response = await fetch('/api/forum/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          thread_id: id,
          author_id: userId,
          content: newComment.trim(),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setComments([...comments, data.comment]);
        setNewComment('');
        // Refresh thread to update reply count
        fetchThread();
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to post comment');
      }
    } catch (error) {
      console.error('Error posting comment:', error);
      setError('Failed to post comment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !thread) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {error || 'Thread not found'}
            </h1>
            <Link
              href="/community"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              ← Back to Community
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-gray-900 to-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link
            href="/community"
            className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Community
          </Link>
        </div>

        {/* Thread Content */}
        <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 rounded-xl shadow-lg border border-gray-700/50 p-6 mb-6 backdrop-blur-sm">
          {/* Thread Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <span 
                className="px-3 py-1 text-xs font-medium rounded-full text-white"
                style={{ backgroundColor: thread.forum_categories.color }}
              >
                {thread.forum_categories.name}
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                by {thread.users.username}
              </span>
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {formatDate(thread.created_at)}
            </span>
          </div>

          {/* Thread Title and Content */}
          <h1 className="text-2xl font-bold text-foreground mb-4 font-serif">
            {thread.title}
          </h1>
          <div className="prose dark:prose-invert max-w-none mb-6">
            <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
              {thread.content}
            </p>
          </div>

          {/* Thread Stats */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-700/50">
            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
              <span className="flex items-center space-x-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span>{thread.view_count} views</span>
              </span>
              <span className="flex items-center space-x-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span>{thread.reply_count} replies</span>
              </span>
            </div>
          </div>

          {/* Thread Reactions */}
          <ReactionBar
            contentType="thread"
            contentId={thread.id}
            userId={userId}
          />
        </div>

        {/* Comments Section */}
        <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 rounded-xl shadow-lg border border-gray-700/50 p-6 backdrop-blur-sm">
          <h2 className="text-xl font-semibold text-foreground mb-6 font-serif">
            Comments ({comments.length})
          </h2>

          {/* Add Comment Form */}
          <div className="mb-8">
            <form onSubmit={handleSubmitComment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Add a Comment
                </label>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  required
                  minLength={1}
                  rows={4}
                  placeholder="Share your thoughts..."
                  className="w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent bg-gray-800 text-gray-200 resize-vertical"
                />
              </div>
              
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3">
                  <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                </div>
              )}

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={submitting || !newComment.trim()}
                  className="px-6 py-2 bg-gradient-to-r from-accent to-accent-dark text-foreground rounded-md hover:shadow-lg hover:shadow-accent/20 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Posting...' : 'Post Comment'}
                </button>
              </div>
            </form>
          </div>

          {/* Comments List */}
          <div className="space-y-6">
            {comments.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">
                  No comments yet. Be the first to share your thoughts!
                </p>
              </div>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="border-b border-gray-700/50 pb-6 last:border-b-0">
                  <div className="flex items-start justify-between mb-2">
                    <span className="font-medium text-accent">
                      {comment.users.username}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDate(comment.created_at)}
                    </span>
                  </div>
                  <div className="prose dark:prose-invert max-w-none">
                    <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                      {comment.content}
                    </p>
                  </div>
                  
                  {/* Comment Reactions */}
                  <ReactionBar
                    contentType="comment"
                    contentId={comment.id}
                    userId={userId}
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThreadDetailPage; 