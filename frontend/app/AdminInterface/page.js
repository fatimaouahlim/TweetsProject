"use client";
import React, { useState, useEffect } from 'react';
import { Mail, Eye, Archive, Trash2, Search, RefreshCw, Star, StarOff, Filter, Calendar, User, Phone, MessageSquare, Copy, Check } from 'lucide-react';
import Layout from '../components/layout';

const API_BASE_URL = 'http://localhost:5000/api/admin/messages';

export default function ContactMessagesAdmin() {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    sortBy: 'newest',
    page: 1,
    limit: 10,
    priority: 'all',
    dateRange: 'all'
  });
  const [stats, setStats] = useState({
    total: 0,
    today: 0,
    thisWeek: 0,
    starred: 0
  });
  const [selectedMessages, setSelectedMessages] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [copySuccess, setCopySuccess] = useState('');

  const fetchMessages = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      params.append('sortBy', filters.sortBy);
      params.append('page', filters.page);
      params.append('limit', filters.limit);
      if (filters.priority !== 'all') params.append('priority', filters.priority);
      if (filters.dateRange !== 'all') params.append('dateRange', filters.dateRange);

      const response = await fetch(`${API_BASE_URL}?${params.toString()}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const data = await response.json();
      if (!data.success) throw new Error(data.error || 'Failed to fetch messages');

      // Add mock data for demonstration
      const mockMessages = data.data?.messages || [
        {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+1-555-0123',
          subject: 'Website Inquiry',
          message: 'Hello, I am interested in your services. Could you please provide more information about your pricing plans?',
          created_at: '2024-12-15T10:30:00Z',
          priority: 'high',
          starred: false
        },
        {
          id: 2,
          name: 'Jane Smith',
          email: 'jane@example.com',
          phone: '+1-555-0124',
          subject: 'Technical Support',
          message: 'I am experiencing issues with my account login. Can you help me resolve this?',
          created_at: '2024-12-14T14:20:00Z',
          priority: 'medium',
          starred: true
        }
      ];

      setMessages(mockMessages);
      setStats({
        total: mockMessages.length,
        today: mockMessages.filter(m => isToday(m.created_at)).length,
        thisWeek: mockMessages.filter(m => isThisWeek(m.created_at)).length,
        starred: mockMessages.filter(m => m.starred).length
      });
    } catch (err) {
      setError(err.message);
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteMessage = async (id) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const data = await response.json();
      if (!data.success) throw new Error(data.error || 'Delete failed');

      await fetchMessages();
      if (selectedMessage?.id === id) setSelectedMessage(null);
    } catch (err) {
      setError(err.message);
      console.error('Delete error:', err);
    } finally {
      setLoading(false);
    }
  };

  const bulkDelete = async () => {
    if (selectedMessages.length === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedMessages.length} messages?`)) return;
    
    try {
      setLoading(true);
      for (const id of selectedMessages) {
        await deleteMessage(id);
      }
      setSelectedMessages([]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleStar = (id) => {
    const updatedMessages = messages.map(msg => 
      msg.id === id ? { ...msg, starred: !msg.starred } : msg
    );
    setMessages(updatedMessages);
    
    // Update stats immediately
    const starredCount = updatedMessages.filter(msg => msg.starred).length;
    setStats(prevStats => ({
      ...prevStats,
      starred: starredCount
    }));
    
    if (selectedMessage?.id === id) {
      setSelectedMessage(prev => ({ ...prev, starred: !prev.starred }));
    }
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopySuccess(type);
      setTimeout(() => setCopySuccess(''), 2000);
    });
  };

  useEffect(() => {
    fetchMessages();
  }, [filters.search, filters.sortBy, filters.page, filters.priority, filters.dateRange]);

  const isToday = (dateString) => {
    const today = new Date();
    const date = new Date(dateString);
    return date.toDateString() === today.toDateString();
  };

  const isThisWeek = (dateString) => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const date = new Date(dateString);
    return date >= weekAgo && date <= now;
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'bg-red-100 text-red-800 border-red-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      low: 'bg-green-100 text-green-800 border-green-200'
    };
    return colors[priority] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getRelativeTime = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return formatDate(dateString);
  };

  const filteredMessages = messages.filter(message => {
    if (filters.priority !== 'all' && message.priority !== filters.priority) return false;
    if (filters.dateRange === 'today' && !isToday(message.created_at)) return false;
    if (filters.dateRange === 'week' && !isThisWeek(message.created_at)) return false;
    return true;
  });

  return (
    <Layout>
                 <div className="min-h-screen bg-gradient-to-br from-[#bbe1f4] to-blue-50">
      <div className="container mx-auto p-4">

        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Contact <span className="text-[#1da9ff]">Messages</span>
          </h1>
        </div>

        {/* Enhanced Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-lg border">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">Total Messages</div>
                <div className="text-2xl font-bold text-black">{stats.total}</div>
              </div>
              <MessageSquare className="w-8 h-8 text-gray-400" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-lg border">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">Today</div>
                <div className="text-2xl font-bold text-black">{stats.today}</div>
              </div>
              <Calendar className="w-8 h-8 text-gray-400" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-lg border">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">This Week</div>
                <div className="text-2xl font-bold text-black">{stats.thisWeek}</div>
              </div>
              <Calendar className="w-8 h-8 text-gray-400" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-lg border">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">Starred</div>
                <div className="text-2xl font-bold text-black">{stats.starred}</div>
              </div>
              <Star className="w-8 h-8 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Enhanced Filters */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search messages..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value, page: 1})}
              />
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
          </div>

          {showFilters && (
            <div className="mt-4 pt-4 border-t grid grid-cols-1 md:grid-cols-3 gap-4">
              <select
                className="px-3 py-2 border rounded-lg text-black focus:ring-2 focus:ring-blue-500"
                value={filters.priority}
                onChange={(e) => setFilters({...filters, priority: e.target.value, page: 1})}
              >
                <option value="all">All Priorities</option>
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>

              <select
                className="px-3 py-2 border rounded-lg text-black focus:ring-2 focus:ring-blue-500"
                value={filters.dateRange}
                onChange={(e) => setFilters({...filters, dateRange: e.target.value, page: 1})}
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
              </select>

              <select
                className="px-3 py-2 border rounded-lg text-black focus:ring-2 focus:ring-blue-500"
                value={filters.sortBy}
                onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="name">By Name</option>
                <option value="priority">By Priority</option>
              </select>
            </div>
          )}
        </div>

        {/* Bulk Actions */}
        {selectedMessages.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-6">
            <div className="flex items-center justify-between">
              <span className="text-yellow-800">
                {selectedMessages.length} message(s) selected
              </span>
              <div className="flex gap-2">
                <button
                  onClick={bulkDelete}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Delete Selected
                </button>
                <button
                  onClick={() => setSelectedMessages([])}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Clear Selection
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Messages List */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-md">
            {loading && messages.length === 0 ? (
              <div className="p-8 text-center text-black">Loading...</div>
            ) : filteredMessages.length === 0 ? (
              <div className="p-8 text-center text-black">No messages found</div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                      selectedMessage?.id === message.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                    }`}
                    onClick={() => setSelectedMessage(message)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <input
                          type="checkbox"
                          checked={selectedMessages.includes(message.id)}
                          onChange={(e) => {
                            e.stopPropagation();
                            if (e.target.checked) {
                              setSelectedMessages([...selectedMessages, message.id]);
                            } else {
                              setSelectedMessages(selectedMessages.filter(id => id !== message.id));
                            }
                          }}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`text-xs px-2 py-1 rounded-full border ${getPriorityColor(message.priority)}`}>
                              {message.priority}
                            </span>
                            <span className="font-semibold text-black">{message.name}</span>
                            {message.starred && <Star className="w-4 h-4 text-yellow-500 fill-current" />}
                          </div>
                          <p className="text-sm font-medium text-gray-900 mb-1">{message.subject}</p>
                          <p className="text-sm text-gray-600 truncate">{message.message}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {message.email}
                            </span>
                            {message.phone && (
                              <span className="flex items-center gap-1">
                                <Phone className="w-3 h-3" />
                                {message.phone}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleStar(message.id);
                          }}
                          className="p-1 hover:bg-gray-200 rounded"
                        >
                          {message.starred ? 
                            <Star className="w-4 h-4 text-yellow-500 fill-current" /> : 
                            <StarOff className="w-4 h-4 text-gray-400" />
                          }
                        </button>
                        <span className="text-xs text-gray-500 whitespace-nowrap">
                          {getRelativeTime(message.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Enhanced Message Detail */}
          <div className="lg:col-span-1 bg-white rounded-lg shadow-md">
            {selectedMessage ? (
              <div className="h-full flex flex-col">
                <div className="p-4 border-b">
                  <div className="flex justify-between items-start mb-3">
                    <span className={`text-xs px-2 py-1 rounded-full border ${getPriorityColor(selectedMessage.priority)}`}>
                      {selectedMessage.priority} priority
                    </span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => toggleStar(selectedMessage.id)}
                        className="p-1 hover:bg-gray-200 rounded"
                      >
                        {selectedMessage.starred ? 
                          <Star className="w-4 h-4 text-yellow-500 fill-current" /> : 
                          <StarOff className="w-4 h-4 text-gray-400" />
                        }
                      </button>
                      <button
                        onClick={() => deleteMessage(selectedMessage.id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-black mb-2">{selectedMessage.subject}</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="text-black font-medium">{selectedMessage.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-700">{selectedMessage.email}</span>
                      <button
                        onClick={() => copyToClipboard(selectedMessage.email, 'email')}
                        className="p-1 hover:bg-gray-200 rounded"
                      >
                        {copySuccess === 'email' ? 
                          <Check className="w-3 h-3 text-green-500" /> : 
                          <Copy className="w-3 h-3 text-gray-400" />
                        }
                      </button>
                    </div>
                    {selectedMessage.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-700">{selectedMessage.phone}</span>
                        <button
                          onClick={() => copyToClipboard(selectedMessage.phone, 'phone')}
                          className="p-1 hover:bg-gray-200 rounded"
                        >
                          {copySuccess === 'phone' ? 
                            <Check className="w-3 h-3 text-green-500" /> : 
                            <Copy className="w-3 h-3 text-gray-400" />
                          }
                        </button>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-700">{formatDate(selectedMessage.created_at)}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 flex-1">
                  <h4 className="font-medium mb-2 text-black">Message</h4>
                  <div className="bg-gray-50 p-3 rounded-lg mb-4">
                    <p className="whitespace-pre-wrap text-black text-sm">{selectedMessage.message}</p>
                  </div>

                  <div className="space-y-3">
                    <button
                      onClick={() => window.open(`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`)}
                      className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                    >
                      <Mail className="w-4 h-4" />
                      Open in Email Client
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-black">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Select a message to view details</p>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="fixed bottom-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg">
            {error}
          </div>
        )}

        {copySuccess && (
          <div className="fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg">
            {copySuccess === 'email' ? 'Email' : 'Phone'} copied to clipboard!
          </div>
        )}
      </div>
      </div>
    </Layout>
  );
}