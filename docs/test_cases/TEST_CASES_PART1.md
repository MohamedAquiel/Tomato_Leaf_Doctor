# Test Cases - Tomato Leaf Disease Prediction Web App (Part 1)

**Test Suite:** Comprehensive Test Cases for User Registration, Login, Predictions, and ML Service APIs
**Version:** 1.0
**Last Updated:** 2024
**Total Test Cases:** TC001 - TC020

---

## TC001: User Registration - Valid Data

| Field | Details |
|---|---|
| **Test ID** | TC001 |
| **Test Case** | User Registration - Valid Data |
| **Description** | Verify that a new user can register with valid name, email, and password |
| **Components Involved** | RegisterPage.jsx, POST /api/auth/register, User model, authController.js |
| **Test Steps** | 1. Navigate to /register page 2. Enter name: 'John Doe' 3. Enter email: john@example.com 4. Enter password: 'Password123!' 5. Enter confirm password: 'Password123!' 6. Click Register button 7. Verify user creation in MongoDB |
| **Expected Results** | HTTP 201 Created status code, User document saved in MongoDB, JWT token returned in response, User redirected to login page or home page, Success notification displayed with message "Registration successful" |
| **Validation Rules** | Password must be at least 8 characters, email must be valid format, name must not be empty |
| **Screenshot** | ![TC001](screenshots/TC001_register_valid.png) |

---

## TC002: User Registration - Missing Name Field

| Field | Details |
|---|---|
| **Test ID** | TC002 |
| **Test Case** | User Registration - Missing Name Field |
| **Description** | Verify that registration fails when the name field is empty |
| **Components Involved** | RegisterPage.jsx, Input component (validation), POST /api/auth/register, authController.js |
| **Test Steps** | 1. Navigate to /register page 2. Leave name field empty 3. Enter email: jane@example.com 4. Enter password: 'Password123!' 5. Enter confirm password: 'Password123!' 6. Click Register button |
| **Expected Results** | HTTP 400 Bad Request status code, Error message displayed: "Name is required", Form does not submit, Red error border appears on name Input component |
| **Validation Rules** | Name field is mandatory, client-side validation triggers before API call |
| **Screenshot** | ![TC002](screenshots/TC002_register_missing_name.png) |

---

## TC003: User Registration - Duplicate Email

| Field | Details |
|---|---|
| **Test ID** | TC003 |
| **Test Case** | User Registration - Duplicate Email Address |
| **Description** | Verify that registration fails when attempting to register with an email that already exists in the database |
| **Components Involved** | RegisterPage.jsx, POST /api/auth/register, User model (unique index), authController.js, MongoDB |
| **Test Steps** | 1. Navigate to /register page 2. Enter name: 'Jane Doe' 3. Enter email: john@example.com (existing user email) 4. Enter password: 'Password123!' 5. Enter confirm password: 'Password123!' 6. Click Register button 7. Check MongoDB for duplicate prevention |
| **Expected Results** | HTTP 409 Conflict status code, Error message displayed: "Email already registered", Form remains on register page, User is not created in database, Suggestion to login or use different email shown |
| **Validation Rules** | Email field must have unique index in MongoDB User schema, duplicate check performed at database level |
| **Screenshot** | ![TC003](screenshots/TC003_register_duplicate_email.png) |

---

## TC004: User Registration - Short Password

| Field | Details |
|---|---|
| **Test ID** | TC004 |
| **Test Case** | User Registration - Password Too Short |
| **Description** | Verify that registration fails when password is shorter than minimum required length (8 characters) |
| **Components Involved** | RegisterPage.jsx, Input component (password validation), POST /api/auth/register, authController.js |
| **Test Steps** | 1. Navigate to /register page 2. Enter name: 'Test User' 3. Enter email: testuser@example.com 4. Enter password: 'Pass12' (6 characters) 5. Enter confirm password: 'Pass12' 6. Click Register button |
| **Expected Results** | HTTP 400 Bad Request status code, Error message displayed: "Password must be at least 8 characters", Form does not submit, Red error border on password field, Helper text shows password requirement |
| **Validation Rules** | Password minimum length: 8 characters, validation occurs on both client and server side |
| **Screenshot** | ![TC004](screenshots/TC004_register_short_password.png) |

---

## TC005: User Registration - Invalid Email Format

