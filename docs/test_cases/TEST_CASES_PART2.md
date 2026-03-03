# Tomato Leaf Disease Prediction Web App - Test Cases (TC021-TC040)

## Part 2: Predict, History, Compare, Education & Contact Pages

---

## TC021: Drag and Drop Image Upload on Predict Page

| Field | Details |
|---|---|
| **Test ID** | TC021 |
| **Test Case** | Drag-Drop Image Upload Functionality |
| **Description** | Verify that users can drag and drop a leaf image file onto the upload area on the Predict page and the file is accepted |
| **Components Involved** | PredictPage.jsx, Input.jsx, ImageUploadDrop component |
| **Test Steps** | 1. Navigate to /predict page<br>2. Locate the drag-drop upload area<br>3. Drag a valid JPG/PNG leaf image (1.2MB) over the drop zone<br>4. Release the file onto the drop zone<br>5. Verify file is processed |
| **Expected Results** | - Drop zone highlights/changes appearance on drag<br>- File is accepted without error<br>- File name displays: "tomato_leaf_diseased.jpg"<br>- Preview image renders below upload area<br>- No console errors |
| **Screenshot** | ![TC021](screenshots/TC021_drag_drop_upload.png) |

---

## TC022: Image Preview and File Validation on Predict Page

| Field | Details |
|---|---|
| **Test ID** | TC022 |
| **Test Case** | Image Preview Display and File Type Validation |
| **Description** | Verify that uploaded image is previewed correctly and invalid file types are rejected |
| **Components Involved** | PredictPage.jsx, Input.jsx, ImagePreview component |
| **Test Steps** | 1. Navigate to /predict page<br>2. Upload a valid JPG image (leaf_sample.jpg, 800x600px)<br>3. Observe preview rendering<br>4. Clear and attempt to upload a PDF file (invalid.pdf)<br>5. Observe rejection message |
| **Expected Results** | - Valid JPG image displays as 200x200px thumbnail<br>- Image container shows clear preview<br>- PDF upload rejected with error: "Only JPG, PNG, and JPEG formats are supported"<br>- Error message appears for 4 seconds then fades<br>- Valid file remains selected after attempting invalid upload |
| **Screenshot** | ![TC022](screenshots/TC022_image_preview_validation.png) |

---

## TC023: Prediction Result Display with Confidence Metrics

| Field | Details |
|---|---|
| **Test ID** | TC023 |
| **Test Case** | Display Prediction Results and Disease Information |
| **Description** | Verify that after image upload and prediction, the disease type, confidence score, and severity level are displayed correctly |
| **Components Involved** | PredictPage.jsx, SolutionPanel.jsx, API: /api/predict |
| **Test Steps** | 1. Upload a tomato leaf image on /predict<br>2. Click "Analyze Image" button<br>3. Wait for API response (simulated delay: 2-3 seconds)<br>4. Observe prediction results panel<br>5. Verify all metrics displayed |
| **Expected Results** | - Loading spinner displays during API call<br>- Results panel shows: "Early Blight" (disease name)<br>- Confidence score: "87.3%"<br>- Severity level: "HIGH" with red badge<br>- "Recommended Actions" section displays 3-4 treatment steps<br>- "Add to History" button is clickable<br>- No error messages or failed requests |
| **Screenshot** | ![TC023](screenshots/TC023_prediction_results.png) |

---

## TC024: Confidence Bar Visual Representation

| Field | Details |
|---|---|
| **Test ID** | TC024 |
| **Test Case** | Confidence Score Bar Chart Rendering |
| **Description** | Verify that the confidence bar correctly visualizes the prediction confidence as a percentage-based visual bar |
| **Components Involved** | SolutionPanel.jsx, ConfidenceBar.jsx |
| **Test Steps** | 1. Upload image and receive prediction with 75.2% confidence<br>2. Observe confidence bar display<br>3. Verify bar fill percentage<br>4. Test with high confidence prediction (95%)<br>5. Test with low confidence prediction (52%) |
| **Expected Results** | - Confidence bar container width: 250px<br>- Bar fill color: Green for 75.2% (75% of 250px = 187.5px)<br>- Percentage text displays: "75.2%"<br>- 95% confidence: bar full green, filled to 95%<br>- 52% confidence: bar yellow/amber warning color<br>- Smooth transition animation (0.3s) when changing values |
| **Screenshot** | ![TC024](screenshots/TC024_confidence_bar.png) |

---

## TC025: Load and Display Prediction History

