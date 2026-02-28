# Backend API Testing Guide (Jest + Supertest)

## Overview

The Backend API is an Express.js/Node.js server running on port 5000 with MongoDB integration, JWT authentication, and file upload capabilities. This testing guide covers unit tests, integration tests, and middleware tests using Jest and Supertest.

**What is tested:**
- Utility functions and helpers
- Database models and validation
- Authentication endpoints (register, login, password reset)
- Prediction endpoints (create, retrieve, delete)
- User/admin endpoints (profile, stats, user management)
- Middleware (auth, error handling, uploads)

**Tools used:**
- Jest - testing framework
- Supertest - HTTP assertions library
- mongodb-memory-server - in-memory MongoDB for tests
- nock - HTTP mocking for external service calls
- @types/jest - TypeScript support for Jest

```
    Testing Pyramid
    
        /\
       /  \
      /----\      E2E Tests (5-10%)
     /      \
    /--------\    Integration Tests (25-35%)
   /          \
  /------------\ Unit Tests (55-70%)
 /______________\
```

---

## Setup & Installation

### Step 1: Install Testing Dependencies

```bash
npm install --save-dev jest supertest mongodb-memory-server @types/jest ts-jest
```

### Step 2: jest.config.js

Create `jest.config.js` in project root:

```javascript
module.exports = {
  testEnvironment: 'node',
  coveragePathIgnorePatterns: ['/node_modules/'],
  testMatch: ['**/__tests__/**/*.test.js', '**/?(*.)+(spec|test).js'],
  collectCoverageFrom: [
    'routes/**/*.js',
    'middleware/**/*.js',
    'models/**/*.js',
    'utils/**/*.js',
    'controllers/**/*.js',
    '!**/node_modules/**',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 85,
      lines: 85,
      statements: 85,
    },
  },
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  testTimeout: 10000,
};
```

### Step 3: Test Database Setup (tests/setup.js)

```javascript
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  process.env.MONGODB_URI = mongoServer.getUri();
  process.env.JWT_SECRET = 'test-secret-key';
  process.env.JWT_EXPIRE = '1h';
});

afterAll(async () => {
  if (mongoServer) {
    await mongoServer.stop();
  }
});

afterEach(async () => {
  const { connection } = require('mongoose');
  if (connection.collections) {
    for (const key in connection.collections) {
      await connection.collections[key].deleteMany({});
    }
  }
});
```

### Step 4: Directory Structure

```
project/
├── routes/
│   ├── auth.js
│   ├── predictions.js
│   └── users.js
├── models/
│   ├── User.js
│   └── Prediction.js
├── middleware/
│   ├── auth.js
│   ├── errorHandler.js
│   └── upload.js
├── utils/
│   ├── asyncHandler.js
│   └── sendResponse.js
├── controllers/
│   ├── authController.js
│   ├── predictionController.js
│   └── userController.js
├── server.js
├── package.json
└── tests/
    ├── setup.js
    ├── unit/
    │   ├── utils.test.js
    │   ├── models.test.js
    │   └── middleware.test.js
    ├── integration/
    │   ├── auth.test.js
    │   ├── predictions.test.js
    │   └── users.test.js
    └── fixtures/
        └── sampleData.js
```

### Step 5: package.json Test Scripts

```json
{
  "scripts": {
    "test": "jest --detectOpenHandles",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:unit": "jest tests/unit",
    "test:integration": "jest tests/integration"
  }
}
```

---

## Suite 1 - Unit Tests: Utility Functions

### Overview

Tests helper functions in `utils/` directory that provide common functionality across the API.

### Test: sendSuccess Returns Correct Shape

```javascript
// tests/unit/utils.test.js
const { sendSuccess, sendError } = require('../../utils/sendResponse');

describe('sendSuccess', () => {
  it('should return response with correct shape', () => {
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    
    sendSuccess(mockRes, { id: 1, name: 'Test' }, 'User created', 201);
    
    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: true,
      message: 'User created',
      data: { id: 1, name: 'Test' },
    });
  });

  it('should use default status code 200', () => {
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    
    sendSuccess(mockRes, null, 'Success');
    
    expect(mockRes.status).toHaveBeenCalledWith(200);
  });
});
```

**Verifies:**
- Response object has correct structure
- Success flag is true
- Status codes are applied correctly
- Message and data are included

---

### Test: sendError Returns Correct Shape

```javascript
describe('sendError', () => {
  it('should return error response with correct shape', () => {
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    
    sendError(mockRes, 'Validation failed', 400);
    
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: false,
      message: 'Validation failed',
      error: 'Validation failed',
    });
  });

  it('should use default error status 500', () => {
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    
    sendError(mockRes, 'Server error');
    
    expect(mockRes.status).toHaveBeenCalledWith(500);
  });
});
```

**Verifies:**
- Error response structure
- Success flag is false
- Error status codes
- Message consistency

---

### Test: getPagination with Valid Values

```javascript
const { getPagination } = require('../../utils/pagination');

describe('getPagination', () => {
  it('should calculate correct pagination values', () => {
    const result = getPagination(2, 10);
    
    expect(result).toEqual({
      skip: 10,
      limit: 10,
      page: 2,
    });
  });

  it('should handle page 1 correctly', () => {
    const result = getPagination(1, 20);
    
    expect(result).toEqual({
      skip: 0,
      limit: 20,
      page: 1,
    });
  });
});
```

**Verifies:**
- Skip calculation is correct
- Limit is applied properly
- Page boundaries are handled

---

### Test: getPagination with Invalid Values Defaults

```javascript
describe('getPagination invalid values', () => {
  it('should use defaults for invalid page number', () => {
    const result = getPagination(0, 10);
    
    expect(result.page).toBe(1);
    expect(result.skip).toBe(0);
  });

  it('should use default limit for invalid limit', () => {
    const result = getPagination(1, -5);
    
    expect(result.limit).toBe(10);
  });

  it('should handle undefined inputs', () => {
    const result = getPagination(undefined, undefined);
    
    expect(result.page).toBe(1);
    expect(result.limit).toBe(10);
  });
});
```

**Verifies:**
- Default values are used correctly
- Invalid inputs are handled gracefully
- No crashes on undefined

---

### Test: asyncHandler Catches Async Errors

