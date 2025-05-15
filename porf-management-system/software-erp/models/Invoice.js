const mongoose = require('mongoose');

const InvoiceSchema = new mongoose.Schema({
  invoiceNumber: {
    type: String,
    required: [true, 'Please add an invoice number'],
    unique: true,
    trim: true
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  issueDate: {
    type: Date,
    required: [true, 'Please add an issue date'],
    default: Date.now
  },
  dueDate: {
    type: Date,
    required: [true, 'Please add a due date']
  },
  items: [{
    description: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    unitPrice: {
      type: Number,
      required: true
    },
    amount: {
      type: Number,
      required: true
    }
  }],
  subtotal: {
    type: Number,
    required: true
  },
  taxRate: {
    type: Number,
    default: 0
  },
  taxAmount: {
    type: Number,
    default: 0
  },
  discount: {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    required: true
  },
  notes: String,
  terms: String,
  status: {
    type: String,
    enum: ['Draft', 'Sent', 'Paid', 'Overdue', 'Cancelled'],
    default: 'Draft'
  },
  paymentMethod: {
    type: String,
    enum: ['Bank Transfer', 'Credit Card', 'PayPal', 'Cash', 'Check', 'Other'],
  },
  paymentDate: {
    type: Date
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Calculate if invoice is overdue
InvoiceSchema.virtual('isOverdue').get(function() {
  const today = new Date();
  const due = new Date(this.dueDate);
  return today > due && this.status !== 'Paid' && this.status !== 'Cancelled';
});

// Enable virtuals in JSON
InvoiceSchema.set('toJSON', { virtuals: true });
InvoiceSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Invoice', InvoiceSchema);
