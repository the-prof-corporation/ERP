// Simple App JavaScript

// Theme toggle functionality
function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

  // Update theme attribute
  document.documentElement.setAttribute('data-theme', newTheme);

  // Save preference to localStorage
  localStorage.setItem('theme', newTheme);

  // Update icon
  updateThemeIcon(newTheme);
}

// Update theme icon based on current theme
function updateThemeIcon(theme) {
  const themeIcon = document.getElementById('theme-icon');
  if (themeIcon) {
    if (theme === 'dark') {
      themeIcon.classList.remove('fa-sun');
      themeIcon.classList.add('fa-moon');
    } else {
      themeIcon.classList.remove('fa-moon');
      themeIcon.classList.add('fa-sun');
    }
  }
}

document.addEventListener('DOMContentLoaded', function() {
  // Initialize Bootstrap components
  initializeBootstrapComponents();

  // Initialize theme icon
  const currentTheme = document.documentElement.getAttribute('data-theme');
  updateThemeIcon(currentTheme);

  // Load dashboard data
  loadDashboardData();

  // Initialize timeline filters and search for desktop
  initializeTimelineControls();

  // Handle sidebar navigation
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      if (this.getAttribute('href') && this.getAttribute('href').startsWith('#')) {
        e.preventDefault();

        // Remove active class from all links
        navLinks.forEach(l => l.classList.remove('active'));

        // Add active class to clicked link
        this.classList.add('active');

        // Show corresponding content
        const targetId = this.getAttribute('href').substring(1);
        showContent(targetId);

        // Close mobile sidebar if open
        if (window.innerWidth < 768) {
          document.getElementById('sidebarMenu').classList.remove('show');
          document.querySelector('.sidebar-overlay').style.display = 'none';
        }
      }
    });
  });

  // Handle theme toggle button
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }

  // Handle login button
  const loginBtn = document.getElementById('login-btn');
  if (loginBtn) {
    loginBtn.addEventListener('click', function(e) {
      e.preventDefault();
      showLoginModal();
    });
  }

  // Handle mobile sidebar toggle
  const sidebarToggle = document.querySelector('.navbar-toggler');
  if (sidebarToggle) {
    sidebarToggle.addEventListener('click', function() {
      const sidebar = document.getElementById('sidebarMenu');
      const overlay = document.querySelector('.sidebar-overlay');

      sidebar.classList.toggle('show');

      if (sidebar.classList.contains('show')) {
        overlay.style.display = 'block';
        setTimeout(() => {
          overlay.style.opacity = '1';
        }, 10);
      } else {
        overlay.style.opacity = '0';
        setTimeout(() => {
          overlay.style.display = 'none';
        }, 300);
      }
    });
  }

  // Handle sidebar overlay click (close sidebar)
  const sidebarOverlay = document.querySelector('.sidebar-overlay');
  if (sidebarOverlay) {
    sidebarOverlay.addEventListener('click', function() {
      document.getElementById('sidebarMenu').classList.remove('show');
      this.style.opacity = '0';
      setTimeout(() => {
        this.style.display = 'none';
      }, 300);
    });
  }

  // Add swipe gesture support for mobile
  let touchStartX = 0;
  let touchEndX = 0;

  document.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
  }, false);

  document.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, false);

  function handleSwipe() {
    const sidebar = document.getElementById('sidebarMenu');
    const overlay = document.querySelector('.sidebar-overlay');

    // Swipe right to open sidebar
    if (touchEndX - touchStartX > 100 && touchStartX < 50) {
      sidebar.classList.add('show');
      overlay.style.display = 'block';
      setTimeout(() => {
        overlay.style.opacity = '1';
      }, 10);
    }

    // Swipe left to close sidebar
    if (touchStartX - touchEndX > 100 && sidebar.classList.contains('show')) {
      sidebar.classList.remove('show');
      overlay.style.opacity = '0';
      setTimeout(() => {
        overlay.style.display = 'none';
      }, 300);
    }
  }

  // Add desktop sidebar collapse toggle
  const sidebarCollapseBtn = document.getElementById('sidebar-collapse-btn');
  if (sidebarCollapseBtn) {
    sidebarCollapseBtn.addEventListener('click', toggleSidebar);
  }

  // Initialize tooltips for desktop
  if (window.innerWidth >= 1200) {
    initializeTooltips();
  }

  // Add filter panel toggle
  const filterToggleBtn = document.getElementById('filter-toggle-btn');
  if (filterToggleBtn) {
    filterToggleBtn.addEventListener('click', function() {
      const filterPanel = document.getElementById('filter-panel');
      if (filterPanel) {
        filterPanel.classList.toggle('d-none');

        // Update button icon
        const icon = this.querySelector('i');
        if (icon) {
          if (filterPanel.classList.contains('d-none')) {
            icon.classList.remove('fa-chevron-up');
            icon.classList.add('fa-filter');
          } else {
            icon.classList.remove('fa-filter');
            icon.classList.add('fa-chevron-up');
          }
        }
      }
    });
  }

  // Initialize tooltips for desktop
  if (window.innerWidth >= 1200) {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl);
    });
  }

  // Initialize popovers for desktop
  if (window.innerWidth >= 1200) {
    const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    popoverTriggerList.map(function (popoverTriggerEl) {
      return new bootstrap.Popover(popoverTriggerEl);
    });
  }
});

// Function to toggle sidebar collapse (desktop)
function toggleSidebar() {
  const sidebar = document.getElementById('sidebarMenu');
  const content = document.querySelector('main');
  const collapseIcon = document.getElementById('sidebar-collapse-icon');

  if (sidebar && content) {
    sidebar.classList.toggle('sidebar-collapsed');

    // Update main content margin
    if (sidebar.classList.contains('sidebar-collapsed')) {
      content.style.marginLeft = '70px';
    } else {
      content.style.marginLeft = '';
    }

    // Update collapse icon
    if (collapseIcon) {
      if (sidebar.classList.contains('sidebar-collapsed')) {
        collapseIcon.classList.remove('fa-chevron-left');
        collapseIcon.classList.add('fa-chevron-right');
      } else {
        collapseIcon.classList.remove('fa-chevron-right');
        collapseIcon.classList.add('fa-chevron-left');
      }
    }

    // Store preference in localStorage
    localStorage.setItem('sidebar-collapsed', sidebar.classList.contains('sidebar-collapsed'));

    // Reinitialize tooltips after sidebar state change
    if (window.innerWidth >= 1200) {
      setTimeout(() => {
        initializeTooltips();
      }, 300);
    }
  }
}

// Function to initialize tooltips
function initializeTooltips() {
  // Destroy existing tooltips first
  const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  tooltipTriggerList.forEach(el => {
    const tooltip = bootstrap.Tooltip.getInstance(el);
    if (tooltip) {
      tooltip.dispose();
    }
  });

  // Add tooltip to sidebar toggle
  const sidebarCollapseBtn = document.getElementById('sidebar-collapse-btn');
  if (sidebarCollapseBtn) {
    sidebarCollapseBtn.setAttribute('data-bs-toggle', 'tooltip');
    sidebarCollapseBtn.setAttribute('data-bs-placement', 'right');
    sidebarCollapseBtn.setAttribute('title', 'Toggle Sidebar');
  }

  // Add tooltips to navigation items
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      const section = href.substring(1);
      link.setAttribute('data-bs-toggle', 'tooltip');
      link.setAttribute('data-bs-placement', 'right');
      link.setAttribute('title', section.charAt(0).toUpperCase() + section.slice(1));
    }
  });

  // Add tooltip to theme toggle
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.setAttribute('data-bs-toggle', 'tooltip');
    themeToggle.setAttribute('data-bs-placement', 'bottom');
    themeToggle.setAttribute('title', 'Toggle Dark Mode');
  }

  // Add tooltip to search
  const searchInput = document.querySelector('.form-control-dark');
  if (searchInput) {
    searchInput.setAttribute('data-bs-toggle', 'tooltip');
    searchInput.setAttribute('data-bs-placement', 'bottom');
    searchInput.setAttribute('title', 'Search');
  }

  // Add tooltips to add buttons
  const addButtons = {
    'add-employee-btn': 'Add Employee',
    'add-client-btn': 'Add Client',
    'add-project-btn': 'Add Project',
    'add-task-btn': 'Add Task'
  };

  Object.keys(addButtons).forEach(id => {
    const btn = document.getElementById(id);
    if (btn) {
      btn.setAttribute('data-bs-toggle', 'tooltip');
      btn.setAttribute('data-bs-placement', 'left');
      btn.setAttribute('title', addButtons[id]);
    }
  });

  // Initialize all tooltips
  const newTooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  newTooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });
}

// Function to get active section
function getActiveSection() {
  const activeLink = document.querySelector('.nav-link.active');
  if (activeLink && activeLink.getAttribute('href')) {
    return activeLink.getAttribute('href').substring(1);
  }
  return 'dashboard';
}

// Show loading overlay
function showLoading() {
  const loadingOverlay = document.getElementById('loading-overlay');
  if (loadingOverlay) {
    loadingOverlay.classList.add('show');
  }
}

// Hide loading overlay
function hideLoading() {
  const loadingOverlay = document.getElementById('loading-overlay');
  if (loadingOverlay) {
    loadingOverlay.classList.remove('show');
  }
}

// Function to load dashboard data
async function loadDashboardData() {
  try {
    showLoading();

    // Load employees count
    const employeesResponse = await fetch('/api/employees');
    const employeesData = await employeesResponse.json();
    document.getElementById('employee-count').textContent = employeesData.data ? employeesData.data.length : 0;

    // Load clients count
    const clientsResponse = await fetch('/api/clients');
    const clientsData = await clientsResponse.json();
    document.getElementById('client-count').textContent = clientsData.data ? clientsData.data.length : 0;

    // Load projects count
    const projectsResponse = await fetch('/api/projects');
    const projectsData = await projectsResponse.json();
    document.getElementById('project-count').textContent = projectsData.data ? projectsData.data.length : 0;

    // Load tasks count
    const tasksResponse = await fetch('/api/tasks');
    const tasksData = await tasksResponse.json();
    document.getElementById('task-count').textContent = tasksData.data ? tasksData.data.length : 0;

    // Load projects table
    loadProjectsTable(projectsData.data);

    // Load tasks table
    loadTasksTable(tasksData.data);

    // Create Project Status Chart
    createProjectStatusChart(projectsData.data);

    // Create Task Completion Chart
    createTaskCompletionChart(tasksData.data);

    // Hide loading overlay when everything is loaded
    hideLoading();
  } catch (error) {
    console.error('Error loading dashboard data:', error);
    hideLoading();
    showAlert('Error loading dashboard data. Please try again later.', 'danger');
  }
}

// Function to create Project Status Chart
function createProjectStatusChart(projects) {
  const ctx = document.getElementById('projectStatusChart');
  if (!ctx) return;

  // Count projects by status
  const statusCounts = {
    'Planning': 0,
    'In Progress': 0,
    'On Hold': 0,
    'Completed': 0,
    'Cancelled': 0
  };

  if (projects) {
    projects.forEach(project => {
      if (statusCounts.hasOwnProperty(project.status)) {
        statusCounts[project.status]++;
      }
    });
  }

  // Get theme colors
  const isLightTheme = document.documentElement.getAttribute('data-theme') !== 'dark';
  const textColor = isLightTheme ? '#1e293b' : '#ffffff';

  // Create chart
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: Object.keys(statusCounts),
      datasets: [{
        data: Object.values(statusCounts),
        backgroundColor: [
          '#0ea5e9', // Info - Planning
          '#3b82f6', // Primary - In Progress
          '#f59e0b', // Warning - On Hold
          '#10b981', // Success - Completed
          '#ef4444'  // Danger - Cancelled
        ],
        borderWidth: 2,
        borderColor: isLightTheme ? '#ffffff' : '#1a1a1a'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '70%',
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: textColor,
            padding: 15,
            usePointStyle: true,
            pointStyle: 'circle'
          }
        },
        tooltip: {
          backgroundColor: isLightTheme ? '#ffffff' : '#1a1a1a',
          titleColor: isLightTheme ? '#1e293b' : '#ffffff',
          bodyColor: isLightTheme ? '#475569' : '#e2e8f0',
          borderColor: isLightTheme ? '#cbd5e1' : '#3a3a3a',
          borderWidth: 1,
          padding: 12,
          boxPadding: 6,
          usePointStyle: true,
          callbacks: {
            label: function(context) {
              const label = context.label || '';
              const value = context.raw || 0;
              const total = context.dataset.data.reduce((acc, val) => acc + val, 0);
              const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
              return `${label}: ${value} (${percentage}%)`;
            }
          }
        }
      }
    }
  });
}

