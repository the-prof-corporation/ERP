const express = require('express');
const path = require('path');

// Initialize Express
const app = express();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Test API route
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

// Sample data
const data = {
  employees: [
    { id: 1, name: 'John Doe', position: 'Developer' },
    { id: 2, name: 'Jane Smith', position: 'Designer' },
    { id: 3, name: 'Mike Johnson', position: 'Manager' }
  ],
  clients: [
    { id: 1, name: 'ABC Corp', company: { name: 'ABC Corporation' } },
    { id: 2, name: 'XYZ Inc', company: { name: 'XYZ Incorporated' } }
  ],
  projects: [
    { id: 1, name: 'E-commerce Platform', client: { name: 'ABC Corp' }, status: 'In Progress', progress: 65 },
    { id: 2, name: 'Mobile App', client: { name: 'XYZ Inc' }, status: 'Planning', progress: 25 }
  ],
  tasks: [
    { id: 1, title: 'Design Database', status: 'Completed' },
    { id: 2, title: 'Implement Auth', status: 'In Progress' },
    { id: 3, title: 'Create UI', status: 'To Do' }
  ]
};

// API routes
app.get('/api/employees', (req, res) => {
  res.json({ success: true, count: data.employees.length, data: data.employees });
});

app.get('/api/clients', (req, res) => {
  res.json({ success: true, count: data.clients.length, data: data.clients });
});

app.get('/api/projects', (req, res) => {
  res.json({ success: true, count: data.projects.length, data: data.projects });
});

app.get('/api/tasks', (req, res) => {
  res.json({ success: true, count: data.tasks.length, data: data.tasks });
});

// Serve index.html for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
