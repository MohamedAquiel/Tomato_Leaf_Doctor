# Test Cases Part 3: Admin Dashboard, Users, Predictions, Notifications, Settings & Security

## TC041: Admin Dashboard - Load Statistics

| Field | Details |
|---|---|
| **Test ID** | TC041 |
| **Test Case** | Admin Dashboard Statistics Display |
| **Description** | Verify that the AdminDashboard page loads and displays key statistics (total predictions, healthy crops, diseased crops, avg confidence) |
| **Components Involved** | AdminDashboard.jsx, AdminLayout.jsx, API: predictions endpoint |
| **Test Steps** | 1. Login as admin user<br>2. Navigate to /admin route<br>3. Wait for statistics to load<br>4. Verify all stat cards are visible |
| **Expected Results** | All statistics cards display correctly with accurate numbers and proper formatting |
| **Screenshot** | ![TC041](screenshots/TC041_admin_dashboard_stats.png) |

---

## TC042: Admin Dashboard - Recent Predictions Table

| Field | Details |
|---|---|
| **Test ID** | TC042 |
| **Test Case** | Admin Dashboard Recent Predictions Table |
| **Description** | Verify that the AdminDashboard displays a table of recent predictions with user info, disease, and confidence score |
| **Components Involved** | AdminDashboard.jsx, API: predictions endpoint |
| **Test Steps** | 1. Login as admin user<br>2. Navigate to /admin<br>3. Scroll to recent predictions section<br>4. Verify table columns: User, Image, Disease, Confidence, Date |
| **Expected Results** | Table displays last 10 predictions with all columns visible and sortable |
| **Screenshot** | ![TC042](screenshots/TC042_recent_predictions_table.png) |

---

## TC043: Admin Dashboard - Disease Breakdown Chart

| Field | Details |
|---|---|
| **Test ID** | TC043 |
| **Test Case** | Admin Dashboard Disease Distribution Analysis |
| **Description** | Verify that the AdminDashboard displays a disease breakdown chart showing distribution of predicted diseases |
| **Components Involved** | AdminDashboard.jsx, Chart library (e.g., recharts), API: analytics endpoint |
| **Test Steps** | 1. Login as admin user<br>2. Navigate to /admin<br>3. Locate disease breakdown chart<br>4. Verify chart displays all disease types with percentages |
| **Expected Results** | Chart renders correctly with accurate disease distribution data and proper labeling |
| **Screenshot** | ![TC043](screenshots/TC043_disease_breakdown_chart.png) |

---

## TC044: Admin Dashboard - Non-Admin Redirect

| Field | Details |
|---|---|
| **Test ID** | TC044 |
| **Test Case** | Non-Admin User Cannot Access Admin Dashboard |
| **Description** | Verify that a non-admin user attempting to access /admin is redirected to home or login page |
| **Components Involved** | ProtectedRoute.jsx, AdminPage.jsx, AdminLayout.jsx |
| **Test Steps** | 1. Login as regular user<br>2. Attempt to navigate to /admin manually via URL<br>3. Observe redirect behavior<br>4. Verify user is redirected to home or unauthorized page |
| **Expected Results** | User is redirected away from /admin with appropriate message or redirect to home |
| **Screenshot** | ![TC044](screenshots/TC044_non_admin_redirect.png) |

---

## TC045: Admin Dashboard - Admin Sidebar Navigation

| Field | Details |
|---|---|
| **Test ID** | TC045 |
| **Test Case** | Admin Sidebar Navigation Links |
| **Description** | Verify that AdminLayout sidebar displays all admin navigation links and navigation is functional |
| **Components Involved** | AdminLayout.jsx, AdminPage.jsx |
| **Test Steps** | 1. Login as admin user<br>2. Navigate to /admin<br>3. Verify sidebar displays: Dashboard, Analytics, Model Monitoring, Predictions, Users, Disease CMS, Settings<br>4. Click each link and verify navigation<br>5. Verify active link is highlighted |
| **Expected Results** | All navigation links are present, clickable, and navigation works correctly with active state styling |
| **Screenshot** | ![TC045](screenshots/TC045_admin_sidebar_navigation.png) |

---

## TC046: Admin Users Page - List All Users

| Field | Details |
|---|---|
| **Test ID** | TC046 |
| **Test Case** | Admin Users Page - Display User List |
| **Description** | Verify that AdminUsers page loads and displays a list of all registered users with their details |
| **Components Involved** | AdminUsers.jsx, AdminLayout.jsx, API: users endpoint |
| **Test Steps** | 1. Login as admin user<br>2. Navigate to /admin/users<br>3. Wait for user list to load<br>4. Verify table displays: User ID, Name, Email, Role, Created Date, Actions |
| **Expected Results** | User list displays all users with correct information in a paginated table format |
| **Screenshot** | ![TC046](screenshots/TC046_admin_users_list.png) |