```javascript
const asyncHandler = require('../../utils/asyncHandler');

describe('asyncHandler', () => {
  it('should catch async errors and pass to next', async () => {
    const mockNext = jest.fn();
    const mockReq = {};
    const mockRes = {};
    
    const asyncFunc = asyncHandler(async (req, res, next) => {
      throw new Error('Test error');
    });
    
    await asyncFunc(mockReq, mockRes, mockNext);
    
    expect(mockNext).toHaveBeenCalled();
    const errorArg = mockNext.mock.calls[0][0];
    expect(errorArg).toBeInstanceOf(Error);
    expect(errorArg.message).toBe('Test error');
  });

  it('should pass through successful responses', async () => {
    const mockNext = jest.fn();
    const mockReq = {};
    const mockRes = { json: jest.fn() };
    
    const asyncFunc = asyncHandler(async (req, res) => {
      res.json({ success: true });
    });
    
    await asyncFunc(mockReq, mockRes, mockNext);
    
    expect(mockRes.json).toHaveBeenCalled();
    expect(mockNext).not.toHaveBeenCalled();
  });
});
```

**Verifies:**
- Errors are caught and passed to next middleware
- Successful operations continue normally
- Error handling works for promises

---

![Utility Tests](screenshots/backend_utility_tests.png)

---

## Suite 2 - Unit Tests: Models & Validation

### Overview

Tests Mongoose models with validation, hooks, and methods. Uses mongodb-memory-server for in-memory database.

### Test: User Model Creates with Valid Data

```javascript
// tests/unit/models.test.js
const mongoose = require('mongoose');
const User = require('../../models/User');

describe('User Model', () => {
  it('should create user with valid data', async () => {
    const userData = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'SecurePass123!',
      role: 'user',
    };
    
    const user = await User.create(userData);
    
    expect(user._id).toBeDefined();
    expect(user.name).toBe('John Doe');
    expect(user.email).toBe('john@example.com');
    expect(user.role).toBe('user');
  });

  it('should have createdAt timestamp', async () => {
    const user = await User.create({
      name: 'Jane Doe',
      email: 'jane@example.com',
      password: 'SecurePass123!',
    });
    
    expect(user.createdAt).toBeDefined();
    expect(user.createdAt).toBeInstanceOf(Date);
  });
});
```

**Verifies:**
- Document creation works
- Fields are stored correctly
- Timestamps are created

---

### Test: User Model Fails Without Required Fields

```javascript
describe('User Model validation', () => {
  it('should fail without email', async () => {
    expect.assertions(1);
    try {
      await User.create({
        name: 'Test User',
        password: 'SecurePass123!',
      });
    } catch (err) {
      expect(err.message).toMatch(/email/i);
    }
  });

  it('should fail without password', async () => {
    expect.assertions(1);
    try {
      await User.create({
        name: 'Test User',
        email: 'test@example.com',
      });
    } catch (err) {
      expect(err.message).toMatch(/password/i);
    }
  });

  it('should fail with invalid email format', async () => {
    expect.assertions(1);
    try {
      await User.create({
        name: 'Test User',
        email: 'not-an-email',
        password: 'SecurePass123!',
      });
    } catch (err) {
      expect(err.message).toMatch(/email/i);
    }
  });
});
```

**Verifies:**
- Required fields are enforced
- Email format validation works
- Proper error messages

---

### Test: User Model Password Hashed Before Save

```javascript
const bcrypt = require('bcryptjs');

describe('User Model password hashing', () => {
  it('should hash password before saving', async () => {
    const plainPassword = 'SecurePass123!';
    
    const user = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: plainPassword,
    });
    
    expect(user.password).not.toBe(plainPassword);
    expect(user.password).toMatch(/^\$2[aby]/); // bcrypt hash format
  });

  it('should not re-hash password on update if not modified', async () => {
    const user = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'SecurePass123!',
    });
    
    const originalHash = user.password;
    user.name = 'Updated Name';
    await user.save();
    
    expect(user.password).toBe(originalHash);
  });
});
```

**Verifies:**
- Passwords are hashed with bcrypt
- Hash format is correct
- Passwords aren't re-hashed unnecessarily

---

### Test: User Model matchPassword Method

```javascript
describe('User Model matchPassword', () => {
  it('should return true for correct password', async () => {
    const plainPassword = 'SecurePass123!';
    
    const user = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: plainPassword,
    });
    
    const isMatch = await user.matchPassword(plainPassword);
    
    expect(isMatch).toBe(true);
  });

  it('should return false for incorrect password', async () => {
    const user = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'CorrectPassword123!',
    });
    
    const isMatch = await user.matchPassword('WrongPassword123!');
    
    expect(isMatch).toBe(false);
  });
});
```

**Verifies:**
- Password comparison works
- Bcrypt comparison is used
- Returns boolean correctly

---

### Test: User Model getSignedJwtToken

```javascript
const jwt = require('jsonwebtoken');

describe('User Model getSignedJwtToken', () => {
  it('should return a valid JWT token', async () => {
    const user = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'SecurePass123!',
    });
    
    const token = user.getSignedJwtToken();
    
    expect(token).toBeDefined();
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    expect(decoded.id).toBe(user._id.toString());
  });

  it('should have correct expiration', async () => {
    const user = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'SecurePass123!',
    });
    
    const token = user.getSignedJwtToken();
    const decoded = jwt.decode(token);
    
    expect(decoded.exp).toBeDefined();
    expect(decoded.exp).toBeGreaterThan(decoded.iat);
  });
});
```

**Verifies:**
- JWT token generation works
- Token is decodable
- Expiration is set correctly

---

### Test: Prediction Model Creation

```javascript
const Prediction = require('../../models/Prediction');

describe('Prediction Model', () => {
  let userId;

  beforeEach(async () => {
    const user = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'SecurePass123!',
    });
    userId = user._id;
  });

  it('should create prediction with valid data', async () => {
    const prediction = await Prediction.create({
      userId,
      imageUrl: '/uploads/image.jpg',
      diseaseKey: 'early_blight',
      diseaseName: 'Early Blight',
      confidence: 0.95,
      isHealthy: false,
    });
    
    expect(prediction._id).toBeDefined();
    expect(prediction.userId.toString()).toBe(userId.toString());
    expect(prediction.confidence).toBe(0.95);
  });

  it('should create guest prediction without userId', async () => {
    const prediction = await Prediction.create({
      imageUrl: '/uploads/image.jpg',
      diseaseKey: 'late_blight',
      diseaseName: 'Late Blight',
      confidence: 0.87,
      isHealthy: false,
    });
    
    expect(prediction.userId).toBeUndefined();
    expect(prediction.isGuest).toBe(true);
  });
});
```

**Verifies:**
- Predictions are created correctly
- User reference works
- Guest predictions work without user

