// ============= FILE SCHEMA ============= //

class File {
  constructor(fileData) {
    try {
      // Metadata for the file
      this.fileID = fileData.fileID || ""; // Unique identifier (Firestore auto-generates this)
      this.fileName = fileData.fileName || "Untitled"; // Name of the file
      this.fileType = fileData.fileType || "unknown"; // Type of file (e.g., pdf, jpg)
      this.fileSize = fileData.fileSize || 0; // Size of the file in bytes
      this.category = fileData.category || "general"; // Category of the file (e.g., invoice, report, userUpload)
      this.uploadSource = fileData.uploadSource || "unknown"; // Source of upload (systemGenerated or userUploaded)

      // Ownership and permissions
      this.uploadedBy = fileData.uploadedBy || "system"; // ID of the user/system who uploaded the file
      this.createdBySystem = fileData.createdBySystem || false; // Boolean to check if system-generated

      // Storage and retrieval metadata
      this.storagePath = fileData.storagePath || ""; // Path in Firebase Storage
      this.downloadURL = fileData.downloadURL || ""; // Direct URL for download
      this.createdAt = fileData.createdAt || new Date().toISOString(); // Timestamp when file was created
      this.lastAccessed = fileData.lastAccessed || null; // Timestamp of last access
    } catch (error) {
      console.error(`Error initializing File schema: ${error.message}`);
      throw error;
    }
  }

  // ----------------------------------------------------
  // Prepare the file data for Firestore
  toFirestoreData() {
    return JSON.parse(JSON.stringify(this));
  }

  // ----------------------------------------------------
  // Create a File instance from Firestore data
  static fromFirestoreData(data) {
    return new File(data);
  }
}

module.exports = File;
