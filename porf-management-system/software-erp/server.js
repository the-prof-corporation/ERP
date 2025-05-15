const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');

// Load environment variables
dotenv.config();

// Initialize Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Set up EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('layout', 'layouts/main');
app.set('views', path.join(__dirname, 'views'));

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/software-erp')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => {
    console.error('MongoDB Connection Error:', err.message);
    // In development mode, continue without database
    if (process.env.NODE_ENV === 'development') {
      console.log('Running in development mode without MongoDB connection');
    }
  });

// Routes
try {
  app.use('/', require('./routes/index'));
  console.log('Index routes loaded');
  app.use('/api/users', require('./routes/users'));
  console.log('User routes loaded');
  app.use('/api/employees', require('./routes/employees'));
  console.log('Employee routes loaded');
  app.use('/api/clients', require('./routes/clients'));
  console.log('Client routes loaded');
  app.use('/api/projects', require('./routes/projects'));
  console.log('Project routes loaded');
  app.use('/api/tasks', require('./routes/tasks'));
  console.log('Task routes loaded');
  app.use('/api/invoices', require('./routes/invoices'));
  console.log('Invoice routes loaded');
} catch (error) {
  console.error('Error loading routes:', error);
}

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

// Home route
app.get('/', (req, res) => {
  try {
    res.render('index', {
      title: 'Software ERP - Home',
      user: req.user || null,
      path: req.path
    });
  } catch (error) {
    console.error('Error rendering index:', error);
    res.status(500).send('Error rendering index page');
  }
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).render('404', {
    title: '404 - Page Not Found',
    user: req.user || null
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('500', {
    title: '500 - Server Error',
    user: req.user || null,
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
