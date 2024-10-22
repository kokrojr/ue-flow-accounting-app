// ==== Invoice Scheme ==== //

class Invoice {
  constructor(invoiceData) {
    try {
      // Document Metadata
      this.docID = invoiceData.docID || ""; // Unique invoice ID
      this.docReference = invoiceData.docReference || ""; // Invoice sequence number
      this.docType = invoiceData.docType || "invoice";
      this.isSubmitted = invoiceData.isSubmitted || false;
      this.isClosed = invoiceData.isClosed || false;
      this.isPaid = invoiceData.isPaid || false;
      this.isArchived = invoiceData.isArchived || false;

      // Customer & Items
      this.customer = invoiceData.customer || {}; // Customer object
      if (!Array.isArray(invoiceData.items))
        throw new Error("Items must be an array");
      this.items = invoiceData.items || []; // List of invoice items

      // Dates
      this.dateCreated = invoiceData.dateCreated || new Date();
      this.dateDue = invoiceData.dateDue || null;
      this.dateSubmitted = invoiceData.dateSubmitted || null;
      this.dateApprovedOrRejected = invoiceData.dateApprovedOrRejected || null;
      this.dateClosed = invoiceData.dateClosed || null;
      this.lastUpdated = invoiceData.lastUpdated || new Date().toISOString();

      // Status & Notes
      this.status = invoiceData.status || "Draft";
      this.notes = invoiceData.notes || "";

      // Created By Information
      this.createdBy = invoiceData.createdBy || {};

      // Payment & Terms
      this.paymentMethod = invoiceData.paymentMethod || "Not set";
      this.paymentTerms = invoiceData.paymentTerms || "Net 30";

      // Currency Information
      this.currency = invoiceData.currency || "USD";
      this.conversionRate = invoiceData.conversionRate || 1;
      this.convertedTotals = invoiceData.convertedTotals || {};

      // Totals
      this.subtotal = invoiceData.subtotal || 0;
      this.grandTotal = invoiceData.grandTotal || 0;

      // Taxes & Discounts
      this.tax = invoiceData.tax || [];
      this.discount = invoiceData.discount || {};

      // Attachments & Related Documents
      this.attachments = invoiceData.attachments || [];
      this.relatedDocuments = invoiceData.relatedDocuments || [];

      // Workflow, Assignee Information, & KPIs
      this.workflow = invoiceData.workflow || {};
      this.currentAssignee = invoiceData.currentAssignee || {};
      this.routingHistory = invoiceData.routingHistory || [];
      this.reports = invoiceData.reports || {};

      // Finance info
      this.financeInfo = invoiceData.financeInfo || {};

      // Comments by stakeholders
      this.comments = invoiceData.comments || [];

      // Dispute info
      this.disputeInfo = invoiceData.disputeInfo || {};
    } catch (error) {
      console.error(`Error initializing Invoice class: ${error.message}`);
      throw error; // Rethrow to notify calling code
    }
  }

  // 

  
}

// Export class
module.exports = Invoice;