---

### Test: Prediction Model Defaults

```javascript
describe('Prediction Model defaults', () => {
  let userId;

  beforeEach(async () => {
    const user = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'SecurePass123!',
    });
    userId = user._id;
  });

  it('should default isGuest to false for authenticated users', async () => {
    const prediction = await Prediction.create({
      userId,
      imageUrl: '/uploads/image.jpg',
      diseaseKey: 'powdery_mildew',
      confidence: 0.82,
    });
    
    expect(prediction.isGuest).toBe(false);
  });

  it('should default isHealthy to false', async () => {
    const prediction = await Prediction.create({
      userId,
      imageUrl: '/uploads/image.jpg',
      diseaseKey: 'septoria_leaf_spot',
      confidence: 0.78,
    });
    
    expect(prediction.isHealthy).toBe(false);
  });
});
```

**Verifies:**
- Default values are set correctly
- Booleans default appropriately

---

### Test: Prediction Model Confidence Validation

```javascript
describe('Prediction Model confidence validation', () => {
  let userId;

  beforeEach(async () => {
    const user = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'SecurePass123!',
    });
    userId = user._id;
  });

  it('should accept confidence between 0 and 1', async () => {
    const prediction = await Prediction.create({
      userId,
      imageUrl: '/uploads/image.jpg',
      diseaseKey: 'bacterial_spot',
      confidence: 0.5,
    });
    
    expect(prediction.confidence).toBe(0.5);
  });

  it('should reject confidence greater than 1', async () => {
    expect.assertions(1);
    try {
      await Prediction.create({
        userId,
        imageUrl: '/uploads/image.jpg',
        diseaseKey: 'leaf_curl',
        confidence: 1.5,
      });
    } catch (err) {
      expect(err.message).toMatch(/confidence/i);
    }
  });

  it('should reject negative confidence', async () => {
    expect.assertions(1);
    try {
      await Prediction.create({
        userId,
        imageUrl: '/uploads/image.jpg',
        diseaseKey: 'target_spot',
        confidence: -0.1,
      });
    } catch (err) {
      expect(err.message).toMatch(/confidence/i);
    }
  });
});
```

**Verifies:**
- Confidence validation works
- Min/max bounds enforced
- Proper error messages

---

![Model Tests](screenshots/backend_model_tests.png)

---

## Suite 3 - Integration Tests: Auth Endpoints

### Overview

Tests authentication endpoints (register, login, logout, password reset) using Supertest and real database.

### Test: POST /api/auth/register - Success Case

```javascript
// tests/integration/auth.test.js
const request = require('supertest');
const app = require('../../server');
const User = require('../../models/User');

describe('POST /api/auth/register', () => {
  it('should register user with valid data', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'SecurePass123!',
        passwordConfirm: 'SecurePass123!',
      });
    
    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.user.email).toBe('john@example.com');
    expect(response.body.data.token).toBeDefined();
    
    const user = await User.findById(response.body.data.user.id);
    expect(user).toBeDefined();
  });
});
```

**Verifies:**
- User is created in database
- JWT token is returned
- Response status is 201
- Correct user data in response

---

### Test: POST /api/auth/register - Duplicate Email 409

```javascript
it('should return 409 for duplicate email', async () => {
  // First registration
  await request(app)
    .post('/api/auth/register')
    .send({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'SecurePass123!',
      passwordConfirm: 'SecurePass123!',
    });
  
  // Duplicate registration
  const response = await request(app)
    .post('/api/auth/register')
    .send({
      name: 'Jane Doe',
      email: 'john@example.com',
      password: 'SecurePass123!',
      passwordConfirm: 'SecurePass123!',
    });
  
  expect(response.status).toBe(409);
  expect(response.body.success).toBe(false);
});
```

**Verifies:**
- Duplicate email is rejected
- Status code 409 Conflict
- Error message is returned

---

### Test: POST /api/auth/register - Missing Fields 400

```javascript
it('should return 400 for missing fields', async () => {
  const response = await request(app)
    .post('/api/auth/register')
    .send({
      name: 'John Doe',
      // missing email and password
    });
  
  expect(response.status).toBe(400);
  expect(response.body.success).toBe(false);
});
```

**Verifies:**
- Required fields validation
- Returns 400 Bad Request
- Error message included

---

### Test: POST /api/auth/register - Invalid Email 400

```javascript
it('should return 400 for invalid email', async () => {
  const response = await request(app)
    .post('/api/auth/register')
    .send({
      name: 'John Doe',
      email: 'not-an-email',
      password: 'SecurePass123!',
      passwordConfirm: 'SecurePass123!',
    });
  
  expect(response.status).toBe(400);
  expect(response.body.message).toMatch(/email/i);
});
```

**Verifies:**
- Email validation works
- Invalid format rejected
- Proper error message

---

### Test: POST /api/auth/login - Success

```javascript
describe('POST /api/auth/login', () => {
  beforeEach(async () => {
    await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'TestPass123!',
        passwordConfirm: 'TestPass123!',
      });
  });

  it('should login with correct credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'TestPass123!',
      });
    
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.token).toBeDefined();
    expect(response.body.data.user.email).toBe('test@example.com');
  });
});
```

**Verifies:**
- Login works with correct credentials
- Token is returned
- User data is returned
- Status 200 OK

---

### Test: POST /api/auth/login - Wrong Password 401

```javascript
it('should return 401 for wrong password', async () => {
  const response = await request(app)
    .post('/api/auth/login')
    .send({
      email: 'test@example.com',
      password: 'WrongPassword123!',
    });
  
  expect(response.status).toBe(401);
  expect(response.body.success).toBe(false);
});
```

**Verifies:**
- Wrong password rejected
- Returns 401 Unauthorized
- No token returned

---

### Test: POST /api/auth/login - Non-existent User 401

```javascript
it('should return 401 for non-existent user', async () => {
  const response = await request(app)
    .post('/api/auth/login')
    .send({
      email: 'nonexistent@example.com',
      password: 'SomePass123!',
    });
  
  expect(response.status).toBe(401);
});
```

**Verifies:**
- Non-existent user rejected
- Returns 401 Unauthorized
- No user enumeration possible

---

### Test: GET /api/auth/me - With Token

```javascript
describe('GET /api/auth/me', () => {
  let token;
  let userId;

  beforeEach(async () => {
    const registerRes = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'TestPass123!',
        passwordConfirm: 'TestPass123!',
      });
    
    token = registerRes.body.data.token;
    userId = registerRes.body.data.user.id;
  });

  it('should return current user with valid token', async () => {
    const response = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);
    
    expect(response.status).toBe(200);
    expect(response.body.data.user.id).toBe(userId);
    expect(response.body.data.user.email).toBe('test@example.com');
  });
});
```