// Function to create Task Completion Chart
function createTaskCompletionChart(tasks) {
  const ctx = document.getElementById('taskCompletionChart');
  if (!ctx) return;

  // Group tasks by month
  const tasksByMonth = {};
  const currentDate = new Date();
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // Initialize last 6 months
  for (let i = 5; i >= 0; i--) {
    const month = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
    const monthKey = `${month.getFullYear()}-${month.getMonth() + 1}`;
    const monthLabel = `${monthNames[month.getMonth()]} ${month.getFullYear()}`;

    tasksByMonth[monthKey] = {
      label: monthLabel,
      completed: 0,
      total: 0
    };
  }

  // Count tasks by month
  if (tasks) {
    tasks.forEach(task => {
      const taskDate = task.startDate ? new Date(task.startDate) : null;
      if (taskDate) {
        const monthKey = `${taskDate.getFullYear()}-${taskDate.getMonth() + 1}`;
        if (tasksByMonth[monthKey]) {
          tasksByMonth[monthKey].total++;
          if (task.status === 'Completed') {
            tasksByMonth[monthKey].completed++;
          }
        }
      }
    });
  }

  // Prepare data for chart
  const labels = Object.values(tasksByMonth).map(month => month.label);
  const completedData = Object.values(tasksByMonth).map(month => month.completed);
  const totalData = Object.values(tasksByMonth).map(month => month.total);

  // Get theme colors
  const isLightTheme = document.documentElement.getAttribute('data-theme') !== 'dark';
  const textColor = isLightTheme ? '#1e293b' : '#ffffff';
  const gridColor = isLightTheme ? '#e2e8f0' : '#3a3a3a';

  // Create chart
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Completed Tasks',
          data: completedData,
          backgroundColor: '#10b981', // Success color
          borderColor: '#10b981',
          borderWidth: 1,
          borderRadius: 4
        },
        {
          label: 'Total Tasks',
          data: totalData,
          backgroundColor: '#3b82f6', // Primary color
          borderColor: '#3b82f6',
          borderWidth: 1,
          borderRadius: 4
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          grid: {
            display: false
          },
          ticks: {
            color: textColor
          }
        },
        y: {
          beginAtZero: true,
          grid: {
            color: gridColor
          },
          ticks: {
            color: textColor,
            precision: 0
          }
        }
      },
      plugins: {
        legend: {
          position: 'top',
          labels: {
            color: textColor,
            padding: 15,
            usePointStyle: true,
            pointStyle: 'circle'
          }
        },
        tooltip: {
          backgroundColor: isLightTheme ? '#ffffff' : '#1a1a1a',
          titleColor: isLightTheme ? '#1e293b' : '#ffffff',
          bodyColor: isLightTheme ? '#475569' : '#e2e8f0',
          borderColor: isLightTheme ? '#cbd5e1' : '#3a3a3a',
          borderWidth: 1,
          padding: 12,
          boxPadding: 6,
          usePointStyle: true
        }
      }
    }
  });
}

