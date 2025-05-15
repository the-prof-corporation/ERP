import { AuthService } from '../services/authService.js';
import { API_URL, APP_NAME } from '../config.js';

export class DashboardPage {
  constructor() {
    this.authService = new AuthService();
    this.user = this.authService.getUser();
    this.stats = {
      customers: 0,
      employees: 0,
      projects: 0,
      tasks: 0
    };
  }

  async fetchStats() {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch customers count
      const customersResponse = await fetch(`${API_URL}/api/customers`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const customers = await customersResponse.json();
      this.stats.customers = customers.length;
      
      // Fetch employees count
      const employeesResponse = await fetch(`${API_URL}/api/users`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const employees = await employeesResponse.json();
      this.stats.employees = employees.length;
      
      // Fetch projects count
      const projectsResponse = await fetch(`${API_URL}/api/projects`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const projects = await projectsResponse.json();
      this.stats.projects = projects.length;
      
      // Fetch tasks count
      const tasksResponse = await fetch(`${API_URL}/api/tasks`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const tasks = await tasksResponse.json();
      this.stats.tasks = tasks.length;
      
      // Update the dashboard cards
      this.updateDashboardCards();
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  }
  
  updateDashboardCards() {
    document.getElementById('customers-count').textContent = this.stats.customers;
    document.getElementById('employees-count').textContent = this.stats.employees;
    document.getElementById('projects-count').textContent = this.stats.projects;
    document.getElementById('tasks-count').textContent = this.stats.tasks;
  }

  render() {
    const container = document.createElement('div');
    
    container.innerHTML = `
      <header class="header">
        <div class="container header-content">
          <div class="logo">${APP_NAME}</div>
          <ul class="nav-menu">
            <li><a href="#/dashboard" class="active">Dashboard</a></li>
            <li><a href="#/customers">Customers</a></li>
            <li><a href="#/employees">Employees</a></li>
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
          <h1>Dashboard</h1>
          <p>Welcome back, ${this.user ? this.user.name : 'User'}!</p>
          
          <div class="dashboard">
            <div class="dashboard-card">
              <div class="dashboard-card-header">
                <h3 class="dashboard-card-title">Customers</h3>
                <i class="fas fa-users dashboard-card-icon"></i>
              </div>
              <div class="dashboard-card-value" id="customers-count">0</div>
              <p class="dashboard-card-description">Total customers</p>
              <a href="#/customers" class="btn btn-primary">View All</a>
            </div>
            
            <div class="dashboard-card">
              <div class="dashboard-card-header">
                <h3 class="dashboard-card-title">Employees</h3>
                <i class="fas fa-user-tie dashboard-card-icon"></i>
              </div>
              <div class="dashboard-card-value" id="employees-count">0</div>
              <p class="dashboard-card-description">Total employees</p>
              <a href="#/employees" class="btn btn-primary">View All</a>
            </div>
            
            <div class="dashboard-card">
              <div class="dashboard-card-header">
                <h3 class="dashboard-card-title">Projects</h3>
                <i class="fas fa-project-diagram dashboard-card-icon"></i>
              </div>
              <div class="dashboard-card-value" id="projects-count">0</div>
              <p class="dashboard-card-description">Total projects</p>
              <a href="#/projects" class="btn btn-primary">View All</a>
            </div>
            
            <div class="dashboard-card">
              <div class="dashboard-card-header">
                <h3 class="dashboard-card-title">Tasks</h3>
                <i class="fas fa-tasks dashboard-card-icon"></i>
              </div>
              <div class="dashboard-card-value" id="tasks-count">0</div>
              <p class="dashboard-card-description">Total tasks</p>
              <a href="#/tasks" class="btn btn-primary">View All</a>
            </div>
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
    
    // Fetch dashboard stats
    this.fetchStats();
  }
}
