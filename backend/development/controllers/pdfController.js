// pdfController.js
const PDFService = require("../services/pdfService");

class PDFController {
  // Generate and upload an invoice PDF to Firebase Storage
  static async generateAndUploadPDF(req, res) {
    try {
      const { invoiceData, invoiceId } = req.body;

      // Ensure both invoiceData and invoiceId are provided
      if (!invoiceData || !invoiceId) {
        return res.status(400).json({
          error: "Missing required fields: 'invoiceData' and/or 'invoiceId'",
        });
      }

      // Generate and upload the PDF, then retrieve the download URL
      const downloadURL = await PDFService.generateAndUploadInvoicePDF(
        invoiceData,
        invoiceId
      );

      return res.status(200).json({
        message: "PDF generated and uploaded successfully",
        downloadURL: downloadURL,
      });
    } catch (error) {
      return res.status(500).json({
        error: `Error generating and uploading PDF: ${error.message}`,
      });
    }
  }
}

module.exports = PDFController;
