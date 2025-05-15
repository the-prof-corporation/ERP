// Main JavaScript file for the ERP system

document.addEventListener('DOMContentLoaded', function() {
  // Logout functionality
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Clear token from localStorage
      localStorage.removeItem('token');
      
      // Redirect to login page
      window.location.href = '/login';
    });
  }
  
  // Form validation
  const forms = document.querySelectorAll('.needs-validation');
  
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }
      
      form.classList.add('was-validated');
    }, false);
  });
  
  // Dashboard data loading
  if (window.location.pathname === '/dashboard') {
    loadDashboardData();
  }
});

// Function to load dashboard data
async function loadDashboardData() {
  try {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    
    if (!token) {
      window.location.href = '/login';
      return;
    }
    
    // Load counts
    await loadCounts(token);
    
    // Load projects
    await loadProjects(token);
    
    // Load tasks
    await loadTasks(token);
    
    // Load invoices
    await loadInvoices(token);
    
    // Load activities
    await loadActivities(token);
  } catch (error) {
    console.error('Error loading dashboard data:', error);
  }
}

// Function to load counts
async function loadCounts(token) {
  try {
    // Employees count
    const employeesResponse = await fetch('/api/employees', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (employeesResponse.ok) {
      const employeesData = await employeesResponse.json();
      document.getElementById('employee-count').textContent = employeesData.count || 0;
    }
    
    // Clients count
    const clientsResponse = await fetch('/api/clients', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (clientsResponse.ok) {
      const clientsData = await clientsResponse.json();
      document.getElementById('client-count').textContent = clientsData.count || 0;
    }
    
    // Projects count
    const projectsResponse = await fetch('/api/projects', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (projectsResponse.ok) {
      const projectsData = await projectsResponse.json();
      document.getElementById('project-count').textContent = projectsData.count || 0;
    }
    
    // Tasks count
    const tasksResponse = await fetch('/api/tasks', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (tasksResponse.ok) {
      const tasksData = await tasksResponse.json();
      document.getElementById('task-count').textContent = tasksData.count || 0;
    }
  } catch (error) {
    console.error('Error loading counts:', error);
  }
}

// Function to load projects
async function loadProjects(token) {
  try {
    const response = await fetch('/api/projects', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      const tableBody = document.getElementById('projects-table-body');
      
      if (data.data.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="4" class="text-center">No projects found</td></tr>';
        return;
      }
      
      let html = '';
      
      // Get only the first 5 projects
      const projects = data.data.slice(0, 5);
      
      projects.forEach(project => {
        // Get status badge class
        let statusClass = '';
        switch (project.status) {
          case 'Planning':
            statusClass = 'badge-info';
            break;
          case 'In Progress':
            statusClass = 'badge-primary';
            break;
          case 'On Hold':
            statusClass = 'badge-warning';
            break;
          case 'Completed':
            statusClass = 'badge-success';
            break;
          case 'Cancelled':
            statusClass = 'badge-danger';
            break;
          default:
            statusClass = 'badge-secondary';
        }
        
        html += `
          <tr>
            <td>${project.name}</td>
            <td>${project.client ? project.client.name : 'N/A'}</td>
            <td><span class="badge ${statusClass}">${project.status}</span></td>
            <td>
              <div class="progress">
                <div class="progress-bar" role="progressbar" style="width: ${project.progress}%" 
                  aria-valuenow="${project.progress}" aria-valuemin="0" aria-valuemax="100">
                  ${project.progress}%
                </div>
              </div>
            </td>
          </tr>
        `;
      });
      
      tableBody.innerHTML = html;
    }
  } catch (error) {
    console.error('Error loading projects:', error);
    document.getElementById('projects-table-body').innerHTML = 
      '<tr><td colspan="4" class="text-center">Error loading projects</td></tr>';
  }
}

// Function to load tasks
async function loadTasks(token) {
  try {
    const response = await fetch('/api/tasks', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      const tableBody = document.getElementById('tasks-table-body');
      
      if (data.data.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="4" class="text-center">No tasks found</td></tr>';
        return;
      }
      
      let html = '';
      
      // Get only the first 5 tasks
      const tasks = data.data.slice(0, 5);
      
      tasks.forEach(task => {
        // Get status badge class
        let statusClass = '';
        switch (task.status) {
          case 'To Do':
            statusClass = 'badge-secondary';
            break;
          case 'In Progress':
            statusClass = 'badge-primary';
            break;
          case 'Review':
            statusClass = 'badge-warning';
            break;
          case 'Completed':
            statusClass = 'badge-success';
            break;
          default:
            statusClass = 'badge-secondary';
        }
        
        // Format date
        const dueDate = new Date(task.dueDate).toLocaleDateString();
        
        html += `
          <tr>
            <td>${task.title}</td>
            <td>${task.project ? task.project.name : 'N/A'}</td>
            <td>${dueDate}</td>
            <td><span class="badge ${statusClass}">${task.status}</span></td>
          </tr>
        `;
      });
      
      tableBody.innerHTML = html;
    }
  } catch (error) {
    console.error('Error loading tasks:', error);
    document.getElementById('tasks-table-body').innerHTML = 
      '<tr><td colspan="4" class="text-center">Error loading tasks</td></tr>';
  }
}

// Function to load invoices
async function loadInvoices(token) {
  try {
    const response = await fetch('/api/invoices', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      const tableBody = document.getElementById('invoices-table-body');
      
      if (data.data.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="4" class="text-center">No invoices found</td></tr>';
        return;
      }
      
      let html = '';
      
      // Get only the first 5 invoices
      const invoices = data.data.slice(0, 5);
      
      invoices.forEach(invoice => {
        // Get status badge class
        let statusClass = '';
        switch (invoice.status) {
          case 'Draft':
            statusClass = 'badge-secondary';
            break;
          case 'Sent':
            statusClass = 'badge-primary';
            break;
          case 'Paid':
            statusClass = 'badge-success';
            break;
          case 'Overdue':
            statusClass = 'badge-danger';
            break;
          case 'Cancelled':
            statusClass = 'badge-warning';
            break;
          default:
            statusClass = 'badge-secondary';
        }
        
        // Format amount
        const amount = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD'
        }).format(invoice.total);
        
        html += `
          <tr>
            <td>${invoice.invoiceNumber}</td>
            <td>${invoice.client ? invoice.client.name : 'N/A'}</td>
            <td>${amount}</td>
            <td><span class="badge ${statusClass}">${invoice.status}</span></td>
          </tr>
        `;
      });
      
      tableBody.innerHTML = html;
    }
  } catch (error) {
    console.error('Error loading invoices:', error);
    document.getElementById('invoices-table-body').innerHTML = 
      '<tr><td colspan="4" class="text-center">Error loading invoices</td></tr>';
  }
}

// Function to load activities
async function loadActivities(token) {
  // This would typically come from an API endpoint
  // For now, we'll just show some dummy data
  const activityFeed = document.getElementById('activity-feed');
  
  const activities = [
    { text: 'John Doe completed task "Update client dashboard"', time: '2 hours ago' },
    { text: 'New project "E-commerce Platform" was created', time: '4 hours ago' },
    { text: 'Invoice #INV-2023-001 was marked as paid', time: '1 day ago' },
    { text: 'Sarah Smith joined the team', time: '2 days ago' },
    { text: 'Client meeting scheduled with ABC Corp', time: '3 days ago' }
  ];
  
  let html = '';
  
  activities.forEach(activity => {
    html += `
      <div class="activity-item">
        <div>${activity.text}</div>
        <small class="activity-time">${activity.time}</small>
      </div>
    `;
  });
  
  activityFeed.innerHTML = html;
}
