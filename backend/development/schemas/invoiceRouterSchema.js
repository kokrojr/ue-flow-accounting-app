// ========================================================== //
// =================== InvoiceRouter Schema ================== //
// ========================================================== //

class InvoiceRouter {
  constructor(routerData) {
    try {
      // Router Metadata
      this.routerId = routerData.routerId || ""; // Unique router ID
      this.documentType = routerData.documentType || "invoice"; // Type of document being routed
      this.routeType = routerData.routeType || "default"; // Type of route, default is "default"

      // Role Assignments
      this.roleAssignments = routerData.roleAssignments || []; // Array of role assignments for this router entry

      // Creation & Update Metadata
      this.dateCreated = routerData.dateCreated || new Date().toISOString();
      this.lastUpdated = routerData.lastUpdated || new Date().toISOString();
    } catch (error) {
      console.error(
        `Error initializing InvoiceRouter schema: ${error.message}`
      );
      throw error;
    }
  }

  // ------ Setters ------ //
  setRouterId(routerId) {
    this.routerId = routerId;
  }

  setDocumentType(documentType) {
    this.documentType = documentType;
  }

  setRouteType(routeType) {
    this.routeType = routeType;
  }

  setRoleAssignments(roleAssignments) {
    if (!Array.isArray(roleAssignments))
      throw new Error("Role assignments must be an array");
    this.roleAssignments = roleAssignments;
  }

  setDateCreated(date) {
    this.dateCreated = date;
  }

  setLastUpdated(date) {
    this.lastUpdated = date;
  }

  // ------ Getters ------ //
  getRouterId() {
    return this.routerId;
  }

  getDocumentType() {
    return this.documentType;
  }

  getRouteType() {
    return this.routeType;
  }

  getRoleAssignments() {
    return this.roleAssignments;
  }

  getDateCreated() {
    return this.dateCreated;
  }

  getLastUpdated() {
    return this.lastUpdated;
  }

  // ------ Methods ------ //

  // Add a role assignment to the router, including category for routing and userName
  addRoleAssignment(roleAssignment) {
    if (!roleAssignment || typeof roleAssignment !== "object")
      throw new Error("Role assignment must be an object");

    const { role, userId, userName, category, assignedBy } = roleAssignment;

    // Validate required fields
    if (!role || !userId || !userName || !category || !assignedBy) {
      throw new Error(
        "Role assignment must include role, userId, userName, category, and assignedBy"
      );
    }

    // Automatically generate assignedDate
    const assignedDate = new Date().toISOString();

    // Push new role assignment into roleAssignments array
    this.roleAssignments.push({
      role,
      userId,
      userName,
      category,
      assignedBy,
      assignedDate,
    });

    // Update lastUpdated timestamp
    this.updateLastUpdated();
  }

  // Remove a role assignment by role
  removeRoleAssignment(role) {
    this.roleAssignments = this.roleAssignments.filter(
      (assignment) => assignment.role !== role
    );
    this.updateLastUpdated();
  }

  // Update a role assignment by role name
  // updateRoleAssignment(role, newUserData) {
  //   const roleIndex = this.roleAssignments.findIndex(
  //     (assignment) => assignment.role === role
  //   );

  //   if (roleIndex === -1) {
  //     return false; // Role not found
  //   }

  //   // Update the found role assignment with new data
  //   this.roleAssignments[roleIndex] = {
  //     ...this.roleAssignments[roleIndex],
  //     ...newUserData,
  //     lastUpdated: new Date().toISOString(), // Ensure timestamp is updated
  //   };

  //   this.updateLastUpdated();
  //   return true; // Indicates success
  // }

  updateRoleAssignment(role, newUserData) {
    const roleIndex = this.roleAssignments.findIndex(
      (assignment) => assignment.role === role
    );

    if (roleIndex === -1) {
      throw new Error(`Role '${role}' not found in role assignments`);
    }

    // Update only specific fields in the role assignment
    this.roleAssignments[roleIndex] = {
      ...this.roleAssignments[roleIndex],
      ...newUserData,
      assignedDate: new Date().toISOString(), // Update assignedDate to now
    };

    this.updateLastUpdated(); // Update the last updated timestamp
  }

  // Update last updated timestamp
  updateLastUpdated() {
    this.lastUpdated = new Date().toISOString();
  }

  // Prepare the router data for Firestore storage
  toFirestoreData() {
    return JSON.parse(JSON.stringify(this));
  }

  // Method to instantiate an InvoiceRouter object from Firestore data
  static fromFirestoreData(data) {
    return new InvoiceRouter(data);
  }
}

module.exports = InvoiceRouter;
