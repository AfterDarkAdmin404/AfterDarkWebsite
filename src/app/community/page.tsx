'use client';

import React, { useState, useEffect } from 'react';
import ThreadCard from '../components/forum/ThreadCard';
import CreateThreadModal from '../components/forum/CreateThreadModal';

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

interface Category {
  id: string;
  name: string;
  slug: string;
  color: string;
}

const CommunityPage: React.FC = () => {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('last_reply_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userId, setUserId] = useState<string | undefined>();

  const fetchCurrentUser = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const data = await response.json();
        setUserId(data.user?.id);
      } else {
        console.log('User not logged in');
      }
    } catch (error) {
      console.error('Error fetching current user:', error);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
    fetchCategories();
    fetchThreads();
  }, []);

  useEffect(() => {
    fetchThreads();
  }, [selectedCategory, searchQuery, sortBy, sortOrder]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/forum/categories');
      const data = await response.json();
      setCategories(data.categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchThreads = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: '1',
        limit: '20',
        sortBy,
        sortOrder
      });

      if (selectedCategory) {
        params.append('categoryId', selectedCategory);
      }

      if (searchQuery) {
        params.append('search', searchQuery);
      }

      const response = await fetch(`/api/forum/threads?${params}`);
      const data = await response.json();
      setThreads(data.threads || []);
    } catch (error) {
      console.error('Error fetching threads:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchThreads();
  };

  const handleThreadCreated = () => {
    fetchThreads(); // Refresh the threads list
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-gray-900 to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          {/* Back Button */}
          <div className="mb-6">
            <a
              href="https://after-dark-website.vercel.app/"
              className="inline-flex items-center text-accent hover:text-accent-dark transition-colors duration-300 group"
            >
              <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="font-medium">Back to AfterDark</span>
            </a>
          </div>
          
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold font-serif glow-text bg-gradient-to-r from-foreground via-accent to-foreground bg-clip-text text-transparent mb-4">
              After Dark Community
            </h1>
            <p className="text-xl text-gray-300 tracking-wide">
              Real People. Real Fantasies. In Real Time.
            </p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 rounded-xl shadow-lg border border-gray-700/50 p-6 mb-6 backdrop-blur-sm">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Category Filter */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent bg-gray-800 text-gray-200"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Options */}
            <div className="flex gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent bg-gray-800 text-gray-200"
                >
                  <option value="last_reply_at">Last Reply</option>
                  <option value="created_at">Created Date</option>
                  <option value="view_count">Views</option>
                  <option value="reply_count">Replies</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Order
                </label>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent bg-gray-800 text-gray-200"
                >
                  <option value="desc">Descending</option>
                  <option value="asc">Ascending</option>
                </select>
              </div>
            </div>
          </div>

          {/* Search */}
          <form onSubmit={handleSearch} className="mt-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search discussions..."
                className="flex-1 px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent bg-gray-800 text-gray-200"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-gradient-to-r from-accent to-accent-dark text-foreground rounded-md hover:shadow-lg hover:shadow-accent/20 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 transition-all duration-300 font-medium"
              >
                Search
              </button>
            </div>
          </form>
        </div>

        {/* Threads List */}
        <div className="space-y-4">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : threads.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-500 dark:text-gray-400 text-lg">
                No discussions found
              </div>
              <p className="text-gray-400 dark:text-gray-500 mt-2">
                {searchQuery || selectedCategory 
                  ? 'Try adjusting your search or filter criteria'
                  : 'Be the first to start a discussion!'
                }
              </p>
            </div>
          ) : (
            threads.map((thread) => (
                              <ThreadCard key={thread.id} thread={thread} userId={userId} />
            ))
          )}
        </div>

        {/* Create Thread Button */}
        <div className="fixed bottom-6 right-6">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-gradient-to-r from-accent to-accent-dark text-foreground p-4 rounded-full shadow-lg hover:shadow-xl hover:shadow-accent/30 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 transition-all duration-300 group"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>

        {/* Create Thread Modal */}
        <CreateThreadModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onThreadCreated={handleThreadCreated}
        />

        {/* Footer with About & Contact Links */}
        <div className="mt-16 pt-8 border-t border-gray-700/50">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-foreground mb-6 font-serif">Learn More About AfterDark</h3>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="/#about"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-accent to-accent-dark text-foreground rounded-lg hover:shadow-lg hover:shadow-accent/30 transition-all duration-300 font-medium"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                About Us
              </a>
              <a
                href="/#contact"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-accent to-accent-dark text-foreground rounded-lg hover:shadow-lg hover:shadow-accent/30 transition-all duration-300 font-medium"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Contact Us
              </a>
            </div>
            <p className="text-muted-foreground mt-4 text-sm">
              Discover our mission, meet our team, and get in touch with us
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityPage; 