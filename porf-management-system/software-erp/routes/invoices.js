const express = require('express');
const router = express.Router();
const Invoice = require('../models/Invoice');
const Client = require('../models/Client');
const Project = require('../models/Project');
const { protect, authorize } = require('../middleware/auth');

// @desc    Get all invoices
// @route   GET /api/invoices
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const invoices = await Invoice.find()
      .populate('client', 'name company.name')
      .populate('project', 'name')
      .populate('createdBy', 'firstName lastName');
    
    res.status(200).json({
      success: true,
      count: invoices.length,
      data: invoices
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// @desc    Get invoices by client
// @route   GET /api/invoices/client/:clientId
// @access  Private
router.get('/client/:clientId', protect, async (req, res) => {
  try {
    const invoices = await Invoice.find({ client: req.params.clientId })
      .populate('project', 'name')
      .populate('createdBy', 'firstName lastName');
    
    res.status(200).json({
      success: true,
      count: invoices.length,
      data: invoices
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// @desc    Get invoices by project
// @route   GET /api/invoices/project/:projectId
// @access  Private
router.get('/project/:projectId', protect, async (req, res) => {
  try {
    const invoices = await Invoice.find({ project: req.params.projectId })
      .populate('client', 'name company.name')
      .populate('createdBy', 'firstName lastName');
    
    res.status(200).json({
      success: true,
      count: invoices.length,
      data: invoices
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// @desc    Get single invoice
// @route   GET /api/invoices/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate('client', 'name company contactPerson')
      .populate('project', 'name')
      .populate('createdBy', 'firstName lastName');
    
    if (!invoice) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }
    
    res.status(200).json({
      success: true,
      data: invoice
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// @desc    Create new invoice
// @route   POST /api/invoices
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    // Check if client exists
    const client = await Client.findById(req.body.client);
    
    if (!client) {
      return res.status(404).json({ success: false, message: 'Client not found' });
    }
    
    // Check if project exists
    const project = await Project.findById(req.body.project);
    
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    
    // Set createdBy to current user's employee record
    req.body.createdBy = req.user.id;
    
    // Create invoice
    const invoice = await Invoice.create(req.body);
    
    // Add invoice to client's invoices
    client.invoices.push(invoice._id);
    await client.save();
    
    res.status(201).json({
      success: true,
      data: invoice
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// @desc    Update invoice
// @route   PUT /api/invoices/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    let invoice = await Invoice.findById(req.params.id);
    
    if (!invoice) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }
    
    // If status is being updated to 'Paid', set paymentDate
    if (req.body.status === 'Paid' && invoice.status !== 'Paid') {
      req.body.paymentDate = Date.now();
    }
    
    invoice = await Invoice.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      data: invoice
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// @desc    Delete invoice
// @route   DELETE /api/invoices/:id
// @access  Private/Admin
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    
    if (!invoice) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }
    
    // Remove invoice from client's invoices
    const client = await Client.findById(invoice.client);
    if (client) {
      client.invoices = client.invoices.filter(
        invoiceId => invoiceId.toString() !== req.params.id
      );
      await client.save();
    }
    
    await invoice.deleteOne();
    
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
