// pdfRoutes.js
const express = require("express");
const PDFController = require("../controllers/pdfController");

const router = express.Router();

// Route to generate and upload an invoice PDF
router.post("/generate-upload-pdf", PDFController.generateAndUploadPDF);

module.exports = router;