| Field | Details |
|---|---|
| **Test ID** | TC025 |
| **Test Case** | History Page Load and Render Predictions |
| **Description** | Verify that the History page loads user's previous predictions and displays them as paginated cards |
| **Components Involved** | HistoryPage.jsx, HistoryCard.jsx, API: /api/history, AuthContext |
| **Test Steps** | 1. Login with valid credentials<br>2. Navigate to /history<br>3. Wait for API call to /api/history<br>4. Verify cards render with prediction data<br>5. Scroll through visible cards (page 1 of 3) |
| **Expected Results** | - Page loads and displays "Your Prediction History" heading<br>- 5 cards display on page 1 (records 1-5 of 15 total)<br>- Each card shows: disease name, prediction date, confidence %, thumbnail<br>- Card example: "Late Blight | Oct 15, 2024 | 92.1% confidence"<br>- Pagination shows: "Page 1 of 3" with Next/Previous buttons<br>- No loading errors |
| **Screenshot** | ![TC025](screenshots/TC025_history_load.png) |

---

## TC026: Delete Prediction from History

| Field | Details |
|---|---|
| **Test ID** | TC026 |
| **Test Case** | Delete Individual Prediction Card |
| **Description** | Verify that users can delete a specific prediction card from their history and confirmation dialog appears |
| **Components Involved** | HistoryCard.jsx, HistoryPage.jsx, API: /api/history/delete/:id |
| **Test Steps** | 1. Navigate to /history with populated predictions<br>2. Locate a card for "Early Blight - Oct 10, 2024"<br>3. Click trash/delete icon on the card<br>4. Confirmation modal appears<br>5. Click "Confirm Delete" button |
| **Expected Results** | - Delete icon highlighted on hover<br>- Confirmation modal displays: "Are you sure you want to delete this prediction?"<br>- Card ID shown in confirmation<br>- Two buttons: "Cancel" and "Confirm Delete"<br>- Upon confirmation: API call to /api/history/delete/[id]<br>- Card removed from page with fade-out animation<br>- Toast notification: "Prediction deleted successfully" (2 second duration)<br>- Page count updates from 3 to 2 pages (if 15 predictions reduced to 14) |
| **Screenshot** | ![TC026](screenshots/TC026_delete_prediction.png) |

---

## TC027: Open Treatment Modal from History Card

| Field | Details |
|---|---|
| **Test ID** | TC027 |
| **Test Case** | Treatment Modal Popup from History |
| **Description** | Verify that clicking "View Treatment" on a history card opens the treatment modal with disease-specific information |
| **Components Involved** | HistoryCard.jsx, TreatmentModal.jsx, HistoryPage.jsx |
| **Test Steps** | 1. Navigate to /history<br>2. Click "View Treatment" button on any card<br>3. Wait for modal animation to complete<br>4. Verify modal content and structure<br>5. Scroll within modal (if needed) |
| **Expected Results** | - Modal overlay appears with dark background (opacity: 0.7)<br>- Modal centered on screen with 600px width<br>- Title: "Treatment Recommendation for [Disease Name]"<br>- Sections displayed:<br>&nbsp;&nbsp;- Disease Overview<br>&nbsp;&nbsp;- Chemical Treatment<br>&nbsp;&nbsp;- Organic Alternatives<br>&nbsp;&nbsp;- Prevention Tips<br>- "Close" or X button in top-right corner<br>- Modal scrollable if content exceeds 500px height<br>- No overflow issues |
| **Screenshot** | ![TC027](screenshots/TC027_treatment_modal.png) |

---

## TC028: Edit and Save Notes in History

| Field | Details |
|---|---|
| **Test ID** | TC028 |
| **Test Case** | Edit and Save Prediction Notes |
| **Description** | Verify that users can edit and save personal notes on a prediction record |
| **Components Involved** | HistoryCard.jsx, NotesEditor.jsx, API: /api/history/notes/:id |
| **Test Steps** | 1. Navigate to /history<br>2. Click edit icon on a card's notes section<br>3. Notes field becomes editable textarea<br>4. Clear existing text and type: "Leaf showed yellow spots. Applied fungicide on Oct 11."<br>5. Click "Save Notes" button<br>6. Verify changes persist |
| **Expected Results** | - Clicking edit icon toggles textarea mode (borders visible)<br>- Textarea accepts text input with 500 character limit<br>- "Save Notes" button appears below textarea (initially disabled)<br>- Button enabled once text differs from saved version<br>- On click: API call to /api/history/notes/[id] with PATCH method<br>- Success response: note text displays normally (no longer in edit mode)<br>- Saved note persists on page refresh<br>- Character counter shows: "42/500" characters used<br>- Toast: "Notes updated successfully" |
| **Screenshot** | ![TC028](screenshots/TC028_edit_notes.png) |