| Field | Details |
|---|---|
| **Test ID** | TC005 |
| **Test Case** | User Registration - Invalid Email Format |
| **Description** | Verify that registration fails when email address format is invalid |
| **Components Involved** | RegisterPage.jsx, Input component (email validation), POST /api/auth/register, authController.js |
| **Test Steps** | 1. Navigate to /register page 2. Enter name: 'Invalid Email User' 3. Enter email: 'notanemail' (no @ symbol) 4. Enter password: 'Password123!' 5. Enter confirm password: 'Password123!' 6. Click Register button |
| **Expected Results** | HTTP 400 Bad Request status code, Error message displayed: "Please enter a valid email address", Form does not submit, Email Input shows error state with red border, Focus remains on email field |
| **Validation Rules** | Email format validation using regex or email validator library, validation on both client and server |
| **Screenshot** | ![TC005](screenshots/TC005_register_invalid_email.png) |

---

## TC006: User Login - Valid Credentials

| Field | Details |
|---|---|
| **Test ID** | TC006 |
| **Test Case** | User Login - Valid Credentials |
| **Description** | Verify that a registered user can successfully login with correct email and password |
| **Components Involved** | LoginPage.jsx, POST /api/auth/login, authController.js, JWT authentication, localStorage |
| **Test Steps** | 1. Navigate to /login page 2. Enter email: john@example.com 3. Enter password: 'Password123!' 4. Click Login button 5. Verify JWT token stored in localStorage 6. Check network request and response |
| **Expected Results** | HTTP 200 OK status code, JWT token returned in response body and stored in localStorage, User redirected to /predict page, Session maintained across page refreshes, User name displayed in navbar |
| **Validation Rules** | Email and password must match existing user record, JWT token should include userId and email in payload |
| **Screenshot** | ![TC006](screenshots/TC006_login_valid.png) |

---

## TC007: User Login - Wrong Password

| Field | Details |
|---|---|
| **Test ID** | TC007 |
| **Test Case** | User Login - Wrong Password |
| **Description** | Verify that login fails when the password provided is incorrect for the registered email |
| **Components Involved** | LoginPage.jsx, POST /api/auth/login, authController.js, password hashing (bcrypt) |
| **Test Steps** | 1. Navigate to /login page 2. Enter email: john@example.com 3. Enter password: 'WrongPassword123!' 4. Click Login button 5. Check response and UI state |
| **Expected Results** | HTTP 401 Unauthorized status code, Error message displayed: "Invalid email or password", No JWT token returned or stored, User remains on login page, Form fields retain values for correction |
| **Validation Rules** | Password comparison using bcrypt.compare(), no token issued on failed authentication |
| **Screenshot** | ![TC007](screenshots/TC007_login_wrong_password.png) |

---

## TC008: User Login - Inactive Account

| Field | Details |
|---|---|
| **Test ID** | TC008 |
| **Test Case** | User Login - Inactive or Deactivated Account |
| **Description** | Verify that login fails when attempting to login with an account that has been deactivated or marked as inactive |
| **Components Involved** | LoginPage.jsx, POST /api/auth/login, User model (status/active field), authController.js |
| **Test Steps** | 1. Deactivate a user account in MongoDB (set active: false) 2. Navigate to /login page 3. Enter email of deactivated user 4. Enter correct password 5. Click Login button |
| **Expected Results** | HTTP 403 Forbidden status code, Error message displayed: "Account is inactive. Please contact support", No JWT token returned, User remains on login page, Suggestion to contact support shown |
| **Validation Rules** | User active status checked during login, deactivated users cannot obtain tokens |
| **Screenshot** | ![TC008](screenshots/TC008_login_inactive_account.png) |

---

## TC009: User Login - Missing Fields

| Field | Details |
|---|---|
| **Test ID** | TC009 |
| **Test Case** | User Login - Missing Email or Password |
| **Description** | Verify that login fails when email or password fields are left empty |
| **Components Involved** | LoginPage.jsx, Input component (required field validation), POST /api/auth/login |
| **Test Steps** | 1. Navigate to /login page 2. Leave email field empty 3. Enter password: 'Password123!' 4. Click Login button 5. Verify client-side validation |
| **Expected Results** | HTTP 400 Bad Request status code (or validation prevented at client), Error message displayed: "Email and password are required", Form does not submit to API, Red border on empty field(s), Focus on first empty required field |
| **Validation Rules** | Both email and password are required fields, validation on client before API call |
| **Screenshot** | ![TC009](screenshots/TC009_login_missing_fields.png) |

---

## TC010: User Login - Token Return and Persistence

