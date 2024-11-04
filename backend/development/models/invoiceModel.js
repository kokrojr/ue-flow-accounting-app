// =================================================== //
// ------------------ Invoice Model ------------------ //
// =================================================== //

const Invoice = require("../schemas/invoice");
const FirestoreInterface = require("../db/firestore");
const UserBoardModel = require("./userBoardModel");
const InvoiceRouterModel = require("./invoiceRouterModel");
const PDFService = require("../services/pdfService"); // Generate PDFs
const EmailService = require("../services/emailService"); // Send Emails

class InvoiceModel {
  // -------------------------------------- //
  // ----------- Create Invoice ----------- //
  // -------------------------------------- //

  static async createInvoice(invoiceData, userID, creatorBoardId) {
    try {
      // Set default dateDue (30 days from dateCreated) if not provided
      if (!invoiceData.dateDue) {
        const defaultDueDate = new Date();
        defaultDueDate.setDate(defaultDueDate.getDate() + 30); // Add 30 days
        invoiceData.dateDue = defaultDueDate;
      } else {
        // Convert provided dateDue to JavaScript Date object
        invoiceData.dateDue = new Date(invoiceData.dateDue);
      }

      // Instantiate invoice
      const invoice = new Invoice(invoiceData);
      const invoiceDoc =
        FirestoreInterface.prepareDocumentForFirestore(invoice);

      // Add invoice to Firestore and retrieve generated docID
      const docID = await FirestoreInterface.addDocument(
        "invoices",
        invoiceDoc
      );
      invoice.docID = docID; // Set docID on invoice instance

      // Update Firestore document with the generated ID
      await FirestoreInterface.updateDocument("invoices", docID, { docID });

      if (!creatorBoardId) throw new Error("Approver's user board not found");

      // Assign the document to the approver's user board
      await UserBoardModel.assignDocument(creatorBoardId, {
        docID,
        docType: "invoice",
        purpose: "created",
        assignedBy: userID,
        status: "Draft",
        priority: "normal",
      });

      return invoice; // Return the created invoice object
    } catch (error) {
      throw new Error(`Error creating invoice: ${error.message}`);
    }
  }

  // -------------------------------------------- //
  // ----------- Delete Invoice by ID ----------- //
  // -------------------------------------------- //

  static async deleteInvoice(invoiceId) {
    try {
      if (!invoiceId) {
        throw new Error("Invoice ID must be provided to delete the invoice.");
      }
      await FirestoreInterface.deleteDocument("invoices", invoiceId);
      return { message: `Invoice with ID ${invoiceId} deleted successfully` };
    } catch (error) {
      console.error(`Error deleting invoice: ${error.message}`);
      throw new Error(`Error deleting invoice: ${error.message}`);
    }
  }

  // ------------------------------------------- //
  // ------------ Get Invoice by ID ------------ //
  // ------------------------------------------- //

  static async getInvoiceById(invoiceId) {
    try {
      if (!invoiceId) {
        throw new Error("Invoice ID must be provided to retrieve the invoice.");
      }
      const invoiceData = await FirestoreInterface.getDocumentById(
        "invoices",
        invoiceId
      ); // Fetch from Firestore
      if (!invoiceData) {
        throw new Error(`Invoice with ID ${invoiceId} not found.`);
      }
      return Invoice.fromFirestoreData(invoiceData); // Convert Firestore data to Invoice instance
    } catch (error) {
      console.error(`Error retrieving invoice: ${error.message}`);
      throw new Error(`Error retrieving invoice: ${error.message}`);
    }
  }

  // ---------------------------------------------- //
  // ------------ Update Invoice by ID ------------ //
  // ---------------------------------------------- //

  static async updateInvoice(invoiceId, updatedData) {
    try {
      if (!invoiceId) {
        throw new Error("Invoice ID must be provided to update the invoice.");
      }

      // Add or update the `lastUpdated` field with the current timestamp
      updatedData.lastUpdated = new Date().toISOString();

      // Update the document in Firestore with the new data
      await FirestoreInterface.updateDocument(
        "invoices",
        invoiceId,
        updatedData
      );

      // Retrieve the updated invoice from Firestore
      const updatedInvoiceData = await FirestoreInterface.getDocumentById(
        "invoices",
        invoiceId
      );

      if (!updatedInvoiceData) {
        throw new Error(`Invoice with ID ${invoiceId} not found.`);
      }

      // Convert Firestore data to Invoice instance and return it
      return Invoice.fromFirestoreData(updatedInvoiceData);
    } catch (error) {
      console.error(`Error updating invoice: ${error.message}`);
      throw new Error(`Error updating invoice: ${error.message}`);
    }
  }

  // ---------------------------------------------- //
  // -------------- Get all Invoices -------------- //
  // ---------------------------------------------- //

  static async getAllInvoices() {
    try {
      // Fetch all documents in the 'invoices' collection
      const allInvoices = await FirestoreInterface.getAllDocuments("invoices");

      // Convert each Firestore document to an Invoice instance
      return allInvoices.map((invoiceData) =>
        Invoice.fromFirestoreData(invoiceData)
      );
    } catch (error) {
      console.error(`Error retrieving invoices: ${error.message}`);
      throw new Error(`Error retrieving invoices: ${error.message}`);
    }
  }

