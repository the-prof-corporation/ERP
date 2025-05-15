const express = require('express');
const router = express.Router();
const { getUsers, getUserById, updateUser, deleteUser } = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

// Test route that doesn't require authentication
router.get('/test', (req, res) => {
  res.json({ message: 'User routes are working!' });
});

router.route('/')
  .get(protect, admin, getUsers);

router.route('/:id')
  .get(protect, getUserById)
  .put(protect, admin, updateUser)
  .delete(protect, admin, deleteUser);

module.exports = router;