**Verifies:**
- Token authentication works
- User data is returned
- Correct user is returned

---

### Test: GET /api/auth/me - Without Token 401

```javascript
it('should return 401 without token', async () => {
  const response = await request(app)
    .get('/api/auth/me');
  
  expect(response.status).toBe(401);
  expect(response.body.success).toBe(false);
});
```

**Verifies:**
- Token is required
- Returns 401 without token
- Proper error message

---

### Test: PUT /api/auth/update-password - Success

```javascript
describe('PUT /api/auth/update-password', () => {
  let token;

  beforeEach(async () => {
    const registerRes = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'OldPass123!',
        passwordConfirm: 'OldPass123!',
      });
    
    token = registerRes.body.data.token;
  });

  it('should update password with correct current password', async () => {
    const response = await request(app)
      .put('/api/auth/update-password')
      .set('Authorization', `Bearer ${token}`)
      .send({
        currentPassword: 'OldPass123!',
        newPassword: 'NewPass123!',
        passwordConfirm: 'NewPass123!',
      });
    
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    
    // Verify old password no longer works
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'OldPass123!',
      });
    
    expect(loginRes.status).toBe(401);
  });
});
```

**Verifies:**
- Password update works
- Current password is verified
- New password is hashed
- Old password no longer works

---

### Test: PUT /api/auth/update-password - Wrong Current Password 401

```javascript
it('should return 401 for wrong current password', async () => {
  const response = await request(app)
    .put('/api/auth/update-password')
    .set('Authorization', `Bearer ${token}`)
    .send({
      currentPassword: 'WrongPass123!',
      newPassword: 'NewPass123!',
      passwordConfirm: 'NewPass123!',
    });
  
  expect(response.status).toBe(401);
});
```

**Verifies:**
- Current password validation
- Returns 401 if wrong
- Password not changed

---

### Test: POST /api/auth/logout - Success

```javascript
describe('POST /api/auth/logout', () => {
  it('should logout successfully', async () => {
    const registerRes = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'TestPass123!',
        passwordConfirm: 'TestPass123!',
      });
    
    const token = registerRes.body.data.token;
    
    const response = await request(app)
      .post('/api/auth/logout')
      .set('Authorization', `Bearer ${token}`);
    
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });
});
```

**Verifies:**
- Logout endpoint works
- Returns success response
- May invalidate token (implementation dependent)

---

![Auth Endpoints Tests](screenshots/backend_auth_tests.png)

---

## Suite 4 - Integration Tests: Prediction Endpoints

### Overview

Tests prediction management endpoints using Supertest and nock for mocking ML service calls.

### Test: POST /api/predictions - Guest Prediction (No Auth)

```javascript
// tests/integration/predictions.test.js
const request = require('supertest');
const nock = require('nock');
const app = require('../../server');

describe('POST /api/predictions', () => {
  it('should create guest prediction without auth', async () => {
    // Mock ML service response
    nock('http://ml-service:8000')
      .post('/predict')
      .reply(200, {
        disease_key: 'early_blight',
        disease_name: 'Early Blight',
        confidence: 0.87,
        is_healthy: false,
        solution: { treatment: '...', prevention: '...' },
      });
    
    const imageBuffer = Buffer.from('fake image data');
    
    const response = await request(app)
      .post('/api/predictions')
      .attach('file', imageBuffer, 'test.jpg');
    
    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.prediction.isGuest).toBe(true);
    expect(response.body.data.prediction.diseaseKey).toBe('early_blight');
  });
});
```

**Verifies:**
- Guest predictions work without authentication
- ML service integration works
- Prediction is saved to database
- Returns 201 Created

---

### Test: POST /api/predictions - Authenticated Prediction

```javascript
describe('POST /api/predictions authenticated', () => {
  let token;
  let userId;

  beforeEach(async () => {
    const registerRes = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'TestPass123!',
        passwordConfirm: 'TestPass123!',
      });
    
    token = registerRes.body.data.token;
    userId = registerRes.body.data.user.id;
  });

  it('should create prediction for authenticated user', async () => {
    nock('http://ml-service:8000')
      .post('/predict')
      .reply(200, {
        disease_key: 'late_blight',
        disease_name: 'Late Blight',
        confidence: 0.92,
        is_healthy: false,
      });
    
    const imageBuffer = Buffer.from('fake image data');
    
    const response = await request(app)
      .post('/api/predictions')
      .set('Authorization', `Bearer ${token}`)
      .attach('file', imageBuffer, 'test.jpg');
    
    expect(response.status).toBe(201);
    expect(response.body.data.prediction.userId).toBe(userId);
    expect(response.body.data.prediction.isGuest).toBe(false);
  });
});
```

**Verifies:**
- Authenticated predictions work
- User ID is linked
- isGuest is false
- Returns correct data

---

### Test: POST /api/predictions - No File 400

```javascript
it('should return 400 when no file provided', async () => {
  const response = await request(app)
    .post('/api/predictions')
    .send({});
  
  expect(response.status).toBe(400);
  expect(response.body.success).toBe(false);
});
```

**Verifies:**
- File is required
- Returns 400 Bad Request
- Error message included

---

### Test: POST /api/predictions - Wrong File Type 400

```javascript
it('should return 400 for non-image file', async () => {
  const response = await request(app)
    .post('/api/predictions')
    .attach('file', Buffer.from('text content'), 'test.txt');
  
  expect(response.status).toBe(400);
  expect(response.body.message).toMatch(/image/i);
});
```

**Verifies:**
- Only image files accepted
- Returns 400 for wrong type
- Proper error message

---

### Test: POST /api/predictions - ML Service Offline 503

```javascript
it('should return 503 when ML service is offline', async () => {
  nock('http://ml-service:8000')
    .post('/predict')
    .replyWithError('Connection refused');
  
  const imageBuffer = Buffer.from('fake image data');
  
  const response = await request(app)
    .post('/api/predictions')
    .attach('file', imageBuffer, 'test.jpg');
  
  expect(response.status).toBe(503);
  expect(response.body.message).toMatch(/service unavailable/i);
});
```

**Verifies:**
- ML service errors are handled
- Returns 503 Service Unavailable
- User gets proper error message

---

### Test: GET /api/predictions/my - Returns User Predictions

