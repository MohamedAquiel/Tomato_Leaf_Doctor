# Tomato Leaf Doctor -- Complete Testing Guide

## Project Overview

The Tomato Leaf Doctor is a comprehensive 3-tier web application for predicting and diagnosing tomato leaf diseases using machine learning. The system combines a responsive React frontend, robust Express.js backend, and a specialized Python ML service.

**Architecture Diagram:**

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (React 18)                      │
│              Vite 5 + React Router v6.22                     │
│        AuthContext | NotificationContext | Protected Routes  │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTPS/REST API
                       │ Bearer Token Auth
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                  Backend (Express.js 4.x)                    │
│              MongoDB | JWT Auth | File Upload               │
│        /api/auth | /api/predictions | /api/users            │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTP Internal Network
                       │ JSON Payloads
                       ▼
┌─────────────────────────────────────────────────────────────┐
│          ML Service (Python + FastAPI / Flask)              │
│              TensorFlow/Keras | Image Processing            │
│        Model Inference | Image Preprocessing | Solutions    │
└─────────────────────────────────────────────────────────────┘
```

**Tech Stack Table:**

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| Frontend | React | 18.x | UI Framework |
| Frontend Build | Vite | 5.x | Fast bundler |
| Routing | React Router | 6.22 | Client routing |
| Testing | Vitest | Latest | Unit/Integration tests |
| Backend | Express.js | 4.x | REST API server |
| Database | MongoDB | 6.x | Data persistence |
| Authentication | JWT | RS256 | Stateless auth |
| ML Service | Python | 3.9+ | ML inference |
| ML Framework | TensorFlow | 2.x | Deep learning |
| Image Processing | OpenCV | 4.x | Image preprocessing |

## Testing Strategy

### Testing Pyramid

```
                    🔻
                   E2E
                   ---
                 /     \
                /       \
               / 5-10%  \
              /-----------\
             /   Integration\
            / 20-30%        \
           /-------------------\
          /   Unit Tests         \
         / 60-70%               \
        /---------------------------\
```

The pyramid shows test distribution for optimal coverage and speed:
- **Unit Tests (60-70%)**: Fast, isolated component and function tests
- **Integration Tests (20-30%)**: Test component interactions, APIs, routing
- **E2E Tests (5-10%)**: Full user workflows in real browser

### Coverage Targets Table

| Service | Unit Tests | Integration | Overall | Target |
|---------|-----------|-------------|---------|--------|
| Frontend | 92% | 88% | 92% | 80% ✅ |
| Backend | 85% | 82% | 85% | 90% ⚠️ |
| ML Service | 80% | 82% | 81% | 85% ⚠️ |

### Tools Summary Table

| Service | Framework | Libraries | Config File |
|---------|-----------|-----------|------------|
| **Frontend** | Vitest | @testing-library/react, MSW, @vitest/coverage-v8 | vite.config.js |
| **Backend** | Jest | supertest, mongodb-memory-server, sinon | jest.config.js |
| **ML Service** | pytest | pytest-cov, unittest.mock, responses | pytest.ini |

## Quick Start -- Run All Tests

### Frontend Tests

```bash
cd frontend
npm install
npm test
```

**Expected Output:**
```
✓ src/components/__tests__/Button.test.jsx (8)
✓ src/components/__tests__/Input.test.jsx (7)
✓ src/pages/public/__tests__/LoginPage.test.jsx (6)
...
Test Files  15 passed (15)
     Tests  92 passed (92)
  Start at  10:15:43
  Duration  2.34s
```

### Backend Tests

```bash
cd backend
npm install
npm test
```

**Expected Output:**
```
PASS  src/__tests__/auth.test.js
  ✓ Login with valid credentials (45ms)
  ✓ Register new user (52ms)
  ✓ JWT token refresh (31ms)
