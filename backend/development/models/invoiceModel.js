// =================================================== //
// ------------------ Invoice Model ------------------ //
// =================================================== //

const Invoice = require("../schemas/invoice");
const FirestoreInterface = require("../db/firestore");
const { Timestamp } = require("firebase-admin").firestore;

class InvoiceModel {
  // -------------------------------------- //
  // ----------- Create Invoice ----------- //
  // -------------------------------------- //

  static async createInvoice(invoiceData) {
    try {
      // Ensure the dateCreated field is set to the current timestamp
      invoiceData.dateCreated = Timestamp.fromDate(new Date());

      // Set a default dateDue (30 days from dateCreated) if not provided
      if (!invoiceData.dateDue) {
        const defaultDueDate = new Date();
        defaultDueDate.setDate(defaultDueDate.getDate() + 30); // Add 30 days
        invoiceData.dateDue = Timestamp.fromDate(defaultDueDate);
      } else {
        // Convert user-provided dateDue to Firestore Timestamp
        invoiceData.dateDue = Timestamp.fromDate(new Date(invoiceData.dateDue));
      }

      const invoice = new Invoice(invoiceData); // Create Invoice instance
      const invoiceDoc =
        FirestoreInterface.prepareDocumentForFirestore(invoice); // Prepare for Firestore

      const docID = await FirestoreInterface.addDocument(
        "invoices",
        invoiceDoc
      );
      invoice.docID = docID;

      return invoice;
    } catch (error) {
      throw new Error(`Error creating invoice: ${error.message}`);
    }
  }

  // static async createInvoice(invoiceData) {
  //   try {
  //     // Ensure dates are stored as Firestore Timestamps
  //     invoiceData.dateCreated = Timestamp.fromDate(
  //       new Date(invoiceData.dateCreated || Date.now())
  //     );
  //     invoiceData.dateDue = Timestamp.fromDate(new Date(invoiceData.dateDue));

  //     // Instantiate invoice
  //     const invoice = new Invoice(invoiceData);
  //     const invoiceDoc =
  //       FirestoreInterface.prepareDocumentForFirestore(invoice);
  //     const docID = await FirestoreInterface.addDocument(
  //       "invoices",
  //       invoiceDoc
  //     );
  //     // Update invoice with generated id
  //     await FirestoreInterface.updateDocument("invoices", docID, { docID });
  //     invoice.docID = docID;
  //     // Return invoice
  //     return invoice;
  //   } catch (error) {
  //     // Handle error
  //     throw new Error(`Error creating invoice: ${error.message}`);
  //   }
  // }

  // static async createInvoice(invoiceData) {
  //   try {
  //     // Instantiate invoice
  //     const invoice = new Invoice(invoiceData);
  //     const invoiceDoc =
  //       FirestoreInterface.prepareDocumentForFirestore(invoice);
  //     const docID = await FirestoreInterface.addDocument(
  //       "invoices",
  //       invoiceDoc
  //     );
  //     // Update invoice with generated id
  //     await FirestoreInterface.updateDocument("invoices", docID, { docID });
  //     invoice.docID = docID;
  //     // Return invoice
  //     return invoice;
  //   } catch (error) {
  //     // Handle error
  //     throw new Error(`Error creating invoice: ${error.message}`);
  //   }
  // }

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
}

module.exports = InvoiceModel;
