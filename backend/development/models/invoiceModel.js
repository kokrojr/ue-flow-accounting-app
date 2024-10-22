// === Invoice Model === //

const db = require("../../config/firebase");
const Invoice = require("../schemas/invoice");

class InvoiceModel {
  // Method to create a new invoice in Firestore
  static async createInvoice(invoiceData) {
    try {
      const invoice = new Invoice(invoiceData); // Create a new Invoice instance
      const invoiceDoc = JSON.parse(JSON.stringify(invoice)); // Convert the Invoice class instance to plain object

      // Save the invoice to Firestore
      const newInvoiceRef = await db.collection("invoices").add(invoiceDoc);

      // Set the Firestore-generated document ID to the invoice instance
      invoice.docID = newInvoiceRef.id;

      // Update the Firestore document with the generated docID
      await db
        .collection("invoices")
        .doc(newInvoiceRef.id)
        .update({ docID: newInvoiceRef.id });

      return invoice;
    } catch (error) {
      throw new Error(`Error creating invoice: ${error.message}`);
    }
  }

  // // Method to create a new invoice in Firestore
  // static async createInvoice(invoiceData) {
  //     try {
  //         const invoice = new Invoice(invoiceData);  // Use the Invoice class to structure the data
  //         const invoiceDoc = JSON.parse(JSON.stringify(invoice));  // Convert class instance to plain object
  //         const newInvoiceRef = await db.collection('invoices').add(invoiceDoc);  // Save to Firestore

  //         invoice.docID = newInvoiceRef.id;  // Assign Firestore-generated ID
  //         return invoice;
  //     } catch (error) {
  //         throw new Error(`Error creating invoice: ${error.message}`);
  //     }
  // }

  //     // Method to get an invoice by ID from Firestore
  //     static async getInvoiceById(invoiceId) {
  //         try {
  //             const invoiceRef = db.collection('invoices').doc(invoiceId);
  //             const invoiceSnapshot = await invoiceRef.get();
  //             if (!invoiceSnapshot.exists) {
  //                 throw new Error('Invoice not found');
  //             }
  //             return InvoiceModel.toInvoice(invoiceSnapshot.data());  // Convert Firestore data to Invoice instance
  //         } catch (error) {
  //             throw new Error(`Error retrieving invoice: ${error.message}`);
  //         }
  //     }

  //     // Method to update an invoice in Firestore
  //     static async updateInvoice(invoiceId, updatedData) {
  //         try {
  //             const invoiceRef = db.collection('invoices').doc(invoiceId);
  //             await invoiceRef.update(updatedData);
  //             return { success: true };
  //         } catch (error) {
  //             throw new Error(`Error updating invoice: ${error.message}`);
  //         }
  //     }

  //     // Method to delete an invoice from Firestore
  //     static async deleteInvoice(invoiceId) {
  //         try {
  //             const invoiceRef = db.collection('invoices').doc(invoiceId);
  //             await invoiceRef.delete();
  //             return { success: true };
  //         } catch (error) {
  //             throw new Error(`Error deleting invoice: ${error.message}`);
  //         }
  //     }

  //     // Helper method to convert Firestore data to an Invoice instance
  //     static toInvoice(data) {
  //         return new Invoice(data);
  //     }
}

module.exports = InvoiceModel;
