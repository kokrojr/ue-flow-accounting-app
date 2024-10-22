// Start Backend Development

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const invoiceRoutes = require("./development/routes/invoiceRoutes");

// ====================================================== //


const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Handle cross-origin requests
app.use(bodyParser.json()); // Parse incoming JSON

// --- API ROUTES HANDLERS --- //
app.use("/api/invoices", invoiceRoutes); // Handle all invoice requests within the invoice routes

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});