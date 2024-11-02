// ========================================================== //
// ===================== UserBoard Schema =================== //
// ========================================================== //

class UserBoard {
  constructor(userBoardData) {
    try {
      this.userBoardId = userBoardData.userBoardId || ""; // User board ID
      this.userID = userBoardData.userID || ""; // User ID
      this.assignedDocs = userBoardData.assignedDocs || []; // Assigned Documents
      this.activityLog = userBoardData.activityLog || []; // Activity Log
      this.notifications = userBoardData.notifications || false; // Notifications
      this.metadata = userBoardData.metadata || {}; // User Board Preferences
      this.lastUpdated = userBoardData.lastUpdated || new Date().toISOString(); // Timestamps
    } catch (error) {
      console.error(`Error initializing UserBoard schema: ${error.message}`);
      throw error;
    }
  }

  // ------ Setters ------ //

  setAssignedDocs(assignedDocs) {
    if (!Array.isArray(assignedDocs))
      throw new Error("Assigned docs must be an array");
    this.assignedDocs = assignedDocs;
  }

  setMetadata(metadata) {
    if (typeof metadata !== "object")
      throw new Error("Metadata must be an object");
    this.metadata = metadata;
  }

  // =============================================== //
  // ------------------- Methods ------------------- //
  // =============================================== //

  // ----------------------------------------------------
  // Assign document
  addAssignedDoc(docData) {
    if (typeof docData !== "object") {
      throw new Error("Document data must be an object");
    }

    const {
      docID,
      docType,
      purpose,
      assignedBy,
      dueDate,
      status,
      priority = "normal",
    } = docData;
    if (!docID || !docType || !purpose || !assignedBy || !status) {
      throw new Error("Incomplete document data for assignment");
    }

    const assignedDate = new Date().toISOString();

    // Assign the document
    this.assignedDocs.push({
      docID,
      docType,
      purpose,
      assignedDate,
      assignedBy,
      dueDate: dueDate || null,
      status,
      priority,
    });

    // Log the assignment
    this.addActivity({
      action: "assigned",
      docID,
      timestamp: assignedDate,
      performedBy: assignedBy,
    });

    // Set notifications
    this.notifications = true;

    // Update the timestamp
    this.updateLastUpdated();
  }

  // ----------------------------------------------------
  // Remove assignment
  removeAssignedDoc(docID, performedBy = "system") {
    const initialLength = this.assignedDocs.length;

    // Filter out the document
    this.assignedDocs = this.assignedDocs.filter((doc) => doc.docID !== docID);

    // Check if the document was removed
    if (this.assignedDocs.length !== initialLength) {
      // Document was removed.
      this.addActivity({
        action: "removed",
        docID: docID,
        timestamp: new Date().toISOString(),
        performedBy: performedBy,
      });

      // Update the timestamp
      this.updateLastUpdated();
    } else {
      throw new Error(`Document with ID '${docID}' not found in assignedDocs.`);
    }
  }

  // ----------------------------------------------------
  // Add activity log
  addActivity(actionData) {
    if (typeof actionData !== "object")
      throw new Error("Action data must be an object");
    const { action, docID, performedBy } = actionData;
    if (!action || !docID || !performedBy)
      throw new Error("Incomplete action data for activity log");

    const timestamp = new Date().toISOString();

    this.activityLog.push({ action, docID, timestamp, performedBy });
    this.updateLastUpdated();
  }

  // ----------------------------------------------------
  // Update last updated timestamp
  updateLastUpdated() {
    this.lastUpdated = new Date().toISOString();
  }

  // ----------------------------------------------------
  // Prepare user board data for Firestore
  toFirestoreData() {
    return JSON.parse(JSON.stringify(this));
  }

  // ----------------------------------------------------
  // Create a UserBoard instance from Firestore data
  static fromFirestoreData(data) {
    return new UserBoard(data);
  }
}

module.exports = UserBoard;
