import { AuthService } from '../services/authService.js';
import { API_URL, APP_NAME } from '../config.js';

export class EmployeesPage {
  constructor() {
    this.authService = new AuthService();
    this.user = this.authService.getUser();
    this.employees = [];
  }

  async fetchEmployees() {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/api/users`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      this.employees = await response.json();
      this.renderEmployees();
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  }
  
  renderEmployees() {
    const employeesTableBody = document.getElementById('employees-table-body');
    
    if (this.employees.length === 0) {
      employeesTableBody.innerHTML = `
        <tr>
          <td colspan="5" style="text-align: center;">No employees found</td>
        </tr>
      `;
      return;
    }
    
    employeesTableBody.innerHTML = this.employees.map(employee => `
      <tr>
        <td>${employee.name}</td>
        <td>${employee.email}</td>
        <td>${employee.position}</td>
        <td>${employee.role}</td>
        <td class="table-actions">
          <button class="edit-btn" data-id="${employee._id}"><i class="fas fa-edit"></i></button>
          <button class="delete-btn" data-id="${employee._id}"><i class="fas fa-trash"></i></button>
        </td>
      </tr>
    `).join('');
    
    // Add event listeners to edit and delete buttons
    const editButtons = document.querySelectorAll('.edit-btn');
    const deleteButtons = document.querySelectorAll('.delete-btn');
    
    editButtons.forEach(button => {
      button.addEventListener('click', () => {
        const employeeId = button.getAttribute('data-id');
        window.location.hash = `#/employees/edit/${employeeId}`;
      });
    });
    
    deleteButtons.forEach(button => {
      button.addEventListener('click', async () => {
        const employeeId = button.getAttribute('data-id');
        
        // Prevent deleting yourself
        if (employeeId === this.user._id) {
          alert('You cannot delete your own account');
          return;
        }
        
        if (confirm('Are you sure you want to delete this employee?')) {
          try {
            const token = localStorage.getItem('token');
            
            const response = await fetch(`${API_URL}/api/users/${employeeId}`, {
              method: 'DELETE',
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            
            if (response.ok) {
              this.fetchEmployees();
            } else {
              alert('Failed to delete employee');
            }
          } catch (error) {
            console.error('Error deleting employee:', error);
            alert('Failed to delete employee');
          }
        }
      });
    });
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
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h1>Employees</h1>
            <a href="#/employees/add" class="btn btn-primary">
              <i class="fas fa-plus"></i> Add Employee
            </a>
          </div>
          
          <div class="table-container">
            <table class="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Position</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody id="employees-table-body">
                <tr>
                  <td colspan="5" style="text-align: center;">Loading employees...</td>
                </tr>
              </tbody>
            </table>
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
    
    // Fetch employees
    this.fetchEmployees();
  }
}