// Function to load projects table
function loadProjectsTable(projects) {
  const tableBody = document.getElementById('projects-table-body');

  if (!projects || projects.length === 0) {
    tableBody.innerHTML = '<tr><td colspan="4" class="text-center">No projects found</td></tr>';
    return;
  }

  let html = '';

  projects.forEach(project => {
    // Get status badge class
    let statusClass = '';
    switch (project.status) {
      case 'Planning':
        statusClass = 'badge bg-info';
        break;
      case 'In Progress':
        statusClass = 'badge bg-primary';
        break;
      case 'On Hold':
        statusClass = 'badge bg-warning';
        break;
      case 'Completed':
        statusClass = 'badge bg-success';
        break;
      case 'Cancelled':
        statusClass = 'badge bg-danger';
        break;
      default:
        statusClass = 'badge bg-secondary';
    }

    html += `
      <tr>
        <td>${project.name}</td>
        <td>${project.client ? project.client.name : 'N/A'}</td>
        <td><span class="${statusClass}">${project.status}</span></td>
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

// Function to load tasks table
function loadTasksTable(tasks) {
  const tableBody = document.getElementById('tasks-table-body');

  if (!tableBody) return;

  if (!tasks || tasks.length === 0) {
    tableBody.innerHTML = '<tr><td colspan="4" class="text-center">No tasks found</td></tr>';
    return;
  }

  // Sort tasks by due date (most recent first)
  tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

  // Get only the first 5 tasks
  const recentTasks = tasks.slice(0, 5);

  let html = '';

  recentTasks.forEach(task => {
    // Get status badge class
    let statusClass = '';
    switch (task.status) {
      case 'To Do':
        statusClass = 'badge bg-secondary';
        break;
      case 'In Progress':
        statusClass = 'badge bg-primary';
        break;
      case 'Review':
        statusClass = 'badge bg-info';
        break;
      case 'Completed':
        statusClass = 'badge bg-success';
        break;
      default:
        statusClass = 'badge bg-secondary';
    }

    // Format date
    const dueDate = new Date(task.dueDate).toLocaleDateString();

    html += `
      <tr>
        <td>${task.title}</td>
        <td>Project ${task.project}</td>
        <td>${dueDate}</td>
        <td><span class="${statusClass}">${task.status}</span></td>
      </tr>
    `;
  });

  tableBody.innerHTML = html;
}

// Function to show content based on navigation
function showContent(contentId) {
  // Hide all content sections
  hideAllContent();

  // Show the selected content
  switch (contentId) {
    case 'dashboard':
      document.getElementById('dashboard-content').style.display = 'block';
      break;
    case 'employees':
      loadEmployeesContent();
      break;
    case 'clients':
      loadClientsContent();
      break;
    case 'projects':
      loadProjectsContent();
      break;
    case 'tasks':
      loadTasksContent();
      break;
    default:
      document.getElementById('dashboard-content').style.display = 'block';
  }
}

// Function to hide all content sections
function hideAllContent() {
  // Hide dashboard content
  const dashboardContent = document.getElementById('dashboard-content');
  if (dashboardContent) {
    dashboardContent.style.display = 'none';
  }

  // Remove any dynamically created content
  const dynamicContent = document.getElementById('dynamic-content');
  if (dynamicContent) {
    dynamicContent.innerHTML = '';
  }
}

// Function to load employees content
async function loadEmployeesContent() {
  try {
    // Show loading overlay
    showLoading();

    // Get or create dynamic content container
    let dynamicContent = document.getElementById('dynamic-content');
    if (!dynamicContent) {
      dynamicContent = document.createElement('div');
      dynamicContent.id = 'dynamic-content';
      document.getElementById('content').appendChild(dynamicContent);
    }

    // Fetch employees data
    const response = await fetch('/api/employees');
    const data = await response.json();

    // Create employees content
    dynamicContent.innerHTML = `
      <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 class="h2">Employees</h1>
        <div class="btn-toolbar mb-2 mb-md-0">
          <div class="btn-group me-2 d-none d-xl-inline-flex">
            <button type="button" class="btn btn-sm btn-outline-secondary" id="export-csv-btn">
              <i class="fas fa-file-csv me-1"></i> Export CSV
            </button>
            <button type="button" class="btn btn-sm btn-outline-secondary" id="print-btn">
              <i class="fas fa-print me-1"></i> Print
            </button>
          </div>
          <button type="button" class="btn btn-sm btn-outline-secondary me-2" id="filter-toggle-btn">
            <i class="fas fa-filter"></i>
          </button>
          <button type="button" class="btn btn-sm btn-outline-primary" id="add-employee-btn">
            <i class="fas fa-plus me-1"></i> Add Employee
          </button>
        </div>
      </div>

      <!-- Advanced Filter Panel (Desktop) -->
      <div id="filter-panel" class="filter-panel d-none mb-4">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h5 class="m-0">Advanced Filters</h5>
          <button type="button" class="btn-close" id="close-filter-btn" aria-label="Close"></button>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label for="filter-name" class="form-label">Name</label>
            <input type="text" class="form-control" id="filter-name" placeholder="Search by name">
          </div>
          <div class="form-group">
            <label for="filter-position" class="form-label">Position</label>
            <select class="form-select" id="filter-position">
              <option value="">All Positions</option>
              <option value="Manager">Manager</option>
              <option value="Developer">Developer</option>
              <option value="Designer">Designer</option>
              <option value="HR Specialist">HR Specialist</option>
            </select>
          </div>
          <div class="form-group">
            <label for="filter-department" class="form-label">Department</label>
            <select class="form-select" id="filter-department">
              <option value="">All Departments</option>
              <option value="Engineering">Engineering</option>
              <option value="Design">Design</option>
              <option value="Marketing">Marketing</option>
              <option value="HR">HR</option>
            </select>
          </div>
          <div class="form-group">
            <label for="filter-status" class="form-label">Status</label>
            <select class="form-select" id="filter-status">
              <option value="">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
        <div class="d-flex justify-content-end mt-3">
          <button type="button" class="btn btn-secondary me-2" id="reset-filter-btn">Reset</button>
          <button type="button" class="btn btn-primary" id="apply-filter-btn">Apply Filters</button>
        </div>
      </div>

      <div class="table-responsive">
        <table class="table table-striped table-hover table-desktop">
          <thead>
            <tr>
              <th class="sortable" data-sort="name">Name <i class="fas fa-sort ms-1"></i></th>
              <th class="sortable" data-sort="position">Position <i class="fas fa-sort ms-1"></i></th>
              <th class="sortable" data-sort="department">Department <i class="fas fa-sort ms-1"></i></th>
              <th class="sortable" data-sort="email">Email <i class="fas fa-sort ms-1"></i></th>
              <th class="sortable" data-sort="status">Status <i class="fas fa-sort ms-1"></i></th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody id="employees-table-body">
            ${data.data.map(employee => `
              <tr>
                <td>${employee.name}</td>
                <td>${employee.position}</td>
                <td>${employee.department}</td>
                <td>${employee.email}</td>
                <td><span class="badge ${employee.status === 'Active' ? 'bg-success' : 'bg-warning'}">${employee.status}</span></td>
                <td>
                  <div class="btn-group">
                    <button class="btn btn-sm btn-primary view-employee-btn" data-id="${employee.id}" data-bs-toggle="tooltip" title="View">
                      <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-warning edit-employee-btn" data-id="${employee.id}" data-bs-toggle="tooltip" title="Edit">
                      <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger delete-employee-btn" data-id="${employee.id}" data-bs-toggle="tooltip" title="Delete">
                      <i class="fas fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <!-- Pagination (Desktop) -->
      <div class="d-flex justify-content-between align-items-center mt-4">
        <div class="d-none d-xl-block">
          <span>Showing <span id="showing-entries">1-${Math.min(data.data.length, 10)}</span> of ${data.data.length} entries</span>
        </div>
        <nav aria-label="Page navigation">
          <ul class="pagination">
            <li class="page-item disabled">
              <a class="page-link" href="#" aria-label="Previous">
                <span aria-hidden="true">&laquo;</span>
              </a>
            </li>
            <li class="page-item active"><a class="page-link" href="#">1</a></li>
            ${data.data.length > 10 ? '<li class="page-item"><a class="page-link" href="#">2</a></li>' : ''}
            ${data.data.length > 20 ? '<li class="page-item"><a class="page-link" href="#">3</a></li>' : ''}
            <li class="page-item ${data.data.length <= 10 ? 'disabled' : ''}">
              <a class="page-link" href="#" aria-label="Next">
                <span aria-hidden="true">&raquo;</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    `;

    // Hide loading overlay
    hideLoading();

    // Add event listeners for employee actions
    document.getElementById('add-employee-btn').addEventListener('click', () => {
      showEmployeeForm();
    });

    document.querySelectorAll('.view-employee-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const employeeId = btn.getAttribute('data-id');
        viewEmployee(employeeId);
      });
    });

    document.querySelectorAll('.edit-employee-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const employeeId = btn.getAttribute('data-id');
        editEmployee(employeeId);
      });
    });

    document.querySelectorAll('.delete-employee-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const employeeId = btn.getAttribute('data-id');
        if (confirm(`Are you sure you want to delete employee ${employeeId}?`)) {
          try {
            const response = await fetch(`/api/employees/${employeeId}`, {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              }
            });

            const data = await response.json();

            if (data.success) {
              showAlert('Employee deleted successfully', 'success');
              // Reload employees content
              loadEmployeesContent();
            } else {
              showAlert(data.message || 'Error deleting employee', 'danger');
            }
          } catch (error) {
            console.error('Error deleting employee:', error);
            showAlert('An error occurred while deleting the employee', 'danger');
          }
        }
      });
    });

    // Add event listeners for desktop features
    if (window.innerWidth >= 1200) {
      // Filter toggle
      const filterToggleBtn = document.getElementById('filter-toggle-btn');
      if (filterToggleBtn) {
        filterToggleBtn.addEventListener('click', function() {
          const filterPanel = document.getElementById('filter-panel');
          if (filterPanel) {
            filterPanel.classList.toggle('d-none');

            // Update button icon
            const icon = this.querySelector('i');
            if (icon) {
              if (filterPanel.classList.contains('d-none')) {
                icon.classList.remove('fa-chevron-up');
                icon.classList.add('fa-filter');
              } else {
                icon.classList.remove('fa-filter');
                icon.classList.add('fa-chevron-up');
              }
            }
          }
        });
      }

      // Close filter panel
      const closeFilterBtn = document.getElementById('close-filter-btn');
      if (closeFilterBtn) {
        closeFilterBtn.addEventListener('click', function() {
          const filterPanel = document.getElementById('filter-panel');
          if (filterPanel) {
            filterPanel.classList.add('d-none');

            // Update filter toggle button icon
            const filterToggleBtn = document.getElementById('filter-toggle-btn');
            if (filterToggleBtn) {
              const icon = filterToggleBtn.querySelector('i');
              if (icon) {
                icon.classList.remove('fa-chevron-up');
                icon.classList.add('fa-filter');
              }
            }
          }
        });
      }

      // Apply filters
      const applyFilterBtn = document.getElementById('apply-filter-btn');
      if (applyFilterBtn) {
        applyFilterBtn.addEventListener('click', function() {
          const nameFilter = document.getElementById('filter-name').value.toLowerCase();
          const positionFilter = document.getElementById('filter-position').value;
          const departmentFilter = document.getElementById('filter-department').value;
          const statusFilter = document.getElementById('filter-status').value;

          const rows = document.querySelectorAll('#employees-table-body tr');

          rows.forEach(row => {
            const name = row.cells[0].textContent.toLowerCase();
            const position = row.cells[1].textContent;
            const department = row.cells[2].textContent;
            const status = row.cells[4].querySelector('.badge').textContent;

            const nameMatch = name.includes(nameFilter);
            const positionMatch = positionFilter === '' || position === positionFilter;
            const departmentMatch = departmentFilter === '' || department === departmentFilter;
            const statusMatch = statusFilter === '' || status === statusFilter;

            if (nameMatch && positionMatch && departmentMatch && statusMatch) {
              row.style.display = '';
            } else {
              row.style.display = 'none';
            }
          });

          // Update showing entries count
          updateShowingEntries();
        });
      }

      // Reset filters
      const resetFilterBtn = document.getElementById('reset-filter-btn');
      if (resetFilterBtn) {
        resetFilterBtn.addEventListener('click', function() {
          document.getElementById('filter-name').value = '';
          document.getElementById('filter-position').value = '';
          document.getElementById('filter-department').value = '';
          document.getElementById('filter-status').value = '';

          // Show all rows
          const rows = document.querySelectorAll('#employees-table-body tr');
          rows.forEach(row => {
            row.style.display = '';
          });

          // Update showing entries count
          updateShowingEntries();
        });
      }

      // Sortable columns
      const sortableHeaders = document.querySelectorAll('.sortable');
      sortableHeaders.forEach(header => {
        header.addEventListener('click', function() {
          const sortBy = this.getAttribute('data-sort');
          const sortIcon = this.querySelector('i');

          // Toggle sort direction
          let sortDirection = 'asc';
          if (sortIcon.classList.contains('fa-sort-up')) {
            sortDirection = 'desc';
          } else if (sortIcon.classList.contains('fa-sort-down')) {
            sortDirection = 'none';
          }

          // Reset all sort icons
          sortableHeaders.forEach(h => {
            const icon = h.querySelector('i');
            icon.className = 'fas fa-sort ms-1';
          });

          // Update current sort icon
          if (sortDirection === 'asc') {
            sortIcon.className = 'fas fa-sort-up ms-1';
          } else if (sortDirection === 'desc') {
            sortIcon.className = 'fas fa-sort-down ms-1';
          }

          // Sort the table
          sortTable(sortBy, sortDirection);
        });
      });

      // Export CSV
      const exportCsvBtn = document.getElementById('export-csv-btn');
      if (exportCsvBtn) {
        exportCsvBtn.addEventListener('click', function() {
          exportTableToCSV('employees.csv');
        });
      }

      // Print
      const printBtn = document.getElementById('print-btn');
      if (printBtn) {
        printBtn.addEventListener('click', function() {
          window.print();
        });
      }

      // Initialize tooltips
      const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
      tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
      });
    }

    // Function to sort table
    function sortTable(column, direction) {
      if (direction === 'none') return;

      const tbody = document.getElementById('employees-table-body');
      const rows = Array.from(tbody.querySelectorAll('tr'));

      // Sort rows
      rows.sort((a, b) => {
        let aValue, bValue;

        switch (column) {
          case 'name':
            aValue = a.cells[0].textContent;
            bValue = b.cells[0].textContent;
            break;
          case 'position':
            aValue = a.cells[1].textContent;
            bValue = b.cells[1].textContent;
            break;
          case 'department':
            aValue = a.cells[2].textContent;
            bValue = b.cells[2].textContent;
            break;
          case 'email':
            aValue = a.cells[3].textContent;
            bValue = b.cells[3].textContent;
            break;
          case 'status':
            aValue = a.cells[4].querySelector('.badge').textContent;
            bValue = b.cells[4].querySelector('.badge').textContent;
            break;
          default:
            return 0;
        }

        if (direction === 'asc') {
          return aValue.localeCompare(bValue);
        } else {
          return bValue.localeCompare(aValue);
        }
      });

      // Reorder rows in the table
      rows.forEach(row => {
        tbody.appendChild(row);
      });
    }

    // Function to update showing entries count
    function updateShowingEntries() {
      const showingEntries = document.getElementById('showing-entries');
      if (!showingEntries) return;

      const visibleRows = document.querySelectorAll('#employees-table-body tr:not([style*="display: none"])');
      const totalRows = document.querySelectorAll('#employees-table-body tr').length;

      showingEntries.textContent = `1-${visibleRows.length} of ${totalRows}`;
    }

    // Function to export table to CSV
    function exportTableToCSV(filename) {
      const rows = document.querySelectorAll('#employees-table-body tr:not([style*="display: none"])');
      let csv = [];

      // Add header row
      const headers = [];
      document.querySelectorAll('.table-desktop th').forEach(th => {
        if (!th.textContent.includes('Actions')) {
          headers.push(th.textContent.replace(/ .*/, '').trim());
        }
      });
      csv.push(headers.join(','));

      // Add data rows
      rows.forEach(row => {
        const data = [];
        for (let i = 0; i < row.cells.length - 1; i++) {
          let cell = row.cells[i];

          // Handle status badge
          if (i === 4) {
            data.push(cell.querySelector('.badge').textContent);
          } else {
            data.push('"' + cell.textContent.replace(/"/g, '""') + '"');
          }
        }
        csv.push(data.join(','));
      });

      // Download CSV file
      const csvContent = 'data:text/csv;charset=utf-8,' + csv.join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  } catch (error) {
    console.error('Error loading employees content:', error);
  }
}

// Function to load clients content
async function loadClientsContent() {
  try {
    // Get or create dynamic content container
    let dynamicContent = document.getElementById('dynamic-content');
    if (!dynamicContent) {
      dynamicContent = document.createElement('div');
      dynamicContent.id = 'dynamic-content';
      document.getElementById('content').appendChild(dynamicContent);
    }

    // Fetch clients data
    const response = await fetch('/api/clients');
    const data = await response.json();

    // Create clients content
    dynamicContent.innerHTML = `
      <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 class="h2">Clients</h1>
        <div class="btn-toolbar mb-2 mb-md-0">
          <button type="button" class="btn btn-sm btn-outline-primary" id="add-client-btn">
            <i class="fas fa-plus"></i> Add Client
          </button>
        </div>
      </div>

      <div class="table-responsive">
        <table class="table table-striped table-sm">
          <thead>
            <tr>
              <th>Name</th>
              <th>Company</th>
              <th>Contact Person</th>
              <th>Email</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${data.data.map(client => `
              <tr>
                <td>${client.name}</td>
                <td>${client.company.name}</td>
                <td>${client.contactPerson ? client.contactPerson.name : 'N/A'}</td>
                <td>${client.contactPerson ? client.contactPerson.email : 'N/A'}</td>
                <td><span class="badge ${client.status === 'Active' ? 'bg-success' : client.status === 'Prospect' ? 'bg-info' : 'bg-warning'}">${client.status}</span></td>
                <td>
                  <button class="btn btn-sm btn-primary view-client-btn" data-id="${client.id}">
                    <i class="fas fa-eye"></i>
                  </button>
                  <button class="btn btn-sm btn-warning edit-client-btn" data-id="${client.id}">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button class="btn btn-sm btn-danger delete-client-btn" data-id="${client.id}">
                    <i class="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;

    // Add event listeners for client actions
    document.getElementById('add-client-btn').addEventListener('click', () => {
      showClientForm();
    });

    document.querySelectorAll('.view-client-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const clientId = btn.getAttribute('data-id');
        viewClient(clientId);
      });
    });

    document.querySelectorAll('.edit-client-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const clientId = btn.getAttribute('data-id');
        editClient(clientId);
      });
    });

    document.querySelectorAll('.delete-client-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const clientId = btn.getAttribute('data-id');
        if (confirm(`Are you sure you want to delete client ${clientId}?`)) {
          try {
            const response = await fetch(`/api/clients/${clientId}`, {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              }
            });

            const data = await response.json();

            if (data.success) {
              showAlert('Client deleted successfully', 'success');
              // Reload clients content
              loadClientsContent();
            } else {
              showAlert(data.message || 'Error deleting client', 'danger');
            }
          } catch (error) {
            console.error('Error deleting client:', error);
            showAlert('An error occurred while deleting the client', 'danger');
          }
        }
      });
    });
  } catch (error) {
    console.error('Error loading clients content:', error);
  }
}

