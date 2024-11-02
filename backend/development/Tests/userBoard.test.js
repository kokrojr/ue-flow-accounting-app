const UserBoardModel = require("../models/userBoardModel");
const FirestoreInterface = require("../db/firestore");
const UserBoard = require("../schemas/userBoardSchema");

// Mock Firestore methods
jest.mock("../db/firestore", () => ({
  addDocument: jest.fn(),
  getAllDocuments: jest.fn(),
  getDocumentById: jest.fn(),
  getDocumentsByField: jest.fn(),
  updateDocument: jest.fn(),
  deleteDocument: jest.fn(),
}));

describe("UserBoardModel", () => {
  const sampleUserBoardData = {
    userID: "user123",
    roles: ["Approver", "Reviewer"],
    notifications: true,
    metadata: { notificationPreference: "email", boardView: "detailed" },
  };

  const sampleDocData = {
    docID: "invoiceID1",
    docType: "invoice",
    purpose: "for approval",
    assignedBy: "adminUserID",
    dueDate: "2024-11-05T23:59:59Z",
    status: "pending",
    priority: "high",
  };

  const sampleActivityData = {
    action: "reviewed",
    docID: "invoiceID1",
    timestamp: "2024-11-06T12:00:00Z",
    performedBy: "reviewerUserID",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test creating a new user board
  describe("createUserBoard", () => {
    it("should create a new user board", async () => {
      FirestoreInterface.addDocument.mockResolvedValue("newUserBoardId");
      FirestoreInterface.updateDocument.mockResolvedValue();

      const userBoard = await UserBoardModel.createUserBoard(
        sampleUserBoardData
      );

      expect(FirestoreInterface.addDocument).toHaveBeenCalledWith(
        "userBoards",
        expect.any(Object)
      );
      expect(FirestoreInterface.updateDocument).toHaveBeenCalledWith(
        "userBoards",
        "newUserBoardId",
        expect.objectContaining({ userBoardId: "newUserBoardId" })
      );
      expect(userBoard).toBeInstanceOf(UserBoard);
      expect(userBoard.userBoardId).toBe("newUserBoardId");
    });
  });

  // Test retrieving all user boards
  describe("getAllUserBoards", () => {
    it("should retrieve all user boards", async () => {
      FirestoreInterface.getAllDocuments.mockResolvedValue([
        sampleUserBoardData,
      ]);

      const userBoards = await UserBoardModel.getAllUserBoards();

      expect(FirestoreInterface.getAllDocuments).toHaveBeenCalledWith(
        "userBoards"
      );
      expect(userBoards).toBeInstanceOf(Array);
      expect(userBoards[0]).toBeInstanceOf(UserBoard);
    });
  });

  // Test retrieving a user board by ID
  describe("getUserBoardById", () => {
    it("should retrieve a user board by userBoardId", async () => {
      FirestoreInterface.getDocumentById.mockResolvedValue(sampleUserBoardData);

      const userBoard = await UserBoardModel.getUserBoardById(
        "testUserBoardId"
      );

      expect(FirestoreInterface.getDocumentById).toHaveBeenCalledWith(
        "userBoards",
        "testUserBoardId"
      );
      expect(userBoard).toBeInstanceOf(UserBoard);
      expect(userBoard.userID).toBe(sampleUserBoardData.userID);
    });
  });

  // Test retrieving a user board by userID
  describe("getUserBoardByUserId", () => {
    it("should retrieve a user board by userID", async () => {
      FirestoreInterface.getDocumentsByField.mockResolvedValue([
        sampleUserBoardData,
      ]);

      const userBoard = await UserBoardModel.getUserBoardByUserId("user123");

      expect(FirestoreInterface.getDocumentsByField).toHaveBeenCalledWith(
        "userBoards",
        "userID",
        "user123"
      );
      expect(userBoard).toBeInstanceOf(UserBoard);
      expect(userBoard.userID).toBe(sampleUserBoardData.userID);
    });
  });

  // Test updating a user board
  describe("updateUserBoard", () => {
    it("should update a user board entry", async () => {
      FirestoreInterface.updateDocument.mockResolvedValue();

      const updateData = { notifications: false };
      const updatedBoard = await UserBoardModel.updateUserBoard(
        "testUserBoardId",
        updateData
      );

      expect(FirestoreInterface.updateDocument).toHaveBeenCalledWith(
        "userBoards",
        "testUserBoardId",
        updateData
      );
      expect(updatedBoard).toEqual({
        userBoardId: "testUserBoardId",
        ...updateData,
      });
    });
  });

  // Test deleting a user board
  describe("deleteUserBoard", () => {
    it("should delete a user board by userBoardId", async () => {
      FirestoreInterface.deleteDocument.mockResolvedValue();

      const result = await UserBoardModel.deleteUserBoard("testUserBoardId");

      expect(FirestoreInterface.deleteDocument).toHaveBeenCalledWith(
        "userBoards",
        "testUserBoardId"
      );
      expect(result).toEqual({
        message: "User board entry with ID testUserBoardId deleted.",
      });
    });
  });

  // Test assigning a document to a user board
  describe("assignDocument", () => {
    it("should assign a document to the user board", async () => {
      FirestoreInterface.getDocumentById.mockResolvedValue(sampleUserBoardData);
      FirestoreInterface.updateDocument.mockResolvedValue();

      const userBoard = await UserBoardModel.assignDocument(
        "testUserBoardId",
        sampleDocData
      );

      expect(FirestoreInterface.getDocumentById).toHaveBeenCalledWith(
        "userBoards",
        "testUserBoardId"
      );
      expect(FirestoreInterface.updateDocument).toHaveBeenCalledWith(
        "userBoards",
        "testUserBoardId",
        expect.objectContaining({ notifications: true })
      );
      expect(userBoard.assignedDocs[0].docID).toBe(sampleDocData.docID);
    });
  });

  // Test removing an assigned document
  describe("removeAssignedDocument", () => {
    it("should remove a document from assignedDocs by docID", async () => {
      const userBoardWithDoc = {
        ...sampleUserBoardData,
        assignedDocs: [sampleDocData],
      };
      FirestoreInterface.getDocumentById.mockResolvedValue(userBoardWithDoc);
      FirestoreInterface.updateDocument.mockResolvedValue();

      const userBoard = await UserBoardModel.removeAssignedDocument(
        "testUserBoardId",
        "invoiceID1"
      );

      expect(FirestoreInterface.getDocumentById).toHaveBeenCalledWith(
        "userBoards",
        "testUserBoardId"
      );
      expect(FirestoreInterface.updateDocument).toHaveBeenCalledWith(
        "userBoards",
        "testUserBoardId",
        expect.objectContaining({ assignedDocs: [] })
      );
      expect(userBoard.assignedDocs.length).toBe(0);
    });
  });

  // Test logging activity in user board
  describe("logActivity", () => {
    it("should log an activity in the user board's activity log", async () => {
      FirestoreInterface.getDocumentById.mockResolvedValue(sampleUserBoardData);
      FirestoreInterface.updateDocument.mockResolvedValue();

      const userBoard = await UserBoardModel.logActivity(
        "testUserBoardId",
        sampleActivityData
      );

      expect(FirestoreInterface.getDocumentById).toHaveBeenCalledWith(
        "userBoards",
        "testUserBoardId"
      );
      expect(FirestoreInterface.updateDocument).toHaveBeenCalledWith(
        "userBoards",
        "testUserBoardId",
        expect.objectContaining({ activityLog: expect.any(Array) })
      );
      expect(userBoard.activityLog[0].action).toBe(sampleActivityData.action);
    });
  });

  

  
});
