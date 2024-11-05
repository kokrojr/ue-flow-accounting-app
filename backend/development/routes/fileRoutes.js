// ============= FILE ROUTES ============= //
const express = require("express");
const router = express.Router();
const FileController = require("../controllers/fileController");

// ----------------------------------------------------
// Routes for File Management
// ----------------------------------------------------

// Add a new file entry
router.post("/", FileController.addFile);

// Get all files
router.get("/", FileController.getAllFiles);

// Get a file by fileID
router.get("/:fileID", FileController.getFileById);

// Update file metadata by fileID
router.put("/:fileID", FileController.updateFile);

// Delete file by fileID
router.delete("/:fileID", FileController.deleteFile);

// Get files by category
router.get("/category/:category", FileController.getFilesByCategory);

// Get all system-generated files
router.get("/system/generated", FileController.getSystemGeneratedFiles);

// ============== TEST ROUTES ======================= //

// Route to upload a file
router.post("/upload", upload.single("file"), FileController.addFile); // Single file upload

// Route to delete a file by fileID
router.delete("/delete/:fileID", FileController.deleteFile); // Delete a file

module.exports = router;
