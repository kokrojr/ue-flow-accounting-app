const express = require("express");
const router = express.Router();
const InvoiceRouterController = require("../controllers/invoiceRouterController");

// ====================================================== //
//                  Invoice Router Routes
// ====================================================== //

// --- CRUD for Routing Table Entries --- //

// Create a new routing table entry
router.post("/", InvoiceRouterController.createRoutingTable);

// Get a specific routing table entry by ID
router.get("/:routerId", InvoiceRouterController.getRoutingTableById);

// Get all routing table entries
router.get("/", InvoiceRouterController.getAllRoutingTables);

// Delete a specific routing table entry by ID
router.delete("/:routerId", InvoiceRouterController.deleteRoutingTable);

// --- Role Management in Routing Table --- //

// Assign a role to a user in a routing table entry
router.put("/:routerId/assign-role", InvoiceRouterController.assignRole);

// Update a role in a routing table entry
router.put("/:routerId/role/:role", InvoiceRouterController.updateRole);

// router.put("/:routerId/update-role", InvoiceRouterController.updateRole);

// Remove a role from a routing table entry
router.delete("/:routerId/role/:role", InvoiceRouterController.removeRole);

// Find a role by category in a routing table entry
router.get("/:routerId/category/:category", InvoiceRouterController.findRoleByCategory);

module.exports = router;
