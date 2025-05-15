import { API_URL } from '../config.js';

export class AuthService {
  async login(email, password) {
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Save token to local storage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));

      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async register(userData) {
    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // Save token to local storage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));

      return data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  async getUserProfile() {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        return null;
      }

      const response = await fetch(`${API_URL}/api/auth/profile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to get user profile');
      }

      return data;
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '#/login';
  }

  isAuthenticated() {
    return localStorage.getItem('token') !== null;
  }

  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  isAdmin() {
    const user = this.getUser();
    return user && user.role === 'admin';
  }
}
