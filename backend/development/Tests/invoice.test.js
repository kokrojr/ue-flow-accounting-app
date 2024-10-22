// Import invoice class
const Invoice = require("../schemas/invoice");
// console.log("Imported ivoice: ", Invoice);


// Mock Firestore (optional, depending on your Firestore setup)
jest.mock("firebase-admin", () => ({
  firestore: jest.fn().mockReturnValue({
    collection: jest.fn().mockReturnThis(),
    add: jest.fn().mockResolvedValue({ id: "mockInvoiceId" }),
    doc: jest.fn().mockReturnThis(),
    get: jest.fn().mockResolvedValue({
      exists: true,
      data: jest.fn().mockReturnValue({
        docID: "mockInvoiceId",
        items: [],
        customer: {},
        status: "Draft",
      }),
    }),
  }),
}));

describe("Invoice Class", () => {
  let invoice;

  beforeEach(() => {
    const invoiceData = {
      docID: "INV-001",
      docReference: "INV-001",
      docType: "invoice",
      items: [{ item: "Item 1", quantity: 2, price: 10 }],
      customer: { name: "John Doe" },
      status: "Draft",
    };
    invoice = new Invoice(invoiceData); // Create a new invoice instance
  });

  // Test invoice creation
//   test("should create an invoice with valid data", () => {
//     expect(invoice.docID).toBe("INV-001");
//     expect(invoice.items.length).toBe(1);
//     expect(invoice.customer.name).toBe("John Doe");
//     expect(invoice.status).toBe("Draft");
//   });

//   // Test subtotal calculation
//   test("should calculate subtotal correctly", () => {
//     invoice.calculateSubtotal(invoice.items);
//     expect(invoice.subtotal).toBe(20); // 2 * 10
//   });

  // Test grand total calculation
//   test("should calculate grand total correctly with taxes", () => {
//     invoice.tax = [{ type: "VAT", amount: 5 }];
//     invoice.calculateGrandTotal();
//     expect(invoice.grandTotal).toBe(25); // Subtotal 20 + Tax 5
//   });

  // Test grand total calculation with taxes
// test("should calculate grand total correctly with taxes", () => {
//     invoice.items = [{ item: "Item 1", quantity: 2, price: 10 }]; // Subtotal should be 20
//     invoice.calculateSubtotal(invoice.items);  // Ensure subtotal is calculated first
//     invoice.tax = [{ type: "VAT", amount: 5 }];  // Add tax of 5
//     invoice.calculateGrandTotal();
//     expect(invoice.grandTotal).toBe(25);  // Subtotal 20 + Tax 5
// });


  // Test submitting for approval
//   test("should submit invoice for approval", () => {
//     invoice.submitForApproval({ userId: "123" });
//     expect(invoice.isSubmitted).toBe(true);
//     expect(invoice.status).toBe("Submitted");
//   });

  // Test saving to Firestore (mocked)
//   test("should save invoice to Firestore and return the invoice with ID", async () => {
//     const savedInvoice = await invoice.saveToFirestore();
//     expect(savedInvoice.docID).toBe("mockInvoiceId");
//   });

  // Test invalid data handling (e.g., items not being an array)
  test("should throw error when items are not an array", () => {
    const invalidData = { ...invoice, items: "invalid" }; // Pass invalid items
    expect(() => new Invoice(invalidData)).toThrow("Items must be an array");
  });

});
