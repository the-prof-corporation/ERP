const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const Project = require('../models/Project');
const { protect } = require('../middleware/auth');

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate('project', 'name')
      .populate('assignedTo', 'firstName lastName')
      .populate('assignedBy', 'firstName lastName');
    
    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// @desc    Get tasks by project
// @route   GET /api/tasks/project/:projectId
// @access  Private
router.get('/project/:projectId', protect, async (req, res) => {
  try {
    const tasks = await Task.find({ project: req.params.projectId })
      .populate('assignedTo', 'firstName lastName')
      .populate('assignedBy', 'firstName lastName');
    
    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// @desc    Get tasks by employee
// @route   GET /api/tasks/employee/:employeeId
// @access  Private
router.get('/employee/:employeeId', protect, async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.params.employeeId })
      .populate('project', 'name')
      .populate('assignedBy', 'firstName lastName');
    
    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('project', 'name client')
      .populate('assignedTo', 'firstName lastName email')
      .populate('assignedBy', 'firstName lastName')
      .populate('dependencies', 'title status')
      .populate('comments.user', 'name')
      .populate('timeEntries.createdBy', 'firstName lastName');
    
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }
    
    res.status(200).json({
      success: true,
      data: task
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    // Check if project exists
    const project = await Project.findById(req.body.project);
    
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    
    // Set assignedBy to current user's employee record
    req.body.assignedBy = req.user.id;
    
    // Create task
    const task = await Task.create(req.body);
    
    // Add task to project's tasks
    project.tasks.push(task._id);
    await project.save();
    
    res.status(201).json({
      success: true,
      data: task
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }
    
    // If status is being updated to 'Completed', set completedDate
    if (req.body.status === 'Completed' && task.status !== 'Completed') {
      req.body.completedDate = Date.now();
    }
    
    task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      data: task
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }
    
    // Remove task from project's tasks
    const project = await Project.findById(task.project);
    if (project) {
      project.tasks = project.tasks.filter(
        taskId => taskId.toString() !== req.params.id
      );
      await project.save();
    }
    
    await task.deleteOne();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// @desc    Add comment to task
// @route   POST /api/tasks/:id/comments
// @access  Private
router.post('/:id/comments', protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }
    
    const comment = {
      user: req.user.id,
      text: req.body.text
    };
    
    task.comments.unshift(comment);
    
    await task.save();
    
    res.status(200).json({
      success: true,
      data: task
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// @desc    Add time entry to task
// @route   POST /api/tasks/:id/time
// @access  Private
router.post('/:id/time', protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }
    
    const timeEntry = {
      date: req.body.date || Date.now(),
      hours: req.body.hours,
      description: req.body.description,
      createdBy: req.user.id
    };
    
    task.timeEntries.push(timeEntry);
    
    // Update actual hours
    task.actualHours = task.timeEntries.reduce((total, entry) => total + entry.hours, 0);
    
    await task.save();
    
    res.status(200).json({
      success: true,
      data: task
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

module.exports = router;
