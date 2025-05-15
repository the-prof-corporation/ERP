import { AuthService } from '../services/authService.js';
import { API_URL, APP_NAME } from '../config.js';

export class CustomersPage {
  constructor() {
    this.authService = new AuthService();
    this.user = this.authService.getUser();
    this.customers = [];
  }

  async fetchCustomers() {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/api/customers`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      this.customers = await response.json();
      this.renderCustomers();
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  }
  
  renderCustomers() {
    const customersTableBody = document.getElementById('customers-table-body');
    
    if (this.customers.length === 0) {
      customersTableBody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align: center;">No customers found</td>
        </tr>
      `;
      return;
    }
    
    customersTableBody.innerHTML = this.customers.map(customer => `
      <tr>
        <td>${customer.name}</td>
        <td>${customer.company}</td>
        <td>${customer.email}</td>
        <td>${customer.phone}</td>
        <td>${customer.contactPerson || '-'}</td>
        <td class="table-actions">
          <button class="edit-btn" data-id="${customer._id}"><i class="fas fa-edit"></i></button>
          <button class="delete-btn" data-id="${customer._id}"><i class="fas fa-trash"></i></button>
        </td>
      </tr>
    `).join('');
    
    // Add event listeners to edit and delete buttons
    const editButtons = document.querySelectorAll('.edit-btn');
    const deleteButtons = document.querySelectorAll('.delete-btn');
    
    editButtons.forEach(button => {
      button.addEventListener('click', () => {
        const customerId = button.getAttribute('data-id');
        window.location.hash = `#/customers/edit/${customerId}`;
      });
    });
    
    deleteButtons.forEach(button => {
      button.addEventListener('click', async () => {
        const customerId = button.getAttribute('data-id');
        
        if (confirm('Are you sure you want to delete this customer?')) {
          try {
            const token = localStorage.getItem('token');
            
            const response = await fetch(`${API_URL}/api/customers/${customerId}`, {
              method: 'DELETE',
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            
            if (response.ok) {
              this.fetchCustomers();
            } else {
              alert('Failed to delete customer');
            }
          } catch (error) {
            console.error('Error deleting customer:', error);
            alert('Failed to delete customer');
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
            <li><a href="#/customers" class="active">Customers</a></li>
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
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h1>Customers</h1>
            <a href="#/customers/add" class="btn btn-primary">
              <i class="fas fa-plus"></i> Add Customer
            </a>
          </div>
          
          <div class="table-container">
            <table class="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Company</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Contact Person</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody id="customers-table-body">
                <tr>
                  <td colspan="6" style="text-align: center;">Loading customers...</td>
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
    
    // Fetch customers
    this.fetchCustomers();
  }
}
