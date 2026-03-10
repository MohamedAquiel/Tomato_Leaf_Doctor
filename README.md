# 🍅 TomatoLeaf Doctor

> **An AI-Driven Full-Stack Web Application for Real-Time Tomato Leaf Disease Prediction**

[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=flat&logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat&logo=node.js)](https://nodejs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115.0-009688?style=flat&logo=fastapi)](https://fastapi.tiangolo.com/)
[![TensorFlow](https://img.shields.io/badge/TensorFlow-2.17.0-FF6F00?style=flat&logo=tensorflow)](https://tensorflow.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat&logo=mongodb)](https://mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 📖 Overview

**TomatoLeaf Doctor** is a production-quality, three-tier AI-integrated web application that enables instant tomato leaf disease detection through image classification. Users upload a photograph of a tomato leaf and the system analyses it using a trained deep learning model, returning the predicted disease name, confidence score, and a comprehensive treatment and prevention guide — in under 2 seconds.

The system supports **10 tomato disease classes** from the PlantVillage dataset and is accessible to both registered users (with full history, notifications, and account management) and unauthenticated guest users (zero-barrier access for instant predictions).

---

## 🏆 Best Model — CNN-SVM Hybrid

The machine learning component was developed through a rigorous **three-phase experimental process**:

| Phase | Model | Test Accuracy | Macro F1 |
|---|---|---|---|
| Phase 1 | Baseline CNN (3 blocks) | 88.89% | 87.68% |
| Phase 2 | Improved CNN (4 blocks + BN + L2 + GAP + Augmentation) | 96.21% | 96.01% |
| **Phase 3** | **CNN-SVM Hybrid ✅ BEST MODEL** | **98.95%** | **98.71%** |

### 🥇 The Best Model: CNN + SVM (RBF Kernel)

The **CNN-SVM hybrid** is the best-performing model identified during development. It works in two stages:

1. **CNN Feature Extractor** — The improved 4-block CNN (trained on augmented PlantVillage images with BatchNorm, L2 regularisation, Global Average Pooling, and `mixed_float16` precision) extracts a **256-dimensional feature vector** from each input image, encoding high-level visual patterns learned from the leaf texture, colour, and morphology.

2. **SVM Classifier (RBF Kernel, C=10)** — The Support Vector Machine maps the 256-dimensional feature vectors into a higher-dimensional space using the Radial Basis Function kernel, finding the optimal separating hyperplane between all 10 disease classes — a task that the CNN's linear softmax head cannot perform as effectively for visually similar classes (e.g. Early Blight vs Target Spot).

> **Note:** The production FastAPI inference service uses the CNN-only softmax pathway for portability. The CNN-SVM hybrid is documented as the best experimental model and is available via the serialised `Model/ensemble_models/cnn_svm_model.pkl` file for future production integration.

---

## 🌿 Supported Disease Classes

| # | Disease | Severity |
|---|---|---|
| 1 | Tomato Bacterial Spot | High |
| 2 | Tomato Early Blight | Medium |
| 3 | Tomato Late Blight | Critical |
| 4 | Tomato Leaf Mold | Medium |
| 5 | Tomato Septoria Leaf Spot | Medium |
| 6 | Tomato Spider Mites | Medium |
| 7 | Tomato Target Spot | Medium |
| 8 | Tomato Yellow Leaf Curl Virus | Critical |
| 9 | Tomato Mosaic Virus | High |
| 10 | Tomato Healthy | None |

---

## 🏗️ System Architecture

```
┌─────────────────────────┐      HTTP/REST      ┌──────────────────────────┐      HTTP/REST      ┌──────────────────────────┐
│     REACT FRONTEND      │ ──────────────────▶ │    EXPRESS BACKEND       │ ──────────────────▶ │   FASTAPI ML SERVICE     │
│   React 18 + Vite       │ ◀────────────────── │   Node.js + JWT Auth     │ ◀────────────────── │  TensorFlow CNN Model    │
│   Port: 5173            │                     │   Port: 5000             │                     │  Port: 8000              │
└─────────────────────────┘                     └────────────┬─────────────┘                     └──────────────────────────┘
                                                             │ Mongoose ODM
                                                             ▼
                                                ┌──────────────────────────┐
                                                │      MONGODB ATLAS       │
                                                │   Users + Predictions    │
                                                └──────────────────────────┘
```

---

## ✨ Features

### 👤 Guest Users
- ✅ Upload tomato leaf images and get instant disease predictions (no registration required)
- ✅ View disease name, confidence score, and health status (Healthy / Diseased)
- ✅ Receive structured treatment guide: symptoms, immediate actions, chemical & organic treatment, prevention, recovery time
- ✅ View top-3 alternative predictions with confidence percentages
- ✅ Browse the **Disease Education Library** — 10 disease cards with search and severity filter
- ✅ View disease detail modal with full information
- ✅ Access the About, Contact, and Home pages

### 🔐 Registered Users
- ✅ All guest features +
- ✅ Persistent **Prediction History** with pagination and sorting
- ✅ Add and edit personal **notes** on each prediction
- ✅ **Compare** two predictions side by side
- ✅ **In-app notifications** for each prediction (read/unread, mark all, delete)
- ✅ **Profile management** (update name, email, password)
- ✅ Secure JWT-based session with automatic restore on page reload

### 🛡️ Admin Portal
- ✅ **Dashboard** — KPI stat cards (total users, predictions, guest predictions, active users), Registered vs Guest bar chart, recent predictions table, disease breakdown with confidence bars
- ✅ **User Management** — search, paginate, promote/demote roles, activate/deactivate, delete
- ✅ **Predictions Review** — filter by Healthy/Diseased/Guest, search, paginate, delete
- ✅ **Disease CMS** — view and edit treatment solutions for each disease class
- ✅ **Analytics, Monitoring, Settings** sections

---

## 🛠️ Technology Stack

### Machine Learning Development
| Tool | Version | Purpose |
|---|---|---|
| TensorFlow / Keras | 2.x | CNN architecture, training, feature extraction |
| scikit-learn | Latest | SVM, Random Forest, Stacking Ensemble, metrics |
| XGBoost | Latest | Gradient boosted ensemble classifier |
| NumPy / Pandas | Latest | Data manipulation and analysis |
| Matplotlib / Seaborn | Latest | Training curves, confusion matrix, EDA visualisations |
| Google Colab + T4 GPU | Cloud | GPU-accelerated model training environment |

### ML Inference Service
| Technology | Version |
|---|---|
| Python | 3.11+ |
| FastAPI | 0.115.0 |
| Uvicorn | 0.30.6 |
| TensorFlow | 2.17.0 |
| Pillow | 10.4.0 |
| NumPy | 1.26.4 |
| OpenCV (headless) | 4.10.0.84 |

### Backend
| Technology | Version |
|---|---|
| Node.js | 18+ LTS |
| Express | 4.18.2 |
| Mongoose | 8.2.1 |
| JSON Web Token | 9.0.2 |
| bcryptjs | 2.4.3 |
| Multer | 1.4.5-lts.1 |
| Helmet | 7.1.0 |
| express-rate-limit | 7.2.0 |

### Frontend
| Technology | Version |
|---|---|
| React | 18.2.0 |
| React Router DOM | 6.22.3 |
| Axios | 1.6.7 |
| Vite | 5.1.x |
| Vitest | 4.x |

### Database
| Technology | Version |
|---|---|
| MongoDB Atlas | 7.x |
| Mongoose ODM | 8.2.1 |

---

## 📁 Project Structure

```
Tomato_Leaf_Doctor/
├── 📂 Model/                          # ML model development
│   ├── Leaf_Disease_Predict.ipynb     # Full Colab notebook (EDA, training, ensemble)
│   ├── cnn_features/                  # Extracted CNN feature vectors (.npy)
│   └── ensemble_models/               # Trained ensemble models (.pkl)
│       ├── cnn_svm_model.pkl          # ⭐ Best model — CNN-SVM Hybrid
│       ├── cnn_xgboost_model.pkl
│       ├── cnn_rf_model.pkl
│       └── stacking_model.pkl
│
├── 📂 backend/                        # Node.js Express REST API
│   ├── server.js                      # Express app entry point
│   ├── config/
│   │   ├── db.js                      # MongoDB connection
│   │   └── constants.js               # App constants
│   ├── controllers/
│   │   ├── authController.js          # Register, login, logout, getMe
│   │   ├── predictionController.js    # Predict, history, CRUD
│   │   └── userController.js          # Admin user management
│   ├── middleware/
│   │   ├── auth.js                    # JWT protect + authorize
│   │   ├── errorHandler.js            # Centralised error handling
│   │   └── upload.js                  # Multer file upload config
│   ├── models/
│   │   ├── User.js                    # User Mongoose schema
│   │   └── Prediction.js              # Prediction Mongoose schema
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── predictionRoutes.js
│   │   └── userRoutes.js
│   ├── utils/
│   │   ├── asyncHandler.js            # Async error wrapper
│   │   └── sendResponse.js            # Standardised response envelope
│   ├── tests/                         # Jest test suite
│   ├── seed.js                        # Database seeder
│   └── .env.example                   # Environment variable template
│
├── 📂 ml_service/                     # FastAPI ML inference microservice
│   ├── main.py                        # FastAPI app with lifespan model loading
│   ├── model_loader.py                # Singleton CNN model loader
│   ├── predictor.py                   # Image preprocessing + inference pipeline
│   ├── solutions.json                 # Disease treatment data (10 classes)
│   ├── requirements.txt               # Python dependencies
│   └── tests/                         # pytest test suite
│
├── 📂 frontend/                       # React 18 SPA
│   ├── src/
│   │   ├── api/                       # Axios API modules
│   │   │   ├── axios.js               # Centralised Axios instance + interceptors
│   │   │   ├── auth.js
│   │   │   ├── predictions.js
│   │   │   └── users.js
│   │   ├── context/
│   │   │   ├── AuthContext.jsx        # JWT session management
│   │   │   └── NotificationContext.jsx # Notification queue
│   │   ├── components/
│   │   │   ├── ProtectedRoute.jsx     # Role-based route guard
│   │   │   ├── Layout.jsx
│   │   │   ├── AdminLayout.jsx
│   │   │   ├── SolutionPanel.jsx
│   │   │   └── TreatmentModal.jsx
│   │   ├── pages/
│   │   │   ├── public/                # Home, Login, Register, Education, Contact, About
│   │   │   ├── user/                  # Predict, History, Compare, Profile, Settings, Notifications
│   │   │   └── admin/                 # Admin portal sections
│   │   └── __tests__/                 # Vitest + React Testing Library
│   └── vite.config.js
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.11+
- **MongoDB Atlas** account (or local MongoDB)
- **Trained CNN model** (`.h5` file) — train via `Model/Leaf_Disease_Predict.ipynb` in Google Colab

---

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/MohamedAquiel/Tomato_Leaf_Doctor.git
cd Tomato_Leaf_Doctor
```

---

### 2️⃣ Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file based on `.env.example`:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/tomato_disease_db
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=30d
ML_SERVICE_URL=http://localhost:8000
MAX_FILE_SIZE=5242880
UPLOAD_PATH=uploads/
ADMIN_EMAIL=admin@tomatoapp.com
ADMIN_PASSWORD=Admin@123456
```

Seed the database (creates default admin account):

```bash
node seed.js
```

Start the backend server:

```bash
npm run dev       # Development (nodemon)
npm start         # Production
```

The backend runs on **http://localhost:5000**

---

### 3️⃣ ML Inference Service Setup

```bash
cd ml_service
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
```

Create a `.env` file in `ml_service/`:

```env
MODEL_PATH=../Model/tomato_disease_model.h5
PORT=8000
```

> **Note:** Train the CNN model using `Model/Leaf_Disease_Predict.ipynb` in Google Colab and download the `.h5` file to the `Model/` directory.

Start the ML service:

```bash
uvicorn main:app --reload --port 8000
```

The ML service runs on **http://localhost:8000**
Interactive API docs available at **http://localhost:8000/docs**

---

### 4️⃣ Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in `frontend/`:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the development server:

```bash
npm run dev
```

The frontend runs on **http://localhost:5173**

---

## 🧪 Running Tests

### Backend Tests (Jest)

```bash
cd backend
npm test                    # Run all tests
npm run test:coverage       # Run with coverage report
```

### Frontend Tests (Vitest)

```bash
cd frontend
npm test                    # Run all unit + integration tests
npm run coverage            # Run with coverage report
```

### ML Service Tests (pytest)

```bash
cd ml_service
pytest tests/ -v            # Run all tests
pytest tests/ --cov=.       # Run with coverage
```

---

## 🔐 Security Features

| Layer | Implementation |
|---|---|
| **Authentication** | JWT tokens (HS256) with 30-day expiry |
| **Password Hashing** | bcrypt with salt factor 10 |
| **HTTP Security Headers** | Helmet (CSP, X-Frame-Options, HSTS, X-Content-Type-Options) |
| **Rate Limiting** | 100 requests / 15 min per IP (stricter on auth endpoints) |
| **File Upload Validation** | MIME type allowlist (JPEG, PNG, WebP) + 5 MB size limit |
| **Filename Security** | UUID-generated filenames (prevent path traversal) |
| **CORS** | Configured origin policy |
| **Role-Based Access Control** | JWT + `authorize('admin')` middleware on admin endpoints |

---

## 📊 API Reference

### Authentication Endpoints

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register a new user account |
| POST | `/api/auth/login` | Public | Login and receive JWT token |
| POST | `/api/auth/logout` | Private | Logout and clear session |
| GET | `/api/auth/me` | Private | Get current authenticated user |
| PUT | `/api/auth/updatepassword` | Private | Update user password |

### Prediction Endpoints

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/predictions` | Public/Guest | Upload leaf image and get prediction |
| GET | `/api/predictions/my` | Private | Get authenticated user's prediction history |
| PUT | `/api/predictions/:id/notes` | Private | Update notes on a prediction |
| DELETE | `/api/predictions/:id` | Private | Delete a prediction record |
| GET | `/api/predictions` | Admin | Get all predictions (paginated, filterable) |
| DELETE | `/api/predictions/admin/:id` | Admin | Admin delete any prediction |

### User Management Endpoints

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/users` | Admin | Get all users (paginated, searchable) |
| PUT | `/api/users/:id/role` | Admin | Promote or demote user role |
| PUT | `/api/users/:id/status` | Admin | Activate or deactivate user account |
| DELETE | `/api/users/:id` | Admin | Delete a user account |
| GET | `/api/users/dashboard` | Admin | Get dashboard KPI statistics |

### ML Service Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Health check |
| POST | `/predict` | Upload image → receive disease prediction |
| GET | `/docs` | Interactive Swagger API documentation |

---

## 🤖 ML Service — Prediction Pipeline

When a leaf image is uploaded to `POST /predict`, the following pipeline executes:

```
1. Receive multipart/form-data image upload
2. Decode bytes → PIL Image (format-agnostic)
3. Convert to RGB colour space (handles RGBA, greyscale)
4. Resize to 128×128 pixels (Lanczos resampling)
5. Convert to NumPy array → normalise to [0, 1]
6. Expand to batch tensor shape (1, 128, 128, 3)
7. CNN model.predict() → (1, 10) softmax probabilities
8. argmax() → predicted class index + confidence %
9. Confidence threshold check (< 60% → is_valid: false)
10. Lookup solutions.json for treatment data
11. Return structured JSON response
```

**Response structure:**

```json
{
  "disease_key": "Tomato___Early_blight",
  "display_name": "Early Blight",
  "confidence": 94.2,
  "is_healthy": false,
  "is_valid": true,
  "solution": {
    "description": "...",
    "symptoms": ["..."],
    "immediate_actions": ["..."],
    "chemical_treatment": ["..."],
    "organic_treatment": ["..."],
    "prevention": ["..."],
    "recovery_time": "2-3 weeks"
  },
  "top_predictions": [
    {"disease": "Early Blight", "confidence": 94.2},
    {"disease": "Target Spot", "confidence": 3.1},
    {"disease": "Septoria Leaf Spot", "confidence": 1.8}
  ]
}
```

---

## 🎓 Model Development Summary

The model was developed in **Google Colaboratory** with NVIDIA T4 GPU acceleration using the **PlantVillage dataset** (tomato subset, 10 classes).

### Dataset Split
| Set | Ratio | Purpose |
|---|---|---|
| Training | 70% | Model weight updates |
| Validation | 15% | Hyperparameter tuning, early stopping |
| Test | 15% | Final generalisation evaluation |

### Improved CNN Architecture (Phase 2)
- 4 convolutional blocks (32 → 64 → 128 → 256 filters)
- 2 × Conv2D per block + BatchNormalization + ReLU + MaxPooling2D + Dropout
- L2 regularisation (λ = 0.001) on all Conv and Dense layers
- Global Average Pooling → Dense(512) → Dense(256) → Dense(10, softmax)
- `mixed_float16` precision for GPU memory efficiency
- Aggressive augmentation: rotation 40°, zoom 0.3, flip, brightness [0.7, 1.3]

### Best Model: CNN-SVM Hybrid (Phase 3)
- CNN feature extractor → 256-dimensional dense vectors
- SVM (RBF kernel, C=10, gamma='scale', probability=True)
- **Test Accuracy: 98.95% | Macro F1: 98.71%**

---

## 🖥️ Default Admin Credentials

After running `node seed.js`:

```
Email:    admin@tomatoapp.com
Password: Admin@123456
```

> ⚠️ Change these credentials immediately in any production deployment.

---

## 📄 License

This project is licensed under the **MIT License**.

---

## 👨‍💻 Author

**M.N.M. Aquiel**
BSc Software Development — Final Year Project
Student ID: CL/BSCSD/31/95 | st20286332

---

## 🙏 Acknowledgements

- [PlantVillage Dataset](https://github.com/spMohanty/PlantVillage-Dataset) — Hughes & Salathé (2015)
- [TensorFlow / Keras](https://tensorflow.org/) — Deep learning framework
- [FastAPI](https://fastapi.tiangolo.com/) — ML inference microservice
- [React](https://reactjs.org/) — Frontend SPA framework
- [MongoDB Atlas](https://mongodb.com/atlas) — Cloud database hosting
- [Google Colaboratory](https://colab.research.google.com/) — GPU-accelerated training environment

---

<div align="center">
  <strong>🍅 TomatoLeaf Doctor — Bringing AI to the Farm, One Leaf at a Time</strong>
</div>
