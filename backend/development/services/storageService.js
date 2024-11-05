// ============= STORAGE UTILITY ============= //
const { storage } = require("../../config/firebase");

class StorageService {
  // Upload file to Firebase Storage
  static async uploadFile(buffer, destinationPath, contentType = "application/octet-stream") {
    const file = storage.file(destinationPath);
    const stream = file.createWriteStream({
      metadata: { contentType },
    });

    return new Promise((resolve, reject) => {
      stream.on("finish", async () => {
        try {
          const downloadURL = await file.getSignedUrl({
            action: "read",
            expires: "03-01-2500",
          });
          resolve(downloadURL[0]);
        } catch (error) {
          reject(`Error getting download URL: ${error.message}`);
        }
      });
      stream.on("error", (error) => reject(`Error uploading file: ${error.message}`));
      stream.end(buffer);
    });
  }

  // Delete file from Firebase Storage
  static async deleteFile(filePath) {
    try {
      const file = storage.file(filePath);
      await file.delete();
      console.log(`File deleted successfully: ${filePath}`);
    } catch (error) {
      throw new Error(`Error deleting file: ${error.message}`);
    }
  }

  // Get download URL for a file
  static async getFileDownloadURL(filePath) {
    try {
      const file = storage.file(filePath);
      const [url] = await file.getSignedUrl({
        action: "read",
        expires: "03-01-2500",
      });
      return url;
    } catch (error) {
      throw new Error(`Error getting download URL: ${error.message}`);
    }
  }
}

module.exports = StorageService;
