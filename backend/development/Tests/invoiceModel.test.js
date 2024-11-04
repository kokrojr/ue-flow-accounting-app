// invoiceModel.test.js

const InvoiceModel = require("../models/invoiceModel");
const InvoiceRouterModel = require("../models/invoiceRouterModel");
const UserBoardModel = require("../models/userBoardModel");
const FirestoreInterface = require("../db/firestore");

// Mock FirestoreInterface for database interactions
jest.mock("../db/firestore");
jest.mock("../models/invoiceRouterModel");
jest.mock("../models/userBoardModel");

// describe("InvoiceModel.submitInvoice", () => {
//   const mockInvoiceId = "invoice123";
//   const mockUserId = "userA";

//   beforeEach(() => {
//     jest.clearAllMocks();
//   });

//   it("should submit the invoice for approval and update the workflow", async () => {
//     // Mock data
//     const invoiceData = {
//       workflow: {
//         currentStage: "Draft",
//         actions: [],
//       },
//     };

//     // Mock methods
//     FirestoreInterface.getDocumentById.mockResolvedValue(invoiceData);
//     InvoiceModel.updateInvoice = jest.fn();
//     InvoiceModel.sendInvoiceForApproval = jest.fn();

//     // Execute function
//     await InvoiceModel.submitInvoice(mockInvoiceId, mockUserId);

//     // Assertions
//     expect(FirestoreInterface.getDocumentById).toHaveBeenCalledWith(
//       "invoices",
//       mockInvoiceId
//     );
//     expect(InvoiceModel.updateInvoice).toHaveBeenCalledWith(
//       mockInvoiceId,
//       expect.objectContaining({
//         workflow: expect.objectContaining({
//           currentStage: "Submitted",
//           actions: expect.arrayContaining([
//             expect.objectContaining({
//               stage: "Submitted",
//               action: "Submitted for Approval",
//               by: mockUserId,
//             }),
//           ]),
//         }),
//       })
//     );
//     expect(InvoiceModel.sendInvoiceForApproval).toHaveBeenCalledWith(
//       mockInvoiceId
//     );
//   });

//   it("should throw an error if the invoice is not in Draft stage", async () => {
//     FirestoreInterface.getDocumentById.mockResolvedValue({
//       workflow: { currentStage: "Submitted" },
//     });

//     await expect(
//       InvoiceModel.submitInvoice(mockInvoiceId, mockUserId)
//     ).rejects.toThrow("Invoice must be in Draft to submit for approval.");
//   });
// });

describe("InvoiceModel.sendInvoiceForApproval", () => {
  const mockInvoiceId = "invoice123";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should route the invoice to the approver's user board", async () => {
    // Mock data
    const invoiceData = {
      workflow: { actions: [] },
      creatorUserBoardId: "creatorBoardId",
    };
    const approverData = { userId: "approverUserId", userName: "Approver" };
    const approverBoardId = "approverBoardId";

    // Mock methods
    FirestoreInterface.getDocumentById.mockResolvedValue(invoiceData);
    InvoiceRouterModel.getRoleAssignment.mockResolvedValue(approverData);
    UserBoardModel.getUserBoardIdByUserId.mockResolvedValue(approverBoardId);
    UserBoardModel.assignDocument = jest.fn();
    UserBoardModel.removeAssignedDocument = jest.fn();

    // Execute function
    const result = await InvoiceModel.sendInvoiceForApproval(mockInvoiceId);

    // Assertions
    expect(FirestoreInterface.getDocumentById).toHaveBeenCalledWith(
      "invoices",
      mockInvoiceId
    );
    expect(InvoiceRouterModel.getRoleAssignment).toHaveBeenCalledWith(
      "Approver"
    );
    expect(UserBoardModel.getUserBoardIdByUserId).toHaveBeenCalledWith(
      approverData.userId
    );
    expect(UserBoardModel.assignDocument).toHaveBeenCalledWith(
      approverBoardId,
      expect.objectContaining({
        docID: mockInvoiceId,
        purpose: "for approval",
        assignedBy: "system",
      })
    );
    expect(UserBoardModel.removeAssignedDocument).toHaveBeenCalledWith(
      "creatorBoardId",
      mockInvoiceId
    );
    expect(FirestoreInterface.updateDocument).toHaveBeenCalledWith(
      "invoices",
      mockInvoiceId,
      expect.objectContaining({
        currentAssignee: {
          userId: approverData.userId,
          userName: approverData.userName,
        },
        workflow: expect.objectContaining({
          actions: expect.arrayContaining([
            expect.objectContaining({
              stage: "Approval",
              action: "Routed for Approval",
            }),
          ]),
        }),
      })
    );
    expect(result).toEqual(
      expect.objectContaining({
        currentAssignee: {
          userId: approverData.userId,
          userName: approverData.userName,
        },
      })
    );
  });

  it("should throw an error if approver is not found", async () => {
    FirestoreInterface.getDocumentById.mockResolvedValue({
      workflow: { actions: [] },
    });
    InvoiceRouterModel.getRoleAssignment.mockResolvedValue(null);

    await expect(
      InvoiceModel.sendInvoiceForApproval(mockInvoiceId)
    ).rejects.toThrow("Approver not found");
  });
});
