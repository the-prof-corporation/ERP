import { AuthService } from '../services/authService.js';
import { API_URL, APP_NAME } from '../config.js';

export class ProjectsPage {
  constructor() {
    this.authService = new AuthService();
    this.user = this.authService.getUser();
    this.projects = [];
  }

  async fetchProjects() {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/api/projects`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      this.projects = await response.json();
      this.renderProjects();
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  }
  
  renderProjects() {
    const projectsTableBody = document.getElementById('projects-table-body');
    
    if (this.projects.length === 0) {
      projectsTableBody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align: center;">No projects found</td>
        </tr>
      `;
      return;
    }
    
    projectsTableBody.innerHTML = this.projects.map(project => `
      <tr>
        <td>${project.name}</td>
        <td>${project.customer ? project.customer.name : '-'}</td>
        <td>${new Date(project.startDate).toLocaleDateString()} - ${new Date(project.endDate).toLocaleDateString()}</td>
        <td>
          <span class="status-badge status-${project.status.toLowerCase().replace(/\\s+/g, '-')}">
            ${project.status}
          </span>
        </td>
        <td>${project.manager ? project.manager.name : '-'}</td>
        <td class="table-actions">
          <button class="edit-btn" data-id="${project._id}"><i class="fas fa-edit"></i></button>
          <button class="delete-btn" data-id="${project._id}"><i class="fas fa-trash"></i></button>
        </td>
      </tr>
    `).join('');
    
    // Add event listeners to edit and delete buttons
    const editButtons = document.querySelectorAll('.edit-btn');
    const deleteButtons = document.querySelectorAll('.delete-btn');
    
    editButtons.forEach(button => {
      button.addEventListener('click', () => {
        const projectId = button.getAttribute('data-id');
        window.location.hash = `#/projects/edit/${projectId}`;
      });
    });
    
    deleteButtons.forEach(button => {
      button.addEventListener('click', async () => {
        const projectId = button.getAttribute('data-id');
        
        if (confirm('Are you sure you want to delete this project?')) {
          try {
            const token = localStorage.getItem('token');
            
            const response = await fetch(`${API_URL}/api/projects/${projectId}`, {
              method: 'DELETE',
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            
            if (response.ok) {
              this.fetchProjects();
            } else {
              alert('Failed to delete project');
            }
          } catch (error) {
            console.error('Error deleting project:', error);
            alert('Failed to delete project');
          }
        }
      });
    });
  }

  render() {
    const container = document.createElement('div');
    
    container.innerHTML = `
      <style>
        .status-badge {
          display: inline-block;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.8rem;
          font-weight: 500;
        }
        .status-not-started {
          background-color: #f8f9fa;
          color: #495057;
        }
        .status-in-progress {
          background-color: #cce5ff;
          color: #004085;
        }
        .status-on-hold {
          background-color: #fff3cd;
          color: #856404;
        }
        .status-completed {
          background-color: #d4edda;
          color: #155724;
        }
        .status-cancelled {
          background-color: #f8d7da;
          color: #721c24;
        }
      </style>
      
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
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h1>Projects</h1>
            <a href="#/projects/add" class="btn btn-primary">
              <i class="fas fa-plus"></i> Add Project
            </a>
          </div>
          
          <div class="table-container">
            <table class="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Customer</th>
                  <th>Timeline</th>
                  <th>Status</th>
                  <th>Manager</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody id="projects-table-body">
                <tr>
                  <td colspan="6" style="text-align: center;">Loading projects...</td>
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
    
    // Fetch projects
    this.fetchProjects();
  }
}
