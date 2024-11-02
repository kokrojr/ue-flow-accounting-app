// // Import Firestore Interface and InvoiceRouter Schema

// const FirestoreInterface = require("../db/firestore");
// const InvoiceRouter = require("../schemas/invoiceRouterSchema"); // Import the InvoiceRouter schema

// // Define Collection Name
// const COLLECTION_NAME = "invoiceRouterTable";

// class InvoiceRouterModel {
//   // ----------------------------------------------------
//   // Create a new invoice routing table entry, ensuring only one default route exists
//   static async createRoutingTable(routerData) {
//     try {
//       // Check if a default route already exists if the new routerData specifies it as default
//       if (routerData.routeType === "default") {
//         const existingDefaultRoute =
//           await FirestoreInterface.getDocumentsByField(
//             COLLECTION_NAME,
//             "routeType",
//             "default"
//           );

//         if (existingDefaultRoute.length > 0) {
//           throw new Error("A default routing table entry already exists.");
//         }
//       }

//       // Initialize the router schema
//       const routerEntry = new InvoiceRouter(routerData);
//       const parsedData = routerEntry.toFirestoreData();

//       // Add document to Firestore and retrieve the docId
//       const docId = await FirestoreInterface.addDocument(
//         COLLECTION_NAME,
//         parsedData
//       );

//       // Update the router schema with Firestore generated ID
//       routerEntry.setRouterId(docId);
//       await FirestoreInterface.updateDocument(COLLECTION_NAME, docId, {
//         routerId: docId,
//       });

//       return routerEntry;
//     } catch (error) {
//       throw new Error(`Error creating routing table: ${error.message}`);
//     }
//   }

//   // Retrieve a routing table entry by ID
//   static async getRoutingTableById(routerId) {
//     try {
//       const routerData = await FirestoreInterface.getDocumentById(
//         COLLECTION_NAME,
//         routerId
//       );
//       return routerData ? InvoiceRouter.fromFirestoreData(routerData) : null;
//     } catch (error) {
//       throw new Error(`Error retrieving routing table entry: ${error.message}`);
//     }
//   }

//   // Update a routing table entry
//   static async updateRoutingTable(routerId, updateData) {
//     try {
//       await FirestoreInterface.updateDocument(
//         COLLECTION_NAME,
//         routerId,
//         updateData
//       );
//       return { routerId, ...updateData };
//     } catch (error) {
//       throw new Error(`Error updating routing table entry: ${error.message}`);
//     }
//   }

//   // Delete a routing table entry by ID
//   static async deleteRoutingTable(routerId) {
//     try {
//       await FirestoreInterface.deleteDocument(COLLECTION_NAME, routerId);
//       return { message: `Routing table entry with ID ${routerId} deleted.` };
//     } catch (error) {
//       throw new Error(`Error deleting routing table entry: ${error.message}`);
//     }
//   }

//   // Retrieve all routing table entries
//   static async getAllRoutingTables() {
//     try {
//       const allRouterEntries = await FirestoreInterface.getAllDocuments(
//         COLLECTION_NAME
//       );
//       return allRouterEntries.map((data) =>
//         InvoiceRouter.fromFirestoreData(data)
//       );
//     } catch (error) {
//       throw new Error(
//         `Error retrieving all routing table entries: ${error.message}`
//       );
//     }
//   }

//   // --------------------------------------------------------------------------
//   // Assign a new role to a routing table entry, allowing "default" as routerId
//   static async assignRole(routerId, roleAssignment) {
//     try {
//       // Check if routerId is "default" and retrieve the actual default routing table ID
//       if (routerId === "default") {
//         const defaultRoute = await FirestoreInterface.getDocumentsByField(
//           COLLECTION_NAME,
//           "routeType",
//           "default"
//         );

//         if (defaultRoute.length === 0) {
//           throw new Error("No default routing table entry found.");
//         }

//         routerId = defaultRoute[0].id; // Use the ID of the default route
//       }

//       // Retrieve the routing table entry
//       const routingTable = await this.getRoutingTableById(routerId);
//       if (!routingTable) throw new Error("Routing table entry not found");

//       // Add role assignment using schema method
//       routingTable.addRoleAssignment(roleAssignment);

//       // Update Firestore with the new role assignment
//       await this.updateRoutingTable(routerId, {
//         roleAssignments: routingTable.getRoleAssignments(),
//         lastUpdated: routingTable.getLastUpdated(),
//       });

//       return routingTable;
//     } catch (error) {
//       throw new Error(`Error assigning role: ${error.message}`);
//     }
//   }