// Function to show client form (add/edit)
function showClientForm(client = null) {
  // Create modal element
  const modal = document.createElement('div');
  modal.className = 'modal fade';
  modal.id = 'clientFormModal';
  modal.tabIndex = '-1';
  modal.setAttribute('aria-labelledby', 'clientFormModalLabel');
  modal.setAttribute('aria-hidden', 'true');

  const isEdit = client !== null;
  const modalTitle = isEdit ? 'Edit Client' : 'Add Client';
  const submitButtonText = isEdit ? 'Update' : 'Add';

  modal.innerHTML = `
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="clientFormModalLabel">${modalTitle}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <form id="client-form">
            <div class="row">
              <div class="col-md-6 mb-3">
                <label for="client-name" class="form-label">Client Name</label>
                <input type="text" class="form-control" id="client-name" value="${isEdit ? client.name : ''}" required>
              </div>
              <div class="col-md-6 mb-3">
                <label for="client-status" class="form-label">Status</label>
                <select class="form-select" id="client-status">
                  <option value="Active" ${isEdit && client.status === 'Active' ? 'selected' : ''}>Active</option>
                  <option value="Prospect" ${isEdit && client.status === 'Prospect' ? 'selected' : ''}>Prospect</option>
                  <option value="Inactive" ${isEdit && client.status === 'Inactive' ? 'selected' : ''}>Inactive</option>
                </select>
              </div>
            </div>

            <h6 class="mt-4 mb-3">Company Information</h6>
            <div class="row">
              <div class="col-md-6 mb-3">
                <label for="company-name" class="form-label">Company Name</label>
                <input type="text" class="form-control" id="company-name" value="${isEdit ? client.company.name : ''}" required>
              </div>
              <div class="col-md-6 mb-3">
                <label for="company-website" class="form-label">Website</label>
                <input type="text" class="form-control" id="company-website" value="${isEdit && client.company.website ? client.company.website : ''}">
              </div>
            </div>
            <div class="row">
              <div class="col-md-6 mb-3">
                <label for="company-industry" class="form-label">Industry</label>
                <input type="text" class="form-control" id="company-industry" value="${isEdit && client.company.industry ? client.company.industry : ''}">
              </div>
              <div class="col-md-6 mb-3">
                <label for="company-address" class="form-label">Address</label>
                <input type="text" class="form-control" id="company-address" value="${isEdit && client.address ? client.address : ''}">
              </div>
            </div>

            <h6 class="mt-4 mb-3">Contact Person</h6>
            <div class="row">
              <div class="col-md-6 mb-3">
                <label for="contact-first-name" class="form-label">First Name</label>
                <input type="text" class="form-control" id="contact-first-name" value="${isEdit && client.contactPerson && client.contactPerson.firstName ? client.contactPerson.firstName : ''}" required>
              </div>
              <div class="col-md-6 mb-3">
                <label for="contact-last-name" class="form-label">Last Name</label>
                <input type="text" class="form-control" id="contact-last-name" value="${isEdit && client.contactPerson && client.contactPerson.lastName ? client.contactPerson.lastName : ''}" required>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6 mb-3">
                <label for="contact-email" class="form-label">Email</label>
                <input type="email" class="form-control" id="contact-email" value="${isEdit && client.contactPerson && client.contactPerson.email ? client.contactPerson.email : ''}" required>
              </div>
              <div class="col-md-6 mb-3">
                <label for="contact-phone" class="form-label">Phone</label>
                <input type="text" class="form-control" id="contact-phone" value="${isEdit && client.contactPerson && client.contactPerson.phone ? client.contactPerson.phone : ''}">
              </div>
            </div>
            <div class="mb-3">
              <label for="contact-position" class="form-label">Position</label>
              <input type="text" class="form-control" id="contact-position" value="${isEdit && client.contactPerson && client.contactPerson.position ? client.contactPerson.position : ''}">
            </div>

            <div class="d-grid">
              <button type="submit" class="btn btn-primary">${submitButtonText} Client</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `;

  // Add modal to body
  document.body.appendChild(modal);

  // Initialize Bootstrap modal
  const clientFormModal = new bootstrap.Modal(document.getElementById('clientFormModal'));
  clientFormModal.show();

  // Handle form submission
  document.getElementById('client-form').addEventListener('submit', async function(e) {
    e.preventDefault();

    // Get form values
    const name = document.getElementById('client-name').value;
    const status = document.getElementById('client-status').value;
    const companyName = document.getElementById('company-name').value;
    const companyWebsite = document.getElementById('company-website').value;
    const companyIndustry = document.getElementById('company-industry').value;
    const companyAddress = document.getElementById('company-address').value;
    const contactFirstName = document.getElementById('contact-first-name').value;
    const contactLastName = document.getElementById('contact-last-name').value;
    const contactEmail = document.getElementById('contact-email').value;
    const contactPhone = document.getElementById('contact-phone').value;
    const contactPosition = document.getElementById('contact-position').value;

    // Create client object
    const clientData = {
      name,
      status,
      company: {
        name: companyName,
        website: companyWebsite,
        industry: companyIndustry
      },
      contactPerson: {
        firstName: contactFirstName,
        lastName: contactLastName,
        name: `${contactFirstName} ${contactLastName}`,
        email: contactEmail,
        phone: contactPhone,
        position: contactPosition
      },
      address: companyAddress,
      projects: isEdit ? client.projects : []
    };

    try {
      let response;

      if (isEdit) {
        // Update existing client
        response = await fetch(`/api/clients/${client.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(clientData)
        });
      } else {
        // Create new client
        response = await fetch('/api/clients', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(clientData)
        });
      }

      const data = await response.json();

      if (data.success) {
        // Close modal
        clientFormModal.hide();

        // Show success message
        showAlert(`Client ${isEdit ? 'updated' : 'added'} successfully`, 'success');

        // Reload clients content
        loadClientsContent();
      } else {
        showAlert(data.message || `Error ${isEdit ? 'updating' : 'adding'} client`, 'danger');
      }
    } catch (error) {
      console.error(`Error ${isEdit ? 'updating' : 'adding'} client:`, error);
      showAlert(`An error occurred while ${isEdit ? 'updating' : 'adding'} the client`, 'danger');
    }
  });

  // Remove modal from DOM when hidden
  document.getElementById('clientFormModal').addEventListener('hidden.bs.modal', function() {
    this.remove();
  });
}

// Function to view client details
async function viewClient(clientId) {
  try {
    // Fetch client data
    const response = await fetch(`/api/clients/${clientId}`);
    const data = await response.json();

    if (!data.success) {
      showAlert(data.message || 'Error fetching client details', 'danger');
      return;
    }

    const client = data.data;

    // Create modal element
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.id = 'clientViewModal';
    modal.tabIndex = '-1';
    modal.setAttribute('aria-labelledby', 'clientViewModalLabel');
    modal.setAttribute('aria-hidden', 'true');

    modal.innerHTML = `
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="clientViewModalLabel">Client Details</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="row mb-4">
              <div class="col-md-6">
                <h4>${client.name}</h4>
                <p class="text-muted">${client.company.name}</p>
              </div>
              <div class="col-md-6 text-end">
                <span class="badge ${client.status === 'Active' ? 'bg-success' : client.status === 'Prospect' ? 'bg-info' : 'bg-warning'}">${client.status}</span>
              </div>
            </div>

            <div class="row">
              <div class="col-md-6">
                <h6>Company Information</h6>
                <p><strong>Industry:</strong> ${client.company.industry || 'N/A'}</p>
                <p><strong>Website:</strong> ${client.company.website ? `<a href="${client.company.website}" target="_blank">${client.company.website}</a>` : 'N/A'}</p>
                <p><strong>Address:</strong> ${client.address || 'N/A'}</p>
              </div>
              <div class="col-md-6">
                <h6>Contact Person</h6>
                <p><strong>Name:</strong> ${client.contactPerson ? client.contactPerson.name : 'N/A'}</p>
                <p><strong>Position:</strong> ${client.contactPerson && client.contactPerson.position ? client.contactPerson.position : 'N/A'}</p>
                <p><strong>Email:</strong> ${client.contactPerson && client.contactPerson.email ? client.contactPerson.email : 'N/A'}</p>
                <p><strong>Phone:</strong> ${client.contactPerson && client.contactPerson.phone ? client.contactPerson.phone : 'N/A'}</p>
              </div>
            </div>

            <div class="mt-4">
              <h6>Projects</h6>
              ${client.projects && client.projects.length > 0
                ? `<ul class="list-group">
                    ${client.projects.map(projectId => `<li class="list-group-item">Project ${projectId}</li>`).join('')}
                  </ul>`
                : '<p>No projects assigned to this client.</p>'
              }
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary" id="edit-client-btn-modal">Edit</button>
          </div>
        </div>
      </div>
    `;

    // Add modal to body
    document.body.appendChild(modal);

    // Initialize Bootstrap modal
    const clientViewModal = new bootstrap.Modal(document.getElementById('clientViewModal'));
    clientViewModal.show();

    // Handle edit button click
    document.getElementById('edit-client-btn-modal').addEventListener('click', function() {
      // Close view modal
      clientViewModal.hide();

      // Show edit form
      editClient(clientId);
    });

    // Remove modal from DOM when hidden
    document.getElementById('clientViewModal').addEventListener('hidden.bs.modal', function() {
      this.remove();
    });
  } catch (error) {
    console.error('Error viewing client:', error);
    showAlert('An error occurred while fetching client details', 'danger');
  }
}

// Function to edit client
async function editClient(clientId) {
  try {
    // Fetch client data
    const response = await fetch(`/api/clients/${clientId}`);
    const data = await response.json();

    if (!data.success) {
      showAlert(data.message || 'Error fetching client details', 'danger');
      return;
    }

    // Show client form with client data
    showClientForm(data.data);
  } catch (error) {
    console.error('Error editing client:', error);
    showAlert('An error occurred while fetching client details', 'danger');
  }
}

// Function to load projects content
async function loadProjectsContent() {
  try {
    // Get or create dynamic content container
    let dynamicContent = document.getElementById('dynamic-content');
    if (!dynamicContent) {
      dynamicContent = document.createElement('div');
      dynamicContent.id = 'dynamic-content';
      document.getElementById('content').appendChild(dynamicContent);
    }

    // Fetch projects data
    const response = await fetch('/api/projects');
    const data = await response.json();

    // Create projects content
    dynamicContent.innerHTML = `
      <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 class="h2">Projects</h1>
        <div class="btn-toolbar mb-2 mb-md-0">
          <button type="button" class="btn btn-sm btn-outline-primary" id="add-project-btn">
            <i class="fas fa-plus"></i> Add Project
          </button>
        </div>
      </div>

      <div class="table-responsive">
        <table class="table table-striped table-sm">
          <thead>
            <tr>
              <th>Name</th>
              <th>Client</th>
              <th>Manager</th>
              <th>Timeline</th>
              <th>Status</th>
              <th>Progress</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${data.data.map(project => {
              // Get status badge class
              let statusClass = '';
              switch (project.status) {
                case 'Planning':
                  statusClass = 'badge bg-info';
                  break;
                case 'In Progress':
                  statusClass = 'badge bg-primary';
                  break;
                case 'On Hold':
                  statusClass = 'badge bg-warning';
                  break;
                case 'Completed':
                  statusClass = 'badge bg-success';
                  break;
                case 'Cancelled':
                  statusClass = 'badge bg-danger';
                  break;
                default:
                  statusClass = 'badge bg-secondary';
              }

              // Format dates
              const startDate = new Date(project.startDate).toLocaleDateString();
              const endDate = project.endDate ? new Date(project.endDate).toLocaleDateString() : 'TBD';

              return `
                <tr>
                  <td>${project.name}</td>
                  <td>${project.client ? project.client.name : 'N/A'}</td>
                  <td>${project.manager ? project.manager.name : 'N/A'}</td>
                  <td>${startDate} - ${endDate}</td>
                  <td><span class="${statusClass}">${project.status}</span></td>
                  <td>
                    <div class="progress">
                      <div class="progress-bar" role="progressbar" style="width: ${project.progress}%"
                        aria-valuenow="${project.progress}" aria-valuemin="0" aria-valuemax="100">
                        ${project.progress}%
                      </div>
                    </div>
                  </td>
                  <td>
                    <button class="btn btn-sm btn-primary view-project-btn" data-id="${project.id}">
                      <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-warning edit-project-btn" data-id="${project.id}">
                      <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger delete-project-btn" data-id="${project.id}">
                      <i class="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    `;

    // Add event listeners for project actions
    document.getElementById('add-project-btn').addEventListener('click', () => {
      showProjectForm();
    });

    document.querySelectorAll('.view-project-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const projectId = btn.getAttribute('data-id');
        viewProject(projectId);
      });
    });

    document.querySelectorAll('.edit-project-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const projectId = btn.getAttribute('data-id');
        editProject(projectId);
      });
    });

    document.querySelectorAll('.delete-project-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const projectId = btn.getAttribute('data-id');
        if (confirm(`Are you sure you want to delete project ${projectId}?`)) {
          try {
            const response = await fetch(`/api/projects/${projectId}`, {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              }
            });

            const data = await response.json();

            if (data.success) {
              showAlert('Project deleted successfully', 'success');
              // Reload projects content
              loadProjectsContent();
            } else {
              showAlert(data.message || 'Error deleting project', 'danger');
            }
          } catch (error) {
            console.error('Error deleting project:', error);
            showAlert('An error occurred while deleting the project', 'danger');
          }
        }
      });
    });
  } catch (error) {
    console.error('Error loading projects content:', error);
  }
}

