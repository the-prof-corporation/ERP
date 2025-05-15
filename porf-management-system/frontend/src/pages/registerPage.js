import { AuthService } from '../services/authService.js';
import { APP_NAME } from '../config.js';

export class RegisterPage {
  constructor() {
    this.authService = new AuthService();
  }

  render() {
    const container = document.createElement('div');
    container.innerHTML = `
      <div class="form-container">
        <h2 class="form-title">${APP_NAME}</h2>
        <h3 class="form-subtitle">Create a new account</h3>
        
        <div id="error-message" class="error-message" style="display: none; color: red; margin-bottom: 15px;"></div>
        
        <form id="register-form">
          <div class="form-group">
            <label for="name" class="form-label">Full Name</label>
            <input type="text" id="name" class="form-control" placeholder="Enter your full name" required>
          </div>
          
          <div class="form-group">
            <label for="email" class="form-label">Email</label>
            <input type="email" id="email" class="form-control" placeholder="Enter your email" required>
          </div>
          
          <div class="form-group">
            <label for="password" class="form-label">Password</label>
            <input type="password" id="password" class="form-control" placeholder="Enter your password" required minlength="6">
          </div>
          
          <div class="form-group">
            <label for="confirmPassword" class="form-label">Confirm Password</label>
            <input type="password" id="confirmPassword" class="form-control" placeholder="Confirm your password" required minlength="6">
          </div>
          
          <div class="form-group">
            <label for="position" class="form-label">Position</label>
            <input type="text" id="position" class="form-control" placeholder="Enter your position" required>
          </div>
          
          <div class="form-group">
            <label for="phone" class="form-label">Phone Number</label>
            <input type="tel" id="phone" class="form-control" placeholder="Enter your phone number">
          </div>
          
          <button type="submit" class="btn btn-primary btn-block">Register</button>
        </form>
        
        <div style="text-align: center; margin-top: 20px;">
          <p>Already have an account? <a href="#/login">Login</a></p>
        </div>
      </div>
    `;

    return container;
  }

  afterRender() {
    const registerForm = document.getElementById('register-form');
    const errorMessage = document.getElementById('error-message');

    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const confirmPassword = document.getElementById('confirmPassword').value;
      const position = document.getElementById('position').value;
      const phone = document.getElementById('phone').value;
      
      // Validate passwords match
      if (password !== confirmPassword) {
        errorMessage.textContent = 'Passwords do not match';
        errorMessage.style.display = 'block';
        return;
      }
      
      try {
        errorMessage.style.display = 'none';
        
        const userData = {
          name,
          email,
          password,
          position,
          phone,
          role: 'employee' // Default role for new registrations
        };
        
        await this.authService.register(userData);
        window.location.hash = '#/dashboard';
      } catch (error) {
        errorMessage.textContent = error.message || 'Registration failed. Please try again.';
        errorMessage.style.display = 'block';
      }
    });
  }
}
