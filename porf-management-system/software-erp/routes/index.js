const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

// @desc    Home page
// @route   GET /
// @access  Public
router.get('/', (req, res) => {
  res.render('index', {
    title: 'Software ERP - Home',
    user: req.user || null
  });
});

// @desc    Dashboard page
// @route   GET /dashboard
// @access  Private
router.get('/dashboard', protect, (req, res) => {
  res.render('dashboard', {
    title: 'Dashboard',
    user: req.user
  });
});

// @desc    Login page
// @route   GET /login
// @access  Public
router.get('/login', (req, res) => {
  res.render('login', {
    title: 'Login',
    layout: 'layouts/auth'
  });
});

// @desc    Register page
// @route   GET /register
// @access  Public
router.get('/register', (req, res) => {
  res.render('register', {
    title: 'Register',
    layout: 'layouts/auth'
  });
});

module.exports = router;
