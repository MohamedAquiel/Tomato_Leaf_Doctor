# Tomato Leaf Disease Prediction React App - Frontend Technical Analysis

## 1. PAGES AND ROUTES

### Public Routes (Accessible to All)
| Route | Component | Purpose |
|-------|-----------|---------|
| `/` | HomePage | Landing page with hero section and call-to-action |
| `/login` | LoginPage | User authentication with email/password validation |
| `/register` | RegisterPage | New user account creation with name/email/password |
| `/predict` | PredictPage | Main disease prediction interface (works for guests) |
| `/education` | EducationPage | Educational content about tomato diseases |
| `/about` | AboutPage | Project information, tech stack, team details |
| `/contact` | ContactPage | Contact form with FAQs and support info |
| `/404` | NotFoundPage | 404 error page |
| `*` | NotFoundPage | Catch-all for undefined routes |

### Protected User Routes (Requires Authentication)
| Route | Component | Purpose |
|-------|-----------|---------|
| `/history` | HistoryPage | View all past predictions with pagination |
| `/profile` | ProfilePage | User profile, stats, and password management |
| `/compare` | ComparePage | Side-by-side comparison of predictions |
| `/notifications` | NotificationsPage | Local notification center with filtering |
| `/settings` | SettingsPage | User preferences and account settings |

### Protected Admin Routes (Requires Admin Role)
| Route | Component | Purpose |
|-------|-----------|---------|
| `/admin` | AdminDashboard | Overview dashboard with key metrics |
| `/admin/analytics` | AdminAnalytics | Prediction trends, user analytics, disease distribution |
| `/admin/model` | AdminModelMonitoring | ML model performance metrics and monitoring |
| `/admin/predictions` | AdminPredictions | Review and manage all user predictions |
| `/admin/users` | AdminUsers | Manage user accounts (search, edit, delete) |
| `/admin/cms` | AdminDiseaseCMS | Manage disease data and treatment solutions |
| `/admin/settings` | AdminSystemSettings | System-level configuration |

---

## 2. COMPONENTS AND FUNCTIONALITY

### Layout Components

#### `Layout.jsx` - Main Navigation Wrapper
- **Purpose:** Sticky navbar with conditional menu items based on auth state
- **Features:**
  - Responsive navigation with brand logo (leaf icon)
  - Conditional menu: guests see Login/Register; authenticated users see History, Compare, Profile, etc.
  - Notification bell with unread count badge
  - Settings icon link
  - Logout button with loading state
  - Footer integration
- **Key Data:** Uses `useAuth()` for user state and `useNotifications()` for unread count

#### `AdminLayout.jsx` - Admin Sidebar Navigation
- **Purpose:** Sidebar layout for admin dashboard pages
- **Features:**
  - Fixed sidebar with 7 admin menu sections
  - Left border indicator for active routes
  - Navigation icons with SVG paths
  - Sticky positioning with scroll handling
  - Clean hierarchical navigation

#### `Footer.jsx` - Application Footer
- **Purpose:** Branded footer with links and company info
- **Content:**
  - Brand info and description
  - 3 column groups (Explore, Account, Support)
  - Copyright and developer credits
  - Dark green theme (`#1b4332`)

### Form & UI Components

#### `Input.jsx` - Reusable Form Input
- **Props:** `label, name, type, value, onChange, error, placeholder, required, disabled`
- **Features:**
  - Inline error display
  - Focus/blur styling with border color changes
  - Required field indicator (red asterisk)
  - Disabled state with reduced opacity
  - Consistent theming with Poppins font

