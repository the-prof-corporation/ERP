import { Router } from './components/router.js';
import { AuthService } from './services/authService.js';

// Initialize the app
const app = {
  init() {
    this.router = new Router();
    this.authService = new AuthService();
    
    // Check if user is logged in
    this.checkAuth();
    
    // Initialize router
    this.router.init();
  },
  
  checkAuth() {
    const token = localStorage.getItem('token');
    if (token) {
      // Validate token and get user info
      this.authService.getUserProfile()
        .then(user => {
          if (user) {
            // Store user in local storage
            localStorage.setItem('user', JSON.stringify(user));
          } else {
            // Invalid token, redirect to login
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '#/login';
          }
        })
        .catch(err => {
          console.error('Auth error:', err);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '#/login';
        });
    } else {
      // No token, redirect to login if not already there
      if (!window.location.hash.includes('/login') && !window.location.hash.includes('/register')) {
        window.location.href = '#/login';
      }
    }
  }
};

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  app.init();
});
