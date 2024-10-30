// // Import necessary modules and models
// const InvoiceRouterModel = require("../models/invoiceRouterModel");

// class InvoiceRouterController {
//   // --------------------------------------------------------------
//   // Create a new invoice routing table entry
//   static async createRoutingTable(req, res) {
//     try {
//       const routerData = req.body;
//       const routerEntry = await InvoiceRouterModel.createRoutingTable(routerData);
//       res.status(201).json({
//         message: "Routing table entry created successfully",
//         routerEntry,
//       });
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   }

//   // --------------------------------------------------------------
//   // Get routing table entry by ID
//   static async getRoutingTableById(req, res) {
//     try {
//       const { routerId } = req.params;
//       const routerEntry = await InvoiceRouterModel.getRoutingTableById(routerId);
//       if (!routerEntry) {
//         return res.status(404).json({ error: "Routing table entry not found" });
//       }
//       res.status(200).json(routerEntry);
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   }

//   // --------------------------------------------------------------
//   // Get all routing table entries
//   static async getAllRoutingTables(req, res) {
//     try {
//       const routerEntries = await InvoiceRouterModel.getAllRoutingTables();
//       res.status(200).json(routerEntries);
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   }

//   // --------------------------------------------------------------
//   // Assign a role to a user in a routing table entry
//   static async assignRole(req, res) {
//     try {
//       const { routerId } = req.params;
//       const roleAssignment = req.body;
//       const updatedRouterEntry = await InvoiceRouterModel.assignRole(routerId, roleAssignment);
//       res.status(200).json({
//         message: "Role assigned successfully",
//         routerEntry: updatedRouterEntry,
//       });
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   }

//   // --------------------------------------------------------------
//   // Update a role assignment in a routing table entry
//   static async updateRole(req, res) {
//     try {
//       const { routerId } = req.params;
//       const { role, newUserData } = req.body;
//       const updatedRouterEntry = await InvoiceRouterModel.updateRole(routerId, role, newUserData);
//       res.status(200).json({
//         message: "Role updated successfully",
//         routerEntry: updatedRouterEntry,
//       });
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   }

//   // --------------------------------------------------------------
//   // Remove a role from a routing table entry
//   static async removeRole(req, res) {
//     try {
//       const { routerId, role } = req.params;
//       const updatedRouterEntry = await InvoiceRouterModel.removeRole(routerId, role);
//       res.status(200).json({
//         message: "Role removed successfully",
//         routerEntry: updatedRouterEntry,
//       });
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   }

//   // --------------------------------------------------------------
//   // Find a role by category within a routing table entry
//   static async findRoleByCategory(req, res) {
//     try {
//       const { routerId, category } = req.params;
//       const roleAssignment = await InvoiceRouterModel.findRoleByCategory(routerId, category);
//       if (!roleAssignment) {
//         return res.status(404).json({ error: "Role for the specified category not found" });
//       }
//       res.status(200).json(roleAssignment);
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   }

//   // --------------------------------------------------------------
//   // Delete an entire routing table entry
//   static async deleteRoutingTable(req, res) {
//     try {
//       const { routerId } = req.params;
//       await InvoiceRouterModel.deleteRoutingTable(routerId);
//       res.status(200).json({ message: "Routing table entry deleted successfully" });
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   }
// }

// module.exports = InvoiceRouterController;

// Import necessary modules and models
const InvoiceRouterModel = require("../models/invoiceRouterModel");

class InvoiceRouterController {
  // --------------------------------------------------------------
  // Create a new invoice routing table entry
  static async createRoutingTable(req, res) {
    try {
      const routerData = req.body;
      const routerEntry = await InvoiceRouterModel.createRoutingTable(
        routerData
      );
      res.status(201).json({
        message: "Routing table entry created successfully",
        data: {
          routerEntry,
          info: "A new routing table entry has been added to the system.",
        },
      });
    } catch (error) {
      res.status(500).json({
        error: error.message,
        info: "Failed to create the routing table entry. Please try again.",
      });
    }
  }

  // --------------------------------------------------------------
  // Get routing table entry by ID
  static async getRoutingTableById(req, res) {
    try {
      const { routerId } = req.params;
      const routerEntry = await InvoiceRouterModel.getRoutingTableById(
        routerId
      );
      if (!routerEntry) {
        return res.status(404).json({
          error: "Routing table entry not found",
          info: `No entry was found for the router ID '${routerId}'.`,
        });
      }
      res.status(200).json({
        message: "Routing table entry retrieved successfully",
        data: routerEntry,
      });
    } catch (error) {
      res.status(500).json({
        error: error.message,
        info: "Failed to retrieve the routing table entry. Please check the router ID.",
      });
    }
  }