---

## TC047: Admin Users Page - Search Users

| Field | Details |
|---|---|
| **Test ID** | TC047 |
| **Test Case** | Admin Users Page - Search Functionality |
| **Description** | Verify that the search functionality on AdminUsers page filters users by name or email |
| **Components Involved** | AdminUsers.jsx, Input component |
| **Test Steps** | 1. Login as admin user<br>2. Navigate to /admin/users<br>3. Locate search input field<br>4. Enter partial name or email (e.g., "john")<br>5. Verify results filter in real-time<br>6. Clear search and verify all users reappear |
| **Expected Results** | Search filters results accurately and displays only matching users; clearing search restores full list |
| **Screenshot** | ![TC047](screenshots/TC047_admin_users_search.png) |

---

## TC048: Admin Users Page - Promote User to Admin

| Field | Details |
|---|---|
| **Test ID** | TC048 |
| **Test Case** | Admin Users Page - Promote User to Admin Role |
| **Description** | Verify that an admin can promote a regular user to admin role via action button |
| **Components Involved** | AdminUsers.jsx, API: users/promote endpoint, Button component |
| **Test Steps** | 1. Login as admin user<br>2. Navigate to /admin/users<br>3. Find a regular user in the list<br>4. Click "Promote to Admin" button<br>5. Confirm action in modal/dialog<br>6. Verify user role changes to "Admin" in table |
| **Expected Results** | User role successfully updates to Admin; action is logged; table reflects change immediately |
| **Screenshot** | ![TC048](screenshots/TC048_promote_user_admin.png) |

---

## TC049: Admin Users Page - Delete User

| Field | Details |
|---|---|
| **Test ID** | TC049 |
| **Test Case** | Admin Users Page - Delete User Account |
| **Description** | Verify that an admin can delete a user account with confirmation dialog |
| **Components Involved** | AdminUsers.jsx, API: users/delete endpoint, Button component, Modal confirmation |
| **Test Steps** | 1. Login as admin user<br>2. Navigate to /admin/users<br>3. Find a user to delete<br>4. Click "Delete" button<br>5. Confirm deletion in modal<br>6. Verify user is removed from list<br>7. Verify user's predictions are handled (archived or deleted) |
| **Expected Results** | User is deleted after confirmation; removed from user list; associated data is properly handled |
| **Screenshot** | ![TC049](screenshots/TC049_delete_user.png) |

---

## TC050: Admin Predictions Page - List All Predictions

| Field | Details |
|---|---|
| **Test ID** | TC050 |
| **Test Case** | Admin Predictions Page - Display All Predictions |
| **Description** | Verify that AdminPredictions page displays a comprehensive list of all system predictions with details |
| **Components Involved** | AdminPredictions.jsx, AdminLayout.jsx, API: predictions endpoint |
| **Test Steps** | 1. Login as admin user<br>2. Navigate to /admin/predictions<br>3. Wait for predictions to load<br>4. Verify table columns: User, Image, Disease, Confidence, Status, Date, Actions |
| **Expected Results** | All predictions display in paginated table with correct data; images load properly; pagination controls work |
| **Screenshot** | ![TC050](screenshots/TC050_admin_predictions_list.png) |

---

## TC051: Admin Predictions Page - Filter Healthy/Diseased

| Field | Details |
|---|---|
| **Test ID** | TC051 |
| **Test Case** | Admin Predictions Page - Filter by Disease Status |
| **Description** | Verify that predictions can be filtered by health status (Healthy vs Diseased) |
| **Components Involved** | AdminPredictions.jsx, Filter component, API: predictions endpoint |
| **Test Steps** | 1. Login as admin user<br>2. Navigate to /admin/predictions<br>3. Click "Filter" or status dropdown<br>4. Select "Healthy" and verify results filter<br>5. Select "Diseased" and verify results filter<br>6. Select "All" and verify all results display |
| **Expected Results** | Predictions filter correctly by status; counts update accurately; filter persists on page |
| **Screenshot** | ![TC051](screenshots/TC051_filter_healthy_diseased.png) |

---

## TC052: Admin Predictions Page - Delete Prediction

