# Energetic Calculator Backend with Firebase Integration

This Spring Boot application integrates Firebase services for authentication, data storage, and real-time updates.

## Setup Instructions

### 1. Prerequisites
- Java 21 or higher
- Maven 3.6+
- Firebase project with Authentication, Firestore, and Realtime Database enabled

### 2. Firebase Configuration
1. Go to the Firebase Console and select your project (calculadora-electronica).
2. Navigate to Project Settings > Service Accounts.
3. Generate a new private key (JSON file).
4. Replace the placeholder content in `src/main/resources/firebase-service-account-key.json` with the actual key content.

### 3. Update Application Properties
Ensure `application.properties` has the correct Firebase project ID:
```
firebase.project-id=calculadora-electronica
```

### 4. Build and Run
```bash
mvn clean install
mvn spring-boot:run
```
The application will start on port 8081.

## API Endpoints

### Authentication
- **POST /api/auth/register**: Register a new user
  - Body: { "email": "user@example.com", "password": "password", "displayName": "User Name" }
- **POST /api/auth/login**: Login (returns message to send ID token)
  - Body: { "email": "user@example.com", "password": "password" }
- **POST /api/auth/verify**: Verify ID token
  - Body: { "idToken": "firebase_id_token" }
- **POST /api/auth/update**: Update user
  - Body: { "uid": "uid", "displayName": "New Name", "email": "newemail@example.com" }
- **POST /api/auth/delete**: Delete user
  - Body: { "uid": "uid" }

### Data Operations (Firestore)
- **POST /api/data/firestore/{collection}**: Create document
- **GET /api/data/firestore/{collection}/{id}**: Get document
- **GET /api/data/firestore/{collection}**: Get all documents
- **PUT /api/data/firestore/{collection}/{id}**: Update document
- **DELETE /api/data/firestore/{collection}/{id}**: Delete document

### Data Operations (Realtime Database)
- **POST /api/data/realtime/{path}**: Create or update data
- **GET /api/data/realtime/{path}**: Get data
- **DELETE /api/data/realtime/{path}**: Delete data

## Security and Best Practices
- CORS is configured to allow all origins (update for production).
- Global exception handling for Firebase errors.
- Logging is implemented for key operations.
- Use HTTPS in production.
- Validate inputs and implement rate limiting.

## Notes
- Authentication login is handled on the client-side; backend verifies tokens.
- Realtime Database operations use asynchronous callbacks.
- Ensure Firebase security rules are set appropriately in the Firebase Console.