---

## TC029: History Pagination Navigation

| Field | Details |
|---|---|
| **Test ID** | TC029 |
| **Test Case** | Pagination Controls and Page Navigation |
| **Description** | Verify that pagination controls allow users to navigate through pages of history predictions |
| **Components Involved** | HistoryPage.jsx, Pagination.jsx, API: /api/history?page=X |
| **Test Steps** | 1. Navigate to /history with 15+ predictions (3 pages)<br>2. Verify "Page 1 of 3" display<br>3. Click "Next" button<br>4. Verify page 2 loads (API called with ?page=2)<br>5. Click "Previous" button<br>6. Verify back on page 1<br>7. Click "Next" again, then "Last" button |
| **Expected Results** | - Page 1: "Previous" button disabled (greyed out)<br>- Page 1: "Next" button enabled<br>- Clicking Next: URL changes to /history?page=2<br>- Page 2: displays records 6-10<br>- Page 2: both Previous and Next enabled<br>- Clicking Previous: returns to page 1<br>- "Last" button jumps to page 3<br>- Page 3: "Next" button disabled, "Previous" enabled<br>- Each page API call takes 0.5-1s with loading indicator<br>- Card order consistent on revisit to page 1 |
| **Screenshot** | ![TC029](screenshots/TC029_pagination.png) |

---

## TC030: Compare Page - Select Two Predictions

| Field | Details |
|---|---|
| **Test ID** | TC030 |
| **Test Case** | Select and Load Two Predictions for Comparison |
| **Description** | Verify that users can select two different predictions from dropdowns on the Compare page and side-by-side view displays both |
| **Components Involved** | ComparePage.jsx, CompareDropdown.jsx, API: /api/compare?id1=X&id2=Y |
| **Test Steps** | 1. Navigate to /compare<br>2. Click first dropdown (Prediction 1)<br>3. Select "Early Blight - Oct 15, 2024 (ID: 5)"<br>4. Click second dropdown (Prediction 2)<br>5. Select "Late Blight - Oct 10, 2024 (ID: 3)"<br>6. Verify compare layout renders |
| **Expected Results** | - Dropdowns initially show placeholder: "Select a prediction..."<br>- Each dropdown lists user's predictions by disease + date<br>- Selecting prediction 1: card loads on left side<br>- Selecting prediction 2: card loads on right side<br>- API call: /api/compare?id1=5&id2=3<br>- Left card shows: Early Blight image, 87.3% confidence<br>- Right card shows: Late Blight image, 92.1% confidence<br>- "VS" label centered between cards<br>- Both dropdowns remain accessible to change selections<br>- No error if selections are the same (modal confirms: "Choose different predictions") |
| **Screenshot** | ![TC030](screenshots/TC030_compare_select.png) |

---

## TC031: Compare Summary Bar Accuracy Difference

| Field | Details |
|---|---|
| **Test ID** | TC031 |
| **Test Case** | Display Confidence Comparison Bar |
| **Description** | Verify that summary bar below comparison cards shows confidence difference and visual comparison |
| **Components Involved** | ComparePage.jsx, ComparisonSummary.jsx |
| **Test Steps** | 1. Navigate to /compare with two selected predictions<br>2. Prediction 1: 87.3% confidence<br>3. Prediction 2: 92.1% confidence<br>4. Observe summary bar display<br>5. Verify percentage labels and visual representation |
| **Expected Results** | - Summary bar title: "Confidence Comparison"<br>- Left bar: 87.3% filled (green)<br>- Right bar: 92.1% filled (green, slightly fuller)<br>- Difference label: "Difference: +4.8%"<br>- Bars equal width (150px each) for easy visual comparison<br>- Percentage text above each bar<br>- Summary statement: "Prediction 2 is more confident by 4.8%"<br>- Color coding: both green (both > 80%)<br>- If difference > 20%: highlight text in yellow warning<br>- Layout remains responsive on tablet view |
| **Screenshot** | ![TC031](screenshots/TC031_compare_summary_bar.png) |

---

## TC032: Compare Page - Empty State Handling

