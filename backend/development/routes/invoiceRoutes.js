// ============================================================ //
// ====================== Invoice Routes ====================== //
// ============================================================ //

const express = require("express");
const router = express.Router();
const InvoiceController = require("../controllers/invoiceController"); // Invoice Controller

// ----------------------------------------------------------------------- //
// -------------------------- Fetch by Criteria -------------------------- //
// ----------------------------------------------------------------------- //

router.get("/status/:status", InvoiceController.getInvoicesByStatus); // Get invoices by status
router.get("/customer/:customerId", InvoiceController.getInvoicesByCustomer); // Get invoices by customer
router.get("/date-range", InvoiceController.getInvoicesByDateRange); // Get invoices by date range
router.get("/payment-status/:status", InvoiceController.getInvoicesByPaymentStatus); // Get invoices by payment status
router.get("/payment-method/:method", InvoiceController.getInvoicesByPaymentMethod); // Get invoices by payment method
router.get("/disputed", InvoiceController.getDisputedInvoices); // Get all disputed invoices
router.get("/open", InvoiceController.getOpenInvoices); // Get all open invoices
router.get("/closed", InvoiceController.getClosedInvoices); // Get all closed invoices


// ------------------------------------------------------------------------ //
// ----------------------- Workflow Specific Routes ----------------------- //
// ------------------------------------------------------------------------ //

router.put('/:invoiceId/submit', InvoiceController.submitInvoice);  // Submit invoice for approval
// router.put("/:invoiceId/submit", InvoiceController.submitInvoice); // Submit invoice
// Workflow-specific routes
// router.put('/:invoiceId/approve', InvoiceController.approveInvoice);  // Approve invoice
// router.put('/:invoiceId/reject', InvoiceController.rejectInvoice);  // Reject invoice

// ------------------------------------------------------------------------ //
// ------------------------- CRUD Specific Routes ------------------------- //
// ------------------------------------------------------------------------ //

router.post("/", InvoiceController.createInvoice); // Create a new invoice
router.get("/:invoiceId", InvoiceController.getInvoiceById); // Get an invoice by ID
router.put("/:invoiceId", InvoiceController.updateInvoice); // Update an invoice by ID
router.delete("/:invoiceId", InvoiceController.deleteInvoice); // Delete an invoice by ID
router.get("/", InvoiceController.getAllInvoices);

module.exports = router;