| Field | Details |
|---|---|
| **Test ID** | TC010 |
| **Test Case** | User Login - JWT Token Returned and Stored |
| **Description** | Verify that JWT token is correctly returned on successful login and persisted in client storage for authenticated requests |
| **Components Involved** | LoginPage.jsx, POST /api/auth/login, authController.js, localStorage, ProtectedRoute component |
| **Test Steps** | 1. Perform successful login with john@example.com 2. Capture JWT token from response 3. Check localStorage for 'authToken' key 4. Inspect token payload using jwt.io 5. Navigate to protected route /predict 6. Refresh page and verify token still valid |
| **Expected Results** | JWT token returned in response with structure: header.payload.signature, Token stored in localStorage with key 'authToken', Token includes userId and email in payload, Token sent in Authorization header for subsequent requests, ProtectedRoute allows access with valid token |
| **Validation Rules** | JWT format valid, token payload contains necessary user information, token expiration set (e.g., 7 days), localStorage persists across browser sessions |
| **Screenshot** | ![TC010](screenshots/TC010_login_token_return.png) |

---

## TC011: Prediction Creation - Guest User Prediction

| Field | Details |
|---|---|
| **Test ID** | TC011 |
| **Test Case** | Prediction Creation - Guest User (Without Authentication) |
| **Description** | Verify that a guest user (not logged in) can upload an image and get disease prediction without authentication, prediction is not saved to database |
| **Components Involved** | PredictPage.jsx, Input (file upload), Button (submit), POST /api/predictions (guest endpoint), ML service, FastAPI |
| **Test Steps** | 1. Navigate to /predict page without login 2. Click file upload area 3. Select valid tomato leaf image (JPG, PNG, max 5MB) 4. Wait for image preview 5. Click "Predict" button 6. Observe prediction results |
| **Expected Results** | HTTP 200 OK status code, Image uploaded to FastAPI /predict endpoint, ML model processes image and returns disease prediction (class, confidence score), Results displayed on page (disease name, confidence %, recommended actions), No database record created, User can perform another prediction immediately |
| **Validation Rules** | File upload must be image format (JPG, PNG), file size max 5MB, ML service returns JSON with prediction data, no authentication token required |
| **Screenshot** | ![TC011](screenshots/TC011_prediction_guest.png) |

---

## TC012: Prediction Creation - Authenticated User Prediction

| Field | Details |
|---|---|
| **Test ID** | TC012 |
| **Test Case** | Prediction Creation - Authenticated User Prediction Saved |
| **Description** | Verify that a logged-in user can upload an image for prediction and the result is saved to the database for history tracking |
| **Components Involved** | PredictPage.jsx, POST /api/predictions (auth endpoint), ML service, User model, Prediction model, authController.js, MongoDB |
| **Test Steps** | 1. Login as john@example.com 2. Navigate to /predict page 3. Upload valid tomato leaf image 4. Click "Predict" button 5. Verify prediction saved in MongoDB 6. Navigate to /history page 7. Confirm prediction appears in history |
| **Expected Results** | HTTP 201 Created status code, Image processed by ML service, Prediction result returned, Prediction document created in MongoDB with fields: userId, filename, uploadDate, diseaseClass, confidence, imageUrl, notes (empty initially), User redirected to /history or sees confirmation, Prediction appears in user's prediction history |
| **Validation Rules** | User must be authenticated (valid JWT token), prediction must be associated with userId, image stored in file system or cloud storage, metadata saved to database |
| **Screenshot** | ![TC012](screenshots/TC012_prediction_auth_user.png) |

---

## TC013: Prediction Creation - No File Selected

| Field | Details |
|---|---|
| **Test ID** | TC013 |
| **Test Case** | Prediction Creation - No File Selected |
| **Description** | Verify that prediction fails when user clicks predict button without selecting an image file |
| **Components Involved** | PredictPage.jsx, Button (predict), Input (file upload), client-side validation |
| **Test Steps** | 1. Navigate to /predict page 2. Do not select any file 3. Click "Predict" button |
| **Expected Results** | HTTP 400 Bad Request status code (or client-side prevention), Error message displayed: "Please select an image file", File input receives focus and shows error state, Red border on file upload component, Form does not submit to API, Button remains enabled for retry |
| **Validation Rules** | File selection is mandatory before prediction, validation occurs before API call |
| **Screenshot** | ![TC013](screenshots/TC013_prediction_no_file.png) |

---

## TC014: Prediction Creation - Wrong File Type