| Field | Details |
|---|---|
| **Test ID** | TC032 |
| **Test Case** | Empty State and Error Handling on Compare Page |
| **Description** | Verify proper UI display when user has no predictions or comparisons cannot be made |
| **Components Involved** | ComparePage.jsx, EmptyState.jsx |
| **Test Steps** | 1. Login with new user (0 predictions)<br>2. Navigate to /compare<br>3. Observe empty state message<br>4. Click "Start Predicting" link<br>5. Verify navigation to /predict |
| **Expected Results** | - Page displays empty state message: "No predictions to compare yet"<br>- Illustration/icon displayed<br>- Text: "Make at least 2 predictions to use the compare feature"<br>- Primary button: "Start Predicting" links to /predict<br>- Secondary button: "View History" links to /history<br>- If dropdowns don't have 2+ predictions: message shown<br>- Message: "You need at least 2 predictions to compare"<br>- Dropdowns disabled (greyed out) until sufficient predictions exist<br>- No error in console |
| **Screenshot** | ![TC032](screenshots/TC032_compare_empty_state.png) |

---

## TC033: Compare Confidence Difference Calculation

| Field | Details |
|---|---|
| **Test ID** | TC033 |
| **Test Case** | Confidence Difference Calculation Accuracy |
| **Description** | Verify that confidence difference is calculated correctly for various confidence score combinations |
| **Components Involved** | ComparePage.jsx, ComparisonLogic.js |
| **Test Steps** | 1. Compare predictions with 95% vs 50% confidence<br>2. Verify difference calculation: 95% - 50% = 45%<br>3. Compare predictions with 75.4% vs 75.2% confidence<br>4. Verify difference: 0.2%<br>5. Compare identical confidence predictions (88% vs 88%)<br>6. Verify difference: 0% |
| **Expected Results** | - Scenario 1 (95% vs 50%): Difference shows as "+45%" or "45% difference"<br>- Prediction with 95% highlighted as "more confident"<br>- Scenario 2 (75.4% vs 75.2%): Difference shown as "+0.2%"<br>- Scenario 3 (88% vs 88%): Difference shows "0% - Equally confident"<br>- All calculations use absolute value (no negative differences)<br>- Percentage text color: red for low confidence (<70%), yellow for medium (70-85%), green for high (>85%)<br>- Decimal precision: 1 decimal place (X.X%)<br>- No rounding errors |
| **Screenshot** | ![TC033](screenshots/TC033_confidence_difference.png) |

---

## TC034: Education Page Disease Cards Render

| Field | Details |
|---|---|
| **Test ID** | TC034 |
| **Test Case** | Display Disease Education Cards |
| **Description** | Verify that the Education page loads and displays all disease cards with proper information layout |
| **Components Involved** | EducationPage.jsx, DiseaseCard.jsx, API: /api/diseases |
| **Test Steps** | 1. Navigate to /education<br>2. Wait for API call to load diseases<br>3. Observe card grid layout<br>4. Verify 10 disease cards rendered<br>5. Inspect card content structure |
| **Expected Results** | - Page loads with heading: "Tomato Disease Encyclopedia"<br>- 10 disease cards display in 2 columns (responsive: 1 on mobile, 3 on desktop)<br>- Each card shows:<br>&nbsp;&nbsp;- Disease image (120x120px)<br>&nbsp;&nbsp;- Disease name<br>&nbsp;&nbsp;- 1-line description<br>&nbsp;&nbsp;- Severity badge (LOW/MEDIUM/HIGH)<br>- Example card: "Early Blight - Fungal infection causing brown spots | HIGH"<br>- Cards have hover effect (shadow/scale up)<br>- "Learn More" button clickable on each card<br>- Cards maintain equal height (300px)<br>- No overflow or truncated text<br>- API response time < 1.5s |
| **Screenshot** | ![TC034](screenshots/TC034_education_cards.png) |

---

## TC035: Education Severity Filter Functionality