// Function to show project form (add/edit)
async function showProjectForm(project = null) {
  try {
    // Fetch employees for manager selection
    const employeesResponse = await fetch('/api/employees');
    const employeesData = await employeesResponse.json();

    // Fetch clients for client selection
    const clientsResponse = await fetch('/api/clients');
    const clientsData = await clientsResponse.json();

    // Create modal element
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.id = 'projectFormModal';
    modal.tabIndex = '-1';
    modal.setAttribute('aria-labelledby', 'projectFormModalLabel');
    modal.setAttribute('aria-hidden', 'true');

    const isEdit = project !== null;
    const modalTitle = isEdit ? 'Edit Project' : 'Add Project';
    const submitButtonText = isEdit ? 'Update' : 'Add';

    modal.innerHTML = `
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="projectFormModalLabel">${modalTitle}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form id="project-form">
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="project-name" class="form-label">Project Name</label>
                  <input type="text" class="form-control" id="project-name" value="${isEdit ? project.name : ''}" required>
                </div>
                <div class="col-md-6 mb-3">
                  <label for="project-client" class="form-label">Client</label>
                  <select class="form-select" id="project-client" required>
                    <option value="" disabled ${!isEdit ? 'selected' : ''}>Select Client</option>
                    ${clientsData.data.map(client => `
                      <option value="${client.id}" ${isEdit && project.client && project.client.id === client.id ? 'selected' : ''}>
                        ${client.name}
                      </option>
                    `).join('')}
                  </select>
                </div>
              </div>

              <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="project-manager" class="form-label">Project Manager</label>
                  <select class="form-select" id="project-manager" required>
                    <option value="" disabled ${!isEdit ? 'selected' : ''}>Select Manager</option>
                    ${employeesData.data.map(employee => `
                      <option value="${employee.id}" ${isEdit && project.manager && project.manager.id === employee.id ? 'selected' : ''}>
                        ${employee.name} (${employee.position})
                      </option>
                    `).join('')}
                  </select>
                </div>
                <div class="col-md-6 mb-3">
                  <label for="project-status" class="form-label">Status</label>
                  <select class="form-select" id="project-status">
                    <option value="Planning" ${isEdit && project.status === 'Planning' ? 'selected' : ''}>Planning</option>
                    <option value="In Progress" ${isEdit && project.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                    <option value="On Hold" ${isEdit && project.status === 'On Hold' ? 'selected' : ''}>On Hold</option>
                    <option value="Completed" ${isEdit && project.status === 'Completed' ? 'selected' : ''}>Completed</option>
                    <option value="Cancelled" ${isEdit && project.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
                  </select>
                </div>
              </div>

              <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="project-start-date" class="form-label">Start Date</label>
                  <input type="date" class="form-control" id="project-start-date" value="${isEdit ? project.startDate : new Date().toISOString().split('T')[0]}" required>
                </div>
                <div class="col-md-6 mb-3">
                  <label for="project-end-date" class="form-label">End Date</label>
                  <input type="date" class="form-control" id="project-end-date" value="${isEdit && project.endDate ? project.endDate : ''}">
                </div>
              </div>

              <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="project-budget" class="form-label">Budget</label>
                  <input type="number" class="form-control" id="project-budget" value="${isEdit ? project.budget : '0'}" min="0">
                </div>
                <div class="col-md-6 mb-3">
                  <label for="project-progress" class="form-label">Progress (%)</label>
                  <input type="range" class="form-range" id="project-progress" min="0" max="100" step="5" value="${isEdit ? project.progress : '0'}">
                  <div class="text-center" id="progress-value">${isEdit ? project.progress : '0'}%</div>
                </div>
              </div>

              <div class="mb-3">
                <label for="project-description" class="form-label">Description</label>
                <textarea class="form-control" id="project-description" rows="3">${isEdit ? project.description : ''}</textarea>
              </div>

              <div class="d-grid">
                <button type="submit" class="btn btn-primary">${submitButtonText} Project</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    `;

    // Add modal to body
    document.body.appendChild(modal);

    // Initialize Bootstrap modal
    const projectFormModal = new bootstrap.Modal(document.getElementById('projectFormModal'));
    projectFormModal.show();

    // Handle progress range input
    const progressInput = document.getElementById('project-progress');
    const progressValue = document.getElementById('progress-value');

    progressInput.addEventListener('input', function() {
      progressValue.textContent = this.value + '%';
    });

    // Handle form submission
    document.getElementById('project-form').addEventListener('submit', async function(e) {
      e.preventDefault();

      // Get form values
      const name = document.getElementById('project-name').value;
      const clientId = document.getElementById('project-client').value;
      const managerId = document.getElementById('project-manager').value;
      const status = document.getElementById('project-status').value;
      const startDate = document.getElementById('project-start-date').value;
      const endDate = document.getElementById('project-end-date').value;
      const budget = parseInt(document.getElementById('project-budget').value) || 0;
      const progress = parseInt(document.getElementById('project-progress').value) || 0;
      const description = document.getElementById('project-description').value;

      // Create project object
      const projectData = {
        name,
        client: { id: parseInt(clientId) },
        manager: { id: parseInt(managerId) },
        status,
        startDate,
        endDate: endDate || null,
        budget,
        progress,
        description,
        team: isEdit ? project.team : [],
        tasks: isEdit ? project.tasks : []
      };

      try {
        let response;

        if (isEdit) {
          // Update existing project
          response = await fetch(`/api/projects/${project.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(projectData)
          });
        } else {
          // Create new project
          response = await fetch('/api/projects', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(projectData)
          });
        }

        const data = await response.json();

        if (data.success) {
          // Close modal
          projectFormModal.hide();

          // Show success message
          showAlert(`Project ${isEdit ? 'updated' : 'added'} successfully`, 'success');

          // Reload projects content
          loadProjectsContent();
        } else {
          showAlert(data.message || `Error ${isEdit ? 'updating' : 'adding'} project`, 'danger');
        }
      } catch (error) {
        console.error(`Error ${isEdit ? 'updating' : 'adding'} project:`, error);
        showAlert(`An error occurred while ${isEdit ? 'updating' : 'adding'} the project`, 'danger');
      }
    });

    // Remove modal from DOM when hidden
    document.getElementById('projectFormModal').addEventListener('hidden.bs.modal', function() {
      this.remove();
    });
  } catch (error) {
    console.error('Error showing project form:', error);
    showAlert('An error occurred while loading the project form', 'danger');
  }
}

// Function to view project details
async function viewProject(projectId) {
  try {
    // Fetch project data
    const response = await fetch(`/api/projects/${projectId}`);
    const data = await response.json();

    if (!data.success) {
      showAlert(data.message || 'Error fetching project details', 'danger');
      return;
    }

    const project = data.data;

    // Fetch tasks for this project
    const tasksResponse = await fetch('/api/tasks');
    const tasksData = await tasksResponse.json();
    const projectTasks = tasksData.data.filter(task => task.project === parseInt(projectId));

    // Create modal element
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.id = 'projectViewModal';
    modal.tabIndex = '-1';
    modal.setAttribute('aria-labelledby', 'projectViewModalLabel');
    modal.setAttribute('aria-hidden', 'true');

    // Get status badge class
    let statusClass = '';
    switch (project.status) {
      case 'Planning':
        statusClass = 'badge bg-info';
        break;
      case 'In Progress':
        statusClass = 'badge bg-primary';
        break;
      case 'On Hold':
        statusClass = 'badge bg-warning';
        break;
      case 'Completed':
        statusClass = 'badge bg-success';
        break;
      case 'Cancelled':
        statusClass = 'badge bg-danger';
        break;
      default:
        statusClass = 'badge bg-secondary';
    }

    // Format dates
    const startDate = new Date(project.startDate).toLocaleDateString();
    const endDate = project.endDate ? new Date(project.endDate).toLocaleDateString() : 'TBD';

    modal.innerHTML = `
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="projectViewModalLabel">Project Details</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="row mb-4">
              <div class="col-md-6">
                <h4>${project.name}</h4>
                <p class="text-muted">Client: ${project.client ? project.client.name : 'N/A'}</p>
              </div>
              <div class="col-md-6 text-end">
                <span class="${statusClass}">${project.status}</span>
              </div>
            </div>

            <div class="row mb-3">
              <div class="col-12">
                <div class="progress" style="height: 20px;">
                  <div class="progress-bar" role="progressbar" style="width: ${project.progress}%"
                    aria-valuenow="${project.progress}" aria-valuemin="0" aria-valuemax="100">
                    ${project.progress}%
                  </div>
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-md-6">
                <h6>Project Information</h6>
                <p><strong>Manager:</strong> ${project.manager ? project.manager.name : 'N/A'}</p>
                <p><strong>Timeline:</strong> ${startDate} - ${endDate}</p>
                <p><strong>Budget:</strong> $${project.budget ? project.budget.toLocaleString() : '0'}</p>
                <p><strong>Description:</strong> ${project.description || 'No description provided.'}</p>
              </div>
              <div class="col-md-6">
                <h6>Team Members</h6>
                ${project.team && project.team.length > 0
                  ? `<ul class="list-group">
                      ${project.team.map(memberId => `<li class="list-group-item">Employee ${memberId}</li>`).join('')}
                    </ul>`
                  : '<p>No team members assigned to this project.</p>'
                }
              </div>
            </div>

            <div class="mt-4">
              <h6>Tasks</h6>
              ${projectTasks.length > 0
                ? `<div class="table-responsive">
                    <table class="table table-sm">
                      <thead>
                        <tr>
                          <th>Title</th>
                          <th>Assigned To</th>
                          <th>Due Date</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${projectTasks.map(task => {
                          // Get status badge class
                          let taskStatusClass = '';
                          switch (task.status) {
                            case 'To Do':
                              taskStatusClass = 'badge bg-secondary';
                              break;
                            case 'In Progress':
                              taskStatusClass = 'badge bg-primary';
                              break;
                            case 'Completed':
                              taskStatusClass = 'badge bg-success';
                              break;
                            default:
                              taskStatusClass = 'badge bg-secondary';
                          }

                          // Format date
                          const dueDate = task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A';

                          return `
                            <tr>
                              <td>${task.title}</td>
                              <td>Employee ${task.assignedTo}</td>
                              <td>${dueDate}</td>
                              <td><span class="${taskStatusClass}">${task.status}</span></td>
                            </tr>
                          `;
                        }).join('')}
                      </tbody>
                    </table>
                  </div>`
                : '<p>No tasks assigned to this project.</p>'
              }
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary" id="edit-project-btn-modal">Edit</button>
          </div>
        </div>
      </div>
    `;

    // Add modal to body
    document.body.appendChild(modal);

    // Initialize Bootstrap modal
    const projectViewModal = new bootstrap.Modal(document.getElementById('projectViewModal'));
    projectViewModal.show();

    // Handle edit button click
    document.getElementById('edit-project-btn-modal').addEventListener('click', function() {
      // Close view modal
      projectViewModal.hide();

      // Show edit form
      editProject(projectId);
    });

    // Remove modal from DOM when hidden
    document.getElementById('projectViewModal').addEventListener('hidden.bs.modal', function() {
      this.remove();
    });
  } catch (error) {
    console.error('Error viewing project:', error);
    showAlert('An error occurred while fetching project details', 'danger');
  }
}

// Function to edit project
async function editProject(projectId) {
  try {
    // Fetch project data
    const response = await fetch(`/api/projects/${projectId}`);
    const data = await response.json();

    if (!data.success) {
      showAlert(data.message || 'Error fetching project details', 'danger');
      return;
    }

    // Show project form with project data
    showProjectForm(data.data);
  } catch (error) {
    console.error('Error editing project:', error);
    showAlert('An error occurred while fetching project details', 'danger');
  }
}

// Function to load tasks content
async function loadTasksContent() {
  try {
    // Get or create dynamic content container
    let dynamicContent = document.getElementById('dynamic-content');
    if (!dynamicContent) {
      dynamicContent = document.createElement('div');
      dynamicContent.id = 'dynamic-content';
      document.getElementById('content').appendChild(dynamicContent);
    }

    // Fetch tasks data
    const response = await fetch('/api/tasks');
    const data = await response.json();

    // Fetch projects data for project names
    const projectsResponse = await fetch('/api/projects');
    const projectsData = await projectsResponse.json();

    // Fetch employees data for assignee names
    const employeesResponse = await fetch('/api/employees');
    const employeesData = await employeesResponse.json();

    // Create tasks content
    dynamicContent.innerHTML = `
      <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 class="h2">Tasks</h1>
        <div class="btn-toolbar mb-2 mb-md-0">
          <button type="button" class="btn btn-sm btn-outline-primary" id="add-task-btn">
            <i class="fas fa-plus"></i> Add Task
          </button>
        </div>
      </div>

      <div class="table-responsive">
        <table class="table table-striped table-sm">
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
          <tbody>
            ${data.data.map(task => {
              // Get status badge class
              let statusClass = '';
              switch (task.status) {
                case 'To Do':
                  statusClass = 'badge bg-secondary';
                  break;
                case 'In Progress':
                  statusClass = 'badge bg-primary';
                  break;
                case 'Review':
                  statusClass = 'badge bg-info';
                  break;
                case 'Completed':
                  statusClass = 'badge bg-success';
                  break;
                default:
                  statusClass = 'badge bg-secondary';
              }

              // Get priority badge class
              let priorityClass = '';
              switch (task.priority) {
                case 'Low':
                  priorityClass = 'badge bg-success';
                  break;
                case 'Medium':
                  priorityClass = 'badge bg-info';
                  break;
                case 'High':
                  priorityClass = 'badge bg-warning';
                  break;
                case 'Critical':
                  priorityClass = 'badge bg-danger';
                  break;
                default:
                  priorityClass = 'badge bg-secondary';
              }

              // Format date
              const dueDate = task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A';

              // Get project name
              const project = projectsData.data.find(p => p.id === task.project);
              const projectName = project ? project.name : `Project ${task.project}`;

              // Get employee name
              const employee = employeesData.data.find(e => e.id === task.assignedTo);
              const employeeName = employee ? employee.name : `Employee ${task.assignedTo}`;

              return `
                <tr>
                  <td>${task.title}</td>
                  <td>${projectName}</td>
                  <td>${employeeName}</td>
                  <td>${dueDate}</td>
                  <td><span class="${priorityClass}">${task.priority}</span></td>
                  <td><span class="${statusClass}">${task.status}</span></td>
                  <td>
                    <button class="btn btn-sm btn-primary view-task-btn" data-id="${task.id}">
                      <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-warning edit-task-btn" data-id="${task.id}">
                      <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger delete-task-btn" data-id="${task.id}">
                      <i class="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    `;

    // Add event listeners for task actions
    document.getElementById('add-task-btn').addEventListener('click', () => {
      showTaskForm();
    });

    document.querySelectorAll('.view-task-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const taskId = btn.getAttribute('data-id');
        viewTask(taskId);
      });
    });

    document.querySelectorAll('.edit-task-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const taskId = btn.getAttribute('data-id');
        editTask(taskId);
      });
    });

    document.querySelectorAll('.delete-task-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const taskId = btn.getAttribute('data-id');
        if (confirm(`Are you sure you want to delete task ${taskId}?`)) {
          try {
            const response = await fetch(`/api/tasks/${taskId}`, {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              }
            });

            const data = await response.json();

            if (data.success) {
              showAlert('Task deleted successfully', 'success');
              // Reload tasks content
              loadTasksContent();
            } else {
              showAlert(data.message || 'Error deleting task', 'danger');
            }
          } catch (error) {
            console.error('Error deleting task:', error);
            showAlert('An error occurred while deleting the task', 'danger');
          }
        }
      });
    });
  } catch (error) {
    console.error('Error loading tasks content:', error);
  }
}

