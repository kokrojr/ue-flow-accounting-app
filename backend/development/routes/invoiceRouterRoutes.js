const express = require("express");
const router = express.Router();
const InvoiceRouterController = require("../controllers/invoiceRouterController");

// =================================================================== //
// ---------------------- Invoice Router Routes ---------------------- //
// =================================================================== //

// --- Role Management in Routing Table --- //
router.put("/:routerId/assign-role", InvoiceRouterController.assignRole); // Assign a role to a user in a routing table entry
router.put("/:routerId/role/:role", InvoiceRouterController.updateRole); // Update a role in a routing table entry
router.delete("/:routerId/role/:role", InvoiceRouterController.removeRole); // Remove a role from a routing table entry
router.get("/:routerId/category/:category", InvoiceRouterController.findRoleByCategory); // Find a role by category in a routing table entry
router.get("/:routerId/role/:role", InvoiceRouterController.findRoleByRole); // Find a role by role in a routing table entry

// --- CRUD for Routing Table Entries --- //
router.post("/", InvoiceRouterController.createRoutingTable); // Create a new routing table entry
router.get("/:routerId", InvoiceRouterController.getRoutingTableById); // Get a specific routing table entry by ID
router.get("/", InvoiceRouterController.getAllRoutingTables); // Get all routing table entries)
router.delete("/:routerId", InvoiceRouterController.deleteRoutingTable); // Delete a specific routing table entry by ID


// router.put("/:routerId/update-role", InvoiceRouterController.updateRole);


module.exports = router;