#### `Button.jsx` - Reusable Button Component
- **Props:** `children, onClick, type, disabled, loading, variant, style`
- **Variants:**
  - `primary` - Dark green (#2d6a4f) background
  - `danger` - Red background (#dc3545)
  - `outline` - Bordered, transparent background
  - `ghost` - Light border, transparent background
- **Features:**
  - Loading spinner animation
  - Hover/press animations (lift and scale effects)
  - Disabled state management
  - Full width by default

### Modal & Content Components

#### `TreatmentModal.jsx` - Disease Treatment Information Modal
- **Features:**
  - Animated overlay and modal entry (scale + rotate)
  - ESC key to close, outside click to close
  - Loading state with spinner
  - Sticky header with close button
  - Passes solution data to `SolutionPanel`
  - Locks body scroll when open

#### `SolutionPanel.jsx` - Disease Solution Display
- **Props:** `solution, compact`
- **Displays:**
  - Disease name (with scientific name and severity badge)
  - Symptoms list
  - Immediate actions
  - Chemical treatment options
  - Organic treatment options
  - Prevention strategies
  - Recovery time estimate
- **Severity Badges:** High (red), Medium (yellow), Low (green)
- **Compact Mode:** Reduced padding and font sizes for history cards

#### `ProtectedRoute.jsx` - Authentication Guard
- **Features:**
  - Redirects unauthenticated users to `/login`
  - Redirects non-admin users from admin routes to home
  - Shows "Loading..." during auth state check
  - Supports `adminOnly` prop for role-based access

---

## 3. API FUNCTIONS

### `api/axios.js` - Axios Instance Configuration
```javascript
baseURL: '/api'
withCredentials: true
Request Interceptor: Adds Authorization Bearer token to headers
Response Interceptor: 
  - Clears token and redirects to /login on 401 status
  - Passes through other errors
```

### `api/auth.js` - Authentication Endpoints
| Function | Endpoint | Method | Purpose |
|----------|----------|--------|---------|
| `register(data)` | `/auth/register` | POST | Create new user account |
| `login(data)` | `/auth/login` | POST | Authenticate user with email/password |
| `logout()` | `/auth/logout` | POST | Logout user and invalidate session |
| `getMe()` | `/auth/me` | GET | Fetch current user profile |
| `updatePassword(data)` | `/auth/update-password` | PUT | Change user password |

### `api/predictions.js` - Prediction Management
| Function | Endpoint | Method | Purpose |
|----------|----------|--------|---------|
| `createPrediction(formData)` | `/predictions` | POST | Submit image and get disease prediction |
| `getMyPredictions(params)` | `/predictions/my` | GET | Fetch authenticated user's predictions (paginated) |
| `getPrediction(id)` | `/predictions/{id}` | GET | Fetch single prediction details |
| `deletePrediction(id)` | `/predictions/{id}` | DELETE | Delete a prediction |
| `updateNotes(id, notes)` | `/predictions/{id}/notes` | PUT | Add/update notes on prediction |
| `getAllPredictions(params)` | `/predictions` | GET | Fetch all predictions (admin only) |

**Note:** `createPrediction` uses `multipart/form-data` for file upload

### `api/users.js` - User Management
| Function | Endpoint | Method | Purpose |
|----------|----------|--------|---------|
| `getProfile()` | `/users/profile` | GET | Fetch current user's full profile |
| `updateProfile(data)` | `/users/profile` | PUT | Update user profile (name, etc.) |
| `getDashboardStats()` | `/users/stats` | GET | Fetch user statistics |
| `getAllUsers(params)` | `/users` | GET | Fetch all users (admin only) |
| `deleteUser(id)` | `/users/{id}` | DELETE | Delete user account (admin only) |
| `updateUser(id, data)` | `/users/{id}` | PUT | Update user data (admin only) |

---

## 4. CONTEXT PROVIDERS AND STATE

### `AuthContext.jsx` - Authentication State Management
**Exported Hook:** `useAuth()`

**Context Value:**
```javascript
{
  user: null | { id, name, email, role, predictionCount, createdAt, lastLogin },
  token: null | string,
  loading: boolean,
  login: async (data) => void,
  register: async (data) => void,
  logout: async () => void
}
```

**Features:**
- Restores session from localStorage on mount
- Stores token in localStorage as `'token'`
- Validates token by calling `getMe()` endpoint
- Clears token on 401 response
- Automatic login/register token and user storage

### `NotificationContext.jsx` - Local Notification System
**Exported Hook:** `useNotifications()`

**Context Value:**
```javascript
{
  notifications: array,  // Max 50 items, most recent first
  unreadCount: number,
  addNotification: (type, title, message, meta) => id,
  markRead: (id) => void,
  markAllRead: () => void,
  remove: (id) => void,
  clearAll: () => void
}
```

**Notification Structure:**
```javascript
{
  id: string,           // Generated: `${Date.now()}-${randomChars}`
  type: 'success' | 'warning' | 'error' | 'info',
  title: string,
  message: string,
  meta: object,         // Optional metadata
  read: boolean,
  createdAt: ISO string
}
```

**Features:**
- Persists to localStorage as `'tld_notifications'`
- Syncs notifications on every change
- Calculates unread count reactively
- Used for disease prediction results and system events

---

## 5. KEY USER FLOWS

### Authentication Flow
```
Register Page
  ↓ (name, email, password validation)
  ↓ POST /auth/register
  ├→ Store token in localStorage
  ├→ Set user in AuthContext
  └→ Navigate to /predict

OR

Login Page
  ↓ (email, password validation)
  ↓ POST /auth/login
  ├→ Store token in localStorage
  ├→ Set user in AuthContext
  └→ Navigate to previous page or /predict
```

### Disease Prediction Flow
```
Predict Page
  ├→ Upload image (drag-drop or click)
  ├→ Validate: file type, size ≤ 5MB, formats: JPEG/PNG/WebP
  ├→ Show preview
  ├→ Click "Analyze Leaf"
    │
    ├→ POST /predictions (multipart/form-data)
    ├→ Display result with:
    │   ├─ Disease name and confidence %
    │   ├─ Status badge (Healthy/Diseased)
    │   ├─ Progress bar
    │   └─ SolutionPanel (treatment info)
    │
    ├→ If authenticated:
    │   ├─ Save prediction to history
    │   ├─ Add notification
    │   └─ Show "Result saved" message
    │
    └→ If guest:
        └─ Show warning to register for history
```

### History & Comparison Flow
```
History Page
  ├→ GET /predictions/my?page=1&limit=12
  ├→ Display paginated cards with:
  │   ├─ Thumbnail image
  │   ├─ Disease name
  │   ├─ Status & confidence badges
  │   ├─ Date created
  │   └─ Action buttons
  │
  ├→ Per prediction:
  │   ├─ View Treatment → TreatmentModal
  │   ├─ Notes → Edit and PUT /predictions/{id}/notes
  │   └─ Delete → Confirm and DELETE /predictions/{id}
  │
  └→ Pagination: prev/next buttons, page info

Compare Page
  ├→ Select 2 predictions
  ├→ Side-by-side comparison of:
  │   ├─ Disease names
  │   ├─ Confidence scores
  │   ├─ Severity levels
  │   ├─ Symptoms
  │   ├─ Treatment recommendations
  │   └─ Images
  │
  └→ Download comparison as PDF (optional feature)
```

### Notifications Flow
```
Notifications Page
  ├→ Display all notifications from NotificationContext
  ├→ Filter by:
  │   ├─ All
  │   ├─ Unread only
  │   ├─ Type (success, warning, error, info)
  │
  ├→ Per notification:
  │   ├─ Click to markRead()
  │   ├─ Timestamp (relative: "2h ago")
  │   └─ Delete button
  │
  ├→ Bulk actions:
  │   ├─ Mark all read
  │   └─ Clear all notifications
  │
  └→ Empty state: "You're all caught up!"
```

### Settings Flow
```
Settings Page
  ├→ Fetch GET /users/stats
  ├→ Display preferences:
  │   ├─ Theme (light/dark) [toggle]
  │   ├─ Email notifications [toggle]
  │   ├─ Language preference [dropdown]
  │   ├─ Data privacy settings [checkboxes]
  │   └─ Account deletion [button]
  │
  ├→ Save settings → PUT endpoint
  └→ Show success/error toasts
```

### Admin Workflows

**Admin Dashboard:**
- Overview cards: Total users, total predictions, active today
- Recent predictions table
- Disease distribution chart
- User growth chart

**Admin Analytics:**
- Prediction trends (line chart)
- Disease prevalence (pie/bar chart)
- Confidence score distribution
- User engagement metrics
- Filter by date range

**Admin Users Management:**
- Searchable user table
- Columns: Name, Email, Role, Predictions, Joined, Last Login
- Bulk actions: delete multiple users
- Individual: view profile, change role, delete
- Export user list

**Admin Predictions Review:**
- All predictions table (paginated)
- Columns: User, Disease, Confidence, Date, Status
- Filter by disease, date range, confidence threshold
- Mark predictions as reviewed/verified
- Flag incorrect predictions

**Admin Disease CMS:**
- Disease list with CRUD operations
- Edit disease info: display name, scientific name, severity
- Manage symptoms, treatments (chemical & organic)
- Set recovery time estimates
- Add/remove disease classes

**Admin Model Monitoring:**
- Model performance metrics (accuracy, precision, recall)
- Inference time statistics
- Input validation errors
- Model version information
- Confidence score distribution

**Admin System Settings:**
- API configuration
- ML service endpoint settings
- File upload limits
- Max predictions per user
- Notification settings
- Email configuration

---

## 6. DEPENDENCIES IN PACKAGE.JSON

### Production Dependencies
| Package | Version | Purpose |
|---------|---------|---------|
| `react` | ^18.2.0 | UI library |
| `react-dom` | ^18.2.0 | React DOM rendering |
| `react-router-dom` | ^6.22.3 | Routing and navigation |
| `axios` | ^1.6.7 | HTTP client with interceptors |

### Dev Dependencies
| Package | Version | Purpose |
|---------|---------|---------|
| `vite` | ^5.1.0 | Build tool and dev server |
| `@vitejs/plugin-react` | ^4.2.1 | Vite React plugin |
| `eslint` | ^8.56.0 | Code linting |
| `eslint-plugin-react` | ^7.33.2 | React-specific linting rules |
| `eslint-plugin-react-hooks` | ^4.6.0 | React hooks linting |
| `eslint-plugin-react-refresh` | ^0.4.5 | Hot module reload validation |
| `@types/react` | ^18.2.55 | TypeScript React types |
| `@types/react-dom` | ^18.2.19 | TypeScript React DOM types |

### NPM Scripts
```bash
npm run dev      # Start Vite dev server (hot reload)
npm run build    # Build for production
npm run lint     # Run ESLint with strict rules
npm run preview  # Preview production build
```

---

## 7. ARCHITECTURE SUMMARY

### Tech Stack
- **Frontend Framework:** React 18.2 with Hooks
- **Build Tool:** Vite 5 (ES modules)
- **Routing:** React Router v6 (nested routes, protected routes)
- **HTTP Client:** Axios with interceptors (JWT auth handling)
- **Styling:** Inline styles (CSS-in-JS, no external CSS framework)
- **State Management:** Context API (AuthContext, NotificationContext)
- **Type Safety:** No TypeScript in production code (types in dev only)

### Design Patterns
1. **Protected Routes:** Wrapper component with auth checks
2. **Context for Global State:** Auth and notifications
3. **Axios Interceptors:** Automatic token injection, 401 redirect
4. **Form Validation:** Client-side validation with error state
5. **Modal Overlay:** Portal-style modals with ESC key handling
6. **Local Storage:** Token and notifications persistence
7. **Pagination:** Server-side pagination with page/limit params
8. **Loading States:** Boolean flags with spinner UI
9. **Inline Styles:** Object-based styling for responsive design
10. **SVG Icons:** Inline SVG for navbar/footer icons

### Color Scheme
- **Primary Green:** `#2d6a4f` (buttons, active states)
- **Dark Green:** `#1b4332` (headings, text)
- **Light Green:** `#d8f3dc`, `#f0f7f4` (backgrounds, borders)
- **Accent Green:** `#40916c` (secondary elements)
- **Success:** `#d1fae5` (green badges)
- **Danger:** `#fee2e2`, `#dc3545` (red alerts)
- **Warning:** `#fef9c3` (yellow alerts)
- **Neutral:** `#f3f4f6`, `#9ca3af` (grays)

### Key Features
✅ Guest predictions (no auth required)  
✅ JWT token auth with localStorage persistence  
✅ Role-based access (admin vs user)  
✅ Prediction history with pagination  
✅ Side-by-side prediction comparison  
✅ Local notification system with filtering  
✅ User profile management  
✅ Password change functionality  
✅ Comprehensive admin dashboard  
✅ Disease/solution CMS  
✅ Model monitoring  
✅ User analytics and reporting  
✅ Responsive design (mobile-first approach)  
✅ Error handling with user-friendly messages  
✅ Loading states and spinners  
✅ Confirmation dialogs for destructive actions  

---

## 8. FILE STRUCTURE OVERVIEW
```
frontend/src/
├── App.jsx                          # Main app with route definitions
├── main.jsx                         # React entry point
├── index.css                        # Global styles
├── context/
│   ├── AuthContext.jsx              # Authentication state
│   └── NotificationContext.jsx      # Notification system
├── api/
│   ├── axios.js                     # Axios instance with interceptors
│   ├── auth.js                      # Auth endpoints
│   ├── predictions.js               # Prediction endpoints
│   └── users.js                     # User endpoints
├── components/
│   ├── Layout.jsx                   # Main navbar + footer wrapper
│   ├── AdminLayout.jsx              # Admin sidebar layout
│   ├── Button.jsx                   # Reusable button component
│   ├── Input.jsx                    # Reusable input component
│   ├── ProtectedRoute.jsx           # Auth guard wrapper
│   ├── SolutionPanel.jsx            # Disease solution display
│   ├── TreatmentModal.jsx           # Disease treatment modal
│   └── Footer.jsx                   # Footer component
├── pages/
│   ├── public/
│   │   ├── HomePage.jsx             # Landing page
│   │   ├── LoginPage.jsx            # Login form
│   │   ├── RegisterPage.jsx         # Registration form
│   │   ├── EducationPage.jsx        # Disease education
│   │   ├── AboutPage.jsx            # About/mission/team
│   │   ├── ContactPage.jsx          # Contact form + FAQs
│   │   └── NotFoundPage.jsx         # 404 page
│   ├── user/
│   │   ├── PredictPage.jsx          # Main prediction tool
│   │   ├── HistoryPage.jsx          # Prediction history
│   │   ├── ProfilePage.jsx          # User profile + password
│   │   ├── ComparePage.jsx          # Comparison tool
│   │   ├── NotificationsPage.jsx    # Notification center
│   │   └── SettingsPage.jsx         # User settings
│   └── admin/sections/
│       ├── AdminDashboard.jsx       # Admin overview
│       ├── AdminAnalytics.jsx       # Analytics dashboard
│       ├── AdminUsers.jsx           # User management
│       ├── AdminPredictions.jsx     # Prediction review
│       ├── AdminDiseaseCMS.jsx      # Disease management
│       ├── AdminModelMonitoring.jsx # Model metrics
│       └── AdminSystemSettings.jsx  # System config
└── package.json                     # Dependencies
```

---

## 9. NOTABLE IMPLEMENTATION DETAILS

### Image Upload & Validation
- Supported formats: JPEG, PNG, WebP
- Max file size: 5 MB
- Validation: MIME type and file size checks before upload
- Uses `FormData` with `multipart/form-data` content type

### Prediction Result Structure
The API returns results with this structure:
```javascript
{
  displayName: string,
  diseaseKey: string,
  isHealthy: boolean,
  confidence: number (0-100),
  solution: object,          // Disease treatment info
  imageUrl: string,
  disease: object            // Alternative structure from API
}
```

### Notification System
- Client-side only (no backend persistence)
- Uses localStorage for persistence across sessions
- Max 50 notifications per session
- Auto-generated IDs with timestamp + random string
- Triggers on prediction completion

### Admin Routes
All admin routes require:
1. User to be authenticated
2. User role to be `'admin'`
3. Will redirect non-admin users to home page

### Error Handling
- Form validation errors displayed inline
- API errors shown in alert boxes with message from backend
- 401 responses trigger token clear + redirect to login
- Network errors fall back to generic messages
- Toast-like success messages (auto-dismiss after 4s in some cases)

---

## 10. RESPONSIVE DESIGN NOTES

- Uses CSS flexbox and grid
- `clamp()` function for responsive typography
- Mobile-first breakpoints:
  - Grid columns adjust with `repeat(auto-fill, minmax(...))`
  - Flex wrapping for small screens
  - Padding/margins scale with viewport
- Max-widths for content containers (usually 640px-1100px)
- Sidebar (admin) becomes fixed with sticky positioning

---

## Conclusion

This is a modern, well-structured React application for AI-powered tomato disease detection. It features:
- **Clean separation of concerns** with context API for state
- **Reusable components** for forms, buttons, and modals
- **Comprehensive error handling** and validation
- **Role-based access control** for admin features
- **Rich admin panel** for system management
- **Accessible design** with proper ARIA labels and semantic HTML
- **Optimized performance** with lazy loading and pagination

The application successfully balances functionality, accessibility, and code maintainability.