  // --------------------------------------------------------------
  // Get all routing table entries
  static async getAllRoutingTables(req, res) {
    try {
      const routerEntries = await InvoiceRouterModel.getAllRoutingTables();
      res.status(200).json({
        message: "All routing table entries retrieved successfully",
        count: routerEntries.length,
        data: routerEntries,
      });
    } catch (error) {
      res.status(500).json({
        error: error.message,
        info: "Failed to retrieve all routing table entries. Please try again later.",
      });
    }
  }

  // --------------------------------------------------------------
  // Assign a role to a user in a routing table entry
  static async assignRole(req, res) {
    try {
      const { routerId } = req.params;
      const roleAssignment = req.body;
      const updatedRouterEntry = await InvoiceRouterModel.assignRole(
        routerId,
        roleAssignment
      );
      res.status(200).json({
        message: `Role '${roleAssignment.role}' assigned successfully to user '${roleAssignment.userId}'`,
        data: updatedRouterEntry,
      });
    } catch (error) {
      res.status(500).json({
        error: error.message,
        info: "Failed to assign the role. Please verify the router ID and user details.",
      });
    }
  }

  // --------------------------------------------------------------
  // Update a role assignment in a routing table entry
  // static async updateRole(req, res) {
  //   try {
  //     const { routerId } = req.params;
  //     const { role, newUserData } = req.body;
  //     const updatedRouterEntry = await InvoiceRouterModel.updateRole(
  //       routerId,
  //       role,
  //       newUserData
  //     );
  //     res.status(200).json({
  //       message: `Role '${role}' updated successfully`,
  //       data: updatedRouterEntry,
  //     });
  //   } catch (error) {
  //     res.status(500).json({
  //       error: error.message,
  //       info: "Failed to update the role. Please verify the provided details.",
  //     });
  //   }
  // }

  // // Update a role assignment in a routing table entry
  // static async updateRole(req, res) {
  //   try {
  //     const { routerId } = req.params;
  //     const { role, newUserData } = req.body;

  //     const updatedRouterEntry = await InvoiceRouterModel.updateRole(
  //       routerId,
  //       role,
  //       newUserData
  //     );

  //     res.status(200).json({
  //       message: `Role '${role}' updated successfully in routing table`,
  //       data: updatedRouterEntry,
  //     });
  //   } catch (error) {
  //     res.status(500).json({
  //       error: error.message,
  //       info: "Failed to update the role. Please ensure the role exists in the specified router entry and the data is valid.",
  //     });
  //   }
  // }

  // Update a role assignment in a routing table entry
  static async updateRole(req, res) {
    try {
      const { routerId, role } = req.params; // Extract `role` from params
      const newUserData = req.body; // Get updated data from body

      const updatedRouterEntry = await InvoiceRouterModel.updateRole(
        routerId,
        role,
        newUserData
      );

      res.status(200).json({
        message: `Role '${role}' updated successfully in routing table`,
        data: updatedRouterEntry,
      });
    } catch (error) {
      res.status(500).json({
        error: error.message,
        info: "Failed to update the role. Please ensure the role exists in the specified router entry and the data is valid.",
      });
    }
  }

  // --------------------------------------------------------------
  // Remove a role from a routing table entry
  static async removeRole(req, res) {
    try {
      const { routerId, role } = req.params;
      const updatedRouterEntry = await InvoiceRouterModel.removeRole(
        routerId,
        role
      );
      res.status(200).json({
        message: `Role '${role}' removed successfully from routing table`,
        data: updatedRouterEntry,
      });
    } catch (error) {
      res.status(500).json({
        error: error.message,
        info: "Failed to remove the role. Please ensure the role exists in the specified router entry.",
      });
    }
  }

  // --------------------------------------------------------------
  // Find a role by category within a routing table entry
  static async findRoleByCategory(req, res) {
    try {
      const { routerId, category } = req.params;
      const roleAssignment = await InvoiceRouterModel.findRoleByCategory(
        routerId,
        category
      );
      if (!roleAssignment) {
        return res.status(404).json({
          error: "Role for the specified category not found",
          info: `No role assignment was found for the category '${category}' in the specified routing table.`,
        });
      }
      res.status(200).json({
        message: `Role assignment for category '${category}' retrieved successfully`,
        data: roleAssignment,
      });
    } catch (error) {
      res.status(500).json({
        error: error.message,
        info: "Failed to retrieve role by category. Please verify the router ID and category.",
      });
    }
  }

  // --------------------------------------------------------------
  // Delete an entire routing table entry
  static async deleteRoutingTable(req, res) {
    try {
      const { routerId } = req.params;
      await InvoiceRouterModel.deleteRoutingTable(routerId);
      res.status(200).json({
        message: "Routing table entry deleted successfully",
        info: `The routing table entry with ID '${routerId}' has been deleted.`,
      });
    } catch (error) {
      res.status(500).json({
        error: error.message,
        info: "Failed to delete the routing table entry. Please verify the router ID.",
      });
    }
  }
}

module.exports = InvoiceRouterController;