...
Tests:       48 passed, 48 total
Time:        3.21 s
```

### ML Service Tests

```bash
cd ml_service
pip install -r requirements.txt
pytest
```

**Expected Output:**
```
test_preprocessing.py ........ [ 42%]
test_model_loader.py ....... [ 71%]
test_predictor.py ........ [ 100%]
============= 23 passed in 1.24s =============
```

### Run Everything at Once

```bash
# From project root
npm run test:all
```

This runs all three test suites in parallel using a root package.json script.

## Test Suite Overview Table

| Service | Suite | Description | Tests Count | Tools |
|---------|-------|-------------|------------|-------|
| **Frontend** | Components | Button, Input, SolutionPanel, TreatmentModal | 27 | Vitest + RTL |
| **Frontend** | Context | AuthContext, NotificationContext | 15 | Vitest + hooks |
| **Frontend** | Pages | Login, Register, Predict, History | 28 | Vitest + RTL |
| **Frontend** | Routing | ProtectedRoute, 404, redirects | 5 | Vitest + React Router |
| **Frontend** | API Layer | axios, auth, predictions, users | 17 | Vitest + MSW |
| **Backend** | Utilities | asyncHandler, sendResponse, validators | 8 | Jest |
| **Backend** | Models | User schema, Prediction schema | 12 | Jest + MongoDB |
| **Backend** | Auth | Login, register, JWT, middleware | 11 | Jest + supertest |
| **Backend** | Predictions | CRUD, ML integration, compare | 10 | Jest + supertest |
| **Backend** | Users & Admin | Role-based access, stats, analytics | 9 | Jest + supertest |
| **Backend** | Middleware | Auth, error handler, file upload | 6 | Jest |
| **ML Service** | Preprocessing | Image normalization, resizing | 6 | pytest |
| **ML Service** | Model Loader | Load CNN, handle missing files | 5 | pytest |
| **ML Service** | Predictor | Inference, confidence scores | 6 | pytest |
| **ML Service** | API Endpoints | /predict, /health, error handling | 4 | pytest |
| **ML Service** | E2E Pipeline | End-to-end image to disease | 2 | pytest |
| **TOTAL** | **16 Suites** | **Complete coverage** | **136 tests** | **Vitest + Jest + pytest** |

## Pre-Testing Checklist

### Services That Need to Be Running

- [ ] **MongoDB**: Running on `localhost:27017` or cloud atlas connection string configured
- [ ] **ML Service**: Running on `http://localhost:8000` (Python FastAPI/Flask)
- [ ] **Backend API**: Running on `http://localhost:5000`
- [ ] **Frontend Dev Server**: Running on `http://localhost:5173` (optional for E2E)

**Quick start services:**

```bash
# Terminal 1: MongoDB (if local)
mongod

# Terminal 2: ML Service
cd ml_service
python main.py

# Terminal 3: Backend
cd backend
npm start

# Terminal 4: Frontend (if needed)
cd frontend
npm run dev
```

### Environment Variables Needed

**Backend (.env):**
```
MONGODB_URI=mongodb://localhost:27017/tomato_leaf_doctor
JWT_SECRET=your-secret-key-for-testing
ML_SERVICE_URL=http://localhost:8000
NODE_ENV=test
```

**ML Service (.env):**
```
MODEL_PATH=./Model/best_improved_cnn.h5
SOLUTIONS_PATH=./solutions.json
LOG_LEVEL=INFO
```

**Frontend (.env):**
```
VITE_API_BASE_URL=http://localhost:5000/api
VITE_ML_SERVICE_URL=http://localhost:8000
```

### Test Database Setup

**For Backend Tests (Auto-handled by mongodb-memory-server):**

```javascript
// jest.setup.js automatically spins up in-memory MongoDB
beforeAll(async () => {
  const mongoUri = await MongoMemoryServer.create()
  process.env.MONGODB_URI = mongoUri.getUri()
})

afterAll(async () => {
  await server.close()
})
```

**For ML Service Tests:**

Create `ml_service/tests/fixtures/` with sample test images:
```
ml_service/tests/fixtures/
├── healthy_leaf.png
├── early_blight.png
├── late_blight.png
└── septoria_leaf_spot.png
```

### Mock ML Service Setup

For frontend testing, MSW mocks all API calls. No real ML service needed:

```javascript
// src/mocks/handlers.js
http.post('http://localhost:5000/api/predictions', async () => {
  return HttpResponse.json({
    prediction: {
      diseaseName: 'Early Blight',
      confidence: 0.95,
      solution: { treatment: '...', prevention: '...' }
    }
  })
})
```

## Coverage Reports

### Generate for Each Service

**Frontend Coverage:**
```bash
cd frontend
npm run test:coverage
# Opens: frontend/coverage/index.html
```

**Backend Coverage:**
```bash
cd backend
npm run test:coverage
# Opens: backend/coverage/index.html
```

**ML Service Coverage:**
```bash
cd ml_service
pytest --cov=. --cov-report=html
# Opens: ml_service/htmlcov/index.html
```

### What the Reports Contain

Coverage reports show:
- **Line Coverage**: % of code lines executed
- **Branch Coverage**: % of if/else branches taken
- **Function Coverage**: % of functions called
- **Statement Coverage**: % of statements executed

