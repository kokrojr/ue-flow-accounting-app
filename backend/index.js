// Start Backend Development

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const invoiceRoutes = require("./development/routes/invoiceRoutes");
const invoiceRouterRoutes = require("./development/routes/invoiceRouterRoutes");
const userBoardRoutes = require("./development/routes/userBoardRoutes");
const PDFServiceRoutes = require("./development/routes/pdfRoutes");
const fileServiceRoutes = require("./development/routes/fileRoutes");

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
    id: "creator123",
    name: "Jane Smith",
    role: "Manager",  // add any relevant user properties
    userBoardId: "0XWkvfIiIVb7jU5YA9rg"
  };
  next();
});

// Mock middleware to add a test user object
// app.use((req, res, next) => {
//   // Dummy user data for testing purposes
//   req.user = {
//     id: "approver123",
//     name: "Manager John",
//     role: "Manager",  // add any relevant user properties
//     userBoardId: "KskhQnWcngjo5COvzhLo"
//   };
//   next();
// });

// Mock middleware to add a test user object
// app.use((req, res, next) => {
//   // Dummy user data for testing purposes
//   req.user = {
//     id: "finance001",
//     name: "Finance Officer Mary",
//     role: "Finance Office",  // add any relevant user properties
//     userBoardId: "D7FJp6R4JlXNMtt1mbCc"
//   };
//   next();
// });

// --- API ROUTES HANDLERS --- //
app.use("/api/invoices", invoiceRoutes); // Handle all invoice requests within the invoice routes
app.use("/api/invoice-router", invoiceRouterRoutes); // Handle all invoice router requests within the invoice router routes
app.use("/api/user-board", userBoardRoutes); // Handle all user board routes
app.use("/api/pdf-service", PDFServiceRoutes); // Handle all pdf requests
app.use("/api/files", fileServiceRoutes); // Handle all file requests

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
