const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const querystring = require('querystring');

const PORT = 5001;

// Helper function to parse JSON body from requests
const getRequestBody = (req) => {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        if (body) {
          resolve(JSON.parse(body));
        } else {
          resolve({});
        }
      } catch (error) {
        reject(error);
      }
    });
    req.on('error', (err) => {
      reject(err);
    });
  });
};

// Sample data
const data = {
  employees: [
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      position: 'Senior Developer',
      department: 'Development',
      phone: '(555) 123-4567',
      hireDate: '2020-01-15',
      skills: ['JavaScript', 'React', 'Node.js'],
      salary: 85000,
      status: 'Active'
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      position: 'UI/UX Designer',
      department: 'Design',
      phone: '(555) 234-5678',
      hireDate: '2021-03-10',
      skills: ['Figma', 'Adobe XD', 'CSS'],
      salary: 75000,
      status: 'Active'
    },
    {
      id: 3,
      name: 'Mike Johnson',
      email: 'mike.johnson@example.com',
      position: 'Project Manager',
      department: 'Management',
      phone: '(555) 345-6789',
      hireDate: '2019-06-22',
      skills: ['Agile', 'Scrum', 'Team Leadership'],
      salary: 95000,
      status: 'Active'
    },
    {
      id: 4,
      name: 'Sarah Williams',
      email: 'sarah.williams@example.com',
      position: 'QA Engineer',
      department: 'Quality Assurance',
      phone: '(555) 456-7890',
      hireDate: '2021-09-05',
      skills: ['Selenium', 'Jest', 'Manual Testing'],
      salary: 70000,
      status: 'Active'
    },
    {
      id: 5,
      name: 'David Brown',
      email: 'david.brown@example.com',
      position: 'DevOps Engineer',
      department: 'Operations',
      phone: '(555) 567-8901',
      hireDate: '2020-11-18',
      skills: ['Docker', 'Kubernetes', 'AWS'],
      salary: 90000,
      status: 'On Leave'
    }
  ],
  clients: [
    {
      id: 1,
      name: 'ABC Corp',
      company: {
        name: 'ABC Corporation',
        website: 'www.abccorp.com',
        industry: 'Finance'
      },
      contactPerson: {
        name: 'Alice Brown',
        firstName: 'Alice',
        lastName: 'Brown',
        email: 'alice.brown@abccorp.com',
        phone: '(555) 111-2222',
        position: 'CTO'
      },
      address: '123 Finance St, New York, NY',
      status: 'Active',
      projects: [1, 3]
    },
    {
      id: 2,
      name: 'XYZ Inc',
      company: {
        name: 'XYZ Incorporated',
        website: 'www.xyzinc.com',
        industry: 'Healthcare'
      },
      contactPerson: {
        name: 'Bob Wilson',
        firstName: 'Bob',
        lastName: 'Wilson',
        email: 'bob.wilson@xyzinc.com',
        phone: '(555) 222-3333',
        position: 'IT Director'
      },
      address: '456 Health Ave, Boston, MA',
      status: 'Active',
      projects: [2]
    },
    {
      id: 3,
      name: 'Tech Solutions',
      company: {
        name: 'Tech Solutions LLC',
        website: 'www.techsolutions.com',
        industry: 'Technology'
      },
      contactPerson: {
        name: 'Carol Davis',
        firstName: 'Carol',
        lastName: 'Davis',
        email: 'carol.davis@techsolutions.com',
        phone: '(555) 333-4444',
        position: 'CEO'
      },
      address: '789 Tech Blvd, San Francisco, CA',
      status: 'Active',
      projects: [4]
    },
    {
      id: 4,
      name: 'Global Retail',
      company: {
        name: 'Global Retail Group',
        website: 'www.globalretail.com',
        industry: 'Retail'
      },
      contactPerson: {
        name: 'Daniel Evans',
        firstName: 'Daniel',
        lastName: 'Evans',
        email: 'daniel.evans@globalretail.com',
        phone: '(555) 444-5555',
        position: 'Digital Director'
      },
      address: '101 Retail Row, Chicago, IL',
      status: 'Prospect',
      projects: []
    }
  ],
  projects: [
    {
      id: 1,
      name: 'E-commerce Platform',
      client: { id: 1, name: 'ABC Corp' },
      description: 'Development of a full-featured e-commerce platform with payment integration',
      manager: { id: 3, name: 'Mike Johnson' },
      team: [1, 2, 4],
      startDate: '2023-01-10',
      endDate: '2023-06-30',
      status: 'In Progress',
      progress: 65,
      budget: 120000,
      tasks: [1, 2, 3, 4]
    },
    {
      id: 2,
      name: 'Mobile App Development',
      client: { id: 2, name: 'XYZ Inc' },
      description: 'Creating a healthcare mobile application for patient management',
      manager: { id: 3, name: 'Mike Johnson' },
      team: [1, 5],
      startDate: '2023-02-15',
      endDate: '2023-08-15',
      status: 'Planning',
      progress: 25,
      budget: 85000,
      tasks: [5, 6]
    },
    {
      id: 3,
      name: 'Financial Dashboard',
      client: { id: 1, name: 'ABC Corp' },
      description: 'Building a real-time financial analytics dashboard',
      manager: { id: 3, name: 'Mike Johnson' },
      team: [1, 4],
      startDate: '2023-03-01',
      endDate: '2023-05-30',
      status: 'Completed',
      progress: 100,
      budget: 65000,
      tasks: [7, 8]
    },
    {
      id: 4,
      name: 'CRM Implementation',
      client: { id: 3, name: 'Tech Solutions' },
      description: 'Customizing and implementing a CRM solution',
      manager: { id: 3, name: 'Mike Johnson' },
      team: [2, 5],
      startDate: '2023-04-10',
      endDate: '2023-09-30',
      status: 'On Hold',
      progress: 35,
      budget: 95000,
      tasks: [9, 10]
    }
  ],
  tasks: [
    {
      id: 1,
      title: 'Design Database Schema',
      description: 'Create the database schema for the e-commerce platform',
      project: 1,
      assignedTo: 1,
      assignedBy: 3,
      startDate: '2023-01-15',
      dueDate: '2023-01-25',
      completedDate: '2023-01-23',
      status: 'Completed',
      priority: 'High',
      estimatedHours: 20,
      actualHours: 18
    },
    {
      id: 2,
      title: 'Implement User Authentication',
      description: 'Create secure user authentication system',
      project: 1,
      assignedTo: 1,
      assignedBy: 3,
      startDate: '2023-01-26',
      dueDate: '2023-02-10',
      completedDate: '2023-02-08',
      status: 'Completed',
      priority: 'High',
      estimatedHours: 30,
      actualHours: 32
    },
    {
      id: 3,
      title: 'Design UI/UX for Product Pages',
      description: 'Create mockups and designs for product listing and detail pages',
      project: 1,
      assignedTo: 2,
      assignedBy: 3,
      startDate: '2023-02-01',
      dueDate: '2023-02-20',
      completedDate: '2023-02-18',
      status: 'Completed',
      priority: 'Medium',
      estimatedHours: 40,
      actualHours: 35
    },
    {
      id: 4,
      title: 'Implement Payment Gateway',
      description: 'Integrate payment processing system',
      project: 1,
      assignedTo: 1,
      assignedBy: 3,
      startDate: '2023-03-01',
      dueDate: '2023-03-20',
      status: 'In Progress',
      priority: 'Critical',
      estimatedHours: 50,
      actualHours: 30
    },
    {
      id: 5,
      title: 'Create UI Mockups for Mobile App',
      description: 'Design the user interface for the healthcare mobile app',
      project: 2,
      assignedTo: 2,
      assignedBy: 3,
      startDate: '2023-02-20',
      dueDate: '2023-03-15',
      completedDate: '2023-03-10',
      status: 'Completed',
      priority: 'Medium',
      estimatedHours: 35,
      actualHours: 30
    },
    {
      id: 6,
      title: 'Setup Development Environment',
      description: 'Configure development and CI/CD pipeline for mobile app',
      project: 2,
      assignedTo: 5,
      assignedBy: 3,
      startDate: '2023-03-01',
      dueDate: '2023-03-10',
      status: 'To Do',
      priority: 'High',
      estimatedHours: 15,
      actualHours: 0
    },
    {
      id: 7,
      title: 'Design Financial Dashboard UI',
      description: 'Create UI design for financial dashboard',
      project: 3,
      assignedTo: 2,
      assignedBy: 3,
      startDate: '2023-03-05',
      dueDate: '2023-03-20',
      completedDate: '2023-03-18',
      status: 'Completed',
      priority: 'Medium',
      estimatedHours: 25,
      actualHours: 22
    },
    {
      id: 8,
      title: 'Implement Data Visualization',
      description: 'Create charts and graphs for financial data',
      project: 3,
      assignedTo: 1,
      assignedBy: 3,
      startDate: '2023-03-21',
      dueDate: '2023-04-10',
      completedDate: '2023-04-08',
      status: 'Completed',
      priority: 'High',
      estimatedHours: 40,
      actualHours: 45
    },
    {
      id: 9,
      title: 'CRM Requirements Gathering',
      description: 'Collect and document client requirements for CRM',
      project: 4,
      assignedTo: 3,
      assignedBy: 3,
      startDate: '2023-04-15',
      dueDate: '2023-04-30',
      completedDate: '2023-04-28',
      status: 'Completed',
      priority: 'High',
      estimatedHours: 30,
      actualHours: 25
    },
    {
      id: 10,
      title: 'CRM Customization',
      description: 'Customize CRM software according to requirements',
      project: 4,
      assignedTo: 5,
      assignedBy: 3,
      startDate: '2023-05-01',
      dueDate: '2023-05-30',
      status: 'On Hold',
      priority: 'Medium',
      estimatedHours: 60,
      actualHours: 20
    }
  ]
};