//   // Remove a role from the routing table by role name
//   static async removeRole(routerId, role) {
//     try {
//       const routingTable = await this.getRoutingTableById(routerId);
//       if (!routingTable) throw new Error("Routing table entry not found");

//       routingTable.removeRoleAssignment(role); // Remove role assignment using schema method

//       await this.updateRoutingTable(routerId, {
//         roleAssignments: routingTable.getRoleAssignments(),
//         lastUpdated: routingTable.getLastUpdated(),
//       });

//       return routingTable;
//     } catch (error) {
//       throw new Error(`Error removing role: ${error.message}`);
//     }
//   }

//   // Update a role assignment in the routing table entry
//   static async updateRole(routerId, role, newUserData) {
//     try {
//       const routingTable = await this.getRoutingTableById(routerId);
//       if (!routingTable) throw new Error("Routing table entry not found");

//       routingTable.updateRoleAssignment(role, newUserData); // Update using class method

//       await this.updateRoutingTable(routerId, {
//         roleAssignments: routingTable.getRoleAssignments(),
//         lastUpdated: routingTable.getLastUpdated(),
//       });

//       return routingTable;
//     } catch (error) {
//       throw new Error(`Error updating role '${role}': ${error.message}`);
//     }
//   }

//   // Find role assignment by role and category
//   static async findRoleByCategory(routerId, category) {
//     try {
//       const routingTable = await this.getRoutingTableById(routerId);
//       if (!routingTable) throw new Error("Routing table entry not found");

//       const roleAssignment = routingTable
//         .getRoleAssignments()
//         .find((assignment) => assignment.category === category);

//       if (!roleAssignment) {
//         throw new Error(
//           `Role assignment for category '${category}' not found.`
//         );
//       }

//       return roleAssignment;
//     } catch (error) {
//       throw new Error(`Error finding role by category: ${error.message}`);
//     }
//   }
// }

// module.exports = InvoiceRouterModel;

// ==============================================================================================================
// ==============================================================================================================
// ==============================================================================================================

// Import Firestore Interface and InvoiceRouter Schema
// const FirestoreInterface = require("../db/firestore");
// const InvoiceRouter = require("../schemas/invoiceRouterSchema"); // Import the InvoiceRouter schema

// // Define Collection Name
// const COLLECTION_NAME = "invoiceRouterTable";

// // Helper function to resolve routerId based on routeType or direct routerId
// async function resolveRouterId(routerIdOrType) {
//   if (routerIdOrType && typeof routerIdOrType === "string") {
//     // Check if routerIdOrType is actually a routeType
//     const routeQuery = await FirestoreInterface.getDocumentsByField(
//       COLLECTION_NAME,
//       "routeType",
//       routerIdOrType
//     );

//     if (routeQuery.length === 0) {
//       throw new Error(
//         `No routing table entry found for routeType '${routerIdOrType}'`
//       );
//     }
//     return routeQuery[0].id; // Return the ID of the routing table entry for the specified routeType
//   }
//   return routerIdOrType; // If not a routeType, assume it’s a direct routerId
// }

// class InvoiceRouterModel {
//   // ----------------------------------------------------
//   // Create a new invoice routing table entry, ensuring only one default route exists
//   static async createRoutingTable(routerData) {
//     try {
//       // Check if a default route already exists if the new routerData specifies it as default
//       if (routerData.routeType === "default") {
//         const existingDefaultRoute =
//           await FirestoreInterface.getDocumentsByField(
//             COLLECTION_NAME,
//             "routeType",
//             "default"
//           );

//         if (existingDefaultRoute.length > 0) {
//           throw new Error("A default routing table entry already exists.");
//         }
//       }

//       // Initialize the router schema
//       const routerEntry = new InvoiceRouter(routerData);
//       const parsedData = routerEntry.toFirestoreData();

//       // Add document to Firestore and retrieve the docId
//       const docId = await FirestoreInterface.addDocument(
//         COLLECTION_NAME,
//         parsedData
//       );

//       // Update the router schema with Firestore generated ID
//       routerEntry.setRouterId(docId);
//       await FirestoreInterface.updateDocument(COLLECTION_NAME, docId, {
//         routerId: docId,
//       });

//       return routerEntry;
//     } catch (error) {
//       throw new Error(`Error creating routing table: ${error.message}`);
//     }
//   }

