import { AuthService } from '../services/authService.js';
import { API_URL, APP_NAME } from '../config.js';

export class TaskFormPage {
  constructor() {
    this.authService = new AuthService();
    this.user = this.authService.getUser();
    this.taskId = null;
    this.isEditMode = false;
    this.task = {
      title: '',
      description: '',
      project: '',
      assignedTo: '',
      dueDate: '',
      priority: 'Medium',
      status: 'To Do',
      comments: []
    };
    this.projects = [];
    this.employees = [];
    
    // Check if we're in edit mode
    const hash = window.location.hash;
    if (hash.includes('/tasks/edit/')) {
      this.isEditMode = true;
      this.taskId = hash.split('/tasks/edit/')[1];
    }
  }

  async fetchData() {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch projects
      const projectsResponse = await fetch(`${API_URL}/api/projects`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      this.projects = await projectsResponse.json();
      
      // Fetch employees
      const employeesResponse = await fetch(`${API_URL}/api/users`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      this.employees = await employeesResponse.json();
      
      // Fetch task if in edit mode
      if (this.isEditMode) {
        const taskResponse = await fetch(`${API_URL}/api/tasks/${this.taskId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        this.task = await taskResponse.json();
      }
      
      this.renderFormOptions();
      
      if (this.isEditMode) {
        this.fillForm();
        this.renderComments();
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  
  renderFormOptions() {
    // Render project options
    const projectSelect = document.getElementById('project');
    projectSelect.innerHTML = '<option value="">Select Project</option>';
    
    this.projects.forEach(project => {
      const option = document.createElement('option');
      option.value = project._id;
      option.textContent = project.name;
      projectSelect.appendChild(option);
    });
    
    // Render employee options
    const assignedToSelect = document.getElementById('assignedTo');
    assignedToSelect.innerHTML = '<option value="">Select Employee</option>';
    
    this.employees.forEach(employee => {
      const option = document.createElement('option');
      option.value = employee._id;
      option.textContent = `${employee.name} (${employee.position})`;
      assignedToSelect.appendChild(option);
    });
  }
  
  fillForm() {
    document.getElementById('title').value = this.task.title || '';
    document.getElementById('description').value = this.task.description || '';
    
    // Format date for input field
    if (this.task.dueDate) {
      const dueDate = new Date(this.task.dueDate);
      document.getElementById('dueDate').value = dueDate.toISOString().split('T')[0];
    }
    
    // Set project
    if (this.task.project) {
      const projectId = typeof this.task.project === 'object' ? this.task.project._id : this.task.project;
      document.getElementById('project').value = projectId;
    }
    
    // Set assigned to
    if (this.task.assignedTo) {
      const assignedToId = typeof this.task.assignedTo === 'object' ? this.task.assignedTo._id : this.task.assignedTo;
      document.getElementById('assignedTo').value = assignedToId;
    }
    
    // Set priority
    const prioritySelect = document.getElementById('priority');
    for (let i = 0; i < prioritySelect.options.length; i++) {
      if (prioritySelect.options[i].value === this.task.priority) {
        prioritySelect.selectedIndex = i;
        break;
      }
    }
    
    // Set status
    const statusSelect = document.getElementById('status');
    for (let i = 0; i < statusSelect.options.length; i++) {
      if (statusSelect.options[i].value === this.task.status) {
        statusSelect.selectedIndex = i;
        break;
      }
    }
  }
  
  renderComments() {
    const commentsContainer = document.getElementById('comments-container');
    
    if (!this.task.comments || this.task.comments.length === 0) {
      commentsContainer.innerHTML = '<p>No comments yet.</p>';
      return;
    }
    
    commentsContainer.innerHTML = this.task.comments.map(comment => `
      <div class="comment">
        <div class="comment-header">
          <strong>${comment.user.name}</strong>
          <span>${new Date(comment.date).toLocaleString()}</span>
        </div>
        <div class="comment-body">
          ${comment.text}
        </div>
      </div>
    `).join('');
  }

  render() {
    const container = document.createElement('div');
    
    container.innerHTML = `
      <style>
        .comment {
          background-color: #f8f9fa;
          border-radius: 8px;
          padding: 15px;
          margin-bottom: 15px;
        }
        .comment-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
          font-size: 0.9rem;
          color: #6c757d;
        }
        .comment-body {
          white-space: pre-line;
        }
        .comments-section {
          margin-top: 30px;
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
          <div style="display: flex; align-items: center; margin-bottom: 20px;">
            <a href="#/tasks" class="btn" style="margin-right: 10px;">
              <i class="fas fa-arrow-left"></i>
            </a>
            <h1>${this.isEditMode ? 'Edit Task' : 'Add Task'}</h1>
          </div>
          
          <div class="form-container" style="max-width: 800px;">
            <div id="error-message" class="error-message" style="display: none; color: red; margin-bottom: 15px;"></div>
            
            <form id="task-form">
              <div class="form-group">
                <label for="title" class="form-label">Title</label>
                <input type="text" id="title" class="form-control" placeholder="Enter task title" required>
              </div>
              
              <div class="form-group">
                <label for="description" class="form-label">Description</label>
                <textarea id="description" class="form-control" placeholder="Enter task description" rows="3" required></textarea>
              </div>
              
              <div class="form-group">
                <label for="project" class="form-label">Project</label>
                <select id="project" class="form-select" required>
                  <option value="">Select Project</option>
                  <!-- Options will be populated dynamically -->
                </select>
              </div>
              
              <div class="form-group">
                <label for="assignedTo" class="form-label">Assigned To</label>
                <select id="assignedTo" class="form-select" required>
                  <option value="">Select Employee</option>
                  <!-- Options will be populated dynamically -->
                </select>
              </div>
              
              <div class="form-group">
                <label for="dueDate" class="form-label">Due Date</label>
                <input type="date" id="dueDate" class="form-control" required>
              </div>
              
              <div class="form-row" style="display: flex; gap: 15px;">
                <div class="form-group" style="flex: 1;">
                  <label for="priority" class="form-label">Priority</label>
                  <select id="priority" class="form-select" required>
                    <option value="Low">Low</option>
                    <option value="Medium" selected>Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
                
                <div class="form-group" style="flex: 1;">
                  <label for="status" class="form-label">Status</label>
                  <select id="status" class="form-select" required>
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Review">Review</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>
              
              <button type="submit" class="btn btn-primary">
                ${this.isEditMode ? 'Update Task' : 'Add Task'}
              </button>
            </form>
            
            ${this.isEditMode ? `
            <div class="comments-section">
              <h3>Comments</h3>
              <div id="comments-container">
                <p>Loading comments...</p>
              </div>
              
              <form id="comment-form" style="margin-top: 20px;">
                <div class="form-group">
                  <label for="comment" class="form-label">Add Comment</label>
                  <textarea id="comment" class="form-control" placeholder="Write your comment here..." rows="3" required></textarea>
                </div>
                <button type="submit" class="btn btn-primary">Add Comment</button>
              </form>
            </div>
            ` : ''}
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
    
    // Handle task form submission
    const taskForm = document.getElementById('task-form');
    const errorMessage = document.getElementById('error-message');
    
    taskForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const taskData = {
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        project: document.getElementById('project').value,
        assignedTo: document.getElementById('assignedTo').value,
        dueDate: document.getElementById('dueDate').value,
        priority: document.getElementById('priority').value,
        status: document.getElementById('status').value
      };
      
      try {
        errorMessage.style.display = 'none';
        const token = localStorage.getItem('token');
        
        let url = `${API_URL}/api/tasks`;
        let method = 'POST';
        
        if (this.isEditMode) {
          url = `${API_URL}/api/tasks/${this.taskId}`;
          method = 'PUT';
        }
        
        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(taskData)
        });
        
        if (response.ok) {
          window.location.hash = '#/tasks';
        } else {
          const data = await response.json();
          throw new Error(data.message || 'Failed to save task');
        }
      } catch (error) {
        errorMessage.textContent = error.message || 'An error occurred. Please try again.';
        errorMessage.style.display = 'block';
      }
    });
    
    // Handle comment form submission if in edit mode
    if (this.isEditMode) {
      const commentForm = document.getElementById('comment-form');
      
      commentForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const commentText = document.getElementById('comment').value;
        
        try {
          const token = localStorage.getItem('token');
          
          const response = await fetch(`${API_URL}/api/tasks/${this.taskId}/comments`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ text: commentText })
          });
          
          if (response.ok) {
            const updatedTask = await response.json();
            this.task = updatedTask;
            this.renderComments();
            document.getElementById('comment').value = '';
          } else {
            const data = await response.json();
            throw new Error(data.message || 'Failed to add comment');
          }
        } catch (error) {
          alert(error.message || 'An error occurred. Please try again.');
        }
      });
    }
  }
}