| Field | Details |
|---|---|
| **Test ID** | TC052 |
| **Test Case** | Admin Predictions Page - Delete Prediction Record |
| **Description** | Verify that an admin can delete a prediction record with confirmation |
| **Components Involved** | AdminPredictions.jsx, API: predictions/delete endpoint, Button component, Modal confirmation |
| **Test Steps** | 1. Login as admin user<br>2. Navigate to /admin/predictions<br>3. Find a prediction to delete<br>4. Click "Delete" action button<br>5. Confirm deletion in modal<br>6. Verify prediction is removed from list<br>7. Verify notification/toast appears confirming deletion |
| **Expected Results** | Prediction is deleted after confirmation; removed from list immediately; success notification displays |
| **Screenshot** | ![TC052](screenshots/TC052_delete_prediction.png) |

---

## TC053: Admin Predictions Page - Pagination

| Field | Details |
|---|---|
| **Test ID** | TC053 |
| **Test Case** | Admin Predictions Page - Pagination Controls |
| **Description** | Verify that pagination works correctly for large prediction datasets |
| **Components Involved** | AdminPredictions.jsx, Pagination component |
| **Test Steps** | 1. Login as admin user<br>2. Navigate to /admin/predictions (with 50+ predictions)<br>3. Verify "Show X-Y of Z" text<br>4. Click "Next" button<br>5. Verify page 2 predictions load<br>6. Click "Previous" button<br>7. Verify return to page 1<br>8. Change items per page if available |
| **Expected Results** | Pagination displays correct data; navigation works smoothly; item count updates correctly |
| **Screenshot** | ![TC053](screenshots/TC053_pagination_predictions.png) |

---

## TC054: Notifications - Add Notification

| Field | Details |
|---|---|
| **Test ID** | TC054 |
| **Test Case** | Notification System - Add New Notification |
| **Description** | Verify that new notifications are added to the system and stored in localStorage |
| **Components Involved** | NotificationContext.jsx, NotificationsPage.jsx, localStorage |
| **Test Steps** | 1. Login as user<br>2. Trigger a notification-generating action (e.g., new prediction, message)<br>3. Verify notification appears in notification bell icon<br>4. Verify unread badge count increments<br>5. Navigate to NotificationsPage<br>6. Verify notification appears in list<br>7. Clear browser cache and refresh; verify notification persists |
| **Expected Results** | Notification is created, badge increments, appears in list, and persists in localStorage |
| **Screenshot** | ![TC054](screenshots/TC054_add_notification.png) |

---

## TC055: Notifications - Mark as Read

| Field | Details |
|---|---|
| **Test ID** | TC055 |
| **Test Case** | Notification System - Mark Notification as Read |
| **Description** | Verify that notifications can be marked as read and badge count updates accordingly |
| **Components Involved** | NotificationContext.jsx, NotificationsPage.jsx, Bell icon component |
| **Test Steps** | 1. Login as user with unread notifications<br>2. Verify unread badge displays count<br>3. Click on a notification in NotificationsPage<br>4. Verify notification is marked as read (visual change)<br>5. Verify unread count decreases<br>6. Verify notification is removed from bell badge count |
| **Expected Results** | Notification marks as read; badge updates; visual indication changes (e.g., bold to normal text) |
| **Screenshot** | ![TC055](screenshots/TC055_mark_notification_read.png) |

---

## TC056: Notifications - Clear All Notifications

| Field | Details |
|---|---|
| **Test ID** | TC056 |
| **Test Case** | Notification System - Clear All Notifications |
| **Description** | Verify that users can clear all notifications at once from the NotificationsPage |
| **Components Involved** | NotificationsPage.jsx, NotificationContext.jsx, Button component |
| **Test Steps** | 1. Login as user with multiple notifications<br>2. Navigate to NotificationsPage (/notifications)<br>3. Click "Clear All" button<br>4. Verify confirmation dialog appears<br>5. Confirm action<br>6. Verify all notifications are removed<br>7. Verify bell icon badge count is zero |
| **Expected Results** | All notifications are cleared; confirmation dialog appears; badge count resets to zero |
| **Screenshot** | ![TC056](screenshots/TC056_clear_all_notifications.png) |

---

## TC057: Settings Page - Save User Preferences

| Field | Details |
|---|---|
| **Test ID** | TC057 |
| **Test Case** | Settings Page - Save User Preferences |
| **Description** | Verify that user settings are saved and persist across sessions |
| **Components Involved** | SettingsPage.jsx, localStorage, Input component, Button component |
| **Test Steps** | 1. Login as user<br>2. Navigate to /settings<br>3. Change preferences (theme, language, notification settings)<br>4. Click "Save" button<br>5. Verify success message/toast<br>6. Logout and login again<br>7. Navigate to /settings<br>8. Verify preferences are restored |
| **Expected Results** | Settings save successfully; confirmation message displays; preferences persist after logout/login |
| **Screenshot** | ![TC057](screenshots/TC057_save_preferences.png) |