//   // Retrieve a routing table entry by ID or routeType
//   static async getRoutingTableById(routerIdOrType) {
//     try {
//       const resolvedRouterId = await resolveRouterId(routerIdOrType);
//       const routerData = await FirestoreInterface.getDocumentById(
//         COLLECTION_NAME,
//         resolvedRouterId
//       );
//       return routerData ? InvoiceRouter.fromFirestoreData(routerData) : null;
//     } catch (error) {
//       throw new Error(`Error retrieving routing table entry: ${error.message}`);
//     }
//   }

//   // Update a routing table entry by ID or routeType
//   static async updateRoutingTable(routerIdOrType, updateData) {
//     try {
//       const resolvedRouterId = await resolveRouterId(routerIdOrType);
//       await FirestoreInterface.updateDocument(
//         COLLECTION_NAME,
//         resolvedRouterId,
//         updateData
//       );
//       return { routerId: resolvedRouterId, ...updateData };
//     } catch (error) {
//       throw new Error(`Error updating routing table entry: ${error.message}`);
//     }
//   }

//   // Delete a routing table entry by ID or routeType
//   static async deleteRoutingTable(routerIdOrType) {
//     try {
//       const resolvedRouterId = await resolveRouterId(routerIdOrType);
//       await FirestoreInterface.deleteDocument(
//         COLLECTION_NAME,
//         resolvedRouterId
//       );
//       return {
//         message: `Routing table entry with ID ${resolvedRouterId} deleted.`,
//       };
//     } catch (error) {
//       throw new Error(`Error deleting routing table entry: ${error.message}`);
//     }
//   }

//   // Retrieve all routing table entries
//   static async getAllRoutingTables() {
//     try {
//       const allRouterEntries = await FirestoreInterface.getAllDocuments(
//         COLLECTION_NAME
//       );
//       return allRouterEntries.map((data) =>
//         InvoiceRouter.fromFirestoreData(data)
//       );
//     } catch (error) {
//       throw new Error(
//         `Error retrieving all routing table entries: ${error.message}`
//       );
//     }
//   }

//   // --------------------------------------------------------------------------
//   // Assign a new role to a routing table entry, allowing any routeType
//   static async assignRole(routerIdOrType, roleAssignment) {
//     try {
//       const resolvedRouterId = await resolveRouterId(routerIdOrType);
//       const routingTable = await this.getRoutingTableById(resolvedRouterId);

//       if (!routingTable) throw new Error("Routing table entry not found");

//       // Add role assignment using schema method
//       routingTable.addRoleAssignment(roleAssignment);

//       // Update Firestore with the new role assignment
//       await this.updateRoutingTable(resolvedRouterId, {
//         roleAssignments: routingTable.getRoleAssignments(),
//         lastUpdated: routingTable.getLastUpdated(),
//       });

//       return routingTable;
//     } catch (error) {
//       throw new Error(`Error assigning role: ${error.message}`);
//     }
//   }

//   // Remove a role from the routing table by role name, supporting any routeType
//   static async removeRole(routerIdOrType, role) {
//     try {
//       const resolvedRouterId = await resolveRouterId(routerIdOrType);
//       const routingTable = await this.getRoutingTableById(resolvedRouterId);

//       if (!routingTable) throw new Error("Routing table entry not found");

//       routingTable.removeRoleAssignment(role); // Remove role assignment using schema method

//       await this.updateRoutingTable(resolvedRouterId, {
//         roleAssignments: routingTable.getRoleAssignments(),
//         lastUpdated: routingTable.getLastUpdated(),
//       });

//       return routingTable;
//     } catch (error) {
//       throw new Error(`Error removing role: ${error.message}`);
//     }
//   }

//   // Update a role assignment in the routing table entry, supporting any routeType
//   static async updateRole(routerIdOrType, role, newUserData) {
//     try {
//       const resolvedRouterId = await resolveRouterId(routerIdOrType);
//       const routingTable = await this.getRoutingTableById(resolvedRouterId);

//       if (!routingTable) throw new Error("Routing table entry not found");

//       routingTable.updateRoleAssignment(role, newUserData); // Update using class method

//       await this.updateRoutingTable(resolvedRouterId, {
//         roleAssignments: routingTable.getRoleAssignments(),
//         lastUpdated: routingTable.getLastUpdated(),
//       });

//       return routingTable;
//     } catch (error) {
//       throw new Error(`Error updating role '${role}': ${error.message}`);
//     }
//   }

//   // Find role assignment by role and category, supporting any routeType
//   static async findRoleByCategory(routerIdOrType, category) {
//     try {
//       const resolvedRouterId = await resolveRouterId(routerIdOrType);
//       const routingTable = await this.getRoutingTableById(resolvedRouterId);

