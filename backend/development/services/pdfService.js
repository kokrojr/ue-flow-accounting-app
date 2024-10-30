// Handle the generation and viewing of pdf

const PDFDocument = require("pdfkit");

class PDFService {
    static generateInvoicePDF(invoiceData) {
        const doc = new PDFDocument();
        // Add content to the PDF using invoiceData
        // For example, doc.text(invoiceData.customer.name);
        return doc;
    }

    static savePDFToFile(doc, filePath) {
        return new Promise((resolve, reject) => {
            const stream = doc.pipe(fs.createWriteStream(filePath));
            stream.on("finish", resolve);
            stream.on("error", reject);
            doc.end();
        });
    }
}

module.exports = PDFService;