---

## TC058: Settings Page - Toggle Notification Preferences

| Field | Details |
|---|---|
| **Test ID** | TC058 |
| **Test Case** | Settings Page - Notification Preference Toggle |
| **Description** | Verify that users can toggle notification preferences for different notification types |
| **Components Involved** | SettingsPage.jsx, Toggle/Checkbox component, NotificationContext.jsx |
| **Test Steps** | 1. Login as user<br>2. Navigate to /settings<br>3. Locate notification preferences section<br>4. Toggle "Email Notifications" off<br>5. Toggle "In-App Notifications" off<br>6. Toggle "SMS Notifications" off (if applicable)<br>7. Click "Save"<br>8. Verify preferences update<br>9. Attempt to trigger notification; verify it's blocked based on settings |
| **Expected Results** | Toggles update state visually; settings save; notifications respect user preferences |
| **Screenshot** | ![TC058](screenshots/TC058_notification_preferences.png) |

---

## TC059: Settings Page - Reset to Default Preferences

| Field | Details |
|---|---|
| **Test ID** | TC059 |
| **Test Case** | Settings Page - Reset Preferences to Default |
| **Description** | Verify that users can reset all settings to default values via a reset button |
| **Components Involved** | SettingsPage.jsx, localStorage, Button component, Modal confirmation |
| **Test Steps** | 1. Login as user<br>2. Navigate to /settings<br>3. Change multiple preferences<br>4. Click "Reset to Defaults" button<br>5. Verify confirmation dialog appears<br>6. Confirm reset action<br>7. Verify all settings revert to defaults<br>8. Verify notification preferences are reset<br>9. Verify localStorage is updated |
| **Expected Results** | Settings reset to defaults; confirmation dialog appears; all changes reverted successfully |
| **Screenshot** | ![TC059](screenshots/TC059_reset_preferences.png) |

---

## TC060: UI/UX - Button Hover Animation

| Field | Details |
|---|---|
| **Test ID** | TC060 |
| **Test Case** | Button Component - Hover Animation (translateY -2px) |
| **Description** | Verify that Button component displays proper hover animation with translateY transformation |
| **Components Involved** | Button.jsx, CSS animations |
| **Test Steps** | 1. Open any page with Button components<br>2. Identify a primary button<br>3. Hover mouse over button<br>4. Observe button movement (should move up 2px)<br>5. Verify animation is smooth<br>6. Move mouse away and verify button returns to original position |
| **Expected Results** | Button smoothly animates upward 2px on hover; returns to original position on mouse leave |
| **Screenshot** | ![TC060](screenshots/TC060_button_hover_animation.png) |

---

## TC061: UI/UX - Button Press Animation and Loading State

| Field | Details |
|---|---|
| **Test ID** | TC061 |
| **Test Case** | Button Component - Press Animation and Loading Spinner |
| **Description** | Verify that Button component displays scale 0.97 animation on press and shows loading spinner |
| **Components Involved** | Button.jsx, CSS animations, Loading spinner |
| **Test Steps** | 1. Open a page with a button that triggers an action (e.g., "Save", "Submit")<br>2. Click button<br>3. Verify button scales to 0.97<br>4. Verify loading spinner appears inside button<br>5. Verify button is disabled during loading<br>6. Verify button returns to normal scale on completion |
| **Expected Results** | Button scales down on click; spinner displays; button is disabled during loading state |
| **Screenshot** | ![TC061](screenshots/TC061_button_press_animation.png) |

---

## TC062: UI/UX - Logout Spinner Display

| Field | Details |
|---|---|
| **Test ID** | TC062 |
| **Test Case** | Logout Process - Loading Spinner Display |
| **Description** | Verify that a loading spinner is displayed during the logout process before redirect |
| **Components Involved** | AuthContext.jsx, Navigation, Button component, Loading spinner |
| **Test Steps** | 1. Login as user<br>2. Locate and click "Logout" button<br>3. Verify loading spinner appears immediately<br>4. Verify page is disabled/dimmed during logout<br>5. Verify redirect to login page occurs after spinner completes<br>6. Verify no errors in console |
| **Expected Results** | Loading spinner displays during logout; page is disabled; smooth redirect to login occurs |
| **Screenshot** | ![TC062](screenshots/TC062_logout_spinner.png) |

---

## TC063: UI/UX - Treatment Modal Animation