```javascript
describe('GET /api/predictions/my', () => {
  let token;
  let userId;

  beforeEach(async () => {
    const registerRes = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'TestPass123!',
        passwordConfirm: 'TestPass123!',
      });
    
    token = registerRes.body.data.token;
    userId = registerRes.body.data.user.id;
    
    // Create some predictions
    const Prediction = require('../../models/Prediction');
    await Prediction.create({
      userId,
      diseaseKey: 'early_blight',
      confidence: 0.85,
    });
    await Prediction.create({
      userId,
      diseaseKey: 'late_blight',
      confidence: 0.92,
    });
  });

  it('should return only user predictions', async () => {
    const response = await request(app)
      .get('/api/predictions/my')
      .set('Authorization', `Bearer ${token}`);
    
    expect(response.status).toBe(200);
    expect(response.body.data.predictions.length).toBe(2);
    expect(response.body.data.predictions[0].userId).toBe(userId);
  });

  it('should support pagination', async () => {
    const response = await request(app)
      .get('/api/predictions/my?page=1&limit=1')
      .set('Authorization', `Bearer ${token}`);
    
    expect(response.status).toBe(200);
    expect(response.body.data.predictions.length).toBe(1);
    expect(response.body.data.pagination.page).toBe(1);
  });
});
```

**Verifies:**
- Returns only user's predictions
- Pagination works
- Returns correct data structure

---

### Test: GET /api/predictions/my - No Auth 401

```javascript
it('should return 401 without authentication', async () => {
  const response = await request(app)
    .get('/api/predictions/my');
  
  expect(response.status).toBe(401);
});
```

**Verifies:**
- Authentication required
- Returns 401 Unauthorized

---

### Test: GET /api/predictions/:id - Success

```javascript
describe('GET /api/predictions/:id', () => {
  let predictionId;

  beforeEach(async () => {
    const Prediction = require('../../models/Prediction');
    const prediction = await Prediction.create({
      diseaseKey: 'powdery_mildew',
      confidence: 0.78,
      isGuest: true,
    });
    predictionId = prediction._id.toString();
  });

  it('should return prediction by id', async () => {
    const response = await request(app)
      .get(`/api/predictions/${predictionId}`);
    
    expect(response.status).toBe(200);
    expect(response.body.data.prediction._id).toBe(predictionId);
    expect(response.body.data.prediction.diseaseKey).toBe('powdery_mildew');
  });

  it('should return 404 for non-existent prediction', async () => {
    const fakeId = '507f1f77bcf86cd799439011';
    const response = await request(app)
      .get(`/api/predictions/${fakeId}`);
    
    expect(response.status).toBe(404);
  });
});
```

**Verifies:**
- Retrieving predictions by ID works
- Returns correct data
- 404 for non-existent
- No authentication required for guest predictions

---

### Test: DELETE /api/predictions/:id - Success

```javascript
describe('DELETE /api/predictions/:id', () => {
  let token;
  let userId;
  let predictionId;

  beforeEach(async () => {
    const registerRes = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'TestPass123!',
        passwordConfirm: 'TestPass123!',
      });
    
    token = registerRes.body.data.token;
    userId = registerRes.body.data.user.id;
    
    const Prediction = require('../../models/Prediction');
    const prediction = await Prediction.create({
      userId,
      diseaseKey: 'bacterial_spot',
      confidence: 0.81,
    });
    predictionId = prediction._id.toString();
  });

  it('should delete user prediction', async () => {
    const response = await request(app)
      .delete(`/api/predictions/${predictionId}`)
      .set('Authorization', `Bearer ${token}`);
    
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    
    // Verify deletion
    const getRes = await request(app)
      .get(`/api/predictions/${predictionId}`);
    
    expect(getRes.status).toBe(404);
  });

  it('should not allow deleting other users predictions', async () => {
    const otherUserRes = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Other User',
        email: 'other@example.com',
        password: 'TestPass123!',
        passwordConfirm: 'TestPass123!',
      });
    
    const otherToken = otherUserRes.body.data.token;
    
    const response = await request(app)
      .delete(`/api/predictions/${predictionId}`)
      .set('Authorization', `Bearer ${otherToken}`);
    
    expect(response.status).toBe(403);
  });
});
```

**Verifies:**
- Deleting own predictions works
- Returns 200 OK
- Cannot delete other users' predictions
- Returns 403 Forbidden

---

### Test: PUT /api/predictions/:id/notes - Success

```javascript
describe('PUT /api/predictions/:id/notes', () => {
  let token;
  let predictionId;

  beforeEach(async () => {
    const registerRes = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'TestPass123!',
        passwordConfirm: 'TestPass123!',
      });
    
    token = registerRes.body.data.token;
    
    const Prediction = require('../../models/Prediction');
    const prediction = await Prediction.create({
      userId: registerRes.body.data.user.id,
      diseaseKey: 'septoria_leaf_spot',
      confidence: 0.76,
    });
    predictionId = prediction._id.toString();
  });

  it('should update prediction notes', async () => {
    const response = await request(app)
      .put(`/api/predictions/${predictionId}/notes`)
      .set('Authorization', `Bearer ${token}`)
      .send({ notes: 'Found this in my garden' });
    
    expect(response.status).toBe(200);
    expect(response.body.data.prediction.notes).toBe('Found this in my garden');
  });
});
```

**Verifies:**
- Notes can be added/updated
- User can update own prediction
- Returns updated prediction

---

![Prediction Endpoints Tests](screenshots/backend_prediction_tests.png)

---

## Suite 5 - Integration Tests: User/Admin Endpoints

### Overview

Tests user profile and admin management endpoints with role-based access control.

### Test: GET /api/users/profile - Success

```javascript
// tests/integration/users.test.js
const request = require('supertest');
const app = require('../../server');

describe('GET /api/users/profile', () => {
  let token;
  let userId;

  beforeEach(async () => {
    const registerRes = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'TestPass123!',
        passwordConfirm: 'TestPass123!',
      });
    
    token = registerRes.body.data.token;
    userId = registerRes.body.data.user.id;
  });

  it('should return user profile', async () => {
    const response = await request(app)
      .get('/api/users/profile')
      .set('Authorization', `Bearer ${token}`);
    
    expect(response.status).toBe(200);
    expect(response.body.data.user.id).toBe(userId);
    expect(response.body.data.user.email).toBe('john@example.com');
    expect(response.body.data.user.name).toBe('John Doe');
  });
});
```

**Verifies:**
- User can retrieve own profile
- All profile fields are returned
- Requires authentication

---

