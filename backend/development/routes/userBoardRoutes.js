// // ============= USER BOARD ROUTES ============= //
// const express = require("express");
// const router = express.Router();
// const UserBoardController = require("../controllers/userBoardController");

// // ----------------------------------------------------
// // Routes for UserBoard
// // ----------------------------------------------------

// // ----------------------------------------------------
// router.post("/", UserBoardController.createUserBoard); // Create a new user board
// router.get("/", UserBoardController.getAllUserBoards); // Get all user boards

// router.get("/:userBoardId", UserBoardController.getUserBoardById); // Get a user board by userBoardId
// router.put("/:userBoardId", UserBoardController.updateUserBoard); // Update a user board by userBoardId
// router.delete("/:userBoardId", UserBoardController.deleteUserBoard); // Delete a user board by userBoardId

// router.get("/user/:userID", UserBoardController.getUserBoardByUserId); // Get a user board by userID
// router.get("/user/:userID/preferences", UserBoardController.getUserBoardPreferences); // Get user board's preferences (metadata) by userID

// router.put("/:userBoardId/assign-document", UserBoardController.assignDocument); // Assign a document to a user board
// router.delete("/:userBoardId/remove-document/:docID", UserBoardController.removeAssignedDocument); // Remove an assigned document by docID from a user board

// router.post("/:userBoardId/log-activity", UserBoardController.logActivity); // Log an activity in the user board's activity log

// module.exports = router;

// ============= USER BOARD ROUTES ============= //
const express = require("express");
const router = express.Router();
const UserBoardController = require("../controllers/userBoardController");

// ----------------------------------------------------
// Routes for UserBoard
// ----------------------------------------------------

// Create a new user board
router.post("/", UserBoardController.createUserBoard);

// Get all user boards
router.get("/", UserBoardController.getAllUserBoards);

// Get a user board by userBoardId
router.get("/:userBoardId", UserBoardController.getUserBoardById);

// Update a user board by userBoardId
router.put("/:userBoardId", UserBoardController.updateUserBoard);

// Delete a user board by userBoardId
router.delete("/:userBoardId", UserBoardController.deleteUserBoard);

// Get a user board by userID
router.get("/user/:userID", UserBoardController.getUserBoardByUserId);

// Get user board's preferences (metadata) by userID
router.get(
  "/user/:userID/preferences",
  UserBoardController.getUserBoardPreferences
);

// Assign a document to a user board
router.put("/:userBoardId/assign-document", UserBoardController.assignDocument);

// Remove an assigned document by docID from a user board
router.delete(
  "/:userBoardId/remove-document/:docID",
  UserBoardController.removeAssignedDocument
);

// Assign a file to a user board
router.put("/:userBoardId/assign-file", UserBoardController.assignFile);

// Remove an assigned file by fileID from a user board
router.delete(
  "/:userBoardId/remove-file/:fileID",
  UserBoardController.removeAssignedFile
);

// Log an activity in the user board's activity log
router.post("/:userBoardId/log-activity", UserBoardController.logActivity);

module.exports = router;
