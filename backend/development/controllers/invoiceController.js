// Invoice Controller

const InvoiceModel = require('../models/invoiceModel'); // Import Document Module

// Import Document Router

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ //


class InvoiceController {
    // Create a new invoice
    static async createInvoice(req, res) {
        try {
            // Extract invoice data from request body
            const invoiceData = req.body; 

            // Call the model to create the invoice
            const newInvoice = await InvoiceModel.createInvoice(invoiceData); 

            // Respond with success message and the created invoice
            res.status(201).json({ message: 'Invoice created successfully', invoice: newInvoice });
            
        } catch (error) {
            res.status(500).json({ error: error.message });  // Handle errors
        }
    }

    // Get an invoice by ID
    static async getInvoiceById(req, res) {
        try {
            // const { invoiceId } = req.params;  // Extract the invoice ID from the route parameter
            // const invoice = await InvoiceModel.getInvoiceById(invoiceId);  // Call the model to fetch the invoice
            // if (!invoice) {
            //     return res.status(404).json({ message: 'Invoice not found' });
            // }
            res.status(200).json(invoice);  // Respond with the invoice data
        } catch (error) {
            res.status(500).json({ error: error.message });  // Handle errors
        }
    }

    // More methods (updateInvoice, deleteInvoice, etc.)
}

module.exports = InvoiceController;