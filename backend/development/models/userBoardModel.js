// ============= USER BOARD MODEL ============= //

const FirestoreInterface = require("../db/firestore");
const UserBoard = require("../schemas/userBoardSchema");

// Define Collection Name
const COLLECTION_NAME = "userBoards";

class UserBoardModel {
  // ----------------------------------------------------
  // Create a new user board
  static async createUserBoard(userBoardData) {
    try {
      if (!userBoardData.userID || userBoardData.userID.trim() === "") {
        throw new Error("userID is required and cannot be empty");
      }

      const userBoardEntry = new UserBoard(userBoardData);
      const parsedData = userBoardEntry.toFirestoreData();

      const docId = await FirestoreInterface.addDocument(
        COLLECTION_NAME,
        parsedData
      );

      userBoardEntry.userBoardId = docId;
      await FirestoreInterface.updateDocument(COLLECTION_NAME, docId, {
        userBoardId: docId,
        userID: userBoardData.userID,
      });

      return userBoardEntry;
    } catch (error) {
      throw new Error(`Error creating user board: ${error.message}`);
    }
  }

  // ----------------------------------------------------
  // Get all user boards
  static async getAllUserBoards() {
    try {
      const allUserBoards = await FirestoreInterface.getAllDocuments(
        COLLECTION_NAME
      );
      return allUserBoards.map((data) => UserBoard.fromFirestoreData(data));
    } catch (error) {
      throw new Error(`Error retrieving all user boards: ${error.message}`);
    }
  }

  // ----------------------------------------------------
  // Get user board by userBoardId
  static async getUserBoardById(userBoardId) {
    try {
      const userBoardData = await FirestoreInterface.getDocumentById(
        COLLECTION_NAME,
        userBoardId
      );
      if (!userBoardData) {
        throw new Error(`User board entry with ID '${userBoardId}' not found`);
      }
      return UserBoard.fromFirestoreData(userBoardData);
    } catch (error) {
      throw new Error(`Error retrieving user board entry: ${error.message}`);
    }
  }

  // ----------------------------------------------------
  // Get user board by userID
  static async getUserBoardByUserId(userID) {
    try {
      const userBoardData = await FirestoreInterface.getDocumentsByField(
        COLLECTION_NAME,
        "userID",
        userID
      );
      if (userBoardData.length === 0) {
        return null;
      }
      return UserBoard.fromFirestoreData(userBoardData[0]);
    } catch (error) {
      throw new Error(
        `Error retrieving user board by userID: ${error.message}`
      );
    }
  }

  // ----------------------------------------------------
  // Get user board's ID by userID
  static async getUserBoardIdByUserId(userID) {
    try {
      const userBoard = await this.getUserBoardByUserId(userID);
      return userBoard ? userBoard.userBoardId : null;
    } catch (error) {
      throw new Error(`Error retrieving user board ID: ${error.message}`);
    }
  }

  // ----------------------------------------------------
  // Update a user board entry
  static async updateUserBoard(userBoardId, updateData) {
    try {
      await FirestoreInterface.updateDocument(
        COLLECTION_NAME,
        userBoardId,
        updateData
      );
      return { userBoardId, ...updateData };
    } catch (error) {
      throw new Error(`Error updating user board entry: ${error.message}`);
    }
  }

  // ----------------------------------------------------
  // Delete a user board entry by userBoardId
  static async deleteUserBoard(userBoardId) {
    try {
      await FirestoreInterface.deleteDocument(COLLECTION_NAME, userBoardId);
      return { message: `User board entry with ID ${userBoardId} deleted.` };
    } catch (error) {
      throw new Error(`Error deleting user board entry: ${error.message}`);
    }
  }

  // ----------------------------------------------------
  // Assign a new document to the user board
  static async assignDocument(userBoardId, docData) {
    try {
      const userBoard = await this.getUserBoardById(userBoardId);
      if (!userBoard) throw new Error("User board entry not found");

      userBoard.addAssignedDoc(docData);

      await this.updateUserBoard(userBoardId, {
        assignedDocs: userBoard.assignedDocs,
        activityLog: userBoard.activityLog,
        lastUpdated: userBoard.lastUpdated,
        notifications: true,
      });

      return userBoard;
    } catch (error) {
      throw new Error(`Error assigning document: ${error.message}`);
    }
  }

  // ----------------------------------------------------
  // Remove a document from the user board by docID
  static async removeAssignedDocument(userBoardId, docID) {
    try {
      if (!docID) {
        throw new Error("Invalid or missing docID for removal.");
      }

      const userBoard = await this.getUserBoardById(userBoardId);
      if (!userBoard) throw new Error("User board entry not found");

      userBoard.removeAssignedDoc(docID);

      await this.updateUserBoard(userBoardId, {
        assignedDocs: userBoard.assignedDocs,
        activityLog: userBoard.activityLog,
        lastUpdated: userBoard.lastUpdated,
      });

      return userBoard;
    } catch (error) {
      throw new Error(`Error removing assigned document: ${error.message}`);
    }
  }

  // ----------------------------------------------------
  // Assign a new file to the user board
  static async assignFile(userBoardId, fileData) {
    try {
      const userBoard = await this.getUserBoardById(userBoardId);
      if (!userBoard) throw new Error("User board entry not found");

      userBoard.addAssignedFile(fileData);

      await this.updateUserBoard(userBoardId, {
        assignedFiles: userBoard.assignedFiles,
        activityLog: userBoard.activityLog,
        lastUpdated: userBoard.lastUpdated,
        notifications: true,
      });

      console.log(`[INFO] Successfully assigned file to user board`);
      return userBoard;
    } catch (error) {
      throw new Error(`Error assigning file: ${error.message}`);
    }
  }

  // ----------------------------------------------------
  // Remove a file from the user board by fileID
  static async removeAssignedFile(userBoardId, fileID) {
    try {
      if (!fileID) {
        throw new Error("Invalid or missing fileID for removal.");
      }

      const userBoard = await this.getUserBoardById(userBoardId);
      if (!userBoard) throw new Error("User board entry not found");

      userBoard.removeAssignedFile(fileID);

      await this.updateUserBoard(userBoardId, {
        assignedFiles: userBoard.assignedFiles,
        activityLog: userBoard.activityLog,
        lastUpdated: userBoard.lastUpdated,
      });

      return userBoard;
    } catch (error) {
      throw new Error(`Error removing assigned file: ${error.message}`);
    }
  }

  // ----------------------------------------------------
  // Log an activity in the user board's activity log
  static async logActivity(userBoardId, actionData) {
    try {
      const userBoard = await this.getUserBoardById(userBoardId);
      if (!userBoard) throw new Error("User board entry not found");

      userBoard.addActivity(actionData);

      await this.updateUserBoard(userBoardId, {
        activityLog: userBoard.activityLog,
        lastUpdated: userBoard.lastUpdated,
      });

      return userBoard;
    } catch (error) {
      throw new Error(`Error logging activity: ${error.message}`);
    }
  }
}

module.exports = UserBoardModel;
