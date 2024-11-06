// ============= FILE MODEL ============= //

const FirestoreInterface = require("../db/firestore");
const File = require("../schemas/fileSchema");

// Define Collection Name
const COLLECTION_NAME = "files";

class FileModel {
  // ----------------------------------------------------
  // Add a new file entry to Firestore
  static async addFile(fileData) {
    try {
      const fileEntry = new File(fileData); // Initialize schema
      const parsedData = fileEntry.toFirestoreData();

      // Add document to Firestore and retrieve docId
      const docId = await FirestoreInterface.addDocument(
        COLLECTION_NAME,
        parsedData
      );

      // Update schema with Firestore-generated ID
      fileEntry.fileID = docId;
      await FirestoreInterface.updateDocument(COLLECTION_NAME, docId, {
        fileID: docId,
      });

      return fileEntry;
      // return fileEntry.fileID;
    } catch (error) {
      throw new Error(`Error adding file: ${error.message}`);
    }
  }

  // ----------------------------------------------------
  // Get all files in the collection
  static async getAllFiles() {
    try {
      const allFiles = await FirestoreInterface.getAllDocuments(
        COLLECTION_NAME
      );
      return allFiles.map((data) => File.fromFirestoreData(data));
    } catch (error) {
      throw new Error(`Error retrieving all files: ${error.message}`);
    }
  }

  // ----------------------------------------------------
  // Get file by fileID
  static async getFileById(fileID) {
    try {
      const fileData = await FirestoreInterface.getDocumentById(
        COLLECTION_NAME,
        fileID
      );
      if (!fileData) throw new Error(`File with ID '${fileID}' not found`);
      return File.fromFirestoreData(fileData);
    } catch (error) {
      throw new Error(`Error retrieving file by ID: ${error.message}`);
    }
  }

  // ----------------------------------------------------
  // Update file metadata by fileID
  static async updateFile(fileID, updateData) {
    try {
      await FirestoreInterface.updateDocument(
        COLLECTION_NAME,
        fileID,
        updateData
      );
      return { fileID, ...updateData };
    } catch (error) {
      throw new Error(`Error updating file metadata: ${error.message}`);
    }
  }

  // ----------------------------------------------------
  // Delete file entry by fileID
  static async deleteFile(fileID) {
    try {
      await FirestoreInterface.deleteDocument(COLLECTION_NAME, fileID);
      return { message: `File with ID '${fileID}' deleted successfully.` };
    } catch (error) {
      throw new Error(`Error deleting file entry: ${error.message}`);
    }
  }

  // ----------------------------------------------------
  // Search files by category
  static async getFilesByCategory(category) {
    try {
      const files = await FirestoreInterface.getDocumentsByField(
        COLLECTION_NAME,
        "category",
        category
      );
      return files.map((data) => File.fromFirestoreData(data));
    } catch (error) {
      throw new Error(
        `Error retrieving files by category '${category}': ${error.message}`
      );
    }
  }

  // ----------------------------------------------------
  // Get all system-generated files
  static async getSystemGeneratedFiles() {
    try {
      const files = await FirestoreInterface.getDocumentsByCondition(
        COLLECTION_NAME,
        "createdBySystem",
        true
      );
      return files.map((data) => File.fromFirestoreData(data));
    } catch (error) {
      throw new Error("Error retrieving system-generated files");
    }
  }
}

module.exports = FileModel;
