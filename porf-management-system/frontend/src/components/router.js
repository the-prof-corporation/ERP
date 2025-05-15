import { LoginPage } from '../pages/loginPage.js';
import { RegisterPage } from '../pages/registerPage.js';
import { DashboardPage } from '../pages/dashboardPage.js';
import { CustomersPage } from '../pages/customersPage.js';
import { CustomerFormPage } from '../pages/customerFormPage.js';
import { EmployeesPage } from '../pages/employeesPage.js';
import { EmployeeFormPage } from '../pages/employeeFormPage.js';
import { ProjectsPage } from '../pages/projectsPage.js';
import { ProjectFormPage } from '../pages/projectFormPage.js';
import { TasksPage } from '../pages/tasksPage.js';
import { TaskFormPage } from '../pages/taskFormPage.js';
import { NotFoundPage } from '../pages/notFoundPage.js';

export class Router {
  constructor() {
    this.routes = [
      { path: '/', component: DashboardPage, auth: true },
      { path: '/login', component: LoginPage, auth: false },
      { path: '/register', component: RegisterPage, auth: false },
      { path: '/dashboard', component: DashboardPage, auth: true },
      { path: '/customers', component: CustomersPage, auth: true },
      { path: '/customers/add', component: CustomerFormPage, auth: true },
      { path: '/customers/edit/:id', component: CustomerFormPage, auth: true },
      { path: '/employees', component: EmployeesPage, auth: true },
      { path: '/employees/add', component: EmployeeFormPage, auth: true },
      { path: '/employees/edit/:id', component: EmployeeFormPage, auth: true },
      { path: '/projects', component: ProjectsPage, auth: true },
      { path: '/projects/add', component: ProjectFormPage, auth: true },
      { path: '/projects/edit/:id', component: ProjectFormPage, auth: true },
      { path: '/tasks', component: TasksPage, auth: true },
      { path: '/tasks/add', component: TaskFormPage, auth: true },
      { path: '/tasks/edit/:id', component: TaskFormPage, auth: true },
      { path: '404', component: NotFoundPage, auth: false }
    ];
  }

  init() {
    // Handle navigation
    window.addEventListener('hashchange', () => this.handleRoute());
    
    // Handle initial route
    this.handleRoute();
  }

  handleRoute() {
    const hash = window.location.hash.slice(1) || '/';
    const route = this.findRoute(hash);
    
    // Check if user is authenticated for protected routes
    if (route.auth && !localStorage.getItem('token')) {
      window.location.hash = '#/login';
      return;
    }
    
    // Check if user is already authenticated for auth routes
    if (!route.auth && localStorage.getItem('token') && (hash === '/login' || hash === '/register')) {
      window.location.hash = '#/dashboard';
      return;
    }
    
    const appContainer = document.getElementById('app');
    const component = new route.component();
    
    // Render the component
    appContainer.innerHTML = '';
    appContainer.appendChild(component.render());
    
    // Call afterRender if it exists
    if (typeof component.afterRender === 'function') {
      component.afterRender();
    }
  }

  findRoute(hash) {
    // Extract path and params
    const [path, queryString] = hash.split('?');
    
    // Find matching route
    for (const route of this.routes) {
      // Check for exact match
      if (route.path === path) {
        return route;
      }
      
      // Check for parameterized routes
      if (route.path.includes(':')) {
        const routeParts = route.path.split('/');
        const pathParts = path.split('/');
        
        if (routeParts.length === pathParts.length) {
          let match = true;
          const params = {};
          
          for (let i = 0; i < routeParts.length; i++) {
            if (routeParts[i].startsWith(':')) {
              const paramName = routeParts[i].slice(1);
              params[paramName] = pathParts[i];
            } else if (routeParts[i] !== pathParts[i]) {
              match = false;
              break;
            }
          }
          
          if (match) {
            route.params = params;
            return route;
          }
        }
      }
    }
    
    // Return 404 route if no match found
    return this.routes.find(route => route.path === '404');
  }
}
