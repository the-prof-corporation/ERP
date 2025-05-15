const express = require('express');
const path = require('path');
const cors = require('cors');

// Initialize Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

// Test API route
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

// Sample data for demo
const employees = [
  { id: 1, name: 'John Doe', position: 'Software Developer', department: 'Development' },
  { id: 2, name: 'Jane Smith', position: 'UI/UX Designer', department: 'Design' },
  { id: 3, name: 'Mike Johnson', position: 'Project Manager', department: 'Management' }
];

const clients = [
  { id: 1, name: 'ABC Corp', company: { name: 'ABC Corporation' }, contactPerson: { firstName: 'Alice', lastName: 'Brown' } },
  { id: 2, name: 'XYZ Inc', company: { name: 'XYZ Incorporated' }, contactPerson: { firstName: 'Bob', lastName: 'Wilson' } }
];

const projects = [
  { id: 1, name: 'E-commerce Platform', client: clients[0], status: 'In Progress', progress: 65 },
  { id: 2, name: 'Mobile App Development', client: clients[1], status: 'Planning', progress: 25 }
];

const tasks = [
  { id: 1, title: 'Design Database Schema', project: projects[0], status: 'Completed', dueDate: '2023-12-15' },
  { id: 2, title: 'Implement User Authentication', project: projects[0], status: 'In Progress', dueDate: '2023-12-20' },
  { id: 3, title: 'Create UI Mockups', project: projects[1], status: 'To Do', dueDate: '2023-12-25' }
];

// API routes
app.get('/api/employees', (req, res) => {
  res.json({ success: true, count: employees.length, data: employees });
});

app.get('/api/clients', (req, res) => {
  res.json({ success: true, count: clients.length, data: clients });
});

app.get('/api/projects', (req, res) => {
  res.json({ success: true, count: projects.length, data: projects });
});

app.get('/api/tasks', (req, res) => {
  res.json({ success: true, count: tasks.length, data: tasks });
});

// Serve index.html for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
