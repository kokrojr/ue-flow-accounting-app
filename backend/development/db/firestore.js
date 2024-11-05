// ========================================================= //
// ============== Firestore  Database Utility ============== //
// ========================================================= //

// Import configurations
const { db } = require("../../config/firebase");
// const db = require("../../config/firebase");
const { Timestamp } = require("firebase-admin").firestore;

class FirestoreInterface {
  // Add a document to Firestore
  static async addDocument(collection, document) {
    try {
      FirestoreInterface.logInfo(
        `Adding document to collection '${collection}'`
      );
      const parsedDocument =
        FirestoreInterface.prepareDocumentForFirestore(document);
      const docRef = await db.collection(collection).add(parsedDocument);
      FirestoreInterface.logSuccess(
        `Document added to '${collection}' with ID: ${docRef.id}`
      );
      return docRef.id;
    } catch (error) {
      FirestoreInterface.logError(
        `Error adding document to collection '${collection}'`,
        error
      );
      throw new Error(
        FirestoreInterface.getErrorMessage("adding document", collection, error)
      );
    }
  }

  // Get document by ID from Firestore
  static async getDocumentById(collection, docId) {
    try {
      FirestoreInterface.logInfo(
        `Fetching document with ID '${docId}' from collection '${collection}'`
      );
      const docRef = db.collection(collection).doc(docId);
      const docSnapshot = await docRef.get();
      if (!docSnapshot.exists) {
        FirestoreInterface.logWarning(
          `Document with ID '${docId}' not found in collection '${collection}'`
        );
        throw new Error(
          `Document with ID '${docId}' not found in collection '${collection}'`
        );
      }
      FirestoreInterface.logSuccess(
        `Document with ID '${docId}' fetched successfully from '${collection}'`
      );

      // Log the fetched data to see its structure
      // console.log("Fetched Invoice Data:", docSnapshot.data());

      return docSnapshot.data();
    } catch (error) {
      FirestoreInterface.logError(
        `Error fetching document with ID '${docId}' from collection '${collection}'`,
        error
      );
      throw new Error(
        FirestoreInterface.getErrorMessage(
          "fetching document",
          collection,
          error
        )
      );
    }
  }

  // Update a document in Firestore
  static async updateDocument(collection, docId, updatedData) {
    try {
      FirestoreInterface.logInfo(
        `Updating document with ID '${docId}' in collection '${collection}'`
      );
      const docRef = db.collection(collection).doc(docId);
      await docRef.update(updatedData);
      FirestoreInterface.logSuccess(
        `Document with ID '${docId}' updated successfully in '${collection}'`
      );
    } catch (error) {
      FirestoreInterface.logError(
        `Error updating document with ID '${docId}' in collection '${collection}'`,
        error
      );
      throw new Error(
        FirestoreInterface.getErrorMessage(
          "updating document",
          collection,
          error
        )
      );
    }
  }

  // Delete a document from Firestore
  static async deleteDocument(collection, docId) {
    try {
      FirestoreInterface.logInfo(
        `Deleting document with ID '${docId}' from collection '${collection}'`
      );
      const docRef = db.collection(collection).doc(docId);
      await docRef.delete();
      FirestoreInterface.logSuccess(
        `Document with ID '${docId}' deleted successfully from '${collection}'`
      );
    } catch (error) {
      FirestoreInterface.logError(
        `Error deleting document with ID '${docId}' from collection '${collection}'`,
        error
      );
      throw new Error(
        FirestoreInterface.getErrorMessage(
          "deleting document",
          collection,
          error
        )
      );
    }
  }

  // Get all documents from Firestore
  static async getAllDocuments(collection) {
    try {
      FirestoreInterface.logInfo(
        `Fetching all documents from collection '${collection}'`
      );
      const collectionSnapshot = await db.collection(collection).get();
      FirestoreInterface.logSuccess(
        `Fetched ${collectionSnapshot.size} documents from '${collection}'`
      );
      return collectionSnapshot.docs.map((doc) => {
        return { id: doc.id, ...doc.data() }; // Return document data with Firestore-generated ID
      });
    } catch (error) {
      FirestoreInterface.logError(
        `Error fetching documents from collection '${collection}'`,
        error
      );
      throw new Error(
        FirestoreInterface.getErrorMessage(
          "fetching documents",
          collection,
          error
        )
      );
    }
  }

