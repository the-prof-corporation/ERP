const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const Client = require('../models/Client');
const Employee = require('../models/Employee');
const { protect, authorize } = require('../middleware/auth');

// @desc    Get all projects
// @route   GET /api/projects
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const projects = await Project.find()
      .populate('client', 'name company.name')
      .populate('projectManager', 'firstName lastName')
      .populate('team', 'firstName lastName position');
    
    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('client', 'name company.name contactPerson')
      .populate('projectManager', 'firstName lastName email phone')
      .populate('team', 'firstName lastName position')
      .populate('tasks', 'title status priority dueDate assignedTo');
    
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    
    res.status(200).json({
      success: true,
      data: project
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// @desc    Create new project
// @route   POST /api/projects
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    // Check if client exists
    const client = await Client.findById(req.body.client);
    
    if (!client) {
      return res.status(404).json({ success: false, message: 'Client not found' });
    }
    
    // Check if project manager exists
    const projectManager = await Employee.findById(req.body.projectManager);
    
    if (!projectManager) {
      return res.status(404).json({ success: false, message: 'Project manager not found' });
    }
    
    // Create project
    const project = await Project.create(req.body);
    
    // Add project to client's projects
    client.projects.push(project._id);
    await client.save();
    
    // Add project to project manager's projects
    projectManager.projects.push(project._id);
    await projectManager.save();
    
    // Add project to team members' projects
    if (req.body.team && req.body.team.length > 0) {
      for (const memberId of req.body.team) {
        const member = await Employee.findById(memberId);
        if (member) {
          member.projects.push(project._id);
          await member.save();
        }
      }
    }
    
    res.status(201).json({
      success: true,
      data: project
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    let project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    
    project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      data: project
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private/Admin
router.delete('/:id', protect, authorize('admin', 'manager'), async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    
    await project.deleteOne();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

module.exports = router;
