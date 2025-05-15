const express = require('express');
const router = express.Router();
const { 
  getTasks, 
  getTaskById, 
  getTasksByProject,
  getTasksByUser,
  createTask, 
  updateTask, 
  deleteTask,
  addTaskComment
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getTasks)
  .post(protect, createTask);

router.route('/project/:projectId')
  .get(protect, getTasksByProject);

router.route('/user/:userId')
  .get(protect, getTasksByUser);

router.route('/:id')
  .get(protect, getTaskById)
  .put(protect, updateTask)
  .delete(protect, deleteTask);

router.route('/:id/comments')
  .post(protect, addTaskComment);

module.exports = router;
