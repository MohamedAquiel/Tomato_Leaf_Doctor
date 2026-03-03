# Tomato Leaf Doctor -- Complete Test Case Suite

## Project Overview

| Field | Details |
|---|---|
| **Application** | Tomato Leaf Doctor -- AI-powered Tomato Disease Detection |
| **Version** | 1.0.0 |
| **Author** | Aquiel |
| **Date** | 2026 |
| **Total Test Cases** | 66 |
| **Coverage** | Authentication, Prediction, ML Service, Frontend Pages, Admin, Notifications, Settings, Security, UI/UX |

---

## Architecture Under Test

```
+------------------+       +-------------------+       +------------------+
|   Frontend       |  <->  |   Backend API     |  <->  |   ML Service     |
|  React + Vite    |       |  Node.js/Express  |       |  FastAPI/Python   |
|  Port: 3000      |       |  Port: 5000       |       |  Port: 8000      |
+------------------+       +-------------------+       +------------------+
                                    |
                           +--------+--------+
                           |    MongoDB      |
                           |  Port: 27017    |
                           +-----------------+
```

---

## Test Case Summary Table

| Test ID | Test Case | Category | Priority |
|---------|-----------|----------|----------|
| TC001 | User Registration - Valid Data | Authentication | High |
| TC002 | User Registration - Missing Name | Authentication | High |
| TC003 | User Registration - Duplicate Email | Authentication | High |
| TC004 | User Registration - Short Password | Authentication | Medium |
| TC005 | User Registration - Invalid Email Format | Authentication | Medium |
| TC006 | User Login - Valid Credentials | Authentication | High |
| TC007 | User Login - Wrong Password | Authentication | High |
| TC008 | User Login - Inactive Account | Authentication | Medium |
| TC009 | User Login - Missing Fields | Authentication | Medium |
| TC010 | User Login - JWT Token Returned | Authentication | High |
| TC011 | Prediction - Guest User Upload | Prediction | High |
| TC012 | Prediction - Authenticated User Upload | Prediction | High |
| TC013 | Prediction - No File Attached | Prediction | High |
| TC014 | Prediction - Wrong File Type | Prediction | Medium |
| TC015 | Prediction - ML Service Offline | Prediction | High |
| TC016 | ML Service - Root Endpoint | ML Service | Medium |
| TC017 | ML Service - Health Endpoint | ML Service | High |
| TC018 | ML Service - Predict Valid Image | ML Service | High |
| TC019 | ML Service - Predict Invalid File | ML Service | High |
| TC020 | ML Service - Diseases Endpoint | ML Service | Medium |
| TC021 | Predict Page - Drag and Drop Upload | Frontend | High |
| TC022 | Predict Page - File Preview Display | Frontend | Medium |
| TC023 | Predict Page - Result Card Display | Frontend | High |
| TC024 | Predict Page - Confidence Bar | Frontend | Medium |
| TC025 | History Page - Load Predictions | Frontend | High |
| TC026 | History Page - Delete Prediction | Frontend | High |
| TC027 | History Page - Treatment Modal Opens | Frontend | High |
| TC028 | History Page - Save Notes | Frontend | Medium |
| TC029 | History Page - Pagination | Frontend | Medium |
| TC030 | Compare Page - Select Two Predictions | Frontend | High |
| TC031 | Compare Page - Summary Bar | Frontend | Medium |
| TC032 | Compare Page - Empty State | Frontend | Low |
| TC033 | Compare Page - Confidence Difference | Frontend | Medium |
| TC034 | Education Page - Disease Cards Render | Frontend | High |
| TC035 | Education Page - Severity Filter | Frontend | Medium |
| TC036 | Education Page - Disease Search | Frontend | Medium |
| TC037 | Education Page - Detail Modal | Frontend | High |
| TC038 | Contact Page - Empty Form Submit | Frontend | High |
| TC039 | Contact Page - Invalid Email | Frontend | High |
| TC040 | Contact Page - Short Message | Frontend | Medium |
| TC041 | Admin Dashboard - Load Stats | Admin | High |
| TC042 | Admin Dashboard - Recent Predictions | Admin | High |
| TC043 | Admin Dashboard - Disease Breakdown | Admin | Medium |
| TC044 | Admin Dashboard - Non-Admin Redirect | Security | Critical |
| TC045 | Admin Sidebar Navigation | Admin | Medium |
| TC046 | Admin Users - List Users | Admin | High |
| TC047 | Admin Users - Search Users | Admin | Medium |
| TC048 | Admin Users - Promote to Admin | Admin | High |
| TC049 | Admin Users - Delete User | Admin | High |
| TC050 | Admin Predictions - List All | Admin | High |
| TC051 | Admin Predictions - Filter Healthy | Admin | Medium |
| TC052 | Admin Predictions - Delete Prediction | Admin | High |
| TC053 | Admin Predictions - Pagination | Admin | Medium |
| TC054 | Notifications - Add Notification | Notifications | High |
| TC055 | Notifications - Mark as Read | Notifications | High |
| TC056 | Notifications - Clear All | Notifications | Medium |
| TC057 | Settings - Save Preferences | Settings | High |
| TC058 | Settings - Toggle Notifications | Settings | Medium |
| TC059 | Settings - Reset Preferences | Settings | Medium |
| TC060 | UI/UX - Button Hover Animation | UI/UX | Low |
| TC061 | UI/UX - Logout Spinner | UI/UX | Medium |
| TC062 | UI/UX - Treatment Modal Animation | UI/UX | Medium |
| TC063 | UI/UX - Footer Links | UI/UX | Low |
| TC064 | Security - Protected Route Redirect | Security | Critical |
| TC065 | Security - Admin-Only Route Redirect | Security | Critical |
| TC066 | Security - JWT Expiry Handling | Security | Critical |

---

## Test Parts

- **Part 1** (TC001-TC020): Authentication, Prediction, ML Service -- `TEST_CASES_PART1.md`
- **Part 2** (TC021-TC040): Frontend Pages (Predict, History, Compare, Education, Contact) -- `TEST_CASES_PART2.md`
- **Part 3** (TC041-TC066): Admin, Notifications, Settings, UI/UX, Security -- `TEST_CASES_PART3.md`

---

## Test Environment Setup

| Service | Command | Port |
|---------|---------|------|
| MongoDB | `mongod` | 27017 |
| Backend | `cd backend && npm run dev` | 5000 |
| ML Service | `cd ml_service && python main.py` | 8000 |
| Frontend | `cd frontend && npm run dev` | 3000 |

---

## Priority Legend

| Priority | Description |
|----------|-------------|
| Critical | Must pass -- app is unusable if failed |
| High | Core functionality -- must pass for release |
| Medium | Important feature -- should pass |
| Low | Minor/cosmetic -- nice to pass |

---

*Copyright 2026 Tomato Leaf Doctor. Developed by Aquiel.*
