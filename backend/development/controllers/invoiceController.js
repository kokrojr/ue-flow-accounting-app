// ======================================================== //
// ------------------ Invoice Controller ------------------ //
// ======================================================== //

const InvoiceModel = require("../models/invoiceModel");

// Import Document Router

class InvoiceController {
  // -------------------------------- //
  // -------- Create Invoice -------- //
  // -------------------------------- //

  static async createInvoice(req, res) {
    try {
      // Get invoice data
      const invoiceData = req.body;
      const newInvoice = await InvoiceModel.createInvoice(invoiceData); // call invoice model
      res.status(201).json({
        message: "Invoice created successfully",
        invoice: newInvoice,
      });
    } catch (error) {
      // Handle errors
      res.status(500).json({ error: error.message });
    }
  }

  // -------------------------------------- //
  // -------- Delete Invoice by ID -------- //
  // -------------------------------------- //

  static async deleteInvoice(req, res) {
    try {
      const { invoiceId } = req.params; // Get invoice ID
      const result = await InvoiceModel.deleteInvoice(invoiceId);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // ----------------------------------- //
  // -------- Get Invoice by ID -------- //
  // ----------------------------------- //

  static async getInvoiceById(req, res) {
    try {
      const { invoiceId } = req.params; // Get invoice ID
      const invoice = await InvoiceModel.getInvoiceById(invoiceId);
      res.status(200).json({
        message: "Invoice retrieved successfully",
        invoice,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // -------------------------------------- //
  // -------- Update Invoice by ID -------- //
  // -------------------------------------- //

  static async updateInvoice(req, res) {
    try {
      const { invoiceId } = req.params; // Get invoice ID
      const updatedInvoiceData = req.body; // Get updated invoice data

      // Call the model to update the invoice
      const updatedInvoice = await InvoiceModel.updateInvoice(
        invoiceId,
        updatedInvoiceData
      );

      res.status(200).json({
        message: "Invoice updated successfully",
        invoice: updatedInvoice,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // ---------------------------------------------- //
  // -------------- Get all Invoices -------------- //
  // ---------------------------------------------- //

  static async getAllInvoices(req, res) {
    try {
      // Call the model to get all invoices
      const invoices = await InvoiceModel.getAllInvoices();

      res.status(200).json({
        message: "Invoices retrieved successfully",
        invoices,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // -------------------------------------------------------- //
  // -------------- Get all Invoices By Status -------------- //
  // -------------------------------------------------------- //

  static async getInvoicesByStatus(req, res) {
    try {
      const { status } = req.params; // Get status from the request parameters

      // Call the model to get invoices by status
      const invoices = await InvoiceModel.getInvoicesByStatus(status);

      res.status(200).json({
        message: `Invoices with status '${status}' retrieved successfully`,
        invoices,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // ----------------------------------------------------------- //
  // -------------- Get all Invoices By Customers -------------- //
  // ----------------------------------------------------------- //

  static async getInvoicesByCustomer(req, res) {
    try {
      const { customerId } = req.params; // Get customerId from the request parameters

      // Call the model to get invoices by customerId
      const invoices = await InvoiceModel.getInvoicesByCustomer(customerId);

      res.status(200).json({
        message: `Invoices for customer '${customerId}' retrieved successfully`,
        invoices,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // ------------------------------------------------------------ //
  // -------------- Get all Invoices By Date Range -------------- //
  // ------------------------------------------------------------ //

  static async getInvoicesByDateRange(req, res) {
    try {
      const { startDate, endDate } = req.query; // Get startDate and endDate from query parameters

      // Call the model to get invoices by date range
      const invoices = await InvoiceModel.getInvoicesByDateRange(
        new Date(startDate),
        new Date(endDate)
      );

      res.status(200).json({
        message: `Invoices between ${startDate} and ${endDate} retrieved successfully`,
        invoices,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  

}

module.exports = InvoiceController;