| Field | Details |
|---|---|
| **Test ID** | TC035 |
| **Test Case** | Filter Disease Cards by Severity Level |
| **Description** | Verify that users can filter disease cards by severity (LOW, MEDIUM, HIGH) and results update correctly |
| **Components Involved** | EducationPage.jsx, SeverityFilter.jsx |
| **Test Steps** | 1. Navigate to /education with all 10 cards visible<br>2. Click severity filter dropdown<br>3. Select "HIGH"<br>4. Verify cards update<br>5. Select "MEDIUM"<br>6. Verify cards update<br>7. Clear filter to show all |
| **Expected Results** | - Filter dropdown shows: "All Severities"<br>- Options: All | LOW | MEDIUM | HIGH<br>- Selecting "HIGH": displays 4 cards (Early Blight, Late Blight, Septoria Leaf Spot, Bacterial Speck)<br>- "No results" message if filter returns 0 cards<br>- Selecting "MEDIUM": displays 4 cards (Powdery Mildew, Fusarium Wilt, Leaf Mold, Anthracnose)<br>- Selecting "LOW": displays 2 cards (Botrytis, Southern Blight)<br>- Filter updates instantly (< 100ms)<br>- Selected filter value persists on page<br>- Clear button resets to "All Severities"<br>- Card count display: "Showing 4 of 10" |
| **Screenshot** | ![TC035](screenshots/TC035_severity_filter.png) |

---

## TC036: Education Search Disease by Name

| Field | Details |
|---|---|
| **Test ID** | TC036 |
| **Test Case** | Search Disease Cards by Name |
| **Description** | Verify that the search functionality filters disease cards by name in real-time |
| **Components Involved** | EducationPage.jsx, SearchBar.jsx |
| **Test Steps** | 1. Navigate to /education<br>2. Click search input field<br>3. Type "blight"<br>4. Observe results update<br>5. Type "fusarium"<br>6. Verify single result<br>7. Clear search field |
| **Expected Results** | - Search input placeholder: "Search diseases by name..."<br>- Typing "blight": 3 cards display (Early Blight, Late Blight, Southern Blight)<br>- Search is case-insensitive<br>- Typing "fusarium": 1 card displays (Fusarium Wilt)<br>- Search results update in < 150ms (debounce: 300ms)<br>- Non-matching search "xyz": "No diseases match your search"<br>- Clear (X) button resets search<br>- Matching text highlighted in cards (optional enhancement)<br>- Search works with partial names: "leaf" returns 2 cards (Septoria Leaf Spot, Leaf Mold)<br>- Combined with filter: search overrides filter settings<br>- Result count: "Found 3 diseases" |
| **Screenshot** | ![TC036](screenshots/TC036_search_disease.png) |

---

## TC037: Education Disease Detail Modal

| Field | Details |
|---|---|
| **Test ID** | TC037 |
| **Test Case** | Open and Display Disease Detail Modal |
| **Description** | Verify that clicking "Learn More" on a disease card opens a modal with detailed information |
| **Components Involved** | DiseaseCard.jsx, DiseaseDetailModal.jsx, EducationPage.jsx |
| **Test Steps** | 1. Navigate to /education<br>2. Click "Learn More" on Early Blight card<br>3. Wait for modal to open<br>4. Verify modal content displays<br>5. Scroll through modal content (if needed)<br>6. Close modal and click another disease |
| **Expected Results** | - Modal opens with smooth fade-in animation (0.3s)<br>- Modal title: "Early Blight - Detailed Information"<br>- Sections displayed:<br>&nbsp;&nbsp;- Full description (200+ words)<br>&nbsp;&nbsp;- Symptoms (bulleted list: 4-5 items)<br>&nbsp;&nbsp;- Causes (text explanation)<br>&nbsp;&nbsp;- Affected parts (checkboxes: leaves, stems, fruit)<br>&nbsp;&nbsp;- Treatment options (3+ strategies)<br>- Disease image: 300x300px, centered<br>- Severity indicator with explanation<br>- "Close" button (X) in top-right<br>- Modal width: 700px (centered on screen)<br>- Max height: 80vh with internal scrolling<br>- Clicking outside modal area: modal closes<br>- No body scroll while modal open |
| **Screenshot** | ![TC037](screenshots/TC037_disease_detail_modal.png) |

---

## TC038: Contact Form - Empty Submit Validation

