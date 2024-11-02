// ============= USER BOARD CONTROLLER ============= //

const UserBoardModel = require("../models/userBoardModel");

class UserBoardController {
  // ----------------------------------------------------
  // Create a new user board
  static async createUserBoard(req, res) {
    try {
      const userBoardData = req.body;
      const userBoardEntry = await UserBoardModel.createUserBoard(
        userBoardData
      );
      res.status(201).json({
        message: "User board created successfully",
        data: userBoardEntry,
      });
    } catch (error) {
      res.status(500).json({
        error: error.message,
        info: "Failed to create user board. Please check the input data.",
      });
    }
  }

  // ----------------------------------------------------
  // Get all user boards
  static async getAllUserBoards(req, res) {
    try {
      const userBoards = await UserBoardModel.getAllUserBoards();
      res.status(200).json(userBoards);
    } catch (error) {
      res.status(500).json({
        error: error.message,
        info: "Failed to retrieve user boards.",
      });
    }
  }

  // ----------------------------------------------------
  // Get user board by userBoardId
  static async getUserBoardById(req, res) {
    try {
      const { userBoardId } = req.params;
      const userBoard = await UserBoardModel.getUserBoardById(userBoardId);
      if (!userBoard) {
        return res.status(404).json({ error: "User board not found" });
      }
      res.status(200).json(userBoard);
    } catch (error) {
      res.status(500).json({
        error: error.message,
        info: "Failed to retrieve the user board entry.",
      });
    }
  }

  // ----------------------------------------------------
  // Get user board by userID
  static async getUserBoardByUserId(req, res) {
    try {
      const { userID } = req.params;
      const userBoard = await UserBoardModel.getUserBoardByUserId(userID);
      if (!userBoard) {
        return res.status(404).json({ error: "User board not found" });
      }
      res.status(200).json(userBoard);
    } catch (error) {
      res.status(500).json({
        error: error.message,
        info: "Failed to retrieve user board by userID.",
      });
    }
  }

  // ----------------------------------------------------
  // Get user board's preferences (metadata) by userID
  static async getUserBoardPreferences(req, res) {
    try {
      const { userID } = req.params;
      const preferences = await UserBoardModel.getUserBoardPreferences(userID);
      res.status(200).json(preferences);
    } catch (error) {
      res.status(500).json({
        error: error.message,
        info: "Failed to retrieve user board preferences.",
      });
    }
  }

  // ----------------------------------------------------
  // Update a user board
  static async updateUserBoard(req, res) {
    try {
      const { userBoardId } = req.params;
      const updateData = req.body;
      const updatedUserBoard = await UserBoardModel.updateUserBoard(
        userBoardId,
        updateData
      );
      res.status(200).json({
        message: "User board updated successfully",
        data: updatedUserBoard,
      });
    } catch (error) {
      res.status(500).json({
        error: error.message,
        info: "Failed to update user board.",
      });
    }
  }

  // ----------------------------------------------------
  // Delete a user board by userBoardId
  static async deleteUserBoard(req, res) {
    try {
      const { userBoardId } = req.params;
      const response = await UserBoardModel.deleteUserBoard(userBoardId);
      res.status(200).json({
        message: response.message,
      });
    } catch (error) {
      res.status(500).json({
        error: error.message,
        info: "Failed to delete user board entry.",
      });
    }
  }

  // ----------------------------------------------------
  // Assign a document to the user board
  static async assignDocument(req, res) {
    try {
      const { userBoardId } = req.params;
      const docData = req.body;
      const userBoard = await UserBoardModel.assignDocument(
        userBoardId,
        docData
      );
      res.status(200).json({
        message: "Document assigned successfully",
        data: userBoard,
      });
    } catch (error) {
      res.status(500).json({
        error: error.message,
        info: "Failed to assign document to user board.",
      });
    }
  }

  // ----------------------------------------------------
  // Remove an assigned document by docID from the user board
  static async removeAssignedDocument(req, res) {
    try {
      const { userBoardId, docID } = req.params;
      const userBoard = await UserBoardModel.removeAssignedDocument(
        userBoardId,
        docID
      );
      res.status(200).json({
        message: `Document with ID '${docID}' removed successfully`,
        data: userBoard,
      });
    } catch (error) {
      res.status(500).json({
        error: error.message,
        info: "Failed to remove assigned document.",
      });
    }
  }

  // ----------------------------------------------------
  // Log an activity in the user board's activity log
  static async logActivity(req, res) {
    try {
      const { userBoardId } = req.params;
      const actionData = req.body;
      const userBoard = await UserBoardModel.logActivity(
        userBoardId,
        actionData
      );
      res.status(200).json({
        message: "Activity logged successfully",
        data: userBoard,
      });
    } catch (error) {
      res.status(500).json({
        error: error.message,
        info: "Failed to log activity in user board.",
      });
    }
  }
}

module.exports = UserBoardController;
