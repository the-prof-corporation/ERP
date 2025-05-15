const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

// Define Routes
try {
  app.use('/api/users', require('./routes/userRoutes'));
  app.use('/api/customers', require('./routes/customerRoutes'));
  app.use('/api/projects', require('./routes/projectRoutes'));
  app.use('/api/tasks', require('./routes/taskRoutes'));
  app.use('/api/auth', require('./routes/authRoutes'));
} catch (error) {
  console.log('Some routes are not available yet:', error.message);
}

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static(path.join(__dirname, '../frontend/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