  // Prepare a document for Firestore
  static prepareDocumentForFirestore(document) {
    try {
      FirestoreInterface.logInfo("Preparing document for Firestore");
      return JSON.parse(JSON.stringify(document)); // Convert instance to plain object
    } catch (error) {
      FirestoreInterface.logError(
        "Error preparing document for Firestore",
        error
      );
      throw new Error(
        `Error preparing document for Firestore: ${error.message}`
      );
    }
  }

  // --------------------------------------------------- //
  // -------------- Get Document By Field -------------- //
  // --------------------------------------------------- //

  static async getDocumentsByField(collection, field, value) {
    try {
      console.log(
        `[INFO] Querying '${collection}' where '${field}' is '${value}'`
      );

      const querySnapshot = await db
        .collection(collection)
        .where(field, "==", value)
        .get();

      if (querySnapshot.empty) {
        console.warn(
          `[WARN] No documents found in '${collection}' with '${field}' equal to '${value}'`
        );
        return [];
      }

      console.log(
        `[SUCCESS] Fetched ${querySnapshot.size} documents from '${collection}' with '${field}' equal to '${value}'`
      );
      return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error(
        `[ERROR] Error querying documents by field '${field}' in collection '${collection}': ${error.message}`
      );
      throw new Error(
        `Error querying documents by field '${field}' in collection '${collection}': ${error.message}`
      );
    }
  }

  // -------------------------------------------------------- //
  // -------------- Get Document By Date Range -------------- //
  // -------------------------------------------------------- //

  static async getDocumentsByDateRange(collection, field, startDate, endDate) {
    try {
      console.log(
        `[INFO] Querying '${collection}' where '${field}' is between '${startDate}' and '${endDate}'`
      );

      // Ensure that the startDate and endDate cover the full day range
      const startDateISO = new Date(startDate).toISOString(); // Start of the day
      const endDateISO = new Date(endDate).setUTCHours(23, 59, 59, 999); // End of the day
      const endDateISOFormatted = new Date(endDateISO).toISOString(); // Convert to ISO

      const querySnapshot = await db
        .collection(collection)
        .where(field, ">=", startDateISO)
        .where(field, "<=", endDateISOFormatted)
        .get();

      if (querySnapshot.empty) {
        console.warn(
          `[WARN] No documents found in '${collection}' within the date range '${startDateISO}' to '${endDateISOFormatted}'`
        );
        return [];
      }

      console.log(
        `[SUCCESS] Fetched ${querySnapshot.size} documents from '${collection}' within the date range`
      );
      return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error(
        `[ERROR] Error querying documents by date range in collection '${collection}': ${error.message}`
      );
      throw new Error(
        `Error querying documents by date range in collection '${collection}': ${error.message}`
      );
    }
  }

  // Get documents by a specific condition (e.g., where a field is true or non-null)
  static async getDocumentsByCondition(collection, field, value) {
    try {
      console.log(
        `[INFO] Querying '${collection}' where '${field}' is '${value}'`
      );
      const querySnapshot = await db
        .collection(collection)
        .where(field, "==", value)
        .get();

      if (querySnapshot.empty) {
        console.warn(
          `[WARN] No documents found in '${collection}' where '${field}' is '${value}'`
        );
        return [];
      }

      console.log(
        `[SUCCESS] Fetched ${querySnapshot.size} documents from '${collection}' where '${field}' is '${value}'`
      );
      return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error(
        `[ERROR] Error querying documents by condition in collection '${collection}': ${error.message}`
      );
      throw new Error(
        `Error querying documents by condition in collection '${collection}': ${error.message}`
      );
    }
  }

  // ===================================
  // Helper methods for logging and errors
  // ===================================

  // Log info message
  static logInfo(message) {
    console.log(`[INFO] ${message}`);
  }

  // Log success message
  static logSuccess(message) {
    console.log(`[SUCCESS] ${message}`);
  }

  // Log warning message
  static logWarning(message) {
    console.warn(`[WARN] ${message}`);
  }

  // Log error message
  static logError(message, error) {
    console.error(`[ERROR] ${message}: ${error.message}`);
  }

  // Get formatted error message
  static getErrorMessage(action, collection, error) {
    return `Error ${action} in collection '${collection}': ${error.message}`;
  }
}

module.exports = FirestoreInterface;