// Function to show task form (add/edit)
async function showTaskForm(task = null) {
  try {
    // Fetch projects for project selection
    const projectsResponse = await fetch('/api/projects');
    const projectsData = await projectsResponse.json();

    // Fetch employees for assignee selection
    const employeesResponse = await fetch('/api/employees');
    const employeesData = await employeesResponse.json();

    // Create modal element
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.id = 'taskFormModal';
    modal.tabIndex = '-1';
    modal.setAttribute('aria-labelledby', 'taskFormModalLabel');
    modal.setAttribute('aria-hidden', 'true');

    const isEdit = task !== null;
    const modalTitle = isEdit ? 'Edit Task' : 'Add Task';
    const submitButtonText = isEdit ? 'Update' : 'Add';

    modal.innerHTML = `
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="taskFormModalLabel">${modalTitle}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form id="task-form">
              <div class="row">
                <div class="col-md-8 mb-3">
                  <label for="task-title" class="form-label">Task Title</label>
                  <input type="text" class="form-control" id="task-title" value="${isEdit ? task.title : ''}" required>
                </div>
                <div class="col-md-4 mb-3">
                  <label for="task-status" class="form-label">Status</label>
                  <select class="form-select" id="task-status">
                    <option value="To Do" ${isEdit && task.status === 'To Do' ? 'selected' : ''}>To Do</option>
                    <option value="In Progress" ${isEdit && task.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                    <option value="Review" ${isEdit && task.status === 'Review' ? 'selected' : ''}>Review</option>
                    <option value="Completed" ${isEdit && task.status === 'Completed' ? 'selected' : ''}>Completed</option>
                  </select>
                </div>
              </div>

              <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="task-project" class="form-label">Project</label>
                  <select class="form-select" id="task-project" required>
                    <option value="" disabled ${!isEdit ? 'selected' : ''}>Select Project</option>
                    ${projectsData.data.map(project => `
                      <option value="${project.id}" ${isEdit && task.project === project.id ? 'selected' : ''}>
                        ${project.name}
                      </option>
                    `).join('')}
                  </select>
                </div>
                <div class="col-md-6 mb-3">
                  <label for="task-assigned-to" class="form-label">Assigned To</label>
                  <select class="form-select" id="task-assigned-to" required>
                    <option value="" disabled ${!isEdit ? 'selected' : ''}>Select Employee</option>
                    ${employeesData.data.map(employee => `
                      <option value="${employee.id}" ${isEdit && task.assignedTo === employee.id ? 'selected' : ''}>
                        ${employee.name} (${employee.position})
                      </option>
                    `).join('')}
                  </select>
                </div>
              </div>

              <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="task-start-date" class="form-label">Start Date</label>
                  <input type="date" class="form-control" id="task-start-date" value="${isEdit && task.startDate ? task.startDate : new Date().toISOString().split('T')[0]}" required>
                </div>
                <div class="col-md-6 mb-3">
                  <label for="task-due-date" class="form-label">Due Date</label>
                  <input type="date" class="form-control" id="task-due-date" value="${isEdit && task.dueDate ? task.dueDate : ''}">
                </div>
              </div>

              <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="task-priority" class="form-label">Priority</label>
                  <select class="form-select" id="task-priority">
                    <option value="Low" ${isEdit && task.priority === 'Low' ? 'selected' : ''}>Low</option>
                    <option value="Medium" ${isEdit && task.priority === 'Medium' ? 'selected' : ''}>Medium</option>
                    <option value="High" ${isEdit && task.priority === 'High' ? 'selected' : ''}>High</option>
                    <option value="Critical" ${isEdit && task.priority === 'Critical' ? 'selected' : ''}>Critical</option>
                  </select>
                </div>
                <div class="col-md-6 mb-3">
                  <label for="task-estimated-hours" class="form-label">Estimated Hours</label>
                  <input type="number" class="form-control" id="task-estimated-hours" value="${isEdit ? task.estimatedHours : '0'}" min="0">
                </div>
              </div>

              <div class="mb-3">
                <label for="task-description" class="form-label">Description</label>
                <textarea class="form-control" id="task-description" rows="3">${isEdit ? task.description : ''}</textarea>
              </div>

              <div class="d-grid">
                <button type="submit" class="btn btn-primary">${submitButtonText} Task</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    `;

    // Add modal to body
    document.body.appendChild(modal);

    // Initialize Bootstrap modal
    const taskFormModal = new bootstrap.Modal(document.getElementById('taskFormModal'));
    taskFormModal.show();

    // Handle form submission
    document.getElementById('task-form').addEventListener('submit', async function(e) {
      e.preventDefault();

      // Get form values
      const title = document.getElementById('task-title').value;
      const status = document.getElementById('task-status').value;
      const projectId = document.getElementById('task-project').value;
      const assignedToId = document.getElementById('task-assigned-to').value;
      const startDate = document.getElementById('task-start-date').value;
      const dueDate = document.getElementById('task-due-date').value;
      const priority = document.getElementById('task-priority').value;
      const estimatedHours = parseInt(document.getElementById('task-estimated-hours').value) || 0;
      const description = document.getElementById('task-description').value;

      // Create task object
      const taskData = {
        title,
        description,
        project: parseInt(projectId),
        assignedTo: parseInt(assignedToId),
        assignedBy: 3, // Default to Mike Johnson (manager)
        startDate,
        dueDate: dueDate || null,
        status,
        priority,
        estimatedHours,
        actualHours: isEdit ? task.actualHours : 0
      };

      try {
        let response;

        if (isEdit) {
          // Update existing task
          response = await fetch(`/api/tasks/${task.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(taskData)
          });
        } else {
          // Create new task
          response = await fetch('/api/tasks', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(taskData)
          });
        }

        const data = await response.json();

        if (data.success) {
          // Close modal
          taskFormModal.hide();

          // Show success message
          showAlert(`Task ${isEdit ? 'updated' : 'added'} successfully`, 'success');

          // Reload tasks content
          loadTasksContent();
        } else {
          showAlert(data.message || `Error ${isEdit ? 'updating' : 'adding'} task`, 'danger');
        }
      } catch (error) {
        console.error(`Error ${isEdit ? 'updating' : 'adding'} task:`, error);
        showAlert(`An error occurred while ${isEdit ? 'updating' : 'adding'} the task`, 'danger');
      }
    });

    // Remove modal from DOM when hidden
    document.getElementById('taskFormModal').addEventListener('hidden.bs.modal', function() {
      this.remove();
    });
  } catch (error) {
    console.error('Error showing task form:', error);
    showAlert('An error occurred while loading the task form', 'danger');
  }
}

// Function to view task details
async function viewTask(taskId) {
  try {
    // Fetch task data
    const response = await fetch(`/api/tasks/${taskId}`);
    const data = await response.json();

    if (!data.success) {
      showAlert(data.message || 'Error fetching task details', 'danger');
      return;
    }

    const task = data.data;

    // Fetch project data
    const projectResponse = await fetch(`/api/projects/${task.project}`);
    const projectData = await projectResponse.json();
    const project = projectData.success ? projectData.data : null;

    // Fetch employee data
    const employeeResponse = await fetch(`/api/employees/${task.assignedTo}`);
    const employeeData = await employeeResponse.json();
    const employee = employeeData.success ? employeeData.data : null;

    // Create modal element
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.id = 'taskViewModal';
    modal.tabIndex = '-1';
    modal.setAttribute('aria-labelledby', 'taskViewModalLabel');
    modal.setAttribute('aria-hidden', 'true');

    // Get status badge class
    let statusClass = '';
    switch (task.status) {
      case 'To Do':
        statusClass = 'badge bg-secondary';
        break;
      case 'In Progress':
        statusClass = 'badge bg-primary';
        break;
      case 'Review':
        statusClass = 'badge bg-info';
        break;
      case 'Completed':
        statusClass = 'badge bg-success';
        break;
      default:
        statusClass = 'badge bg-secondary';
    }

    // Get priority badge class
    let priorityClass = '';
    switch (task.priority) {
      case 'Low':
        priorityClass = 'badge bg-success';
        break;
      case 'Medium':
        priorityClass = 'badge bg-info';
        break;
      case 'High':
        priorityClass = 'badge bg-warning';
        break;
      case 'Critical':
        priorityClass = 'badge bg-danger';
        break;
      default:
        priorityClass = 'badge bg-secondary';
    }

    // Format dates
    const startDate = task.startDate ? new Date(task.startDate).toLocaleDateString() : 'N/A';
    const dueDate = task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A';
    const completedDate = task.completedDate ? new Date(task.completedDate).toLocaleDateString() : 'N/A';

    modal.innerHTML = `
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="taskViewModalLabel">Task Details</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="row mb-4">
              <div class="col-md-8">
                <h4>${task.title}</h4>
                <p class="text-muted">Project: ${project ? project.name : `Project ${task.project}`}</p>
              </div>
              <div class="col-md-4 text-end">
                <span class="${statusClass}">${task.status}</span>
                <span class="${priorityClass} ms-2">${task.priority}</span>
              </div>
            </div>

            <div class="row">
              <div class="col-md-6">
                <h6>Task Information</h6>
                <p><strong>Assigned To:</strong> ${employee ? employee.name : `Employee ${task.assignedTo}`}</p>
                <p><strong>Start Date:</strong> ${startDate}</p>
                <p><strong>Due Date:</strong> ${dueDate}</p>
                ${task.status === 'Completed' ? `<p><strong>Completed Date:</strong> ${completedDate}</p>` : ''}
                <p><strong>Estimated Hours:</strong> ${task.estimatedHours}</p>
                <p><strong>Actual Hours:</strong> ${task.actualHours}</p>
              </div>
              <div class="col-md-6">
                <h6>Description</h6>
                <p>${task.description || 'No description provided.'}</p>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" class="btn btn-success" id="complete-task-btn" ${task.status === 'Completed' ? 'disabled' : ''}>
              Mark as Completed
            </button>
            <button type="button" class="btn btn-primary" id="edit-task-btn-modal">Edit</button>
          </div>
        </div>
      </div>
    `;

    // Add modal to body
    document.body.appendChild(modal);

    // Initialize Bootstrap modal
    const taskViewModal = new bootstrap.Modal(document.getElementById('taskViewModal'));
    taskViewModal.show();

    // Handle edit button click
    document.getElementById('edit-task-btn-modal').addEventListener('click', function() {
      // Close view modal
      taskViewModal.hide();

      // Show edit form
      editTask(taskId);
    });

    // Handle complete button click
    document.getElementById('complete-task-btn').addEventListener('click', async function() {
      if (task.status === 'Completed') return;

      try {
        const response = await fetch(`/api/tasks/${taskId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            ...task,
            status: 'Completed',
            completedDate: new Date().toISOString().split('T')[0]
          })
        });

        const data = await response.json();

        if (data.success) {
          // Close modal
          taskViewModal.hide();

          // Show success message
          showAlert('Task marked as completed', 'success');

          // Reload tasks content
          loadTasksContent();
        } else {
          showAlert(data.message || 'Error updating task', 'danger');
        }
      } catch (error) {
        console.error('Error completing task:', error);
        showAlert('An error occurred while updating the task', 'danger');
      }
    });

    // Remove modal from DOM when hidden
    document.getElementById('taskViewModal').addEventListener('hidden.bs.modal', function() {
      this.remove();
    });
  } catch (error) {
    console.error('Error viewing task:', error);
    showAlert('An error occurred while fetching task details', 'danger');
  }
}

