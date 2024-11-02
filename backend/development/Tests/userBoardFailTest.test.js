const UserBoardModel = require("../models/userBoardModel");
const FirestoreInterface = require("../db/firestore");
const UserBoard = require("../schemas/userBoardSchema");

// Fail Test

// Mock Firestore methods
jest.mock("../db/firestore", () => ({
  addDocument: jest.fn(),
  getAllDocuments: jest.fn(),
  getDocumentById: jest.fn(),
  getDocumentsByField: jest.fn(),
  updateDocument: jest.fn(),
  deleteDocument: jest.fn(),
}));

describe("UserBoardModel with Invalid Data", () => {
  const invalidUserBoardData = {
    userID: "", // Invalid empty userID
    roles: ["Approver", "Reviewer"],
    notifications: true,
    metadata: { notificationPreference: "email", boardView: "detailed" },
  };

  const invalidDocData = {
    docID: "", // Invalid empty docID
    docType: "invoice",
    purpose: "for approval",
    assignedBy: "adminUserID",
    dueDate: "2024-11-05T23:59:59Z",
    status: "", // Invalid empty status
  };

  const invalidActivityData = {
    action: "reviewed",
    docID: "invoiceID1",
    timestamp: "", // Invalid empty timestamp
    performedBy: "", // Invalid empty performedBy
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test creating a new user board with invalid data
  describe("createUserBoard with invalid data", () => {
    it("should throw an error when userID is missing or empty", async () => {
      await expect(
        UserBoardModel.createUserBoard(invalidUserBoardData)
      ).rejects.toThrow(
        "Error creating user board: userID is required and cannot be empty"
      );
    });
  });

  // Test assigning a document with invalid data
  describe("assignDocument with invalid data", () => {
    it("should throw an error when docID or status is missing or empty", async () => {
      FirestoreInterface.getDocumentById.mockResolvedValue(
        invalidUserBoardData
      );

      await expect(
        UserBoardModel.assignDocument("testUserBoardId", invalidDocData)
      ).rejects.toThrow("Incomplete document data for assignment");

      expect(FirestoreInterface.getDocumentById).toHaveBeenCalledWith(
        "userBoards",
        "testUserBoardId"
      );
    });
  });

  // Test removing an assigned document with an invalid docID
    describe("removeAssignedDocument with invalid docID", () => {
      it("should throw an error when trying to remove a non-existent docID", async () => {
        const userBoardWithDocs = {
          ...invalidUserBoardData,
          assignedDocs: [invalidDocData],
        };
        FirestoreInterface.getDocumentById.mockResolvedValue(userBoardWithDocs);

        await expect(
          UserBoardModel.removeAssignedDocument(
            "testUserBoardId",
            "nonExistentDocID"
          )
        ).rejects.toThrow(
          "Document with ID 'nonExistentDocID' not found in assignedDocs"
        );

        expect(FirestoreInterface.getDocumentById).toHaveBeenCalledWith(
          "userBoards",
          "testUserBoardId"
        );
      });
    });

  // Test logging activity with invalid data
  describe("logActivity with invalid data", () => {
    it("should throw an error when action data is incomplete", async () => {
      FirestoreInterface.getDocumentById.mockResolvedValue(invalidUserBoardData);

      await expect(
        UserBoardModel.logActivity("testUserBoardId", invalidActivityData)
      ).rejects.toThrow("Incomplete action data for activity log");

      expect(FirestoreInterface.getDocumentById).toHaveBeenCalledWith(
        "userBoards",
        "testUserBoardId"
      );
    });
  });

  // Test updating a user board with invalid data
  describe("updateUserBoard with invalid data", () => {
    it("should throw an error when updateData is empty or missing required fields", async () => {
      FirestoreInterface.updateDocument.mockRejectedValue(
        new Error("Invalid update data")
      );

      await expect(
        UserBoardModel.updateUserBoard("testUserBoardId", {})
      ).rejects.toThrow("Invalid update data");

      expect(FirestoreInterface.updateDocument).toHaveBeenCalledWith(
        "userBoards",
        "testUserBoardId",
        {}
      );
    });
  });

  // Test getting user board by userID with missing data
  describe("getUserBoardByUserId with non-existent userID", () => {
    it("should return null if user board does not exist for the given userID", async () => {
      FirestoreInterface.getDocumentsByField.mockResolvedValue([]);

      const userBoard = await UserBoardModel.getUserBoardByUserId(
        "nonExistentUserID"
      );

      expect(FirestoreInterface.getDocumentsByField).toHaveBeenCalledWith(
        "userBoards",
        "userID",
        "nonExistentUserID"
      );
      expect(userBoard).toBeNull();
    });
  });
});
