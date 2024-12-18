// ====================================================== //
// =================== Invoice Scheme =================== //
// ====================================================== //

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
      this.hasPDF = invoiceData.hasPDF || false;
      this.pdfURL = invoiceData.pdfURL || "";

      // Customer & Items
      this.customer = invoiceData.customer || {}; // Customer object

      if (!Array.isArray(invoiceData.items))
        throw new Error("Items must be an array");
      this.items = invoiceData.items || []; // List of invoice items

      // Dates
      this.dateCreated = invoiceData.dateCreated || new Date().toISOString();
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

      // Totals
      this.subtotal = invoiceData.subtotal || 0;
      this.grandTotal = invoiceData.grandTotal || 0;
      this.convertedTotals = invoiceData.convertedTotals || {};

      // Taxes & Discounts
      this.tax = invoiceData.tax || [];
      this.discount = invoiceData.discount || {};

      // Attachments & Related Documents
      this.attachments = invoiceData.attachments || [];
      this.relatedDocuments = invoiceData.relatedDocuments || [];

      // Assignee Information, & KPIs
      this.currentAssignee = invoiceData.currentAssignee || {};
      this.routingHistory = invoiceData.routingHistory || [];
      this.reports = invoiceData.reports || {};

      // Workflow
      this.workflow = {
        currentStage: invoiceData.workflow?.currentStage || "Draft",
        actions: invoiceData.workflow?.actions || [],
        statusChangeDate: invoiceData.workflow?.statusChangeDate || null,
        expectedCompletionDate:
          invoiceData.workflow?.expectedCompletionDate || null,
      };

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

  // ------ Setters ------ //
  setDocID(docID) {
    this.docID = docID;
  }

  setDocReference(docReference) {
    this.docReference = docReference;
  }

  setDocType(docType) {
    this.docType = docType;
  }

  setSubmitted(isSubmitted) {
    this.isSubmitted = isSubmitted;
  }

  setClosed(isClosed) {
    this.isClosed = isClosed;
  }

  setPaid(isPaid) {
    this.isPaid = isPaid;
  }

  setArchived(isArchived) {
    this.isArchived = isArchived;
  }

  setCustomer(customer) {
    this.customer = customer;
  }

  setItems(items) {
    if (!Array.isArray(items)) throw new Error("Items must be an array");
    this.items = items;
  }

  setDateCreated(date) {
    this.dateCreated = date;
  }

  setDateDue(date) {
    this.dateDue = date;
  }

  setDateSubmitted(date) {
    this.dateSubmitted = date;
  }

  setDateApprovedOrRejected(date) {
    this.dateApprovedOrRejected = date;
  }

  setDateClosed(date) {
    this.dateClosed = date;
  }

  setStatus(status) {
    this.status = status;
  }

  setNotes(notes) {
    this.notes = notes;
  }

  setCreatedBy(createdBy) {
    this.createdBy = createdBy;
  }

  setPaymentMethod(method) {
    this.paymentMethod = method;
  }

  setPaymentTerms(terms) {
    this.paymentTerms = terms;
  }

  setCurrency(currency) {
    this.currency = currency;
  }

  setConversionRate(rate) {
    this.conversionRate = rate;
  }

  setSubtotal(subtotal) {
    this.subtotal = subtotal;
  }

  setGrandTotal(grandTotal) {
    this.grandTotal = grandTotal;
  }

  setTax(taxArray) {
    this.tax = taxArray;
  }

  setDiscount(discount) {
    this.discount = discount;
  }

  setAttachments(attachments) {
    this.attachments = attachments;
  }

  setRelatedDocuments(docs) {
    this.relatedDocuments = docs;
  }

  setWorkflow(workflow) {
    this.workflow = workflow;
  }

  setCurrentAssignee(assignee) {
    this.currentAssignee = assignee;
  }

  setRoutingHistory(history) {
    this.routingHistory = history;
  }

  setReports(reports) {
    this.reports = reports;
  }

  setFinanceInfo(info) {
    this.financeInfo = info;
  }

  setComments(comments) {
    this.comments = comments;
  }

  setDisputeInfo(disputeInfo) {
    this.disputeInfo = disputeInfo;
  }

  // ------ Getters ------ //
  getDocID() {
    return this.docID;
  }

  getDocReference() {
    return this.docReference;
  }

  getDocType() {
    return this.docType;
  }

  isInvoiceSubmitted() {
    return this.isSubmitted;
  }

  isInvoiceClosed() {
    return this.isClosed;
  }

  isInvoicePaid() {
    return this.isPaid;
  }

  isInvoiceArchived() {
    return this.isArchived;
  }

  getCustomer() {
    return this.customer;
  }

  getItems() {
    return this.items;
  }

  getDateCreated() {
    return this.dateCreated;
  }

  getDateDue() {
    return this.dateDue;
  }

  getDateSubmitted() {
    return this.dateSubmitted;
  }

  getDateApprovedOrRejected() {
    return this.dateApprovedOrRejected;
  }

  getDateClosed() {
    return this.dateClosed;
  }

  getStatus() {
    return this.status;
  }

  getNotes() {
    return this.notes;
  }

  getCreatedBy() {
    return this.createdBy;
  }

  getPaymentMethod() {
    return this.paymentMethod;
  }

  getPaymentTerms() {
    return this.paymentTerms;
  }

  getCurrency() {
    return this.currency;
  }

  getConversionRate() {
    return this.conversionRate;
  }

  getSubtotal() {
    return this.subtotal;
  }

  getGrandTotal() {
    return this.grandTotal;
  }

  getTax() {
    return this.tax;
  }

  getDiscount() {
    return this.discount;
  }

  getAttachments() {
    return this.attachments;
  }

  getRelatedDocuments() {
    return this.relatedDocuments;
  }

  getWorkflow() {
    return this.workflow;
  }

  getCurrentAssignee() {
    return this.currentAssignee;
  }

  getRoutingHistory() {
    return this.routingHistory;
  }

  getReports() {
    return this.reports;
  }

  getFinanceInfo() {
    return this.financeInfo;
  }

  getComments() {
    return this.comments;
  }

  getDisputeInfo() {
    return this.disputeInfo;
  }

  // ---------------------------------------------- //
  // ------- Methods for Workflow Processing ------ //
  // ---------------------------------------------- //

  // Workflow Getters
  getWorkflow() {
    return this.workflow;
  }

  getCurrentStage() {
    return this.workflow.currentStage;
  }

  getActions() {
    return this.workflow.actions;
  }

  getStatusChangeDate() {
    return this.workflow.statusChangeDate;
  }

  getExpectedCompletionDate() {
    return this.workflow.expectedCompletionDate;
  }

  // Workflow Setters
  setCurrentStage(stage) {
    this.workflow.currentStage = stage;
    this.updateStatusChangeDate();
  }

  setStatusChangeDate(date) {
    this.workflow.statusChangeDate = date;
  }

  setExpectedCompletionDate(date) {
    this.workflow.expectedCompletionDate = date;
  }

  // Method to update status change date
  updateStatusChangeDate() {
    this.workflow.statusChangeDate = new Date().toISOString();
  }

  // Method to add an action to the workflow
  addWorkflowAction({
    stage,
    action,
    by,
    timeStamp = new Date().toISOString(),
  }) {
    this.workflow.actions.push({
      stage,
      action,
      by,
      timeStamp,
    });
    this.updateStatusChangeDate(); // Update status change date each time an action is added
  }

  // Method to update the workflow stage and log the action
  advanceWorkflowStage(newStage, action, by) {
    this.setCurrentStage(newStage);
    this.addWorkflowAction({
      stage: newStage,
      action,
      by,
    });
  }

  // Method to set workflow as archived
  archiveWorkflow(by) {
    this.advanceWorkflowStage("Archived", "Archived", by);
  }

  // Method to check if workflow is completed
  isWorkflowCompleted() {
    return this.workflow.currentStage === "Completed";
  }

  // --------------------------------------------------------- //
  // ----- Methods Method to submit invoice for approval ----- //
  // --------------------------------------------------------- //

  // Method to submit invoice for approval
  submitForApproval() {
    if (this.workflow.currentStage !== "Draft") {
      throw new Error("Invoice must be in Draft to submit for approval.");
    }

    this.workflow.currentStage = "Submitted";
    this.workflow.statusChangeDate = new Date().toISOString();
    this.workflow.actions.push({
      stage: "Submitted",
      action: "Submitted for Approval",
      by: this.createdBy.userID,
      timeStamp: new Date().toISOString(),
    });
  }

  // ----------------------------------------- //
  // ----- Method to approve the invoice ----- //
  // ----------------------------------------- //

  approve(approver) {
    if (this.workflow.currentStage !== "Under Review") {
      throw new Error("Invoice must be under review to approve.");
    }

    this.workflow.currentStage = "Approved";
    this.workflow.statusChangeDate = new Date().toISOString();
    this.workflow.actions.push({
      stage: "Under Review",
      action: "Approved",
      by: approver.userID,
      timeStamp: new Date().toISOString(),
    });
  }

  // ----------------------------------------- //
  // ----- Method to reject the invoice ----- //
  // ----------------------------------------- //

  reject(approver, reason) {
    if (this.workflow.currentStage !== "Under Review") {
      throw new Error("Invoice must be under review to reject.");
    }

    this.workflow.currentStage = "Rejected";
    this.workflow.statusChangeDate = new Date().toISOString();
    this.workflow.actions.push({
      stage: "Under Review",
      action: `Rejected - ${reason}`,
      by: approver.userID,
      timeStamp: new Date().toISOString(),
    });
  }

  // ----------------------------------------- //
  // ----- Method to send for signature ----- //
  // ----------------------------------------- //

  sendForSignature(role) {
    if (this.workflow.currentStage !== "Approved") {
      throw new Error("Invoice must be approved to send for signature.");
    }

    const action =
      role === "creator"
        ? "Sent for Signature - Creator"
        : "Sent for Signature - Manager";
    this.workflow.actions.push({
      stage: "Approved",
      action: action,
      by: "System",
      timeStamp: new Date().toISOString(),
    });
  }

  // ----------------------------------------- //
  // ----- Method to mark as paid  ----- //
  // ----------------------------------------- //

  markAsPaid(financeUser) {
    if (this.workflow.currentStage !== "Finance Processing") {
      throw new Error("Invoice must be in finance processing to mark as paid.");
    }

    this.workflow.currentStage = "Paid";
    this.workflow.statusChangeDate = new Date().toISOString();
    this.workflow.actions.push({
      stage: "Finance Processing",
      action: "Marked as Paid",
      by: financeUser.userID,
      timeStamp: new Date().toISOString(),
    });
  }

  // ------------------------------ //
  // ----- Method to archive  ----- //
  // ------------------------------ //

  archive(user) {
    if (this.workflow.currentStage !== "Completed") {
      throw new Error("Invoice must be completed to archive.");
    }

    this.workflow.currentStage = "Archived";
    this.workflow.statusChangeDate = new Date().toISOString();
    this.workflow.actions.push({
      stage: "Archived",
      action: "Archived",
      by: user.userID,
      timeStamp: new Date().toISOString(),
    });
  }

  // ---------------------------------------------- //
  // ------- Methods for Calculating Totals ------- //
  // ---------------------------------------------- //

  // Calculate subtotal
  calculateSubtotal() {
    try {
      if (!Array.isArray(this.items)) throw new Error("Items must be an array");
      this.subtotal = this.items.reduce((sum, item) => {
        if (
          typeof item.quantity !== "number" ||
          typeof item.price !== "number"
        ) {
          throw new Error("Each item must have valid quantity and price");
        }
        return sum + item.quantity * item.price;
      }, 0);
      this.updateLastUpdated();
    } catch (error) {
      console.error(`Error calculating subtotal: ${error.message}`);
      throw error;
    }
  }

  // Calculate grand total
  calculateGrandTotal() {
    try {
      if (!Array.isArray(this.tax)) throw new Error("Tax must be an array");
      if (typeof this.subtotal !== "number")
        throw new Error("Subtotal must be a valid number");
      const taxAmount = this.tax.reduce((sum, taxItem) => {
        if (typeof taxItem.amount !== "number")
          throw new Error("Tax amount must be a valid number");
        return sum + taxItem.amount;
      }, 0);
      const discountAmount = this.discount.amount || 0;
      if (typeof discountAmount !== "number")
        throw new Error("Discount amount must be a valid number");
      this.grandTotal = this.subtotal + taxAmount - discountAmount;
      this.updateLastUpdated();
    } catch (error) {
      console.error(`Error calculating grand total: ${error.message}`);
      throw error;
    }
  }

  // ----------------------------------------------- //
  // -------- Methods for Converting Totals -------- //
  // ----------------------------------------------- //

  // Convert totals into another currency
  convertTotals(conversionRate) {
    try {
      if (typeof conversionRate !== "number" || conversionRate <= 0)
        throw new Error("Conversion rate must be a valid positive number");
      if (
        typeof this.subtotal !== "number" ||
        typeof this.grandTotal !== "number"
      )
        throw new Error("Subtotal and grand total must be valid numbers");
      this.convertedTotals.subtotal = this.subtotal * conversionRate;
      this.convertedTotals.grandTotal = this.grandTotal * conversionRate;
      this.convertedTotals.tax = this.tax.map((taxItem) => {
        if (typeof taxItem.amount !== "number")
          throw new Error("Tax amount must be a valid number");
        return { ...taxItem, amount: taxItem.amount * conversionRate };
      });
      this.convertedTotals.discount = {
        ...this.discount,
        amount: this.discount.amount
          ? this.discount.amount * conversionRate
          : 0,
      };
      this.updateLastUpdated();
    } catch (error) {
      console.error(`Error converting totals: ${error.message}`);
      throw error;
    }
  }

  // ----------------------------------------------- //
  // -------- Methods for Adding Attachment -------- //
  // ----------------------------------------------- //

  // Add an attachment
  addAttachment(file) {
    try {
      if (!file || typeof file !== "object")
        throw new Error("File must be an object");
      const { fileId, fileName, fileType, fileUrl } = file;
      if (!fileId || !fileName || !fileType || !fileUrl)
        throw new Error(
          "File object must contain fileId, fileName, fileType, and fileUrl"
        );
      this.attachments.push({ fileId, fileName, fileType, fileUrl });
      this.updateLastUpdated();
    } catch (error) {
      console.error(`Error adding attachment: ${error.message}`);
      throw error;
    }
  }

  // --------------------------------------------------- //
  // ------- Methods for Adding Related Document ------- //
  // --------------------------------------------------- //

  // Add related document
  addRelatedDocument(relatedDocument) {
    try {
      if (!relatedDocument || typeof relatedDocument !== "object")
        throw new Error("Related document must be an object");
      const { docId, type, link } = relatedDocument;
      if (!docId || !type || !link)
        throw new Error("Related document must contain docId, type, and link");
      this.relatedDocuments.push({ docId, type, link });
      this.updateLastUpdated();
    } catch (error) {
      console.error(`Error adding related document: ${error.message}`);
      throw error;
    }
  }

  // -------------------------------------------------- //
  // ----------- Methods for Adding Comment ----------- //
  // -------------------------------------------------- //

  // Add a comment
  addComment(comment) {
    try {
      if (!comment || typeof comment !== "object")
        throw new Error("Comment must be an object");
      const { userId, text, timestamp } = comment;
      if (!userId || !text || !timestamp)
        throw new Error("Comment must contain userId, text, and timestamp");
      this.comments.push({ userId, text, timestamp });
      this.updateLastUpdated();
    } catch (error) {
      console.error(`Error adding comment: ${error.message}`);
      throw error;
    }
  }

  // ---------------------------------------------------- //
  // ----------- Methods for Removing Comment ----------- //
  // ---------------------------------------------------- //

  // Remove a comment by index
  removeComment(index) {
    try {
      if (
        typeof index !== "number" ||
        index < 0 ||
        index >= this.comments.length
      )
        throw new Error("Invalid comment index");
      this.comments.splice(index, 1);
      this.updateLastUpdated();
    } catch (error) {
      console.error(`Error removing comment: ${error.message}`);
      throw error;
    }
  }

  // ----------------------------------------------------------------- //
  // ------ Methods to Create Invoice Data from Firestore Data ------ //
  // ----------------------------------------------------------------- //

  // Method to populate invoice properties from Firestore data
  static fromFirestoreData(data) {
    return new Invoice(data); // Ensure all fields are passed correctly to the constructor
  }

  // --------------------------------------------------------------- //
  // ----------- Methods for Updating Last Updated field ----------- //
  // --------------------------------------------------------------- //

  // Update the last updated timestamp
  updateLastUpdated() {
    this.lastUpdated = new Date();
  }
}

// Export class
module.exports = Invoice;