// Function to edit task
async function editTask(taskId) {
  try {
    // Fetch task data
    const response = await fetch(`/api/tasks/${taskId}`);
    const data = await response.json();

    if (!data.success) {
      showAlert(data.message || 'Error fetching task details', 'danger');
      return;
    }

    // Show task form with task data
    showTaskForm(data.data);
  } catch (error) {
    console.error('Error editing task:', error);
    showAlert('An error occurred while fetching task details', 'danger');
  }
}

// Function to show login modal
function showLoginModal() {
  // Create modal element
  const modal = document.createElement('div');
  modal.className = 'modal fade';
  modal.id = 'loginModal';
  modal.tabIndex = '-1';
  modal.setAttribute('aria-labelledby', 'loginModalLabel');
  modal.setAttribute('aria-hidden', 'true');

  modal.innerHTML = `
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="loginModalLabel">Login</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <form id="login-form">
            <div class="mb-3">
              <label for="email" class="form-label">Email address</label>
              <input type="email" class="form-control" id="email" placeholder="name@example.com" required>
            </div>
            <div class="mb-3">
              <label for="password" class="form-label">Password</label>
              <input type="password" class="form-control" id="password" required>
            </div>
            <div class="mb-3 form-check">
              <input type="checkbox" class="form-check-input" id="remember-me">
              <label class="form-check-label" for="remember-me">Remember me</label>
            </div>
            <div class="d-grid">
              <button type="submit" class="btn btn-primary">Login</button>
            </div>
          </form>
        </div>
        <div class="modal-footer justify-content-center">
          <p class="mb-0">Don't have an account? <a href="#" id="register-link">Register</a></p>
        </div>
      </div>
    </div>
  `;

  // Add modal to body
  document.body.appendChild(modal);

  // Initialize Bootstrap modal
  const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
  loginModal.show();

  // Handle form submission
  document.getElementById('login-form').addEventListener('submit', async function(e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
      // Make API call to login
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (data.success) {
        // Store token and user info in localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        // Close modal
        loginModal.hide();

        // Update UI for logged in user
        document.getElementById('login-btn').innerHTML = `${data.user.name} <i class="fas fa-user-circle"></i>`;

        // Show success message
        showAlert('Login successful!', 'success');
      } else {
        // Show error message
        showAlert(data.message || 'Invalid email or password', 'danger');
      }
    } catch (error) {
      console.error('Login error:', error);
      showAlert('An error occurred during login. Please try again.', 'danger');
    }
  });

  // Handle register link
  document.getElementById('register-link').addEventListener('click', function(e) {
    e.preventDefault();

    // Close login modal
    loginModal.hide();

    // Show register modal
    showRegisterModal();
  });
}

// Function to show register modal
function showRegisterModal() {
  // Create modal element
  const modal = document.createElement('div');
  modal.className = 'modal fade';
  modal.id = 'registerModal';
  modal.tabIndex = '-1';
  modal.setAttribute('aria-labelledby', 'registerModalLabel');
  modal.setAttribute('aria-hidden', 'true');

  modal.innerHTML = `
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="registerModalLabel">Register</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <form id="register-form">
            <div class="mb-3">
              <label for="register-name" class="form-label">Full Name</label>
              <input type="text" class="form-control" id="register-name" required>
            </div>
            <div class="mb-3">
              <label for="register-email" class="form-label">Email address</label>
              <input type="email" class="form-control" id="register-email" placeholder="name@example.com" required>
            </div>
            <div class="mb-3">
              <label for="register-password" class="form-label">Password</label>
              <input type="password" class="form-control" id="register-password" required>
            </div>
            <div class="mb-3">
              <label for="register-confirm-password" class="form-label">Confirm Password</label>
              <input type="password" class="form-control" id="register-confirm-password" required>
            </div>
            <div class="d-grid">
              <button type="submit" class="btn btn-primary">Register</button>
            </div>
          </form>
        </div>
        <div class="modal-footer justify-content-center">
          <p class="mb-0">Already have an account? <a href="#" id="login-link">Login</a></p>
        </div>
      </div>
    </div>
  `;

  // Add modal to body
  document.body.appendChild(modal);

  // Initialize Bootstrap modal
  const registerModal = new bootstrap.Modal(document.getElementById('registerModal'));
  registerModal.show();

  // Handle form submission
  document.getElementById('register-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;

    // Validate passwords match
    if (password !== confirmPassword) {
      showAlert('Passwords do not match', 'danger');
      return;
    }

    // In a real app, this would make an API call to register the user
    showAlert('Registration functionality would be implemented in a real app.', 'info');

    // Close modal
    registerModal.hide();
  });

  // Handle login link
  document.getElementById('login-link').addEventListener('click', function(e) {
    e.preventDefault();

    // Close register modal
    registerModal.hide();

    // Show login modal
    showLoginModal();
  });
}