  // -------------------------------------------------------- //
  // -------------- Get all Invoices By Status -------------- //
  // -------------------------------------------------------- //

  static async getInvoicesByStatus(status) {
    try {
      if (!status) {
        throw new Error("Status must be provided to filter invoices.");
      }

      // Query Firestore for documents in 'invoices' where 'status' matches
      const filteredInvoices = await FirestoreInterface.getDocumentsByField(
        "invoices",
        "status",
        status
      );

      // Convert each Firestore document to an Invoice instance
      return filteredInvoices.map((invoiceData) =>
        Invoice.fromFirestoreData(invoiceData)
      );
    } catch (error) {
      console.error(`Error retrieving invoices by status: ${error.message}`);
      throw new Error(`Error retrieving invoices by status: ${error.message}`);
    }
  }

  // -------------------------------------------------------- //
  // ------- Get all Invoices By Specific Field Value ------- //
  // -------------------------------------------------------- //

  static async getInvoicesByField(field, value) {
    try {
      const invoices = await FirestoreInterface.getDocumentsByField(
        "invoices",
        field,
        value
      );
      return invoices;
    } catch (error) {
      throw new Error(
        `Error retrieving invoices by ${field}: ${error.message}`
      );
    }
  }

  // ----------------------------------------------------------- //
  // -------------- Get all Invoices By Customers -------------- //
  // ----------------------------------------------------------- //

  static async getInvoicesByCustomer(customerId) {
    try {
      if (!customerId) {
        throw new Error("Customer ID must be provided to filter invoices.");
      }

      // Query Firestore for documents in 'invoices' where 'customer.customerId' matches the provided customerId
      const filteredInvoices = await FirestoreInterface.getDocumentsByField(
        "invoices",
        "customer.id",
        customerId
      );

      // Convert each Firestore document to an Invoice instance
      return filteredInvoices.map((invoiceData) =>
        Invoice.fromFirestoreData(invoiceData)
      );
    } catch (error) {
      console.error(`Error retrieving invoices by customer: ${error.message}`);
      throw new Error(
        `Error retrieving invoices by customer: ${error.message}`
      );
    }
  }

  // ------------------------------------------------------------ //
  // -------------- Get all Invoices By Date Range -------------- //
  // ------------------------------------------------------------ //

  static async getInvoicesByDateRange(startDate, endDate) {
    try {
      if (!startDate || !endDate) {
        throw new Error(
          "Start date and end date must be provided to filter invoices."
        );
      }

      // Query Firestore for documents in 'invoices' where 'dateCreated' is within the date range
      const filteredInvoices = await FirestoreInterface.getDocumentsByDateRange(
        "invoices",
        "dateCreated",
        startDate,
        endDate
      );

      // Convert each Firestore document to an Invoice instance
      return filteredInvoices.map((invoiceData) =>
        Invoice.fromFirestoreData(invoiceData)
      );
    } catch (error) {
      console.error(
        `Error retrieving invoices by date range: ${error.message}`
      );
      throw new Error(
        `Error retrieving invoices by date range: ${error.message}`
      );
    }
  }

  // ------------------------------------------------------- //
  // -------------- Get all disputed invoices -------------- //
  // ------------------------------------------------------- //

  static async getDisputedInvoices() {
    try {
      const invoices = await FirestoreInterface.getDocumentsByCondition(
        "invoices",
        "disputeInfo.isActive",
        true
      );
      return invoices;
    } catch (error) {
      throw new Error(`Error retrieving disputed invoices: ${error.message}`);
    }
  }

  // ------------------------------------------------------- //
  // -------------- Update Invoice Status -------------- //
  // ------------------------------------------------------- //

  // Method to update invoice status with additional fields
  static async updateInvoiceStatus(invoiceId, status, additionalData = {}) {
    try {
      const invoice = await FirestoreInterface.getDocumentById(
        "invoices",
        invoiceId
      );

      if (!invoice) throw new Error("Invoice not found");

      // Update status and additional fields
      const updatedData = {
        ...additionalData,
        status,
        lastUpdated: new Date().toISOString(),
      };

      await FirestoreInterface.updateDocument(
        "invoices",
        invoiceId,
        updatedData
      );
      return { ...invoice, ...updatedData };
    } catch (error) {
      throw new Error(`Error updating invoice status: ${error.message}`);
    }
  }

  // ====================================================== //
  // ===================== Begin Flow ===================== //
  // ====================================================== //

  // --------------------------------------------------- //
  // Submit Invoice for Approval

