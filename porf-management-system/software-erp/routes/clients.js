const express = require('express');
const router = express.Router();
const Client = require('../models/Client');
const { protect, authorize } = require('../middleware/auth');

// @desc    Get all clients
// @route   GET /api/clients
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const clients = await Client.find()
      .populate('projects', 'name status')
      .populate('invoices', 'invoiceNumber total status');
    
    res.status(200).json({
      success: true,
      count: clients.length,
      data: clients
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// @desc    Get single client
// @route   GET /api/clients/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const client = await Client.findById(req.params.id)
      .populate('projects', 'name description status startDate endDate')
      .populate('invoices', 'invoiceNumber total status issueDate dueDate');
    
    if (!client) {
      return res.status(404).json({ success: false, message: 'Client not found' });
    }
    
    res.status(200).json({
      success: true,
      data: client
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// @desc    Create new client
// @route   POST /api/clients
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const client = await Client.create(req.body);
    
    res.status(201).json({
      success: true,
      data: client
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// @desc    Update client
// @route   PUT /api/clients/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    let client = await Client.findById(req.params.id);
    
    if (!client) {
      return res.status(404).json({ success: false, message: 'Client not found' });
    }
    
    client = await Client.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      data: client
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// @desc    Delete client
// @route   DELETE /api/clients/:id
// @access  Private/Admin
router.delete('/:id', protect, authorize('admin', 'manager'), async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    
    if (!client) {
      return res.status(404).json({ success: false, message: 'Client not found' });
    }
    
    await client.deleteOne();
    
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