| Field | Details |
|---|---|
| **Test ID** | TC014 |
| **Test Case** | Prediction Creation - Invalid File Type |
| **Description** | Verify that prediction fails when user uploads a file that is not a valid image format (PDF, TXT, DOC, etc.) |
| **Components Involved** | PredictPage.jsx, Input (file upload with accept attribute), POST /api/predictions, file validation |
| **Test Steps** | 1. Navigate to /predict page 2. Select a PDF file or text file 3. Attempt upload or click "Predict" button |
| **Expected Results** | HTTP 415 Unsupported Media Type status code (or client-side prevention), Error message displayed: "Please upload an image file (JPG, PNG, GIF, WebP)", File is rejected at upload step, Input shows error state, No API call made or call fails, User can retry with correct file type |
| **Validation Rules** | Accepted file types: JPG, JPEG, PNG, GIF, WebP, file type validation on both client and server using MIME type checking |
| **Screenshot** | ![TC014](screenshots/TC014_prediction_wrong_file_type.png) |

---

## TC015: Prediction Creation - ML Service Offline

| Field | Details |
|---|---|
| **Test ID** | TC015 |
| **Test Case** | Prediction Creation - ML Service Unavailable |
| **Description** | Verify that appropriate error handling occurs when the FastAPI ML service is offline or unreachable during prediction request |
| **Components Involved** | PredictPage.jsx, POST /api/predictions, Node.js Express backend, FastAPI ML service, error handling |
| **Test Steps** | 1. Stop or mock unavailability of FastAPI ML service (stop the service or block network) 2. Login to application (optional) 3. Navigate to /predict page 4. Upload a valid image 5. Click "Predict" button 6. Observe error handling |
| **Expected Results** | HTTP 503 Service Unavailable status code (or 500 Internal Server Error), Error message displayed: "ML service is currently unavailable. Please try again later", User-friendly error shown (not technical error), Loading state on button is cleared, User can retry without refreshing, No partial data saved |
| **Validation Rules** | ML service timeout set (e.g., 30 seconds), fallback/retry mechanism implemented, graceful error handling in UI |
| **Screenshot** | ![TC015](screenshots/TC015_prediction_ml_offline.png) |

---

## TC016: ML Service - GET / Endpoint (Health Check)

| Field | Details |
|---|---|
| **Test ID** | TC016 |
| **Test Case** | ML Service - GET / Root Endpoint |
| **Description** | Verify that the FastAPI ML service root endpoint returns expected metadata about the service |
| **Components Involved** | FastAPI application, GET / endpoint, Tomato Leaf Disease ML service |
| **Test Steps** | 1. Open terminal or API client (Postman, curl) 2. Send GET request to ML service root: http://ml-service:8000/ 3. Capture response body and status code 4. Verify response structure |
| **Expected Results** | HTTP 200 OK status code, Response contains service metadata: name, version, description, example: {"name": "Tomato Leaf Disease Prediction Service", "version": "1.0.0", "description": "CNN-based disease classification"}, Response time < 100ms |
| **Validation Rules** | Endpoint is publicly accessible (no authentication required), response is JSON format, contains at minimum name and version fields |
| **Screenshot** | ![TC016](screenshots/TC016_ml_get_root.png) |

---

## TC017: ML Service - GET /health Endpoint

| Field | Details |
|---|---|
| **Test ID** | TC017 |
| **Test Case** | ML Service - GET /health Health Check Endpoint |
| **Description** | Verify that the FastAPI ML service health check endpoint returns service status and model readiness |
| **Components Involved** | FastAPI application, GET /health endpoint, TensorFlow CNN model, system resources |
| **Test Steps** | 1. Send GET request to ML service: http://ml-service:8000/health 2. Capture response body and headers 3. Verify response structure and status information |
| **Expected Results** | HTTP 200 OK status code, Response includes: status: 'healthy', model_loaded: true, gpu_available: true/false, response_time_ms: <number>, example: {"status": "healthy", "model_loaded": true, "gpu_available": false, "message": "Service is operational"}, Response time < 100ms |
| **Validation Rules** | Endpoint accessible without authentication, indicates if model is ready, useful for uptime monitoring, response in JSON format |
| **Screenshot** | ![TC017](screenshots/TC017_ml_health_check.png) |

---

## TC018: ML Service - POST /predict Valid Image

