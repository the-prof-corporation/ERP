import { AuthService } from '../services/authService.js';
import { API_URL, APP_NAME } from '../config.js';

export class CustomerFormPage {
  constructor() {
    this.authService = new AuthService();
    this.user = this.authService.getUser();
    this.customerId = null;
    this.isEditMode = false;
    this.customer = {
      name: '',
      email: '',
      phone: '',
      company: '',
      address: '',
      notes: '',
      contactPerson: ''
    };
    
    // Check if we're in edit mode
    const hash = window.location.hash;
    if (hash.includes('/customers/edit/')) {
      this.isEditMode = true;
      this.customerId = hash.split('/customers/edit/')[1];
    }
  }

  async fetchCustomer() {
    if (!this.isEditMode) return;
    
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/api/customers/${this.customerId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      this.customer = await response.json();
      this.fillForm();
    } catch (error) {
      console.error('Error fetching customer:', error);
    }
  }
  
  fillForm() {
    document.getElementById('name').value = this.customer.name || '';
    document.getElementById('email').value = this.customer.email || '';
    document.getElementById('phone').value = this.customer.phone || '';
    document.getElementById('company').value = this.customer.company || '';
    document.getElementById('address').value = this.customer.address || '';
    document.getElementById('notes').value = this.customer.notes || '';
    document.getElementById('contactPerson').value = this.customer.contactPerson || '';
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
          <div style="display: flex; align-items: center; margin-bottom: 20px;">
            <a href="#/customers" class="btn" style="margin-right: 10px;">
              <i class="fas fa-arrow-left"></i>
            </a>
            <h1>${this.isEditMode ? 'Edit Customer' : 'Add Customer'}</h1>
          </div>
          
          <div class="form-container" style="max-width: 800px;">
            <div id="error-message" class="error-message" style="display: none; color: red; margin-bottom: 15px;"></div>
            
            <form id="customer-form">
              <div class="form-group">
                <label for="name" class="form-label">Name</label>
                <input type="text" id="name" class="form-control" placeholder="Enter customer name" required>
              </div>
              
              <div class="form-group">
                <label for="company" class="form-label">Company</label>
                <input type="text" id="company" class="form-control" placeholder="Enter company name" required>
              </div>
              
              <div class="form-group">
                <label for="email" class="form-label">Email</label>
                <input type="email" id="email" class="form-control" placeholder="Enter email" required>
              </div>
              
              <div class="form-group">
                <label for="phone" class="form-label">Phone</label>
                <input type="tel" id="phone" class="form-control" placeholder="Enter phone number" required>
              </div>
              
              <div class="form-group">
                <label for="contactPerson" class="form-label">Contact Person</label>
                <input type="text" id="contactPerson" class="form-control" placeholder="Enter contact person name">
              </div>
              
              <div class="form-group">
                <label for="address" class="form-label">Address</label>
                <textarea id="address" class="form-control" placeholder="Enter address" rows="3"></textarea>
              </div>
              
              <div class="form-group">
                <label for="notes" class="form-label">Notes</label>
                <textarea id="notes" class="form-control" placeholder="Enter notes" rows="3"></textarea>
              </div>
              
              <button type="submit" class="btn btn-primary">
                ${this.isEditMode ? 'Update Customer' : 'Add Customer'}
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
    
    // Fetch customer if in edit mode
    if (this.isEditMode) {
      this.fetchCustomer();
    }
    
    // Handle form submission
    const customerForm = document.getElementById('customer-form');
    const errorMessage = document.getElementById('error-message');
    
    customerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const customerData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        company: document.getElementById('company').value,
        address: document.getElementById('address').value,
        notes: document.getElementById('notes').value,
        contactPerson: document.getElementById('contactPerson').value
      };
      
      try {
        errorMessage.style.display = 'none';
        const token = localStorage.getItem('token');
        
        let url = `${API_URL}/api/customers`;
        let method = 'POST';
        
        if (this.isEditMode) {
          url = `${API_URL}/api/customers/${this.customerId}`;
          method = 'PUT';
        }
        
        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(customerData)
        });
        
        if (response.ok) {
          window.location.hash = '#/customers';
        } else {
          const data = await response.json();
          throw new Error(data.message || 'Failed to save customer');
        }
      } catch (error) {
        errorMessage.textContent = error.message || 'An error occurred. Please try again.';
        errorMessage.style.display = 'block';
      }
    });
  }
}