| Field | Details |
|---|---|
| **Test ID** | TC038 |
| **Test Case** | Contact Form Empty Field Validation |
| **Description** | Verify that submitting the contact form with empty required fields displays appropriate validation errors |
| **Components Involved** | ContactPage.jsx, ContactForm.jsx, FormValidation.js |
| **Test Steps** | 1. Navigate to /contact<br>2. Leave all fields empty<br>3. Click "Send Message" button<br>4. Observe validation errors<br>5. Fill name only<br>6. Try submit again |
| **Expected Results** | - Submit attempt 1 (all empty): displays errors:<br>&nbsp;&nbsp;- "Name is required" (under Name field)<br>&nbsp;&nbsp;- "Email is required" (under Email field)<br>&nbsp;&nbsp;- "Subject is required" (under Subject dropdown)<br>&nbsp;&nbsp;- "Message is required" (under Message textarea)<br>- Error text color: red (#E74C3C)<br>- Field borders turn red on error<br>- Submit button remains enabled<br>- Submit attempt 2 (name filled): errors for Email, Subject, Message persist<br>- Error messages displayed inline with field labels<br>- Form does not submit (no API call made)<br>- No console errors |
| **Screenshot** | ![TC038](screenshots/TC038_contact_empty_validation.png) |

---

## TC039: Contact Form - Invalid Email and Email Validation

| Field | Details |
|---|---|
| **Test ID** | TC039 |
| **Test Case** | Contact Form Email Format Validation |
| **Description** | Verify that the contact form validates email format and rejects invalid email addresses |
| **Components Involved** | ContactForm.jsx, FormValidation.js, EmailValidator.js |
| **Test Steps** | 1. Navigate to /contact<br>2. Fill form with:<br>&nbsp;&nbsp;- Name: "John Smith"<br>&nbsp;&nbsp;- Email: "invalid.email"<br>&nbsp;&nbsp;- Subject: "Bug Report"<br>&nbsp;&nbsp;- Message: "Found a bug"<br>3. Click "Send Message"<br>4. Observe error<br>5. Correct email to "john@example.com"<br>6. Submit again |
| **Expected Results** | - Invalid email "invalid.email": error "Invalid email format. Use: user@domain.com"<br>- Error displayed in red below email field<br>- Field border becomes red<br>- Submit button disabled while error exists<br>- Valid email formats accepted:<br>&nbsp;&nbsp;- john@example.com ✓<br>&nbsp;&nbsp;- user.name@company.co.uk ✓<br>&nbsp;&nbsp;- contact+tag@domain.com ✓<br>- Invalid formats rejected:<br>&nbsp;&nbsp;- user@domain (no TLD)<br>&nbsp;&nbsp;- @domain.com (no username)<br>&nbsp;&nbsp;- user @example.com (space)<br>- Validation occurs on blur and on submit<br>- Error clears when valid email entered<br>- Submit button re-enabled |
| **Screenshot** | ![TC039](screenshots/TC039_email_validation.png) |

---

## TC040: Contact Form - Message Length Validation

| Field | Details |
|---|---|
| **Test ID** | TC040 |
| **Test Case** | Contact Form Message Length Validation |
| **Description** | Verify that the contact form validates message length and prevents submission of messages that are too short or too long |
| **Components Involved** | ContactForm.jsx, FormValidation.js, MessageValidator.js |
| **Test Steps** | 1. Navigate to /contact<br>2. Fill name, email, subject correctly<br>3. Type message: "Hi" (2 characters)<br>4. Click "Send Message"<br>5. Observe error<br>6. Type message: "This is a detailed message about my feedback..." (47+ characters)<br>7. Submit form<br>8. Verify form clears after success |
| **Expected Results** | - Message field has min 10 characters, max 1000 characters<br>- "Hi" (2 chars) error: "Message must be at least 10 characters"<br>- Error displayed in red below textarea<br>- Character counter shows: "2/1000"<br>- Submit button disabled<br>- 10 character message: "Feedback p" (accepted, counter shows green "10/1000")<br>- Long message (1000+ chars) error: "Message cannot exceed 1000 characters"<br>- Character limit enforced (typing stops at 1000)<br>- Counter shows red at 1000+ chars<br>- Valid 47+ char message: "This is a detailed message about my feedback..." (accepted)<br>- Counter shows green: "47/1000"<br>- Form submits successfully<br>- API call: POST /api/contact with message data<br>- Success message: "Your message has been sent successfully"<br>- Form fields clear automatically |
| **Screenshot** | ![TC040](screenshots/TC040_message_validation.png) |

---

## Summary

**Total Test Cases:** 20 (TC021-TC040)

**Coverage Areas:**
- **Predict Page (TC021-TC024):** Upload, preview, results, confidence metrics
- **History Page (TC025-TC029):** Load, delete, notes, treatment modal, pagination
- **Compare Page (TC030-TC033):** Selection, summary bar, empty state, difference calculation
- **Education Page (TC034-TC037):** Card rendering, severity filter, search, detail modal
- **Contact Page (TC038-TC040):** Form validation (empty, email format, message length)

**Key Testing Principles:**
- Real-world user scenarios with exact values and data
- Component interactions and user workflows
- Form validation and error handling
- API integration points
- UI/UX responsiveness and accessibility
- Edge cases and error states
