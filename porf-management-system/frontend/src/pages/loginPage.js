import { AuthService } from '../services/authService.js';
import { APP_NAME } from '../config.js';

export class LoginPage {
  constructor() {
    this.authService = new AuthService();
  }

  render() {
    const container = document.createElement('div');
    container.innerHTML = `
      <div class="form-container">
        <h2 class="form-title">${APP_NAME}</h2>
        <h3 class="form-subtitle">Login to your account</h3>
        
        <div id="error-message" class="error-message" style="display: none; color: red; margin-bottom: 15px;"></div>
        
        <form id="login-form">
          <div class="form-group">
            <label for="email" class="form-label">Email</label>
            <input type="email" id="email" class="form-control" placeholder="Enter your email" required>
          </div>
          
          <div class="form-group">
            <label for="password" class="form-label">Password</label>
            <input type="password" id="password" class="form-control" placeholder="Enter your password" required>
          </div>
          
          <button type="submit" class="btn btn-primary btn-block">Login</button>
        </form>
        
        <div style="text-align: center; margin-top: 20px;">
          <p>Don't have an account? <a href="#/register">Register</a></p>
        </div>
      </div>
    `;

    return container;
  }

  afterRender() {
    const loginForm = document.getElementById('login-form');
    const errorMessage = document.getElementById('error-message');

    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      
      try {
        errorMessage.style.display = 'none';
        await this.authService.login(email, password);
        window.location.hash = '#/dashboard';
      } catch (error) {
        errorMessage.textContent = error.message || 'Login failed. Please check your credentials.';
        errorMessage.style.display = 'block';
      }
    });
  }
}
