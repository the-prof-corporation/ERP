import { AuthService } from '../services/authService.js';
import { API_URL, APP_NAME } from '../config.js';

export class TasksPage {
  constructor() {
    this.authService = new AuthService();
    this.user = this.authService.getUser();
    this.tasks = [];
    this.filter = {
      project: '',
      status: '',
      assignedTo: ''
    };
    this.projects = [];
    this.employees = [];
  }

  async fetchData() {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch tasks
      const tasksResponse = await fetch(`${API_URL}/api/tasks`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      this.tasks = await tasksResponse.json();
      
      // Fetch projects for filter
      const projectsResponse = await fetch(`${API_URL}/api/projects`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      this.projects = await projectsResponse.json();
      
      // Fetch employees for filter
      const employeesResponse = await fetch(`${API_URL}/api/users`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      this.employees = await employeesResponse.json();
      
      this.renderFilters();
      this.renderTasks();
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  
  renderFilters() {
    // Project filter
    const projectFilter = document.getElementById('project-filter');
    projectFilter.innerHTML = '<option value="">All Projects</option>';
    
    this.projects.forEach(project => {
      const option = document.createElement('option');
      option.value = project._id;
      option.textContent = project.name;
      projectFilter.appendChild(option);
    });
    
    // Employee filter
    const employeeFilter = document.getElementById('employee-filter');
    employeeFilter.innerHTML = '<option value="">All Employees</option>';
    
    this.employees.forEach(employee => {
      const option = document.createElement('option');
      option.value = employee._id;
      option.textContent = employee.name;
      employeeFilter.appendChild(option);
    });
    
    // Add event listeners to filters
    projectFilter.addEventListener('change', () => {
      this.filter.project = projectFilter.value;
      this.renderTasks();
    });
    
    document.getElementById('status-filter').addEventListener('change', (e) => {
      this.filter.status = e.target.value;
      this.renderTasks();
    });
    
    employeeFilter.addEventListener('change', () => {
      this.filter.assignedTo = employeeFilter.value;
      this.renderTasks();
    });
  }
  
  renderTasks() {
    const tasksTableBody = document.getElementById('tasks-table-body');
    
    // Filter tasks
    let filteredTasks = [...this.tasks];
    
    if (this.filter.project) {
      filteredTasks = filteredTasks.filter(task => 
        task.project && (task.project._id === this.filter.project || task.project === this.filter.project)
      );
    }
    
    if (this.filter.status) {
      filteredTasks = filteredTasks.filter(task => task.status === this.filter.status);
    }
    
    if (this.filter.assignedTo) {
      filteredTasks = filteredTasks.filter(task => 
        task.assignedTo && (task.assignedTo._id === this.filter.assignedTo || task.assignedTo === this.filter.assignedTo)
      );
    }
    
    if (filteredTasks.length === 0) {
      tasksTableBody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align: center;">No tasks found</td>
        </tr>
      `;
      return;
    }
    
    tasksTableBody.innerHTML = filteredTasks.map(task => `
      <tr>
        <td>${task.title}</td>
        <td>${task.project && task.project.name ? task.project.name : '-'}</td>
        <td>${task.assignedTo && task.assignedTo.name ? task.assignedTo.name : '-'}</td>
        <td>${new Date(task.dueDate).toLocaleDateString()}</td>
        <td>
          <span class="priority-badge priority-${task.priority.toLowerCase()}">
            ${task.priority}
          </span>
        </td>
        <td>
          <span class="status-badge status-${task.status.toLowerCase().replace(/\\s+/g, '-')}">
            ${task.status}
          </span>
        </td>
        <td class="table-actions">
          <button class="edit-btn" data-id="${task._id}"><i class="fas fa-edit"></i></button>
          <button class="delete-btn" data-id="${task._id}"><i class="fas fa-trash"></i></button>
        </td>
      </tr>
    `).join('');
    
    // Add event listeners to edit and delete buttons
    const editButtons = document.querySelectorAll('.edit-btn');
    const deleteButtons = document.querySelectorAll('.delete-btn');
    
    editButtons.forEach(button => {
      button.addEventListener('click', () => {
        const taskId = button.getAttribute('data-id');
        window.location.hash = `#/tasks/edit/${taskId}`;
      });
    });
    
    deleteButtons.forEach(button => {
      button.addEventListener('click', async () => {
        const taskId = button.getAttribute('data-id');
        
        if (confirm('Are you sure you want to delete this task?')) {
          try {
            const token = localStorage.getItem('token');
            
            const response = await fetch(`${API_URL}/api/tasks/${taskId}`, {
              method: 'DELETE',
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            
            if (response.ok) {
              this.fetchData();
            } else {
              alert('Failed to delete task');
            }
          } catch (error) {
            console.error('Error deleting task:', error);
            alert('Failed to delete task');
          }
        }
      });
    });
  }

  render() {
    const container = document.createElement('div');
    
    container.innerHTML = `
      <style>
        .priority-badge, .status-badge {
          display: inline-block;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.8rem;
          font-weight: 500;
        }
        .priority-low {
          background-color: #d1e7dd;
          color: #0f5132;
        }
        .priority-medium {
          background-color: #fff3cd;
          color: #664d03;
        }
        .priority-high {
          background-color: #f8d7da;
          color: #842029;
        }
        .priority-urgent {
          background-color: #dc3545;
          color: white;
        }
        .status-to-do {
          background-color: #f8f9fa;
          color: #495057;
        }
        .status-in-progress {
          background-color: #cce5ff;
          color: #004085;
        }
        .status-review {
          background-color: #fff3cd;
          color: #856404;
        }
        .status-completed {
          background-color: #d4edda;
          color: #155724;
        }
        .filters {
          display: flex;
          gap: 15px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }
        .filter-group {
          flex: 1;
          min-width: 200px;
        }
      </style>
      
      <header class="header">
        <div class="container header-content">
          <div class="logo">${APP_NAME}</div>
          <ul class="nav-menu">
            <li><a href="#/dashboard">Dashboard</a></li>
            <li><a href="#/customers">Customers</a></li>
            <li><a href="#/employees">Employees</a></li>
            <li><a href="#/projects">Projects</a></li>
            <li><a href="#/tasks" class="active">Tasks</a></li>
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
            <h1>Tasks</h1>
            <a href="#/tasks/add" class="btn btn-primary">
              <i class="fas fa-plus"></i> Add Task
            </a>
          </div>
          
          <div class="filters">
            <div class="filter-group">
              <label for="project-filter" class="form-label">Project</label>
              <select id="project-filter" class="form-select">
                <option value="">All Projects</option>
                <!-- Options will be populated dynamically -->
              </select>
            </div>
            
            <div class="filter-group">
              <label for="status-filter" class="form-label">Status</label>
              <select id="status-filter" class="form-select">
                <option value="">All Statuses</option>
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Review">Review</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            
            <div class="filter-group">
              <label for="employee-filter" class="form-label">Assigned To</label>
              <select id="employee-filter" class="form-select">
                <option value="">All Employees</option>
                <!-- Options will be populated dynamically -->
              </select>
            </div>
          </div>
          
          <div class="table-container">
            <table class="table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Project</th>
                  <th>Assigned To</th>
                  <th>Due Date</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody id="tasks-table-body">
                <tr>
                  <td colspan="7" style="text-align: center;">Loading tasks...</td>
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
    
    // Fetch data
    this.fetchData();
  }
}