**Example Frontend Coverage Report Breakdown:**
```
File                              | Coverage | Statements | Branches | Functions | Lines
-------------------------------|----------|-----------|----------|-----------|-------
src/components/Button.jsx      |  100%    | 24/24     | 12/12    | 8/8       | 24/24
src/context/AuthContext.jsx    |  92%     | 48/50     | 18/20    | 6/6       | 48/50
src/pages/user/PredictPage.jsx |  88%     | 95/105    | 32/40    | 12/12     | 95/105
---
TOTAL                          |  92%     | 542/589   | 185/201  | 78/84     | 542/589
```

![ML Coverage](screenshots/ml_coverage_report.png)
![Backend Coverage](screenshots/backend_coverage_report.png)
![Frontend Coverage](screenshots/frontend_coverage_report.png)

## Common Issues & Fixes

| Issue | Cause | Solution |
|-------|-------|----------|
| **MongoDB connection refused** | MongoDB not running | Start MongoDB: `mongod` or check Atlas connection string in `.env` |
| **ML model file not found** | Missing `Model/best_improved_cnn.h5` | Download model or use mock in tests. Check `MODEL_PATH` env var. |
| **Port conflicts (5000/8000)** | Services already running on ports | Kill processes: `lsof -ti:5000 \| xargs kill -9` |
| **Token expiry in tests** | JWT token expires during test | Use long-lived test tokens or mock time with `vi.useFakeTimers()` |
| **MSW handlers not intercepting** | Handlers not registered before tests | Ensure `vitest.setup.js` loads mocks. Check `beforeAll(server.listen())` |
| **Multipart form data failing** | File upload boundary issues | MSW 2.0+ handles multipart. Use `new FormData()` in tests. |
| **CORS errors in tests** | CORS headers missing | Backend tests don't need CORS. Frontend mocks with MSW. |
| **Memory leaks in tests** | Timers/subscriptions not cleaned | Use `afterEach()` hooks. Clear timers with `vi.clearAllTimers()` |

## CI/CD Integration

### GitHub Actions Workflow

Create `.github/workflows/tests.yml`:

```yaml
name: Test All Services

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: cd frontend && npm install
      - run: cd frontend && npm run test:coverage
      - uses: codecov/codecov-action@v3
        with:
          files: ./frontend/coverage/coverage-final.json
          flags: frontend

  backend:
    runs-on: ubuntu-latest
    services:
      mongodb:
        image: mongo:6
        options: >-
          --health-cmd mongosh
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 27017:27017
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: cd backend && npm install
      - run: cd backend && npm run test:coverage
      - uses: codecov/codecov-action@v3
        with:
          files: ./backend/coverage/coverage-final.json
          flags: backend

  ml-service:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-python@v4
        with:
          python-version: '3.9'
      - run: cd ml_service && pip install -r requirements.txt
      - run: cd ml_service && pytest --cov --cov-report=xml
      - uses: codecov/codecov-action@v3
        with:
          files: ./ml_service/coverage.xml
          flags: ml-service
```

**Workflow Steps Explanation:**

1. **Trigger**: On push to main/develop and on PRs
2. **Frontend Job**: Install deps, run tests, upload coverage to Codecov
3. **Backend Job**: Start MongoDB container, run tests, upload coverage
4. **ML Service Job**: Setup Python 3.9, install requirements, run pytest
5. **Coverage Upload**: All services send coverage data to Codecov

## Screenshot Index

| Screenshot | File | Description |
|-----------|------|-------------|
| Button Tests | `frontend_button_tests.png` | Button component unit tests passing |
| Input Tests | `frontend_input_tests.png` | Input validation and state tests |
| LoginPage Tests | `frontend_login_page_tests.png` | Login form integration tests |
| PredictPage Tests | `frontend_predict_page_tests.png` | Image upload and ML prediction flow |
| AuthContext Tests | `frontend_auth_context_tests.png` | Authentication hook tests |
| Routing Tests | `frontend_routing_tests.png` | Protected routes and navigation |
| Frontend Coverage | `frontend_coverage_report.png` | 92% coverage across frontend |
| Backend Auth Tests | `backend_auth_tests.png` | JWT and user registration tests |
| Backend Predictions | `backend_predictions_tests.png` | Prediction API endpoint tests |
| Backend Coverage | `backend_coverage_report.png` | 85% coverage across backend |
| ML Preprocessing | `ml_preprocessing_tests.png` | Image normalization unit tests |
| ML Model Loading | `ml_model_loader_tests.png` | Model initialization tests |
| ML Predictor | `ml_predictor_tests.png` | Inference and confidence score tests |
| ML Coverage | `ml_coverage_report.png` | 81% coverage across ML service |

## Test File Structure

Full directory tree of all test files across services:

