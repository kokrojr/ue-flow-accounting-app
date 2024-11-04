// ====================================================== //
// ================= Invoice Controller ================= //
// ====================================================== //

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
      const creatorUserId = req.user.id;
      const creatorBoardId = req.user.userBoardId;

      const newInvoice = await InvoiceModel.createInvoice(invoiceData, creatorUserId, creatorBoardId); // call invoice model
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

  // ------------------------------------------------------------ //
  // -------------- Get invoices by payment status -------------- //
  // ------------------------------------------------------------ //

  static async getInvoicesByPaymentStatus(req, res) {
    try {
      const { status } = req.params;
      const invoices = await InvoiceModel.getInvoicesByField(
        "paymentStatus",
        status
      );
      res.status(200).json({
        message: `Invoices with payment status '${status}' retrieved successfully`,
        invoices,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // ------------------------------------------------------------ //
  // -------------- Get invoices by payment method -------------- //
  // ------------------------------------------------------------ //

  static async getInvoicesByPaymentMethod(req, res) {
    try {
      const { method } = req.params;
      const invoices = await InvoiceModel.getInvoicesByField(
        "paymentMethod",
        method
      );
      res.status(200).json({
        message: `Invoices with payment method '${method}' retrieved successfully`,
        invoices,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // --------------------------------------------------- //
  // -------------- Get disputed invoices -------------- //
  // --------------------------------------------------- //

  static async getDisputedInvoices(req, res) {
    try {
      const invoices = await InvoiceModel.getDisputedInvoices();
      res.status(200).json({
        message: `Disputed invoices retrieved successfully`,
        invoices,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get all open invoices (isClosed = false)
  // --------------------------------------------------- //
  // -------------- Get all open invoices -------------- //
  // --------------------------------------------------- //

  static async getOpenInvoices(req, res) {
    try {
      const invoices = await InvoiceModel.getInvoicesByField("isClosed", false);
      res.status(200).json({
        message: `Open invoices retrieved successfully`,
        invoices,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // --------------------------------------------------- //
  // ------------- Get all closed invoices ------------- //
  // --------------------------------------------------- //
  // Get all closed invoices (isClosed = true)

  static async getClosedInvoices(req, res) {
    try {
      const invoices = await InvoiceModel.getInvoicesByField("isClosed", true);
      res.status(200).json({
        message: `Closed invoices retrieved successfully`,
        invoices,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // ---------------------------------------------------- //
  // ------------- Workflow: Submit Invoice ------------- //
  // ---------------------------------------------------- //

  static async submitInvoice(req, res) {
    try {
      const { invoiceId } = req.params;
      const creatorUserId = req.user.id;
      const creatorBoardId = req.user.userBoardId;

      // Submit the invoice using the model method
      const response = await InvoiceModel.submitInvoice(
        invoiceId,
        creatorUserId,
        creatorBoardId
      );

      res.status(200).json({
        message: "Invoice submitted successfully for approval",
        data: response,
      });
    } catch (error) {
      res.status(500).json({
        error: error.message,
        info: "Failed to submit invoice. Please ensure the invoice ID is correct and the user has permission.",
      });
    }
  }

  // ---------------------------------------------------- //
  // ------------- Workflow: Approve Invoice ------------- //
  // ---------------------------------------------------- //

  static async approveInvoice(req, res) {
    try {
      const { invoiceId } = req.params;
      const approverUserId = req.user.id;

      const response = await InvoiceModel.approveInvoice(
        invoiceId,
        approverUserId
      );

      res.status(200).json({
        message: "Invoice approved successfully",
        data: response,
      });
    } catch (error) {
      res.status(500).json({
        error: error.message,
        info: "Failed to approve invoice. Please ensure the invoice ID and user permissions are correct.",
      });
    }
  }

}

module.exports = InvoiceController;
