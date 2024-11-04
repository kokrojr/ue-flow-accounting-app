# UserBoard Module Documentation

The `userBoard` module manages user board functionality, allowing users to view assigned documents, log activities, and update board preferences.

---

## 1. Schema (`userBoardSchema.js`)
The `UserBoard` schema outlines the structure of each user board entry, including fields like `userID`, `assignedDocs`, and `activityLog`.

### Schema Fields

- **userBoardID** (string): Unique ID for the user board.
- **userID** (string): Unique user identifier associated with this board.
- **assignedDocs** (array): Array of documents assigned to the user, with fields:
  - **docID** (string): Unique document identifier.
  - **docType** (string): Type of document (e.g., `invoice`, `voucher`).
  - **purpose** (string): Purpose of document assignment (e.g., `for review`, `for approval`).
  - **assignedDate** (timestamp): Date the document was assigned.
  - **assignedBy** (string): ID of the user who assigned the document.
  - **dueDate** (timestamp): Optional due date for document completion.
  - **status** (string): Document status (e.g., `pending`, `completed`).
  - **priority** (string): Document priority level (default is `normal`).
- **activityLog** (array): Log of user actions, each containing:
  - **action** (string): Type of action (e.g., `assigned`, `removed`, `reviewed`).
  - **docID** (string): ID of the affected document.
  - **timestamp** (timestamp): Date and time of the action.
  - **performedBy** (string): ID of the user who performed the action.
- **notifications** (boolean): Indicates if notifications are enabled.
- **metadata** (object): User preferences:
  - **notificationPreference** (string): Preferred notification type (`email`, `SMS`).
  - **boardView** (string): Preferred board view (e.g., `detailed`, `summary`).
- **lastUpdated** (timestamp): Timestamp of the last update to the board data.

### Methods in Schema
1. **addAssignedDoc(docData)**: Adds a document to `assignedDocs` and logs the assignment.
2. **removeAssignedDoc(docID)**: Removes a document from `assignedDocs` by `docID` and logs the removal.
3. **addActivity(actionData)**: Logs an activity in `activityLog`.
4. **toFirestoreData()**: Prepares user board data for storage in Firestore.
5. **fromFirestoreData(data)**: Converts Firestore data into a `UserBoard` instance.

---

## 2. Model (`userBoardModel.js`)
The `UserBoardModel` provides methods for CRUD operations and data management in Firestore.

### Methods in Model
1. **createUserBoard(userBoardData)**: Creates a new user board entry in Firestore.
2. **getAllUserBoards()**: Retrieves all user boards.
3. **getUserBoardById(userBoardId)**: Retrieves a user board by its `userBoardID`.
4. **getUserBoardByUserId(userID)**: Finds a user board by `userID`.
5. **getUserBoardIdByUserId(userID)**: Retrieves the `userBoardID` for a given `userID`.
6. **getUserBoardPreferences(userID)**: Retrieves the preferences (metadata) for a user board.
7. **updateUserBoard(userBoardId, updateData)**: Updates a user board entry.
8. **deleteUserBoard(userBoardId)**: Deletes a user board by its `userBoardId`.
9. **assignDocument(userBoardId, docData)**: Assigns a document to the user board and logs the assignment.
10. **removeAssignedDocument(userBoardId, docID)**: Removes a document from `assignedDocs` and logs the removal.
11. **logActivity(userBoardId, actionData)**: Logs an activity in the `activityLog`.

---

## 3. Controller (`userBoardController.js`)
The `UserBoardController` handles API requests and maps them to model functions.

### Controller Methods
1. **createUserBoard(req, res)**: Creates a user board entry.
2. **getAllUserBoards(req, res)**: Returns all user board entries.
3. **getUserBoardById(req, res)**: Retrieves a user board by `userBoardId`.
4. **getUserBoardByUserId(req, res)**: Finds a user board by `userID`.
5. **getUserBoardIdByUserId(req, res)**: Returns the `userBoardID` for a given `userID`.
6. **getUserBoardPreferences(req, res)**: Retrieves preferences (metadata) for a user board.
7. **updateUserBoard(req, res)**: Updates a user board entry.
8. **deleteUserBoard(req, res)**: Deletes a user board by `userBoardId`.
9. **assignDocument(req, res)**: Assigns a document to the user board.
10. **removeAssignedDocument(req, res)**: Removes a document from `assignedDocs`.
11. **logActivity(req, res)**: Logs an action in the activity log.

---

## 4. Routes (`userBoardRoutes.js`)
The `userBoardRoutes` file defines the API endpoints for user board management.

### API Endpoints
- `POST /userBoards`: Creates a new user board.
- `GET /userBoards`: Retrieves all user boards.
- `GET /userBoards/:userBoardId`: Retrieves a user board by `userBoardId`.
- `GET /userBoards/user/:userID`: Retrieves a user board by `userID`.
- `GET /userBoards/userId/:userID`: Fetches the `userBoardID` for a given `userID`.
- `GET /userBoards/preferences/:userID`: Retrieves preferences (metadata) for a user board.
- `PUT /userBoards/:userBoardId`: Updates a user board.
- `DELETE /userBoards/:userBoardId`: Deletes a user board.
- `PUT /userBoards/:userBoardId/assign`: Assigns a document to the user board.
- `DELETE /userBoards/:userBoardId/remove/:docID`: Removes a document by `docID`.
- `POST /userBoards/:userBoardId/log`: Logs an action in the activity log.

---

## 5. API Responses (Views)
The API sends JSON responses for both success and error scenarios.

### Success Response Example
```json
{
  "message": "User board entry created successfully",
  "userBoard": { /* user board data */ }
}
```

### Error Response Example
```json

{
  "error": "Error message",
  "info": "Additional context if necessary"
}
```