| Field | Details |
|---|---|
| **Test ID** | TC018 |
| **Test Case** | ML Service - POST /predict with Valid Tomato Leaf Image |
| **Description** | Verify that the FastAPI ML service correctly predicts disease class from a valid tomato leaf image using the CNN model |
| **Components Involved** | FastAPI application, POST /predict endpoint, TensorFlow CNN model, image preprocessing, NumPy, image validation |
| **Test Steps** | 1. Prepare a valid tomato leaf image (JPG or PNG, 224x224 or larger) 2. Send POST request with multipart/form-data containing image file to http://ml-service:8000/predict 3. Send image with proper headers and file encoding 4. Capture response and prediction details |
| **Expected Results** | HTTP 200 OK status code, Response contains JSON: {"prediction": "healthy", "confidence": 0.95, "class_index": 0, "processing_time_ms": 150}, Confidence score between 0-1 (95%), Disease class from trained model classes (e.g., Early Blight, Late Blight, Septoria Leaf Spot, Healthy, Yellow Leaf Curl, etc.), Processing time < 500ms |
| **Validation Rules** | Image must be valid format, model returns valid disease class from training data, confidence score is percentage, consistent predictions for same image, processing includes image normalization and resizing to 224x224 |
| **Screenshot** | ![TC018](screenshots/TC018_ml_predict_valid.png) |

---

## TC019: ML Service - POST /predict Invalid Image

| Field | Details |
|---|---|
| **Test ID** | TC019 |
| **Test Case** | ML Service - POST /predict with Invalid/Corrupted Image |
| **Description** | Verify that the FastAPI ML service properly handles invalid, corrupted, or non-image files sent to the predict endpoint |
| **Components Involved** | FastAPI application, POST /predict endpoint, image validation, error handling |
| **Test Steps** | 1. Prepare a corrupted image file or non-image file (PDF, TXT) 2. Send POST request to http://ml-service:8000/predict with invalid file 3. Or send empty file or binary garbage data 4. Capture error response |
| **Expected Results** | HTTP 400 Bad Request status code, Response contains error: {"error": "Invalid image file", "message": "Could not process image. Ensure it is a valid image format."}, No prediction returned, Error message is descriptive and user-friendly |
| **Validation Rules** | Image validation occurs before model processing, appropriate HTTP status code returned, error handling prevents model from crashing, validation uses image library (PIL/Pillow) |
| **Screenshot** | ![TC019](screenshots/TC019_ml_predict_invalid.png) |

---

## TC020: ML Service - GET /diseases Endpoint

| Field | Details |
|---|---|
| **Test ID** | TC020 |
| **Test Case** | ML Service - GET /diseases List All Disease Classes |
| **Description** | Verify that the FastAPI ML service provides an endpoint listing all disease classes the model can predict |
| **Components Involved** | FastAPI application, GET /diseases endpoint, model class definitions, training data information |
| **Test Steps** | 1. Send GET request to http://ml-service:8000/diseases 2. Capture response containing all disease classes 3. Verify completeness and accuracy of disease list |
| **Expected Results** | HTTP 200 OK status code, Response contains JSON array of diseases: {"diseases": ["Bacterial Spot", "Early Blight", "Late Blight", "Leaf Mold", "Septoria Leaf Spot", "Spider Mites", "Target Spot", "Yellow Leaf Curl", "Healthy"]}, Total of 9 classes (or model-specific count), Each disease has clear, readable name, Classes match model training classes |
| **Validation Rules** | Endpoint accessible without authentication, returns all classes the model was trained on, useful for UI display of possible predictions, response is JSON array format, consistent with model.classes_ or similar |
| **Screenshot** | ![TC020](screenshots/TC020_ml_diseases_list.png) |

---

## Summary

| Test Category | Test IDs | Count | Status |
|---|---|---|---|
| User Registration | TC001-TC005 | 5 | ✓ Included |
| User Login | TC006-TC010 | 5 | ✓ Included |
| Prediction Creation | TC011-TC015 | 5 | ✓ Included |
| ML Service API | TC016-TC020 | 5 | ✓ Included |
| **Total** | **TC001-TC020** | **20** | **✓ Complete** |

---

## Notes for Test Execution

- **Screenshots**: Replace placeholder screenshot paths with actual captured images during test execution
- **API Testing Tools**: Use Postman, Insomnia, or curl for API endpoint testing
- **Browser DevTools**: Use Network tab to verify requests, responses, and token handling
- **Database Verification**: Use MongoDB Compass or CLI to verify data persistence
- **ML Service Testing**: Ensure FastAPI service is running on correct port (default 8000)
- **Environment Variables**: Configure API base URLs, ML service URLs, and database connections appropriately
- **Test Data**: Prepare test images of actual tomato leaves for realistic prediction testing
- **Authentication**: Ensure JWT tokens are correctly formatted and have appropriate expiration times
- **Error Scenarios**: Test both happy path and edge cases for comprehensive coverage

---

**Document Version**: 1.0
**Created**: 2024
**Framework**: React (Frontend), Node.js/Express (Backend), FastAPI (ML Service)
**Testing Approach**: Black-box and white-box testing with API and UI verification
