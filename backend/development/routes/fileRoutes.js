// ------------------------------------------------- //
// ================== FILE ROUTES ================== //
// ------------------------------------------------- //

const express = require("express");
const router = express.Router();
const multer = require("multer");
const FileController = require("../controllers/fileController");

// Set up multer for handling file uploads
const upload = multer({ storage: multer.memoryStorage() });

// -------------------------------------------------- //
// =========== Routes for File Management =========== //
// -------------------------------------------------- //

router.post("/", FileController.addFile); // Add a new file entry
router.get("/", FileController.getAllFiles); // Get all files
router.get("/:fileID", FileController.getFileById); // Get a file by fileID
router.put("/:fileID", FileController.updateFile); // Update file metadata by fileID
router.delete("/:fileID", FileController.deleteFile); // Delete file by fileID
router.get("/category/:category", FileController.getFilesByCategory); // Get files by category
router.get("/system/generated", FileController.getSystemGeneratedFiles); // Get all system-generated files

// ============== TEST ROUTES ======================= //

router.post("/upload", upload.single("file"), FileController.addFile); // Single file upload
router.delete("/delete/:fileID", FileController.deleteFile); // Delete a file

module.exports = router;