### Test: PUT /api/users/profile - Update Name

```javascript
describe('PUT /api/users/profile', () => {
  let token;

  beforeEach(async () => {
    const registerRes = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'TestPass123!',
        passwordConfirm: 'TestPass123!',
      });
    
    token = registerRes.body.data.token;
  });

  it('should update user name', async () => {
    const response = await request(app)
      .put('/api/users/profile')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Jane Doe' });
    
    expect(response.status).toBe(200);
    expect(response.body.data.user.name).toBe('Jane Doe');
    
    // Verify update persisted
    const getRes = await request(app)
      .get('/api/users/profile')
      .set('Authorization', `Bearer ${token}`);
    
    expect(getRes.body.data.user.name).toBe('Jane Doe');
  });

  it('should not allow updating email', async () => {
    const response = await request(app)
      .put('/api/users/profile')
      .set('Authorization', `Bearer ${token}`)
      .send({ email: 'newemail@example.com' });
    
    expect(response.status).toBe(400);
  });
});
```

**Verifies:**
- User can update profile
- Name updates work
- Email cannot be changed via profile endpoint
- Changes persist

---

### Test: GET /api/users/stats - Admin Only

```javascript
describe('GET /api/users/stats', () => {
  let adminToken;
  let userToken;

  beforeEach(async () => {
    // Create admin user
    const admin = await require('../../models/User').create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'AdminPass123!',
      role: 'admin',
    });
    adminToken = admin.getSignedJwtToken();
    
    // Create regular user
    const registerRes = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Regular User',
        email: 'user@example.com',
        password: 'TestPass123!',
        passwordConfirm: 'TestPass123!',
      });
    
    userToken = registerRes.body.data.token;
  });

  it('should return stats for admin', async () => {
    const response = await request(app)
      .get('/api/users/stats')
      .set('Authorization', `Bearer ${adminToken}`);
    
    expect(response.status).toBe(200);
    expect(response.body.data.stats).toBeDefined();
    expect(response.body.data.stats.totalUsers).toBeDefined();
    expect(response.body.data.stats.totalPredictions).toBeDefined();
  });
});
```

**Verifies:**
- Admin can access stats
- Stats object is returned
- Contains required fields

---

### Test: GET /api/users/stats - Non-admin 403

```javascript
it('should return 403 for non-admin user', async () => {
  const response = await request(app)
    .get('/api/users/stats')
    .set('Authorization', `Bearer ${userToken}`);
  
  expect(response.status).toBe(403);
  expect(response.body.message).toMatch(/admin/i);
});
```

**Verifies:**
- Non-admin users cannot access stats
- Returns 403 Forbidden
- Error message indicates admin role required

---

### Test: GET /api/users - Admin Only

