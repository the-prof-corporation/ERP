import { AuthService } from '../services/authService.js';
import { API_URL, APP_NAME } from '../config.js';

export class ProjectFormPage {
  constructor() {
    this.authService = new AuthService();
    this.user = this.authService.getUser();
    this.projectId = null;
    this.isEditMode = false;
    this.project = {
      name: '',
      description: '',
      customer: '',
      startDate: '',
      endDate: '',
      status: 'Not Started',
      budget: '',
      team: [],
      manager: ''
    };
    this.customers = [];
    this.employees = [];
    
    // Check if we're in edit mode
    const hash = window.location.hash;
    if (hash.includes('/projects/edit/')) {
      this.isEditMode = true;
      this.projectId = hash.split('/projects/edit/')[1];
    }
  }

  async fetchData() {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch customers
      const customersResponse = await fetch(`${API_URL}/api/customers`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      this.customers = await customersResponse.json();
      
      // Fetch employees
      const employeesResponse = await fetch(`${API_URL}/api/users`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      this.employees = await employeesResponse.json();
      
      // Fetch project if in edit mode
      if (this.isEditMode) {
        const projectResponse = await fetch(`${API_URL}/api/projects/${this.projectId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        this.project = await projectResponse.json();
      }
      
      this.renderFormOptions();
      
      if (this.isEditMode) {
        this.fillForm();
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  
  renderFormOptions() {
    // Render customer options
    const customerSelect = document.getElementById('customer');
    customerSelect.innerHTML = '<option value="">Select Customer</option>';
    
    this.customers.forEach(customer => {
      const option = document.createElement('option');
      option.value = customer._id;
      option.textContent = `${customer.name} (${customer.company})`;
      customerSelect.appendChild(option);
    });
    
    // Render manager options
    const managerSelect = document.getElementById('manager');
    managerSelect.innerHTML = '<option value="">Select Manager</option>';
    
    this.employees.forEach(employee => {
      const option = document.createElement('option');
      option.value = employee._id;
      option.textContent = `${employee.name} (${employee.position})`;
      managerSelect.appendChild(option);
    });
    
    // Render team options
    const teamSelect = document.getElementById('team');
    teamSelect.innerHTML = '';
    
    this.employees.forEach(employee => {
      const option = document.createElement('option');
      option.value = employee._id;
      option.textContent = `${employee.name} (${employee.position})`;
      teamSelect.appendChild(option);
    });
  }
  
  fillForm() {
    document.getElementById('name').value = this.project.name || '';
    document.getElementById('description').value = this.project.description || '';
    
    // Format dates for input fields
    if (this.project.startDate) {
      const startDate = new Date(this.project.startDate);
      document.getElementById('startDate').value = startDate.toISOString().split('T')[0];
    }
    
    if (this.project.endDate) {
      const endDate = new Date(this.project.endDate);
      document.getElementById('endDate').value = endDate.toISOString().split('T')[0];
    }
    
    document.getElementById('budget').value = this.project.budget || '';
    
    // Set customer
    if (this.project.customer) {
      const customerId = typeof this.project.customer === 'object' ? this.project.customer._id : this.project.customer;
      document.getElementById('customer').value = customerId;
    }
    
    // Set manager
    if (this.project.manager) {
      const managerId = typeof this.project.manager === 'object' ? this.project.manager._id : this.project.manager;
      document.getElementById('manager').value = managerId;
    }
    
    // Set status
    const statusSelect = document.getElementById('status');
    for (let i = 0; i < statusSelect.options.length; i++) {
      if (statusSelect.options[i].value === this.project.status) {
        statusSelect.selectedIndex = i;
        break;
      }
    }
    
    // Set team members
    const teamSelect = document.getElementById('team');
    if (this.project.team && this.project.team.length > 0) {
      const teamIds = this.project.team.map(member => typeof member === 'object' ? member._id : member);
      
      for (let i = 0; i < teamSelect.options.length; i++) {
        if (teamIds.includes(teamSelect.options[i].value)) {
          teamSelect.options[i].selected = true;
        }
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
            <li><a href="#/employees">Employees</a></li>
            <li><a href="#/projects" class="active">Projects</a></li>
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
            <a href="#/projects" class="btn" style="margin-right: 10px;">
              <i class="fas fa-arrow-left"></i>
            </a>
            <h1>${this.isEditMode ? 'Edit Project' : 'Add Project'}</h1>
          </div>
          
          <div class="form-container" style="max-width: 800px;">
            <div id="error-message" class="error-message" style="display: none; color: red; margin-bottom: 15px;"></div>
            
            <form id="project-form">
              <div class="form-group">
                <label for="name" class="form-label">Project Name</label>
                <input type="text" id="name" class="form-control" placeholder="Enter project name" required>
              </div>
              
              <div class="form-group">
                <label for="description" class="form-label">Description</label>
                <textarea id="description" class="form-control" placeholder="Enter project description" rows="3" required></textarea>
              </div>
              
              <div class="form-group">
                <label for="customer" class="form-label">Customer</label>
                <select id="customer" class="form-select" required>
                  <option value="">Select Customer</option>
                  <!-- Options will be populated dynamically -->
                </select>
              </div>
              
              <div class="form-row" style="display: flex; gap: 15px;">
                <div class="form-group" style="flex: 1;">
                  <label for="startDate" class="form-label">Start Date</label>
                  <input type="date" id="startDate" class="form-control" required>
                </div>
                
                <div class="form-group" style="flex: 1;">
                  <label for="endDate" class="form-label">End Date</label>
                  <input type="date" id="endDate" class="form-control" required>
                </div>
              </div>
              
              <div class="form-group">
                <label for="status" class="form-label">Status</label>
                <select id="status" class="form-select" required>
                  <option value="Not Started">Not Started</option>
                  <option value="In Progress">In Progress</option>
                  <option value="On Hold">On Hold</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              
              <div class="form-group">
                <label for="budget" class="form-label">Budget</label>
                <input type="number" id="budget" class="form-control" placeholder="Enter project budget">
              </div>
              
              <div class="form-group">
                <label for="manager" class="form-label">Project Manager</label>
                <select id="manager" class="form-select" required>
                  <option value="">Select Manager</option>
                  <!-- Options will be populated dynamically -->
                </select>
              </div>
              
              <div class="form-group">
                <label for="team" class="form-label">Team Members</label>
                <select id="team" class="form-select" multiple size="5">
                  <!-- Options will be populated dynamically -->
                </select>
                <small class="form-text text-muted">Hold Ctrl (or Cmd) to select multiple team members</small>
              </div>
              
              <button type="submit" class="btn btn-primary">
                ${this.isEditMode ? 'Update Project' : 'Add Project'}
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
    
    // Fetch data
    this.fetchData();
    
    // Handle form submission
    const projectForm = document.getElementById('project-form');
    const errorMessage = document.getElementById('error-message');
    
    projectForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      // Get selected team members
      const teamSelect = document.getElementById('team');
      const selectedTeam = Array.from(teamSelect.selectedOptions).map(option => option.value);
      
      const projectData = {
        name: document.getElementById('name').value,
        description: document.getElementById('description').value,
        customer: document.getElementById('customer').value,
        startDate: document.getElementById('startDate').value,
        endDate: document.getElementById('endDate').value,
        status: document.getElementById('status').value,
        budget: document.getElementById('budget').value || 0,
        manager: document.getElementById('manager').value,
        team: selectedTeam
      };
      
      try {
        errorMessage.style.display = 'none';
        const token = localStorage.getItem('token');
        
        let url = `${API_URL}/api/projects`;
        let method = 'POST';
        
        if (this.isEditMode) {
          url = `${API_URL}/api/projects/${this.projectId}`;
          method = 'PUT';
        }
        
        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(projectData)
        });
        
        if (response.ok) {
          window.location.hash = '#/projects';
        } else {
          const data = await response.json();
          throw new Error(data.message || 'Failed to save project');
        }
      } catch (error) {
        errorMessage.textContent = error.message || 'An error occurred. Please try again.';
        errorMessage.style.display = 'block';
      }
    });
  }
}
