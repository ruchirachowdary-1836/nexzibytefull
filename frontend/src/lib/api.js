import axios from 'axios';
import { mockData } from '../data/mockData';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 12000,
});

const readStoredToken = () => {
  try {
    return localStorage.getItem('techtalk-token');
  } catch {
    return null;
  }
};

const storeToken = (token) => {
  try {
    if (token) localStorage.setItem('techtalk-token', token);
    else localStorage.removeItem('techtalk-token');
  } catch {
    // ignore storage errors in restricted environments
  }
};

api.interceptors.request.use((config) => {
  const token = readStoredToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const safeRequest = async (request, fallback) => {
  try {
    const response = await request();
    return response?.data ?? fallback;
  } catch (error) {
    return fallback;
  }
};

const fallbackImage = 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80';
const fallbackPortrait = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80';

const normalizePost = (post, categoryMap = {}) => ({
  id: post.id,
  title: post.title || 'Untitled post',
  excerpt: post.excerpt || post.content?.slice(0, 140) || 'A TechTalk insight from the community.',
  content: post.content || 'No content provided yet.',
  category: categoryMap[post.category_id] || post.category || 'General',
  categoryId: post.category_id || 1,
  tags: Array.isArray(post.tags)
    ? post.tags
    : typeof post.tags === 'string'
      ? post.tags.split(',').map((tag) => tag.trim()).filter(Boolean)
      : ['Technology'],
  author: post.author || 'Community member',
  authorRole: post.authorRole || 'TechTalk contributor',
  publishedAt: post.created_at ? new Date(post.created_at).toISOString().slice(0, 10) : '2026-01-01',
  readTime: post.readTime || '5 min read',
  reactions: post.reactions ?? 0,
  comments: post.comments ?? 0,
  image: post.cover_image || post.image || fallbackImage,
});

const normalizeSpeaker = (speaker) => ({
  id: speaker.id,
  name: speaker.name || 'TechTalk Speaker',
  designation: speaker.designation || 'Community Expert',
  company: speaker.company || 'NexziByte',
  expertise: Array.isArray(speaker.expertise)
    ? speaker.expertise
    : typeof speaker.expertise === 'string'
      ? speaker.expertise.split(',').map((value) => value.trim()).filter(Boolean)
      : ['Technology'],
  bio: speaker.biography || speaker.bio || 'Technology leader shaping thoughtful conversations.',
  photo: speaker.photo || fallbackPortrait,
});

const normalizeEvent = (event, itemType) => ({
  id: event.id,
  title: event.title || 'Upcoming event',
  description: event.description || 'Technology community experience for learning and connection.',
  banner: event.banner || fallbackImage,
  date: event.date || '2026-01-01',
  time: event.time || '09:00',
  location: event.location || 'Hyderabad',
  venue: event.venue || 'NexziByte Hub',
  agenda: Array.isArray(event.agenda) ? event.agenda : event.agenda ? [event.agenda] : ['Agenda to be announced'],
  speakers: Array.isArray(event.speakers) ? event.speakers.map((speaker) => (typeof speaker === 'object' ? speaker.id : speaker)) : event.speaker_ids || [],
  status: event.status || 'upcoming',
  is_published: event.is_published ?? true,
  founder_information: event.founder_information || 'Founder-led conversation for high-signal networking.',
  networking_info: event.networking_info || 'Structured networking and curated peer introductions.',
  type: itemType,
});

export const apiService = {
  async getCategories() {
    return safeRequest(() => api.get('/categories'), mockData.categories);
  },
  async getPosts() {
    const categories = await this.getCategories();
    const categoryMap = Object.fromEntries((categories || []).map((category) => [category.id, category.name]));
    const posts = await safeRequest(() => api.get('/posts'), mockData.posts);
    if (!Array.isArray(posts)) return mockData.posts;
    return posts.map((post) => normalizePost(post, categoryMap));
  },
  async getSpeakers() {
    const speakers = await safeRequest(() => api.get('/speakers'), mockData.speakers);
    if (!Array.isArray(speakers)) return mockData.speakers;
    return speakers.map(normalizeSpeaker);
  },
  async getSummits() {
    const summits = await safeRequest(() => api.get('/summits'), mockData.summits);
    if (!Array.isArray(summits)) return mockData.summits;
    return summits.map((event) => normalizeEvent(event, 'summit'));
  },
  async getFounderMeets() {
    const meets = await safeRequest(() => api.get('/founder-meets'), mockData.founderMeets);
    if (!Array.isArray(meets)) return mockData.founderMeets;
    return meets.map((event) => normalizeEvent(event, 'founder'));
  },
  async login({ email, password }) {
    const params = new URLSearchParams({ username: email, password });
    const response = await safeRequest(
      () =>
        api.post('/auth/login', params, {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        }),
      { access_token: 'demo-token' }
    );
    const token = response?.access_token;
    storeToken(token);
    return response;
  },
  async loginWithGoogle(credential) {
    try {
      const response = await api.post('/auth/google', { credential });
      const token = response?.data?.access_token;
      if (!token) throw new Error('Google authentication did not return an access token.');
      storeToken(token);
      return response.data;
    } catch (error) {
      const detail = error?.response?.data?.detail;
      throw new Error(detail || error?.message || 'Google authentication failed.');
    }
  },
  async register({ name, email, password }) {
    return safeRequest(() => api.post('/auth/register', { name, email, password }), {
      name,
      email,
      password,
    });
  },
  async getCurrentUser() {
    const token = readStoredToken();
    if (!token) return null;
    return safeRequest(() => api.get('/users/me'), null);
  },
  async createPost(payload) {
    return safeRequest(() => api.post('/posts', payload), {
      ...payload,
      id: Date.now(),
      status: 'draft',
      author: 'Current member',
      publishedAt: new Date().toISOString().slice(0, 10),
      readTime: '4 min read',
      reactions: 0,
      comments: 0,
      image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80',
    });
  },
  async registerForEvent(payload) {
    return safeRequest(() => api.post('/registrations', payload), {
      ...payload,
      id: Date.now(),
      status: 'registered',
    });
  },
  async getComments(postId) {
    return safeRequest(() => api.get(`/posts/${postId}/comments`), []);
  },
  async addComment(postId, content) {
    return safeRequest(() => api.post(`/posts/${postId}/comments`, { content }), null);
  },
  async deleteComment(commentId) {
    return safeRequest(() => api.delete(`/comments/${commentId}`), null);
  },
  async toggleReaction(postId) {
    return safeRequest(() => api.post(`/posts/${postId}/reactions`), null);
  },
  async getNotifications() {
    return safeRequest(() => api.get('/notifications'), []);
  },
  async getUnreadNotificationCount() {
    return safeRequest(() => api.get('/notifications/unread-count'), { count: 0 });
  },
  async markNotificationRead(notificationId) {
    return safeRequest(() => api.put(`/notifications/${notificationId}/read`), null);
  },
  async markAllNotificationsRead() {
    return safeRequest(() => api.put('/notifications/read-all'), null);
  },
  logout() {
    storeToken(null);
  },
};

export const getAuthToken = () => readStoredToken();

export default api;
