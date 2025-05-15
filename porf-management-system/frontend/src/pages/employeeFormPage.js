import { AuthService } from '../services/authService.js';
import { API_URL, APP_NAME } from '../config.js';

export class EmployeeFormPage {
  constructor() {
    this.authService = new AuthService();
    this.user = this.authService.getUser();
    this.employeeId = null;
    this.isEditMode = false;
    this.employee = {
      name: '',
      email: '',
      position: '',
      phone: '',
      role: 'employee'
    };
    
    // Check if we're in edit mode
    const hash = window.location.hash;
    if (hash.includes('/employees/edit/')) {
      this.isEditMode = true;
      this.employeeId = hash.split('/employees/edit/')[1];
    }
  }

  async fetchEmployee() {
    if (!this.isEditMode) return;
    
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/api/users/${this.employeeId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      this.employee = await response.json();
      this.fillForm();
    } catch (error) {
      console.error('Error fetching employee:', error);
    }
  }
  
  fillForm() {
    document.getElementById('name').value = this.employee.name || '';
    document.getElementById('email').value = this.employee.email || '';
    document.getElementById('position').value = this.employee.position || '';
    document.getElementById('phone').value = this.employee.phone || '';
    
    const roleSelect = document.getElementById('role');
    for (let i = 0; i < roleSelect.options.length; i++) {
      if (roleSelect.options[i].value === this.employee.role) {
        roleSelect.selectedIndex = i;
        break;
      }
    }
  }

  render() {
    const container = document.createElement('div');
    
    container.innerHTML = `
      <header class="header">
        <div class="container header-content">
          <div class="logo">${APP_NAME}</div>
          <ul class="nav-menu">
            <li><a href="#/dashboard">Dashboard</a></li>
            <li><a href="#/customers">Customers</a></li>
            <li><a href="#/employees" class="active">Employees</a></li>
            <li><a href="#/projects">Projects</a></li>
            <li><a href="#/tasks">Tasks</a></li>
          </ul>
          <div class="user-menu">
            <span>${this.user ? this.user.name : 'User'} <i class="fas fa-chevron-down"></i></span>
            <div class="user-menu-dropdown">
              <a href="#/profile"><i class="fas fa-user"></i> Profile</a>
              <a href="#" id="logout-btn"><i class="fas fa-sign-out-alt"></i> Logout</a>
            </div>
          </div>
        </div>
      </header>
      
      <main class="main-content">
        <div class="container">
          <div style="display: flex; align-items: center; margin-bottom: 20px;">
            <a href="#/employees" class="btn" style="margin-right: 10px;">
              <i class="fas fa-arrow-left"></i>
            </a>
            <h1>${this.isEditMode ? 'Edit Employee' : 'Add Employee'}</h1>
          </div>
          
          <div class="form-container" style="max-width: 800px;">
            <div id="error-message" class="error-message" style="display: none; color: red; margin-bottom: 15px;"></div>
            
            <form id="employee-form">
              <div class="form-group">
                <label for="name" class="form-label">Name</label>
                <input type="text" id="name" class="form-control" placeholder="Enter employee name" required>
              </div>
              
              <div class="form-group">
                <label for="email" class="form-label">Email</label>
                <input type="email" id="email" class="form-control" placeholder="Enter email" required>
              </div>
              
              ${!this.isEditMode ? `
              <div class="form-group">
                <label for="password" class="form-label">Password</label>
                <input type="password" id="password" class="form-control" placeholder="Enter password" required minlength="6">
              </div>
              ` : ''}
              
              <div class="form-group">
                <label for="position" class="form-label">Position</label>
                <input type="text" id="position" class="form-control" placeholder="Enter position" required>
              </div>
              
              <div class="form-group">
                <label for="phone" class="form-label">Phone</label>
                <input type="tel" id="phone" class="form-control" placeholder="Enter phone number">
              </div>
              
              <div class="form-group">
                <label for="role" class="form-label">Role</label>
                <select id="role" class="form-select">
                  <option value="employee">Employee</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              
              <button type="submit" class="btn btn-primary">
                ${this.isEditMode ? 'Update Employee' : 'Add Employee'}
              </button>
            </form>
          </div>
        </div>
      </main>
    `;
    
    return container;
  }

  afterRender() {
    // Toggle user menu dropdown
    const userMenu = document.querySelector('.user-menu');
    const userMenuDropdown = document.querySelector('.user-menu-dropdown');
    
    userMenu.addEventListener('click', () => {
      userMenuDropdown.classList.toggle('active');
    });
    
    // Handle logout
    const logoutBtn = document.getElementById('logout-btn');
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      this.authService.logout();
    });
    
    // Fetch employee if in edit mode
    if (this.isEditMode) {
      this.fetchEmployee();
    }
    
    // Handle form submission
    const employeeForm = document.getElementById('employee-form');
    const errorMessage = document.getElementById('error-message');
    
    employeeForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const employeeData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        position: document.getElementById('position').value,
        phone: document.getElementById('phone').value,
        role: document.getElementById('role').value
      };
      
      if (!this.isEditMode) {
        employeeData.password = document.getElementById('password').value;
      }
      
      try {
        errorMessage.style.display = 'none';
        const token = localStorage.getItem('token');
        
        let url = `${API_URL}/api/users`;
        let method = 'POST';
        
        if (this.isEditMode) {
          url = `${API_URL}/api/users/${this.employeeId}`;
          method = 'PUT';
        }
        
        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(employeeData)
        });
        
        if (response.ok) {
          window.location.hash = '#/employees';
        } else {
          const data = await response.json();
          throw new Error(data.message || 'Failed to save employee');
        }
      } catch (error) {
        errorMessage.textContent = error.message || 'An error occurred. Please try again.';
        errorMessage.style.display = 'block';
      }
    });
  }
}
