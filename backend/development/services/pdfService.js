// PDF Service

const { storage } = require("../../config/firebase");
const PDFDocument = require("pdfkit");

class PDFService {
  static async generateAndUploadInvoicePDF(invoiceData, invoiceId) {
    const doc = new PDFDocument({ margin: 40 }); // Explicitly set a margin
    const filePath = `${invoiceId}.pdf`;

    // Create a reference to the file in Firebase Storage
    const file = storage.file(filePath);
    const stream = file.createWriteStream({
      metadata: { contentType: "application/pdf" },
    });

    // Start piping PDF content to the Firebase stream
    doc.pipe(stream);

    // Add PDF content using `invoiceData`
    doc.fontSize(20).text("Invoice", { align: "center" });
    doc.moveDown();
    doc
      .fontSize(12)
      .text(`Customer Name: ${invoiceData.customer.name || "N/A"}`);
    doc.text(`Total Amount: ${invoiceData.grandTotal || "N/A"} USD`);
    doc.moveDown();

    // Add additional invoice content here
    // Example: Add each item in the invoice
    invoiceData.items.forEach((item, index) => {
      doc.text(
        `${index + 1}. ${item.description} - ${item.quantity} x ${
          item.unitPrice
        } USD`
      );
    });

    doc.end(); // End the PDF document stream

    // Return a promise to get the download URL once upload completes
    return new Promise((resolve, reject) => {
      stream.on("finish", async () => {
        try {
          const downloadURL = await file.getSignedUrl({
            action: "read",
            expires: "03-01-2500", // Adjust expiration as needed
          });
          resolve(downloadURL[0]); // Return the URL for access
        } catch (error) {
          reject(new Error(`Failed to get download URL: ${error.message}`));
        }
      });

      // Catch stream errors
      stream.on("error", (error) => {
        reject(new Error(`Stream error: ${error.message}`));
      });
    });
  }
}

module.exports = PDFService;
