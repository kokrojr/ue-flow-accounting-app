// Start Backend Development

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const invoiceRoutes = require("./development/routes/invoiceRoutes");
const invoiceRouterRoutes = require("./development/routes/invoiceRouterRoutes");
const userBoardRoutes = require("./development/routes/userBoardRoutes");

// ====================================================== //


const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Handle cross-origin requests
app.use(bodyParser.json()); // Parse incoming JSON

// Mock middleware to add a test user object
app.use((req, res, next) => {
  // Dummy user data for testing purposes
  req.user = {
    id: "testUser123",
    name: "Test User",
    role: "Manager"  // add any relevant user properties
  };
  next();
});

// --- API ROUTES HANDLERS --- //
app.use("/api/invoices", invoiceRoutes); // Handle all invoice requests within the invoice routes
app.use("/api/invoice-router", invoiceRouterRoutes); // Handle all invoice router requests within the invoice router routes
app.use("/api/user-board", userBoardRoutes); // Handle all user board routes

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