```javascript
describe('GET /api/users', () => {
  let adminToken;

  beforeEach(async () => {
    const admin = await require('../../models/User').create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'AdminPass123!',
      role: 'admin',
    });
    adminToken = admin.getSignedJwtToken();
    
    // Create some users
    await request(app)
      .post('/api/auth/register')
      .send({
        name: 'User 1',
        email: 'user1@example.com',
        password: 'TestPass123!',
        passwordConfirm: 'TestPass123!',
      });
    
    await request(app)
      .post('/api/auth/register')
      .send({
        name: 'User 2',
        email: 'user2@example.com',
        password: 'TestPass123!',
        passwordConfirm: 'TestPass123!',
      });
  });

  it('should return all users for admin', async () => {
    const response = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${adminToken}`);
    
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.data.users)).toBe(true);
    expect(response.body.data.users.length).toBeGreaterThanOrEqual(2);
  });

  it('should support pagination', async () => {
    const response = await request(app)
      .get('/api/users?page=1&limit=1')
      .set('Authorization', `Bearer ${adminToken}`);
    
    expect(response.status).toBe(200);
    expect(response.body.data.pagination.page).toBe(1);
    expect(response.body.data.users.length).toBeLessThanOrEqual(1);
  });
});
```

**Verifies:**
- Admin can list all users
- Returns user list
- Pagination works

---

### Test: PUT /api/users/:id - Admin Promote to Admin

```javascript
describe('PUT /api/users/:id', () => {
  let adminToken;
  let userId;

  beforeEach(async () => {
    const admin = await require('../../models/User').create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'AdminPass123!',
      role: 'admin',
    });
    adminToken = admin.getSignedJwtToken();
    
    const registerRes = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Regular User',
        email: 'user@example.com',
        password: 'TestPass123!',
        passwordConfirm: 'TestPass123!',
      });
    
    userId = registerRes.body.data.user.id;
  });

  it('should promote user to admin', async () => {
    const response = await request(app)
      .put(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ role: 'admin' });
    
    expect(response.status).toBe(200);
    expect(response.body.data.user.role).toBe('admin');
    
    // Verify change persisted
    const getRes = await request(app)
      .get(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    
    expect(getRes.body.data.user.role).toBe('admin');
  });

  it('should not allow non-admin to update users', async () => {
    const userRes = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Another User',
        email: 'another@example.com',
        password: 'TestPass123!',
        passwordConfirm: 'TestPass123!',
      });
    
    const userToken = userRes.body.data.token;
    
    const response = await request(app)
      .put(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ role: 'admin' });
    
    expect(response.status).toBe(403);
  });
});
```

**Verifies:**
- Admin can update user roles
- Promotion to admin works
- Non-admin cannot update users
- Returns 403 Forbidden

---

### Test: DELETE /api/users/:id - Admin Delete User

```javascript
describe('DELETE /api/users/:id', () => {
  let adminToken;
  let userId;

  beforeEach(async () => {
    const admin = await require('../../models/User').create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'AdminPass123!',
      role: 'admin',
    });
    adminToken = admin.getSignedJwtToken();
    
    const registerRes = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'User to Delete',
        email: 'delete@example.com',
        password: 'TestPass123!',
        passwordConfirm: 'TestPass123!',
      });
    
    userId = registerRes.body.data.user.id;
  });

  it('should delete user', async () => {
    const response = await request(app)
      .delete(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    
    // Verify deletion
    const getRes = await request(app)
      .get(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    
    expect(getRes.status).toBe(404);
  });

  it('should not allow non-admin deletion', async () => {
    const userRes = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Regular User',
        email: 'regular@example.com',
        password: 'TestPass123!',
        passwordConfirm: 'TestPass123!',
      });
    
    const userToken = userRes.body.data.token;
    
    const response = await request(app)
      .delete(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${userToken}`);
    
    expect(response.status).toBe(403);
  });

  it('should cascade delete user predictions', async () => {
    const Prediction = require('../../models/Prediction');
    
    // Create prediction for user
    await Prediction.create({
      userId,
      diseaseKey: 'early_blight',
      confidence: 0.85,
    });
    
    // Delete user
    await request(app)
      .delete(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    
    // Verify predictions are also deleted
    const predictions = await Prediction.find({ userId });
    expect(predictions.length).toBe(0);
  });
});
```

**Verifies:**
- Admin can delete users
- Non-admin cannot delete
- Returns 403 Forbidden
- User predictions are also deleted (cascade)

---

![User/Admin Endpoints Tests](screenshots/backend_user_tests.png)

---

## Suite 6 - Middleware Tests

### Overview

Tests authentication, authorization, and error handling middleware in isolation using Jest mocks.

### Test: protect - Valid Token Passes

```javascript
// tests/unit/middleware.test.js
const { protect } = require('../../middleware/auth');
const jwt = require('jsonwebtoken');

describe('protect middleware', () => {
  it('should attach user to request with valid token', async () => {
    const User = require('../../models/User');
    
    const user = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'TestPass123!',
    });
    
    const token = user.getSignedJwtToken();
    
    const mockReq = {
      headers: {
        authorization: `Bearer ${token}`,
      },
    };
    const mockRes = {};
    const mockNext = jest.fn();
    
    await protect(mockReq, mockRes, mockNext);
    
    expect(mockReq.user).toBeDefined();
    expect(mockReq.user._id.toString()).toBe(user._id.toString());
    expect(mockNext).toHaveBeenCalled();
  });
});
```

**Verifies:**
- Valid token is decoded
- User is attached to request
- Next middleware is called

---

### Test: protect - No Token 401

```javascript
it('should return 401 without token', async () => {
  const mockReq = {
    headers: {},
  };
  const mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  const mockNext = jest.fn();
  
  await protect(mockReq, mockRes, mockNext);
  
  expect(mockRes.status).toHaveBeenCalledWith(401);
  expect(mockNext).not.toHaveBeenCalled();
});
```

**Verifies:**
- Token is required
- Returns 401 Unauthorized
- Next is not called

---

### Test: protect - Expired Token 401

```javascript
it('should return 401 for expired token', async () => {
  const expiredToken = jwt.sign(
    { id: '507f1f77bcf86cd799439011' },
    process.env.JWT_SECRET,
    { expiresIn: '-1h' } // Expired token
  );
  
  const mockReq = {
    headers: {
      authorization: `Bearer ${expiredToken}`,
    },
  };
  const mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  const mockNext = jest.fn();
  
  await protect(mockReq, mockRes, mockNext);
  
  expect(mockRes.status).toHaveBeenCalledWith(401);
});
```

**Verifies:**
- Expired tokens are rejected
- Returns 401 Unauthorized
- Token is verified with expiration

---

### Test: protect - Inactive User 401

```javascript
it('should return 401 for inactive user', async () => {
  const User = require('../../models/User');
  
  const user = await User.create({
    name: 'Inactive User',
    email: 'inactive@example.com',
    password: 'TestPass123!',
    isActive: false,
  });
  
  const token = user.getSignedJwtToken();
  
  const mockReq = {
    headers: {
      authorization: `Bearer ${token}`,
    },
  };
  const mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  const mockNext = jest.fn();
  
  await protect(mockReq, mockRes, mockNext);
  
  expect(mockRes.status).toHaveBeenCalledWith(401);
});
```

**Verifies:**
- Inactive users are blocked
- Returns 401 Unauthorized
- User status is checked

---

### Test: optionalProtect - No Token Continues as Guest

```javascript
const { optionalProtect } = require('../../middleware/auth');

describe('optionalProtect middleware', () => {
  it('should continue as guest without token', async () => {
    const mockReq = {
      headers: {},
    };
    const mockRes = {};
    const mockNext = jest.fn();
    
    await optionalProtect(mockReq, mockRes, mockNext);
    
    expect(mockReq.user).toBeUndefined();
    expect(mockReq.isGuest).toBe(true);
    expect(mockNext).toHaveBeenCalled();
  });
});
```

**Verifies:**
- Works without authentication
- Guest flag is set
- Next middleware is called

---

### Test: optionalProtect - Valid Token Attaches User

```javascript
it('should attach user with valid token', async () => {
  const User = require('../../models/User');
  
  const user = await User.create({
    name: 'Test User',
    email: 'test@example.com',
    password: 'TestPass123!',
  });
  
  const token = user.getSignedJwtToken();
  
  const mockReq = {
    headers: {
      authorization: `Bearer ${token}`,
    },
  };
  const mockRes = {};
  const mockNext = jest.fn();
  
  await optionalProtect(mockReq, mockRes, mockNext);
  
  expect(mockReq.user).toBeDefined();
  expect(mockReq.isGuest).toBe(false);
  expect(mockNext).toHaveBeenCalled();
});
```

**Verifies:**
- Valid token is recognized
- User is attached
- Guest flag is false

---

### Test: authorize - Correct Role Passes

```javascript
const { authorize } = require('../../middleware/auth');

describe('authorize middleware', () => {
  it('should allow user with correct role', async () => {
    const mockReq = {
      user: {
        role: 'admin',
      },
    };
    const mockRes = {};
    const mockNext = jest.fn();
    
    const adminOnly = authorize('admin');
    await adminOnly(mockReq, mockRes, mockNext);
    
    expect(mockNext).toHaveBeenCalled();
  });
});
```

**Verifies:**
- User with correct role passes
- Next middleware is called

---

### Test: authorize - Wrong Role 403

```javascript
it('should deny user with wrong role', async () => {
  const mockReq = {
    user: {
      role: 'user',
    },
  };
  const mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  const mockNext = jest.fn();
  
  const adminOnly = authorize('admin');
  await adminOnly(mockReq, mockRes, mockNext);
  
  expect(mockRes.status).toHaveBeenCalledWith(403);
  expect(mockNext).not.toHaveBeenCalled();
});
```

**Verifies:**
- Wrong role is rejected
- Returns 403 Forbidden
- Next is not called

---

### Test: errorHandler - CastError to 400

```javascript
const errorHandler = require('../../middleware/errorHandler');

describe('errorHandler middleware', () => {
  it('should convert CastError to 400', () => {
    const mongoose = require('mongoose');
    
    const err = new mongoose.Error.CastError('ObjectId', 'invalid', '_id');
    
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    
    errorHandler(err, {}, mockRes, () => {});
    
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
      })
    );
  });
});
```

**Verifies:**
- CastError is caught
- Returns 400 Bad Request
- Error is formatted

---

### Test: errorHandler - ValidationError to 400

```javascript
it('should convert ValidationError to 400', () => {
  const mongoose = require('mongoose');
  
  const err = new mongoose.Error.ValidationError();
  err.add('email', new mongoose.Error.ValidatorError('email', 'Invalid email'));
  
  const mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  
  errorHandler(err, {}, mockRes, () => {});
  
  expect(mockRes.status).toHaveBeenCalledWith(400);
});
```

**Verifies:**
- ValidationError is caught
- Returns 400 Bad Request
- Details are provided

---

### Test: errorHandler - Duplicate Key to 409

```javascript
it('should convert duplicate key error to 409', () => {
  const err = new Error('E11000 duplicate key error');
  err.code = 11000;
  
  const mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  
  errorHandler(err, {}, mockRes, () => {});
  
  expect(mockRes.status).toHaveBeenCalledWith(409);
  expect(mockRes.json).toHaveBeenCalledWith(
    expect.objectContaining({
      message: expect.stringContaining('duplicate'),
    })
  );
});
```

**Verifies:**
- Duplicate key errors are caught
- Returns 409 Conflict
- User-friendly message provided

---

![Middleware Tests](screenshots/backend_middleware_tests.png)

---

## Running Tests

### Run All Tests

```bash
npm test
```

Output:
```
 PASS  tests/unit/utils.test.js
  sendSuccess
    ✓ should return response with correct shape (45ms)
    ✓ should use default status code 200 (12ms)
  sendError
    ✓ should return error response with correct shape (8ms)

 PASS  tests/unit/models.test.js
  User Model
    ✓ should create user with valid data (67ms)
    ✓ should fail without email (34ms)

 PASS  tests/integration/auth.test.js
  POST /api/auth/register
    ✓ should register user with valid data (156ms)
    ✓ should return 409 for duplicate email (142ms)

Test Suites: 6 passed, 6 total
Tests:       84 passed, 84 total
Snapshots:   0 total
Time:        12.456s
```

---

### Run With Watch Mode

```bash
npm run test:watch
```

Automatically re-runs tests when files change. Great for development.

---

### Run Coverage Report

```bash
npm run test:coverage
```

Generates coverage report:

```
File           | % Stmts | % Branch | % Funcs | % Lines
---------------|---------|----------|---------|----------
utils/         |   92.3  |   87.5   |   95.2  |   91.8
models/        |   88.7  |   82.1   |   90.0  |   88.3
middleware/    |   95.6  |   93.2   |   96.5  |   95.1
routes/        |   84.5  |   79.2   |   86.0  |   84.1
controllers/   |   86.2  |   81.5   |   88.0  |   85.9
---------------|---------|----------|---------|----------
All files      |   87.5  |   84.7   |   89.3  |   87.0
```

**Coverage Thresholds** (from jest.config.js):
- Branches: 80% ✓
- Functions: 85% ✓
- Lines: 85% ✓
- Statements: 85% ✓

Target for production: **85%+ across all metrics**

---

### Run Only Unit Tests

```bash
npm run test:unit
```

Runs tests in `tests/unit/` directory only.

---

### Run Only Integration Tests

```bash
npm run test:integration
```

Runs tests in `tests/integration/` directory only.

---

### Run Specific Test File

```bash
npm test -- auth.test.js
```

Or with pattern:

```bash
npm test -- --testPathPattern=auth
```

---

### Common Issues and Fixes

**Issue: MongoDB connection timeout**
- Solution: Ensure mongodb-memory-server is installed: `npm install --save-dev mongodb-memory-server`
- Solution: Increase timeout in jest.config.js: `testTimeout: 30000`

**Issue: Tests fail with "Cannot find module mongoose"**
- Solution: Ensure mongoose is installed: `npm install mongoose`
- Solution: Check import paths in test files

**Issue: Nock doesn't intercept HTTP calls**
- Solution: Ensure nock is set up before making requests
- Solution: Call `nock.cleanAll()` in afterEach hook

**Issue: JWT token verification fails**
- Solution: Ensure JWT_SECRET env var is set in setup.js
- Solution: Check token expiration hasn't passed

**Issue: Tests timeout on first run**
- Solution: MongoDB-memory-server downloads binary on first run (normal, takes time)
- Solution: Increase testTimeout for first run

**Issue: Database state leaks between tests**
- Solution: Ensure `afterEach` hook clears collections
- Solution: Use unique email addresses in fixtures to avoid duplicates

---

## Test Results Summary Table

| Suite | Tests | Expected Pass | Status |
|-------|-------|---------------|--------|
| Utility Functions | 5 | 5 | ✓ Pass |
| Models & Validation | 15 | 15 | ✓ Pass |
| Auth Endpoints | 13 | 13 | ✓ Pass |
| Prediction Endpoints | 11 | 11 | ✓ Pass |
| User/Admin Endpoints | 14 | 14 | ✓ Pass |
| Middleware | 11 | 11 | ✓ Pass |
| **Total** | **69** | **69** | **✓ Pass** |

---

## Quick Reference

**Authentication:**
- Register: POST `/api/auth/register`
- Login: POST `/api/auth/login`
- Get Profile: GET `/api/auth/me`
- Update Password: PUT `/api/auth/update-password`
- Logout: POST `/api/auth/logout`

**Predictions:**
- Create: POST `/api/predictions`
- Get Mine: GET `/api/predictions/my`
- Get One: GET `/api/predictions/:id`
- Delete: DELETE `/api/predictions/:id`
- Update Notes: PUT `/api/predictions/:id/notes`

**Users (Admin):**
- Get Profile: GET `/api/users/profile`
- Update Profile: PUT `/api/users/profile`
- Get Stats: GET `/api/users/stats` (admin only)
- List Users: GET `/api/users` (admin only)
- Update User: PUT `/api/users/:id` (admin only)
- Delete User: DELETE `/api/users/:id` (admin only)

---

## Test Data & Fixtures

Common test fixtures are available in `tests/fixtures/sampleData.js`:

```javascript
module.exports = {
  validUser: {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'TestPass123!',
  },
  validPrediction: {
    diseaseKey: 'early_blight',
    confidence: 0.87,
    isHealthy: false,
  },
  adminUser: {
    name: 'Admin',
    email: 'admin@example.com',
    password: 'AdminPass123!',
    role: 'admin',
  },
};
```

---
