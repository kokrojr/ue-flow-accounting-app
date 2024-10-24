// Invoice Routes
const express = require("express");
const router = express.Router();
const InvoiceController = require("../controllers/invoiceController"); // Invoice Controller

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ //

// Fetch by Criteria
router.get("/status/:status", InvoiceController.getInvoicesByStatus); // Get invoices by status
router.get("/customer/:customerId", InvoiceController.getInvoicesByCustomer); // Get invoices by customer
router.get("/date-range", InvoiceController.getInvoicesByDateRange); // Get invoices by date range

// === CRUD Operations === //

router.post("/", InvoiceController.createInvoice); // Create a new invoice
router.get("/:invoiceId", InvoiceController.getInvoiceById); // Get an invoice by ID
router.put("/:invoiceId", InvoiceController.updateInvoice); // Update an invoice by ID
router.delete("/:invoiceId", InvoiceController.deleteInvoice); // Delete an invoice by ID
router.get("/", InvoiceController.getAllInvoices);

// // Workflow Actions
// router.put('/:invoiceId/submit', InvoiceController.submitInvoiceForApproval);  // Submit invoice for approval
// router.put('/:invoiceId/approve', InvoiceController.approveInvoice);  // Approve an invoice
// router.put('/:invoiceId/reject', InvoiceController.rejectInvoice);  // Reject an invoice
// router.put('/:invoiceId/close', InvoiceController.closeInvoice);  // Close an invoice

// // Payments and Archive
// router.put('/:invoiceId/paid', InvoiceController.markInvoiceAsPaid);  // Mark invoice as paid
// router.put('/:invoiceId/archive', InvoiceController.archiveInvoice);  // Archive an invoice

// // Comments
// router.post('/:invoiceId/comments', InvoiceController.addComment);  // Add a comment to an invoice

module.exports = router;
