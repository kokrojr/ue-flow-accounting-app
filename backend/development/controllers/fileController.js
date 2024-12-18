// ============= FILE CONTROLLER ============= //

const FileModel = require("../models/fileModel");
const StorageService = require("../services/storageService");

class FileController {
  // ----------------------------------------------------
  // Add a new file entry

  static async addFile(req, res) {
    try {
      const uploadedBy = req.user.id;
      // const createdBy = req.user.id;
      const { originalname, buffer, mimetype, size } = req.file;
      const { category, uploadSource } = req.body;
      const storagePath = `uploads/${category}/${Date.now()}_${originalname}`;

      // Upload file to Firebase Storage
      const downloadURL = await StorageService.uploadFile(
        buffer,
        storagePath,
        mimetype
      );

      // Save file metadata in Firestore
      const fileData = {
        fileName: originalname,
        fileType: mimetype,
        fileSize: size,
        category,
        uploadSource,
        uploadedBy,
        storagePath,
        downloadURL,
        uploadDate: new Date().toISOString(),
        systemGenerated: false,
      };
      // const fileID = await FileModel.addFile(fileData);
      const fileRecord = await FileModel.addFile(fileData);

      res
        .status(201)
        .json({ message: "File uploaded successfully", data: fileRecord });
    } catch (error) {
      res
        .status(500)
        .json({ error: error.message, info: "Failed to upload file" });
    }
  }

  // ----------------------------------------------------
  // Get all files
  static async getAllFiles(req, res) {
    try {
      const files = await FileModel.getAllFiles();
      res.status(200).json(files);
    } catch (error) {
      res.status(500).json({
        error: error.message,
        info: "Failed to retrieve files.",
      });
    }
  }

  // ----------------------------------------------------
  // Get file by fileID
  static async getFileById(req, res) {
    try {
      const { fileID } = req.params;
      const file = await FileModel.getFileById(fileID);
      if (!file) {
        return res.status(404).json({ error: "File not found" });
      }
      res.status(200).json(file);
    } catch (error) {
      res.status(500).json({
        error: error.message,
        info: "Failed to retrieve file.",
      });
    }
  }

  // ----------------------------------------------------
  // Update file metadata by fileID
  static async updateFile(req, res) {
    try {
      const { fileID } = req.params;
      const updateData = req.body;
      const updatedFile = await FileModel.updateFile(fileID, updateData);
      res.status(200).json({
        message: "File metadata updated successfully",
        data: updatedFile,
      });
    } catch (error) {
      res.status(500).json({
        error: error.message,
        info: "Failed to update file metadata.",
      });
    }
  }

  // ----------------------------------------------------
  // Delete file by fileID
  static async deleteFile(req, res) {
    try {
      const { fileID } = req.params;

      // Fetch file record to get storage path
      const fileRecord = await FileModel.getFileById(fileID);
      if (!fileRecord) {
        return res.status(404).json({ error: "File not found" });
      }

      // Ensure filePath exists
    const filePath = fileRecord.storagePath;
    if (!filePath) {
      throw new Error("A file path must be specified for deletion.");
    }

      // Delete file from Firebase Storage
      await StorageService.deleteFile(filePath);

      // Delete file record from Firestore
      await FileModel.deleteFile(fileID);

      res.status(200).json({ message: "File deleted successfully" });
    } catch (error) {
      res
        .status(500)
        .json({ error: error.message, info: "Failed to delete file" });
    }
  }

  // ----------------------------------------------------
  // Get files by category
  static async getFilesByCategory(req, res) {
    try {
      const { category } = req.params;
      const files = await FileModel.getFilesByCategory(category);
      res.status(200).json(files);
    } catch (error) {
      res.status(500).json({
        error: error.message,
        info: `Failed to retrieve files by category '${category}'.`,
      });
    }
  }

  // ----------------------------------------------------
  // Get all system-generated files
  static async getSystemGeneratedFiles(req, res) {
    try {
      const files = await FileModel.getSystemGeneratedFiles();
      res.status(200).json(files);
    } catch (error) {
      res.status(500).json({
        error: error.message,
        info: "Failed to retrieve system-generated files.",
      });
    }
  }
}

module.exports = FileController;