// Function to show employee form (add/edit)
function showEmployeeForm(employee = null) {
  // Create modal element
  const modal = document.createElement('div');
  modal.className = 'modal fade';
  modal.id = 'employeeFormModal';
  modal.tabIndex = '-1';
  modal.setAttribute('aria-labelledby', 'employeeFormModalLabel');
  modal.setAttribute('aria-hidden', 'true');

  const isEdit = employee !== null;
  const modalTitle = isEdit ? 'Edit Employee' : 'Add Employee';
  const submitButtonText = isEdit ? 'Update' : 'Add';

  modal.innerHTML = `
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="employeeFormModalLabel">${modalTitle}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <form id="employee-form">
            <div class="row">
              <div class="col-md-6 mb-3">
                <label for="employee-name" class="form-label">Full Name</label>
                <input type="text" class="form-control" id="employee-name" value="${isEdit ? employee.name : ''}" required>
              </div>
              <div class="col-md-6 mb-3">
                <label for="employee-email" class="form-label">Email</label>
                <input type="email" class="form-control" id="employee-email" value="${isEdit ? employee.email : ''}" required>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6 mb-3">
                <label for="employee-position" class="form-label">Position</label>
                <input type="text" class="form-control" id="employee-position" value="${isEdit ? employee.position : ''}" required>
              </div>
              <div class="col-md-6 mb-3">
                <label for="employee-department" class="form-label">Department</label>
                <select class="form-select" id="employee-department" required>
                  <option value="" disabled ${!isEdit ? 'selected' : ''}>Select Department</option>
                  <option value="Development" ${isEdit && employee.department === 'Development' ? 'selected' : ''}>Development</option>
                  <option value="Design" ${isEdit && employee.department === 'Design' ? 'selected' : ''}>Design</option>
                  <option value="Management" ${isEdit && employee.department === 'Management' ? 'selected' : ''}>Management</option>
                  <option value="Quality Assurance" ${isEdit && employee.department === 'Quality Assurance' ? 'selected' : ''}>Quality Assurance</option>
                  <option value="Operations" ${isEdit && employee.department === 'Operations' ? 'selected' : ''}>Operations</option>
                  <option value="HR" ${isEdit && employee.department === 'HR' ? 'selected' : ''}>HR</option>
                  <option value="Finance" ${isEdit && employee.department === 'Finance' ? 'selected' : ''}>Finance</option>
                </select>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6 mb-3">
                <label for="employee-phone" class="form-label">Phone</label>
                <input type="text" class="form-control" id="employee-phone" value="${isEdit ? employee.phone : ''}">
              </div>
              <div class="col-md-6 mb-3">
                <label for="employee-hire-date" class="form-label">Hire Date</label>
                <input type="date" class="form-control" id="employee-hire-date" value="${isEdit ? employee.hireDate : new Date().toISOString().split('T')[0]}">
              </div>
            </div>
            <div class="row">
              <div class="col-md-6 mb-3">
                <label for="employee-salary" class="form-label">Salary</label>
                <input type="number" class="form-control" id="employee-salary" value="${isEdit ? employee.salary : '0'}">
              </div>
              <div class="col-md-6 mb-3">
                <label for="employee-status" class="form-label">Status</label>
                <select class="form-select" id="employee-status">
                  <option value="Active" ${isEdit && employee.status === 'Active' ? 'selected' : ''}>Active</option>
                  <option value="On Leave" ${isEdit && employee.status === 'On Leave' ? 'selected' : ''}>On Leave</option>
                  <option value="Terminated" ${isEdit && employee.status === 'Terminated' ? 'selected' : ''}>Terminated</option>
                </select>
              </div>
            </div>
            <div class="mb-3">
              <label for="employee-skills" class="form-label">Skills (comma separated)</label>
              <input type="text" class="form-control" id="employee-skills" value="${isEdit ? employee.skills.join(', ') : ''}">
            </div>
            <div class="d-grid">
              <button type="submit" class="btn btn-primary">${submitButtonText} Employee</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `;

  // Add modal to body
  document.body.appendChild(modal);

  // Initialize Bootstrap modal
  const employeeFormModal = new bootstrap.Modal(document.getElementById('employeeFormModal'));
  employeeFormModal.show();

  // Handle form submission
  document.getElementById('employee-form').addEventListener('submit', async function(e) {
    e.preventDefault();

    // Get form values
    const name = document.getElementById('employee-name').value;
    const email = document.getElementById('employee-email').value;
    const position = document.getElementById('employee-position').value;
    const department = document.getElementById('employee-department').value;
    const phone = document.getElementById('employee-phone').value;
    const hireDate = document.getElementById('employee-hire-date').value;
    const salary = parseInt(document.getElementById('employee-salary').value) || 0;
    const status = document.getElementById('employee-status').value;
    const skills = document.getElementById('employee-skills').value
      .split(',')
      .map(skill => skill.trim())
      .filter(skill => skill !== '');

    // Create employee object
    const employeeData = {
      name,
      email,
      position,
      department,
      phone,
      hireDate,
      salary,
      status,
      skills
    };

    try {
      let response;

      if (isEdit) {
        // Update existing employee
        response = await fetch(`/api/employees/${employee.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(employeeData)
        });
      } else {
        // Create new employee
        response = await fetch('/api/employees', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(employeeData)
        });
      }

      const data = await response.json();

      if (data.success) {
        // Close modal
        employeeFormModal.hide();

        // Show success message
        showAlert(`Employee ${isEdit ? 'updated' : 'added'} successfully`, 'success');

        // Reload employees content
        loadEmployeesContent();
      } else {
        showAlert(data.message || `Error ${isEdit ? 'updating' : 'adding'} employee`, 'danger');
      }
    } catch (error) {
      console.error(`Error ${isEdit ? 'updating' : 'adding'} employee:`, error);
      showAlert(`An error occurred while ${isEdit ? 'updating' : 'adding'} the employee`, 'danger');
    }
  });

  // Remove modal from DOM when hidden
  document.getElementById('employeeFormModal').addEventListener('hidden.bs.modal', function() {
    this.remove();
  });
}

// Function to view employee details
async function viewEmployee(employeeId) {
  try {
    // Fetch employee data
    const response = await fetch(`/api/employees/${employeeId}`);
    const data = await response.json();

    if (!data.success) {
      showAlert(data.message || 'Error fetching employee details', 'danger');
      return;
    }

    const employee = data.data;

    // Create modal element
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.id = 'employeeViewModal';
    modal.tabIndex = '-1';
    modal.setAttribute('aria-labelledby', 'employeeViewModalLabel');
    modal.setAttribute('aria-hidden', 'true');

    modal.innerHTML = `
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="employeeViewModalLabel">Employee Details</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="row mb-4">
              <div class="col-md-6">
                <h4>${employee.name}</h4>
                <p class="text-muted">${employee.position}</p>
              </div>
              <div class="col-md-6 text-end">
                <span class="badge ${employee.status === 'Active' ? 'bg-success' : employee.status === 'On Leave' ? 'bg-warning' : 'bg-danger'}">${employee.status}</span>
              </div>
            </div>

            <div class="row">
              <div class="col-md-6">
                <h6>Contact Information</h6>
                <p><strong>Email:</strong> ${employee.email}</p>
                <p><strong>Phone:</strong> ${employee.phone || 'N/A'}</p>
              </div>
              <div class="col-md-6">
                <h6>Employment Details</h6>
                <p><strong>Department:</strong> ${employee.department}</p>
                <p><strong>Hire Date:</strong> ${new Date(employee.hireDate).toLocaleDateString()}</p>
                <p><strong>Salary:</strong> $${employee.salary.toLocaleString()}</p>
              </div>
            </div>

            <div class="mt-4">
              <h6>Skills</h6>
              <div>
                ${employee.skills.map(skill => `<span class="badge bg-info me-1">${skill}</span>`).join('')}
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary" id="edit-employee-btn-modal">Edit</button>
          </div>
        </div>
      </div>
    `;

    // Add modal to body
    document.body.appendChild(modal);

    // Initialize Bootstrap modal
    const employeeViewModal = new bootstrap.Modal(document.getElementById('employeeViewModal'));
    employeeViewModal.show();

    // Handle edit button click
    document.getElementById('edit-employee-btn-modal').addEventListener('click', function() {
      // Close view modal
      employeeViewModal.hide();

      // Show edit form
      editEmployee(employeeId);
    });

    // Remove modal from DOM when hidden
    document.getElementById('employeeViewModal').addEventListener('hidden.bs.modal', function() {
      this.remove();
    });
  } catch (error) {
    console.error('Error viewing employee:', error);
    showAlert('An error occurred while fetching employee details', 'danger');
  }
}

// Function to edit employee
async function editEmployee(employeeId) {
  try {
    // Fetch employee data
    const response = await fetch(`/api/employees/${employeeId}`);
    const data = await response.json();

    if (!data.success) {
      showAlert(data.message || 'Error fetching employee details', 'danger');
      return;
    }

    // Show employee form with employee data
    showEmployeeForm(data.data);
  } catch (error) {
    console.error('Error editing employee:', error);
    showAlert('An error occurred while fetching employee details', 'danger');
  }
}

// Function to initialize Bootstrap components
function initializeBootstrapComponents() {
  console.log('Initializing Bootstrap components');

  // Initialize dropdowns
  const dropdownElementList = [].slice.call(document.querySelectorAll('[data-bs-toggle="dropdown"]'));
  const dropdowns = dropdownElementList.map(function (dropdownToggleEl) {
    return new bootstrap.Dropdown(dropdownToggleEl);
  });

  // Initialize tooltips
  const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  const tooltips = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });

  // Initialize popovers
  const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
  const popovers = popoverTriggerList.map(function (popoverTriggerEl) {
    return new bootstrap.Popover(popoverTriggerEl);
  });

  console.log('Bootstrap components initialized:', {
    dropdowns: dropdownElementList.length,
    tooltips: tooltipTriggerList.length,
    popovers: popoverTriggerList.length
  });
}

// Function to show alert message
function showAlert(message, type = 'info') {
  // Create alert element
  const alert = document.createElement('div');
  alert.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3`;
  alert.style.zIndex = '9999';
  alert.role = 'alert';

  alert.innerHTML = `
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  `;

  // Add alert to body
  document.body.appendChild(alert);

  // Auto dismiss after 3 seconds
  setTimeout(() => {
    alert.remove();
  }, 3000);
}

// Function to initialize timeline controls for desktop
function initializeTimelineControls() {
  console.log('Initializing timeline controls');

  // Get timeline elements
  const timelineItems = document.querySelectorAll('.timeline-item');
  const filterButtons = document.querySelectorAll('.timeline-filter-btn');
  const searchInput = document.getElementById('timeline-search');
  const searchButton = document.getElementById('timeline-search-btn');
  const timeRangeLinks = document.querySelectorAll('[data-range]');
  const loadMoreButton = document.getElementById('load-more-activities');
  const closeFilterBtn = document.getElementById('close-filter-btn');

  // Log elements for debugging
  console.log('Timeline items:', timelineItems.length);
  console.log('Filter buttons:', filterButtons.length);
  console.log('Search input:', searchInput);
  console.log('Search button:', searchButton);
  console.log('Time range links:', timeRangeLinks.length);
  console.log('Load more button:', loadMoreButton);

  // Filter timeline items by type
  if (filterButtons.length > 0) {
    filterButtons.forEach(button => {
      button.addEventListener('click', function() {
        console.log('Filter button clicked:', this.getAttribute('data-filter'));

        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));

        // Add active class to clicked button
        this.classList.add('active');

        // Get filter type
        const filterType = this.getAttribute('data-filter');

        // Filter timeline items
        timelineItems.forEach(item => {
          if (filterType === 'all' || item.getAttribute('data-type') === filterType) {
            item.style.display = '';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }

  // Search timeline items
  if (searchInput && searchButton) {
    searchButton.addEventListener('click', function() {
      console.log('Search button clicked');
      searchTimeline();
    });

    searchInput.addEventListener('keyup', function(e) {
      if (e.key === 'Enter') {
        console.log('Search input enter pressed');
        searchTimeline();
      }
    });
  }

  // Filter timeline items by time range
  if (timeRangeLinks.length > 0) {
    timeRangeLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('Time range link clicked:', this.getAttribute('data-range'));

        // Remove active class from all links
        timeRangeLinks.forEach(l => l.classList.remove('active'));

        // Add active class to clicked link
        this.classList.add('active');

        // Get time range
        const timeRange = this.getAttribute('data-range');

        // Filter timeline items by time range
        filterTimelineByRange(timeRange);
      });
    });
  }

  // Load more activities
  if (loadMoreButton) {
    loadMoreButton.addEventListener('click', function(e) {
      e.preventDefault();
      console.log('Load more button clicked');
      loadMoreActivities();
    });
  }

  // Function to search timeline
  function searchTimeline() {
    const searchTerm = searchInput.value.toLowerCase();
    console.log('Searching for:', searchTerm);

    if (searchTerm.trim() === '') {
      // If search term is empty, show all items (respecting current filter)
      const activeFilter = document.querySelector('.timeline-filter-btn.active');
      const filterType = activeFilter ? activeFilter.getAttribute('data-filter') : 'all';
      console.log('Empty search, respecting current filter:', filterType);

      timelineItems.forEach(item => {
        if (filterType === 'all' || item.getAttribute('data-type') === filterType) {
          item.style.display = '';
        } else {
          item.style.display = 'none';
        }
      });

      return;
    }

    // Search in timeline items
    let matchCount = 0;
    timelineItems.forEach(item => {
      const content = item.querySelector('.timeline-item-content').textContent.toLowerCase();

      if (content.includes(searchTerm)) {
        item.style.display = '';
        matchCount++;
      } else {
        item.style.display = 'none';
      }
    });

    console.log('Search results:', matchCount, 'matches found');

    // Show a message if no results found
    if (matchCount === 0) {
      showAlert('No activities found matching your search.', 'info');
    }
  }

  // Function to filter timeline by time range
  function filterTimelineByRange(range) {
    console.log('Filtering by time range:', range);

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    let visibleCount = 0;

    timelineItems.forEach(item => {
      // Get date from marker text (simplified for demo)
      const markerText = item.querySelector('.timeline-item-marker-text').textContent;
      let itemDate;

      if (markerText.toLowerCase() === 'today') {
        itemDate = today;
      } else if (markerText.toLowerCase() === 'yesterday') {
        itemDate = new Date(today);
        itemDate.setDate(today.getDate() - 1);
      } else {
        // Parse date from marker text (e.g., "May 15")
        const parts = markerText.split(' ');
        if (parts.length === 2) {
          const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          const monthIndex = monthNames.indexOf(parts[0]);
          const day = parseInt(parts[1]);

          if (monthIndex !== -1 && !isNaN(day)) {
            itemDate = new Date(now.getFullYear(), monthIndex, day);
          }
        }
      }

      // If we couldn't parse the date, show the item
      if (!itemDate) {
        item.style.display = '';
        visibleCount++;
        return;
      }

      // Filter by range
      let isVisible = false;
      switch (range) {
        case 'today':
          isVisible = itemDate.getTime() === today.getTime();
          break;
        case 'week':
          isVisible = itemDate >= weekStart;
          break;
        case 'month':
          isVisible = itemDate >= monthStart;
          break;
        case 'all':
        default:
          isVisible = true;
          break;
      }

      item.style.display = isVisible ? '' : 'none';
      if (isVisible) visibleCount++;
    });

    console.log('Time range filter results:', visibleCount, 'items visible');

    // Show a message if no results found
    if (visibleCount === 0) {
      showAlert(`No activities found in the selected time range: ${range}.`, 'info');
    }
  }

  // Function to load more activities (demo)
  function loadMoreActivities() {
    // Show loading state
    loadMoreButton.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Loading...';
    loadMoreButton.disabled = true;

    console.log('Loading more activities...');

    // Simulate loading delay
    setTimeout(() => {
      // Create new timeline items
      const timeline = document.getElementById('activity-timeline');

      // Add new items (in a real app, these would come from an API)
      const newItems = [
        {
          type: 'employee',
          date: 'May 10',
          title: 'Employee promotion',
          content: 'Employee <strong>"John Doe"</strong> has been promoted to Senior Manager',
          time: 'May 10, 2023 at 2:30 PM',
          color: 'info'
        },
        {
          type: 'client',
          date: 'May 8',
          title: 'Client meeting scheduled',
          content: 'Meeting with client <strong>"Tech Solutions Inc."</strong> scheduled for next week',
          time: 'May 8, 2023 at 11:15 AM',
          color: 'warning'
        },
        {
          type: 'project',
          date: 'May 5',
          title: 'Project milestone reached',
          content: 'Project <strong>"E-commerce Platform"</strong> has reached milestone 2',
          time: 'May 5, 2023 at 4:20 PM',
          color: 'success'
        }
      ];

      console.log('Adding', newItems.length, 'new items to timeline');

      // Add new items to timeline
      newItems.forEach(item => {
        const timelineItem = document.createElement('div');
        timelineItem.className = 'timeline-item';
        timelineItem.setAttribute('data-type', item.type);

        timelineItem.innerHTML = `
          <div class="timeline-item-marker">
            <div class="timeline-item-marker-text">${item.date}</div>
            <div class="timeline-item-marker-indicator bg-${item.color}"></div>
          </div>
          <div class="timeline-item-content">
            <div class="timeline-item-title">
              ${item.title}
            </div>
            <p class="mb-0">${item.content}</p>
            <div class="timeline-item-time">
              <i class="fas fa-clock"></i> ${item.time}
            </div>
          </div>
        `;

        // Add hover effect event listeners
        timelineItem.addEventListener('mouseenter', function() {
          this.style.transform = 'translateX(5px)';
        });

        timelineItem.addEventListener('mouseleave', function() {
          this.style.transform = '';
        });

        timeline.appendChild(timelineItem);
      });

      // Reset button state
      loadMoreButton.innerHTML = '<i class="fas fa-history me-1"></i> Load More Activities';
      loadMoreButton.disabled = false;

      // Show success message
      showAlert('Loaded 3 more activities', 'success');

      // Apply current filters
      const activeFilter = document.querySelector('.timeline-filter-btn.active');
      if (activeFilter) {
        const filterType = activeFilter.getAttribute('data-filter');
        if (filterType !== 'all') {
          console.log('Applying current filter to new items:', filterType);
          document.querySelectorAll('.timeline-item').forEach(item => {
            if (item.getAttribute('data-type') !== filterType) {
              item.style.display = 'none';
            }
          });
        }
      }

      // Apply current search
      if (searchInput && searchInput.value.trim() !== '') {
        console.log('Applying current search to new items');
        searchTimeline();
      }

      // Apply current time range
      const activeRange = document.querySelector('[data-range].active');
      if (activeRange) {
        const timeRange = activeRange.getAttribute('data-range');
        if (timeRange !== 'all') {
          console.log('Applying current time range to new items:', timeRange);
          filterTimelineByRange(timeRange);
        }
      }
    }, 1500);
  }

  // Initialize tooltips for timeline items
  timelineItems.forEach(item => {
    // Add hover effect
    item.addEventListener('mouseenter', function() {
      this.style.transform = 'translateX(5px)';
    });

    item.addEventListener('mouseleave', function() {
      this.style.transform = '';
    });
  });

  console.log('Timeline controls initialized');
}