| Field | Details |
|---|---|
| **Test ID** | TC063 |
| **Test Case** | Treatment Modal - Spin-In Animation and Interactions |
| **Description** | Verify that TreatmentModal displays spin-in animation, locks body scroll, and responds to close triggers |
| **Components Involved** | TreatmentModal.jsx, CSS animations, Modal overlay |
| **Test Steps** | 1. Navigate to predict page and make a prediction<br>2. View disease result and click "View Treatment"<br>3. Verify modal appears with spin-in animation (600ms)<br>4. Verify overlay covers entire screen<br>5. Verify body scroll is locked (page doesn't scroll)<br>6. Press Escape key and verify modal closes<br>7. Reopen modal and click overlay; verify modal closes<br>8. Verify body scroll is restored |
| **Expected Results** | Modal animates in with spin-in effect (600ms); body scroll locked; closes on Escape key or overlay click |
| **Screenshot** | ![TC063](screenshots/TC063_treatment_modal_animation.png) |

---

## TC064: Footer Links - Navigation Verification

| Field | Details |
|---|---|
| **Test ID** | TC064 |
| **Test Case** | Footer Component - Link Navigation |
| **Description** | Verify that all footer links navigate correctly to their respective pages |
| **Components Involved** | Footer.jsx, Navigation, React Router |
| **Test Steps** | 1. Open any page with footer<br>2. Locate footer component<br>3. Verify footer displays links to: Home, About, Education, Contact, Predict, History, Notifications, Settings<br>4. Click each link and verify correct navigation<br>5. Verify no console errors<br>6. Verify copyright text: "Copyright © 2026"<br>7. Verify attribution: "Developed by Aquiel" |
| **Expected Results** | All links navigate correctly; copyright and attribution display correctly |
| **Screenshot** | ![TC064](screenshots/TC064_footer_links.png) |

---

## TC065: Security - Protected Route Redirect for Non-Authenticated Users

| Field | Details |
|---|---|
| **Test ID** | TC065 |
| **Test Case** | Protected Route - Non-Authenticated User Redirect |
| **Description** | Verify that ProtectedRoute redirects non-authenticated users to login page |
| **Components Involved** | ProtectedRoute.jsx, AuthContext.jsx, localStorage (JWT), Navigation |
| **Test Steps** | 1. Clear authentication token from localStorage<br>2. Attempt to navigate to /settings (protected route)<br>3. Verify redirect to login page occurs<br>4. Verify redirect URL is /login<br>5. Verify user cannot access protected content<br>6. Login and verify can now access /settings |
| **Expected Results** | Non-authenticated users are redirected to login; authenticated users can access protected routes |
| **Screenshot** | ![TC065](screenshots/TC065_protected_route_redirect.png) |

---

## TC066: Security - Admin-Only Route Protection

| Field | Details |
|---|---|
| **Test ID** | TC066 |
| **Test Case** | Protected Route - Admin-Only Access Control |
| **Description** | Verify that routes with adminOnly prop deny access to non-admin users and redirect appropriately |
| **Components Involved** | ProtectedRoute.jsx with adminOnly prop, AdminLayout.jsx, AuthContext.jsx |
| **Test Steps** | 1. Login as regular user<br>2. Attempt to navigate to /admin route directly<br>3. Verify redirect occurs (to home or unauthorized page)<br>4. Logout<br>5. Login as admin user<br>6. Navigate to /admin<br>7. Verify access is granted<br>8. Verify all admin sections are accessible |
| **Expected Results** | Non-admin users cannot access /admin routes; admin users have full access; proper redirects occur |
| **Screenshot** | ![TC066](screenshots/TC066_admin_only_protection.png) |

---

## TC067: Security - JWT Token Expiry and Refresh

| Field | Details |
|---|---|
| **Test ID** | TC067 |
| **Test Case** | JWT Token - Expiry Handling and Auto-Refresh |
| **Description** | Verify that expired JWT tokens trigger logout or token refresh, and optionalProtect middleware handles gracefully |
| **Components Involved** | AuthContext.jsx, auth middleware, axios interceptors, localStorage |
| **Test Steps** | 1. Login as user<br>2. Manually expire JWT token (modify localStorage)<br>3. Attempt to perform protected action (e.g., make prediction)<br>4. Verify error handling (logout or refresh token)<br>5. Verify user is redirected to login if refresh fails<br>6. Verify error notification appears<br>7. Re-login and verify normal operation resumes |
| **Expected Results** | Expired tokens are detected; auto-refresh attempts; graceful logout if refresh fails |
| **Screenshot** | ![TC067](screenshots/TC067_jwt_expiry_handling.png) |