  static async submitInvoice(invoiceId, userId, creatorBoardId) {
    try {
      // Fetch invoice
      const invoice = await this.getInvoiceById(invoiceId);
      if (!invoice) throw new Error("Invoice not found");

      // Ensure invoice is in draft stage
      if (invoice.status !== "Draft") {
        throw new Error("Invoice must be in Draft to submit for approval.");
      }

      // Update essential fields before routing
      invoice.dateSubmitted = new Date().toISOString();

      // Update workflow status
      invoice.workflow.currentStage = "Submitted";
      invoice.workflow.statusChangeDate = new Date().toISOString();
      invoice.workflow.actions.push({
        stage: "Submitted",
        action: "Submitted for Approval",
        by: userId,
        timeStamp: new Date().toISOString(),
      });

      // Save workflow, submission status, and assignee in Firestore
      await this.updateInvoice(invoiceId, {
        dateSubmitted: invoice.dateSubmitted,
        workflow: invoice.workflow,
      });

      // Initiate invoice routing
      return await this.sendInvoiceForApproval(invoiceId, creatorBoardId);
    } catch (error) {
      throw new Error(`Error submitting invoice: ${error.message}`);
    }
  }

  // --------------------------------------------------- //
  // Send Invoice for Approval

  static async sendInvoiceForApproval(invoiceId, creatorBoardId) {
    try {
      // Retrieve invoice
      const invoice = await this.getInvoiceById(invoiceId);
      if (!invoice) throw new Error("Invoice not found");

      // Get approver details
      const approver = await InvoiceRouterModel.findRoleByRole(
        "default",
        "Approver"
      );

      // Validate if approver is set
      if (!approver) throw new Error("Approver not found");

      // Find the approver's user board ID
      const approverBoardId = await UserBoardModel.getUserBoardIdByUserId(
        approver.userId
      );

      if (!approverBoardId) throw new Error("Approver's user board not found");

      // Assign the document to the approver's user board
      await UserBoardModel.assignDocument(approverBoardId, {
        docID: invoiceId,
        docType: "invoice",
        purpose: "for approval",
        assignedBy: "system",
        status: "pending",
        priority: "high",
      });

      // Remove from creator's user board
      await UserBoardModel.removeAssignedDocument(creatorBoardId, invoiceId);

      // Update currentAssignee in the invoice
      invoice.currentAssignee = {
        userId: approver.userId,
        userName: approver.userName,
      };

      // Update essential fields
      invoice.isSubmitted = true;
      invoice.status = "Submitted";

      // Update workflow
      invoice.workflow.actions.push({
        stage: "Approval",
        action: "Routed for Approval",
        by: "system",
        timeStamp: new Date().toISOString(),
      });

      // Update Firestore
      await this.updateInvoice(invoiceId, {
        isSubmitted: invoice.isSubmitted,
        status: invoice.status,
        currentAssignee: invoice.currentAssignee,
        workflow: invoice.workflow,
      });

      return invoice;

    } catch (error) {
      throw new Error(`Error sending invoice for approval: ${error.message}`);
    }
  }

  // --------------------------------------------------- //
  // Approve Invoice

  static async approveInvoice(invoiceId, approverUserId) {
    try {
      // Step 1: Retrieve the invoice and validate its current stage
      const invoiceData = await FirestoreInterface.getDocumentById(
        "invoices",
        invoiceId
      );
      if (!invoiceData) throw new Error("Invoice not found");

      if (invoiceData.workflow.currentStage !== "Submitted") {
        throw new Error("Invoice must be in 'Submitted' stage to approve");
      }

      // Step 2: Update workflow stage to Approved
      invoiceData.workflow.currentStage = "Approved";
      invoiceData.workflow.actions.push({
        stage: "Approved",
        action: "Approved by Approver",
        by: approverUserId,
        timestamp: new Date().toISOString(),
      });

      // Step 3: Route invoice to Finance for payment processing
      // Get the Finance role assignment from InvoiceRouterModel
      const financeUser = await InvoiceRouterModel.getRoleAssignment("Finance");
      if (!financeUser) throw new Error("Finance role assignment not found");

      // Get Finance user's userBoard ID
      const financeBoardId = await UserBoardModel.getUserBoardIdByUserId(
        financeUser.userId
      );
      if (!financeBoardId) throw new Error("Finance user board not found");

      // Assign the document to Finance's userBoard
      await UserBoardModel.assignDocument(financeBoardId, {
        docID: invoiceId,
        purpose: "for payment",
        assignedBy: approverUserId,
      });

      // Remove the document from Approver's userBoard
      const approverBoardId = await UserBoardModel.getUserBoardIdByUserId(
        approverUserId
      );
      await UserBoardModel.removeAssignedDocument(approverBoardId, invoiceId);

      // Step 4: Trigger PDF generation for the invoice
      PDFService.generateInvoicePDF(invoiceId); // Assumes a separate PDF service
      // await PDFService.generateInvoicePDF(invoiceId); // Assumes a separate PDF service

      // Step 5: Update currentAssignee in invoice to Finance
      invoiceData.currentAssignee = {
        userId: financeUser.userId,
        userName: financeUser.userName,
      };

      // Step 6: Save changes to Firestore
      await FirestoreInterface.updateDocument(
        "invoices",
        invoiceId,
        invoiceData
      );

      return {
        message: "Invoice approved successfully and forwarded to Finance",
        currentAssignee: invoiceData.currentAssignee,
      };
    } catch (error) {
      throw new Error(`Error approving invoice: ${error.message}`);
    }
  }
}

module.exports = InvoiceModel;