//       if (!routingTable) throw new Error("Routing table entry not found");

//       const roleAssignment = routingTable
//         .getRoleAssignments()
//         .find((assignment) => assignment.category === category);

//       if (!roleAssignment) {
//         throw new Error(
//           `Role assignment for category '${category}' not found.`
//         );
//       }

//       return roleAssignment;
//     } catch (error) {
//       throw new Error(`Error finding role by category: ${error.message}`);
//     }
//   }
// }

// module.exports = InvoiceRouterModel;


// ==============================================================================================================
// ==============================================================================================================
// ==============================================================================================================

// Import Firestore Interface and InvoiceRouter Schema
const FirestoreInterface = require("../db/firestore");
const InvoiceRouter = require("../schemas/invoiceRouterSchema"); // Import the InvoiceRouter schema

// Define Collection Name
const COLLECTION_NAME = "invoiceRouterTable";

class InvoiceRouterModel {
  // ----------------------------------------------------
  // Private helper method to resolve routerId based on routeType or direct routerId
  static async #resolveRouterId(routerIdOrType) {
    try {
      console.log(
        `[INFO] Resolving routerId or routeType: '${routerIdOrType}'`
      );

      // First, treat the input as a routeType and attempt to fetch by routeType field
      const routeQuery = await FirestoreInterface.getDocumentsByField(
        COLLECTION_NAME,
        "routeType",
        routerIdOrType
      );

      if (routeQuery.length > 0) {
        console.log(
          `[SUCCESS] Routing table entry found for routeType '${routerIdOrType}'`
        );
        return routeQuery[0].id; // Return the ID of the first matching document
      }

      // If no match by routeType, treat it as a direct router ID
      console.log(
        `[INFO] No routeType found for '${routerIdOrType}', treating as routerId`
      );

      const routerData = await FirestoreInterface.getDocumentById(
        COLLECTION_NAME,
        routerIdOrType
      );

      if (routerData) {
        console.log(
          `[SUCCESS] Routing table entry found with routerId '${routerIdOrType}'`
        );
        return routerIdOrType;
      }

      // If neither routeType nor routerId resolves, throw an error
      throw new Error(
        `No routing table entry found for either routeType or routerId '${routerIdOrType}'`
      );
    } catch (error) {
      console.error(
        `[ERROR] Failed to resolve routerId or routeType: ${error.message}`
      );
      throw new Error(
        `Error resolving routerId or routeType: ${error.message}`
      );
    }
  }

  // ----------------------------------------------------
  // Create a new invoice routing table entry, ensuring only one default route exists
  static async createRoutingTable(routerData) {
    try {
      if (routerData.routeType === "default") {
        const existingDefaultRoute =
          await FirestoreInterface.getDocumentsByField(
            COLLECTION_NAME,
            "routeType",
            "default"
          );

        if (existingDefaultRoute.length > 0) {
          throw new Error("A default routing table entry already exists.");
        }
      }

      const routerEntry = new InvoiceRouter(routerData);
      const parsedData = routerEntry.toFirestoreData();

      const docId = await FirestoreInterface.addDocument(
        COLLECTION_NAME,
        parsedData
      );

      routerEntry.setRouterId(docId);
      await FirestoreInterface.updateDocument(COLLECTION_NAME, docId, {
        routerId: docId,
      });

      return routerEntry;
    } catch (error) {
      throw new Error(`Error creating routing table: ${error.message}`);
    }
  }

  // Retrieve a routing table entry by ID or routeType
  static async getRoutingTableById(routerIdOrType) {
    try {
      const resolvedRouterId = await this.#resolveRouterId(routerIdOrType);
      const routerData = await FirestoreInterface.getDocumentById(
        COLLECTION_NAME,
        resolvedRouterId
      );
      return routerData ? InvoiceRouter.fromFirestoreData(routerData) : null;
    } catch (error) {
      throw new Error(`Error retrieving routing table entry: ${error.message}`);
    }
  }

  // Update a routing table entry by ID or routeType
  static async updateRoutingTable(routerIdOrType, updateData) {
    try {
      const resolvedRouterId = await this.#resolveRouterId(routerIdOrType);
      await FirestoreInterface.updateDocument(
        COLLECTION_NAME,
        resolvedRouterId,
        updateData
      );
      return { routerId: resolvedRouterId, ...updateData };
    } catch (error) {
      throw new Error(`Error updating routing table entry: ${error.message}`);
    }
  }

  // Delete a routing table entry by ID or routeType
  static async deleteRoutingTable(routerIdOrType) {
    try {
      const resolvedRouterId = await this.#resolveRouterId(routerIdOrType);
      await FirestoreInterface.deleteDocument(
        COLLECTION_NAME,
        resolvedRouterId
      );
      return {
        message: `Routing table entry with ID ${resolvedRouterId} deleted.`,
      };
    } catch (error) {
      throw new Error(`Error deleting routing table entry: ${error.message}`);
    }
  }

  // Retrieve all routing table entries
  static async getAllRoutingTables() {
    try {
      const allRouterEntries = await FirestoreInterface.getAllDocuments(
        COLLECTION_NAME
      );
      return allRouterEntries.map((data) =>
        InvoiceRouter.fromFirestoreData(data)
      );
    } catch (error) {
      throw new Error(
        `Error retrieving all routing table entries: ${error.message}`
      );
    }
  }

  // Assign a new role to a routing table entry, allowing any routeType
  static async assignRole(routerIdOrType, roleAssignment) {
    try {
      const resolvedRouterId = await this.#resolveRouterId(routerIdOrType);
      const routingTable = await this.getRoutingTableById(resolvedRouterId);

      if (!routingTable) throw new Error("Routing table entry not found");

      routingTable.addRoleAssignment(roleAssignment);

      await this.updateRoutingTable(resolvedRouterId, {
        roleAssignments: routingTable.getRoleAssignments(),
        lastUpdated: routingTable.getLastUpdated(),
      });

      return routingTable;
    } catch (error) {
      throw new Error(`Error assigning role: ${error.message}`);
    }
  }

  // Remove a role from the routing table by role name, supporting any routeType
  static async removeRole(routerIdOrType, role) {
    try {
      const resolvedRouterId = await this.#resolveRouterId(routerIdOrType);
      const routingTable = await this.getRoutingTableById(resolvedRouterId);

      if (!routingTable) throw new Error("Routing table entry not found");

      routingTable.removeRoleAssignment(role);

      await this.updateRoutingTable(resolvedRouterId, {
        roleAssignments: routingTable.getRoleAssignments(),
        lastUpdated: routingTable.getLastUpdated(),
      });

      return routingTable;
    } catch (error) {
      throw new Error(`Error removing role: ${error.message}`);
    }
  }

  // Update a role assignment in the routing table entry, supporting any routeType
  static async updateRole(routerIdOrType, role, newUserData) {
    try {
      const resolvedRouterId = await this.#resolveRouterId(routerIdOrType);
      const routingTable = await this.getRoutingTableById(resolvedRouterId);

      if (!routingTable) throw new Error("Routing table entry not found");

      routingTable.updateRoleAssignment(role, newUserData);

      await this.updateRoutingTable(resolvedRouterId, {
        roleAssignments: routingTable.getRoleAssignments(),
        lastUpdated: routingTable.getLastUpdated(),
      });

      return routingTable;
    } catch (error) {
      throw new Error(`Error updating role '${role}': ${error.message}`);
    }
  }

  // Find role assignment by role and category, supporting any routeType
  static async findRoleByCategory(routerIdOrType, category) {
    try {
      const resolvedRouterId = await this.#resolveRouterId(routerIdOrType);
      const routingTable = await this.getRoutingTableById(resolvedRouterId);

      if (!routingTable) throw new Error("Routing table entry not found");

      const roleAssignment = routingTable
        .getRoleAssignments()
        .find((assignment) => assignment.category === category);

      if (!roleAssignment) {
        throw new Error(
          `Role assignment for category '${category}' not found.`
        );
      }

      return roleAssignment;
    } catch (error) {
      throw new Error(`Error finding role by category: ${error.message}`);
    }
  }

  // Find role assignment by role and category, supporting any routeType
  static async findRoleByRole(routerIdOrType, role) {
    try {
      const resolvedRouterId = await this.#resolveRouterId(routerIdOrType);
      const routingTable = await this.getRoutingTableById(resolvedRouterId);

      if (!routingTable) throw new Error("Routing table entry not found");

      const roleAssignment = routingTable
        .getRoleAssignments()
        .find((assignment) => assignment.role === role);

      if (!roleAssignment) {
        throw new Error(
          `Role assignment for category '${role}' not found.`
        );
      }

      return roleAssignment;
    } catch (error) {
      throw new Error(`Error finding role by category: ${error.message}`);
    }
  }
}

module.exports = InvoiceRouterModel;