```
project-root/
├── frontend/
│   ├── src/
│   │   ├── vitest.setup.js
│   │   ├── mocks/
│   │   │   ├── handlers.js
│   │   │   └── server.js
│   │   ├── components/
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── SolutionPanel.jsx
│   │   │   ├── TreatmentModal.jsx
│   │   │   └── __tests__/
│   │   │       ├── Button.test.jsx
│   │   │       ├── Input.test.jsx
│   │   │       ├── SolutionPanel.test.jsx
│   │   │       └── TreatmentModal.test.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   ├── NotificationContext.jsx
│   │   │   └── __tests__/
│   │   │       ├── AuthContext.test.jsx
│   │   │       └── NotificationContext.test.jsx
│   │   ├── pages/
│   │   │   ├── public/
│   │   │   │   └── __tests__/
│   │   │   │       ├── LoginPage.test.jsx
│   │   │   │       └── RegisterPage.test.jsx
│   │   │   └── user/
│   │   │       └── __tests__/
│   │   │           ├── PredictPage.test.jsx
│   │   │           └── HistoryPage.test.jsx
│   │   ├── api/
│   │   │   ├── auth.js
│   │   │   ├── predictions.js
│   │   │   ├── users.js
│   │   │   ├── axios.js
│   │   │   └── __tests__/
│   │   │       └── api.test.js
│   │   └── __tests__/
│   │       └── routing.test.jsx
│   ├── coverage/
│   ├── vite.config.js
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── jest.setup.js
│   │   ├── utils/
│   │   │   ├── asyncHandler.js
│   │   │   ├── sendResponse.js
│   │   │   └── __tests__/
│   │   │       └── utils.test.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Prediction.js
│   │   │   └── __tests__/
│   │   │       ├── User.test.js
│   │   │       └── Prediction.test.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   ├── errorHandler.js
│   │   │   ├── upload.js
│   │   │   └── __tests__/
│   │   │       ├── auth.test.js
│   │   │       ├── errorHandler.test.js
│   │   │       └── upload.test.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── predictionController.js
│   │   │   ├── userController.js
│   │   │   └── __tests__/
│   │   │       ├── auth.test.js
│   │   │       ├── predictions.test.js
│   │   │       └── users.test.js
│   │   ├── routes/
│   │   │   └── __tests__/
│   │   │       ├── auth.routes.test.js
│   │   │       ├── predictions.routes.test.js
│   │   │       └── users.routes.test.js
│   │   ├── server.js
│   │   └── app.js
│   ├── coverage/
│   ├── jest.config.js
│   └── package.json
│
├── ml_service/
│   ├── tests/
│   │   ├── conftest.py
│   │   ├── fixtures/
│   │   │   ├── healthy_leaf.png
│   │   │   ├── early_blight.png
│   │   │   └── late_blight.png
│   │   ├── test_preprocessing.py
│   │   ├── test_model_loader.py
│   │   ├── test_predictor.py
│   │   ├── test_api_endpoints.py
│   │   └── test_e2e_pipeline.py
│   ├── model_loader.py
│   ├── predictor.py
│   ├── main.py
│   ├── requirements.txt
│   ├── pytest.ini
│   └── htmlcov/
│
└── docs/
    └── testing/
        ├── TESTING_README.md (this file)
        ├── FRONTEND_TESTING.md (frontend guide)
        ├── BACKEND_TESTING.md (backend guide)
        └── ML_SERVICE_TESTING.md (ML guide)
```

## Best Practices & Tips

### Testing Best Practices

1. **Unit Test First**: Write unit tests for isolated logic before integration tests
2. **Mock External Services**: Use MSW for frontend, mocks for backend, responses for ML
3. **Test Behavior, Not Implementation**: Focus on what component does, not how
4. **Keep Tests Focused**: One test per behavior. Use descriptive names.
5. **Clean Up After Tests**: Use `afterEach()` to reset state and clear timers
6. **Use Test Fixtures**: Create reusable test data factories
7. **Avoid Flaky Tests**: Don't rely on timing. Use `waitFor()` for async operations
8. **Test Error Cases**: Test both success and failure paths

### Coverage Tips

- **Target 80%+**: Aim for high coverage but don't obsess over 100%
- **Focus on Logic**: Prioritize testing complex business logic over UI rendering
- **Exclude Generated Code**: Don't count generated/vendor code in coverage
- **Use Coverage Gates**: Set minimum coverage in CI to prevent regressions

### Performance Tips

- **Run Tests in Parallel**: Jest and pytest run tests in parallel by default
- **Use In-Memory DB**: mongodb-memory-server is much faster than cloud
- **Mock Heavy Dependencies**: Don't load actual ML model in unit tests
- **Cache Dependencies**: Use GitHub Actions cache for npm/pip in CI

---

**Last Updated:** 2024
**Contributors:** Tomato Leaf Doctor Dev Team
**License:** MIT