const server = http.createServer(async (req, res) => {
  console.log(`Request: ${req.method} ${req.url}`);

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle OPTIONS request for CORS
  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
    return;
  }

  // Parse the URL
  const parsedUrl = url.parse(req.url);
  const pathname = parsedUrl.pathname;
  const query = querystring.parse(parsedUrl.query || '');

  // API endpoints
  if (pathname === '/api/test') {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ message: 'API is working!' }));
    return;
  }

  // Handle employees endpoints
  if (pathname.startsWith('/api/employees')) {
    // GET all employees
    if (req.method === 'GET' && pathname === '/api/employees') {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ success: true, count: data.employees.length, data: data.employees }));
      return;
    }

    // GET single employee
    if (req.method === 'GET' && pathname.match(/^\/api\/employees\/\d+$/)) {
      const id = parseInt(pathname.split('/').pop());
      const employee = data.employees.find(emp => emp.id === id);

      if (employee) {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ success: true, data: employee }));
      } else {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ success: false, message: 'Employee not found' }));
      }
      return;
    }

    // POST new employee
    if (req.method === 'POST' && pathname === '/api/employees') {
      try {
        const body = await getRequestBody(req);

        // Validate required fields
        if (!body.name || !body.email || !body.position || !body.department) {
          res.statusCode = 400;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: false, message: 'Missing required fields' }));
          return;
        }

        // Create new employee
        const newEmployee = {
          id: data.employees.length > 0 ? Math.max(...data.employees.map(emp => emp.id)) + 1 : 1,
          name: body.name,
          email: body.email,
          position: body.position,
          department: body.department,
          phone: body.phone || '',
          hireDate: body.hireDate || new Date().toISOString().split('T')[0],
          skills: body.skills || [],
          salary: body.salary || 0,
          status: body.status || 'Active'
        };

        data.employees.push(newEmployee);

        res.statusCode = 201;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ success: true, data: newEmployee }));
      } catch (error) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ success: false, message: 'Invalid request body' }));
      }
      return;
    }

    // PUT update employee
    if (req.method === 'PUT' && pathname.match(/^\/api\/employees\/\d+$/)) {
      try {
        const id = parseInt(pathname.split('/').pop());
        const employeeIndex = data.employees.findIndex(emp => emp.id === id);

        if (employeeIndex === -1) {
          res.statusCode = 404;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: false, message: 'Employee not found' }));
          return;
        }

        const body = await getRequestBody(req);

        // Update employee
        data.employees[employeeIndex] = {
          ...data.employees[employeeIndex],
          ...body,
          id // Ensure ID doesn't change
        };

        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ success: true, data: data.employees[employeeIndex] }));
      } catch (error) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ success: false, message: 'Invalid request body' }));
      }
      return;
    }

    // DELETE employee
    if (req.method === 'DELETE' && pathname.match(/^\/api\/employees\/\d+$/)) {
      const id = parseInt(pathname.split('/').pop());
      const employeeIndex = data.employees.findIndex(emp => emp.id === id);

      if (employeeIndex === -1) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ success: false, message: 'Employee not found' }));
        return;
      }

      // Remove employee
      data.employees.splice(employeeIndex, 1);

      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ success: true, message: 'Employee deleted successfully' }));
      return;
    }
  }

  // Handle clients endpoints
  if (pathname.startsWith('/api/clients')) {
    // GET all clients
    if (req.method === 'GET' && pathname === '/api/clients') {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ success: true, count: data.clients.length, data: data.clients }));
      return;
    }

    // GET single client
    if (req.method === 'GET' && pathname.match(/^\/api\/clients\/\d+$/)) {
      const id = parseInt(pathname.split('/').pop());
      const client = data.clients.find(c => c.id === id);

      if (client) {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ success: true, data: client }));
      } else {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ success: false, message: 'Client not found' }));
      }
      return;
    }

    // POST new client
    if (req.method === 'POST' && pathname === '/api/clients') {
      try {
        const body = await getRequestBody(req);

        // Validate required fields
        if (!body.name || !body.company || !body.contactPerson) {
          res.statusCode = 400;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: false, message: 'Missing required fields' }));
          return;
        }

        // Create new client
        const newClient = {
          id: data.clients.length > 0 ? Math.max(...data.clients.map(c => c.id)) + 1 : 1,
          name: body.name,
          company: body.company,
          contactPerson: body.contactPerson,
          address: body.address || '',
          status: body.status || 'Active',
          projects: body.projects || []
        };

        // Ensure contactPerson has name property
        if (newClient.contactPerson.firstName && newClient.contactPerson.lastName && !newClient.contactPerson.name) {
          newClient.contactPerson.name = `${newClient.contactPerson.firstName} ${newClient.contactPerson.lastName}`;
        }

        data.clients.push(newClient);

        res.statusCode = 201;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ success: true, data: newClient }));
      } catch (error) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ success: false, message: 'Invalid request body' }));
      }
      return;
    }

    // PUT update client
    if (req.method === 'PUT' && pathname.match(/^\/api\/clients\/\d+$/)) {
      try {
        const id = parseInt(pathname.split('/').pop());
        const clientIndex = data.clients.findIndex(c => c.id === id);

        if (clientIndex === -1) {
          res.statusCode = 404;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: false, message: 'Client not found' }));
          return;
        }

        const body = await getRequestBody(req);

        // Update client
        data.clients[clientIndex] = {
          ...data.clients[clientIndex],
          ...body,
          id // Ensure ID doesn't change
        };

        // Ensure contactPerson has name property
        if (data.clients[clientIndex].contactPerson.firstName &&
            data.clients[clientIndex].contactPerson.lastName) {
          data.clients[clientIndex].contactPerson.name =
            `${data.clients[clientIndex].contactPerson.firstName} ${data.clients[clientIndex].contactPerson.lastName}`;
        }

        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ success: true, data: data.clients[clientIndex] }));
      } catch (error) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ success: false, message: 'Invalid request body' }));
      }
      return;
    }

    // DELETE client
    if (req.method === 'DELETE' && pathname.match(/^\/api\/clients\/\d+$/)) {
      const id = parseInt(pathname.split('/').pop());
      const clientIndex = data.clients.findIndex(c => c.id === id);

      if (clientIndex === -1) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ success: false, message: 'Client not found' }));
        return;
      }

      // Remove client
      data.clients.splice(clientIndex, 1);

      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ success: true, message: 'Client deleted successfully' }));
      return;
    }
  }

  // Handle projects endpoints
  if (pathname.startsWith('/api/projects')) {
    // GET all projects
    if (req.method === 'GET' && pathname === '/api/projects') {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ success: true, count: data.projects.length, data: data.projects }));
      return;
    }

    // GET single project
    if (req.method === 'GET' && pathname.match(/^\/api\/projects\/\d+$/)) {
      const id = parseInt(pathname.split('/').pop());
      const project = data.projects.find(p => p.id === id);

      if (project) {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ success: true, data: project }));
      } else {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ success: false, message: 'Project not found' }));
      }
      return;
    }

    // POST new project
    if (req.method === 'POST' && pathname === '/api/projects') {
      try {
        const body = await getRequestBody(req);

        // Validate required fields
        if (!body.name || !body.client || !body.manager) {
          res.statusCode = 400;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: false, message: 'Missing required fields' }));
          return;
        }

        // Create new project
        const newProject = {
          id: data.projects.length > 0 ? Math.max(...data.projects.map(p => p.id)) + 1 : 1,
          name: body.name,
          description: body.description || '',
          client: body.client,
          manager: body.manager,
          team: body.team || [],
          startDate: body.startDate || new Date().toISOString().split('T')[0],
          endDate: body.endDate || '',
          status: body.status || 'Planning',
          progress: body.progress || 0,
          budget: body.budget || 0,
          tasks: body.tasks || []
        };

        data.projects.push(newProject);

        res.statusCode = 201;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ success: true, data: newProject }));
      } catch (error) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ success: false, message: 'Invalid request body' }));
      }
      return;
    }

    // PUT update project
    if (req.method === 'PUT' && pathname.match(/^\/api\/projects\/\d+$/)) {
      try {
        const id = parseInt(pathname.split('/').pop());
        const projectIndex = data.projects.findIndex(p => p.id === id);

        if (projectIndex === -1) {
          res.statusCode = 404;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: false, message: 'Project not found' }));
          return;
        }

        const body = await getRequestBody(req);

        // Update project
        data.projects[projectIndex] = {
          ...data.projects[projectIndex],
          ...body,
          id // Ensure ID doesn't change
        };

        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ success: true, data: data.projects[projectIndex] }));
      } catch (error) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ success: false, message: 'Invalid request body' }));
      }
      return;
    }

    // DELETE project
    if (req.method === 'DELETE' && pathname.match(/^\/api\/projects\/\d+$/)) {
      const id = parseInt(pathname.split('/').pop());
      const projectIndex = data.projects.findIndex(p => p.id === id);

      if (projectIndex === -1) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ success: false, message: 'Project not found' }));
        return;
      }

      // Remove project
      data.projects.splice(projectIndex, 1);

      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ success: true, message: 'Project deleted successfully' }));
      return;
    }
  }

  // Handle tasks endpoints
  if (pathname.startsWith('/api/tasks')) {
    // GET all tasks
    if (req.method === 'GET' && pathname === '/api/tasks') {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ success: true, count: data.tasks.length, data: data.tasks }));
      return;
    }

    // GET single task
    if (req.method === 'GET' && pathname.match(/^\/api\/tasks\/\d+$/)) {
      const id = parseInt(pathname.split('/').pop());
      const task = data.tasks.find(t => t.id === id);

      if (task) {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ success: true, data: task }));
      } else {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ success: false, message: 'Task not found' }));
      }
      return;
    }

    // POST new task
    if (req.method === 'POST' && pathname === '/api/tasks') {
      try {
        const body = await getRequestBody(req);

        // Validate required fields
        if (!body.title || !body.project || !body.assignedTo) {
          res.statusCode = 400;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: false, message: 'Missing required fields' }));
          return;
        }

        // Create new task
        const newTask = {
          id: data.tasks.length > 0 ? Math.max(...data.tasks.map(t => t.id)) + 1 : 1,
          title: body.title,
          description: body.description || '',
          project: body.project,
          assignedTo: body.assignedTo,
          assignedBy: body.assignedBy || 3, // Default to Mike Johnson (manager)
          startDate: body.startDate || new Date().toISOString().split('T')[0],
          dueDate: body.dueDate || '',
          status: body.status || 'To Do',
          priority: body.priority || 'Medium',
          estimatedHours: body.estimatedHours || 0,
          actualHours: body.actualHours || 0
        };

        data.tasks.push(newTask);

        // Add task to project
        const projectIndex = data.projects.findIndex(p => p.id === parseInt(body.project));
        if (projectIndex !== -1) {
          data.projects[projectIndex].tasks.push(newTask.id);
        }

        res.statusCode = 201;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ success: true, data: newTask }));
      } catch (error) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ success: false, message: 'Invalid request body' }));
      }
      return;
    }

    // PUT update task
    if (req.method === 'PUT' && pathname.match(/^\/api\/tasks\/\d+$/)) {
      try {
        const id = parseInt(pathname.split('/').pop());
        const taskIndex = data.tasks.findIndex(t => t.id === id);

        if (taskIndex === -1) {
          res.statusCode = 404;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: false, message: 'Task not found' }));
          return;
        }

        const body = await getRequestBody(req);

        // If status is being updated to 'Completed', set completedDate
        if (body.status === 'Completed' && data.tasks[taskIndex].status !== 'Completed') {
          body.completedDate = new Date().toISOString().split('T')[0];
        }

        // Update task
        data.tasks[taskIndex] = {
          ...data.tasks[taskIndex],
          ...body,
          id // Ensure ID doesn't change
        };

        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ success: true, data: data.tasks[taskIndex] }));
      } catch (error) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ success: false, message: 'Invalid request body' }));
      }
      return;
    }

    // DELETE task
    if (req.method === 'DELETE' && pathname.match(/^\/api\/tasks\/\d+$/)) {
      const id = parseInt(pathname.split('/').pop());
      const taskIndex = data.tasks.findIndex(t => t.id === id);

      if (taskIndex === -1) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ success: false, message: 'Task not found' }));
        return;
      }

      // Remove task from project
      const projectId = data.tasks[taskIndex].project;
      const projectIndex = data.projects.findIndex(p => p.id === projectId);
      if (projectIndex !== -1) {
        data.projects[projectIndex].tasks = data.projects[projectIndex].tasks.filter(t => t !== id);
      }

      // Remove task
      data.tasks.splice(taskIndex, 1);

      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ success: true, message: 'Task deleted successfully' }));
      return;
    }
  }

  // Authentication endpoint
  if (pathname === '/api/auth/login') {
    if (req.method === 'POST') {
      try {
        const body = await getRequestBody(req);

        // Validate required fields
        if (!body.email || !body.password) {
          res.statusCode = 400;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: false, message: 'Email and password are required' }));
          return;
        }

        // Check credentials (in a real app, this would be more secure)
        if (body.email === 'admin@example.com' && body.password === 'password') {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({
            success: true,
            token: 'fake-jwt-token',
            user: {
              id: 1,
              name: 'Admin User',
              email: 'admin@example.com',
              role: 'admin'
            }
          }));
        } else {
          res.statusCode = 401;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: false, message: 'Invalid credentials' }));
        }
      } catch (error) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ success: false, message: 'Invalid request body' }));
      }
      return;
    }
  }

  // Serve static files
  let filePath = path.join(__dirname, 'public', req.url === '/' ? 'index.html' : req.url);

  // Get the file extension
  const extname = path.extname(filePath);

  // Set the content type based on the file extension
  let contentType = 'text/html';
  switch (extname) {
    case '.js':
      contentType = 'text/javascript';
      break;
    case '.css':
      contentType = 'text/css';
      break;
    case '.json':
      contentType = 'application/json';
      break;
    case '.png':
      contentType = 'image/png';
      break;
    case '.jpg':
      contentType = 'image/jpg';
      break;
  }

  // Read the file
  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // Page not found
        fs.readFile(path.join(__dirname, 'public', 'index.html'), (err, content) => {
          if (err) {
            res.writeHead(500);
            res.end('Server Error');
            return;
          }

          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(content, 'utf8');
        });
      } else {
        // Some server error
        res.writeHead(500);
        res.end(`Server Error: ${err.code}`);
      }
    } else {
      // Success
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf8');
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
