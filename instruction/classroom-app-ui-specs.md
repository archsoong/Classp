# Classroom Interactive App - UI Feature Specifications

## 1. Application Structure Overview

### 1.1 Teacher Portal Pages
- Landing/Login Page
- Dashboard (Class List)
- Class Management Page
- Live Session View
- Question Bank
- Analytics Dashboard
- Account Settings

### 1.2 Student Portal Pages
- Join Class Page
- Waiting Room
- Active Question View
- Results Display
- Session History (optional)

---

## 2. Teacher Portal - Detailed Page Specifications

### 2.1 Teacher Login Page
**URL**: `/teacher/login`

**UI Components**:
- Logo and app name header
- Email input field
- Password input field
- "Remember me" checkbox
- "Sign In" button
- "Forgot Password?" link
- "Create Account" link

**Functionality**:
- Form validation (email format, password requirements)
- Error messaging for failed login attempts
- Redirect to dashboard upon successful login
- Session persistence based on "Remember me" selection

**Responsive Behavior**:
- Mobile: Stack form elements vertically
- Tablet/Desktop: Centered form with max-width 400px

---

### 2.2 Teacher Dashboard
**URL**: `/teacher/dashboard`

**UI Components**:
- Navigation bar with:
  - App logo
  - "My Classes" (active)
  - "Question Bank"
  - "Analytics"
  - Profile dropdown
- "Create New Class" button (primary CTA)
- Class cards grid displaying:
  - Class name
  - Class code
  - Number of enrolled students
  - Last activity date
  - "Enter Class" button
  - "Settings" icon
  - "Delete" icon

**Functionality**:
- Sort classes by: Name, Last Activity, Student Count
- Search/filter classes
- Click class card to enter class management
- Hover states for all interactive elements
- Confirmation modal for class deletion

**Empty State**:
- Illustration
- "No classes yet" message
- "Create Your First Class" button

---

### 2.3 Class Management Page
**URL**: `/teacher/class/{classId}`

**UI Components**:
- Back arrow to dashboard
- Class header:
  - Class name (editable)
  - Class code
  - "Copy Link" button
  - Active student count indicator
- Tab navigation:
  - "Live Session"
  - "Prepared Questions"
  - "Students"
  - "Settings"

#### 2.3.1 Live Session Tab
**Components**:
- "Start New Question" button
- Active question display (if any):
  - Question text
  - Question type indicator
  - Response counter (real-time)
  - "End Question" button
  - Live results preview
- Question history list

#### 2.3.2 Prepared Questions Tab
**Components**:
- "Create Question" button
- Question list with:
  - Question preview
  - Type badge
  - "Edit" button
  - "Duplicate" button
  - "Delete" button
  - "Publish Now" button

#### 2.3.3 Students Tab
**Components**:
- Student roster table:
  - Student identifier
  - Join date
  - Participation rate
  - Last active
- "Export Roster" button

---

### 2.4 Question Creation Modal
**Triggered by**: "Create Question" or "Start New Question" buttons

**UI Components**:
- Modal header with close button
- Question type selector:
  - Multiple Choice (radio button)
  - Short Answer (radio button)
- Question text input (rich text editor):
  - Bold, italic, underline formatting
  - Character counter
- For Multiple Choice:
  - Answer option inputs (min 2, max 6)
  - "Add Option" button
  - Correct answer checkbox(es)
  - Delete option buttons
- For Short Answer:
  - Expected answer length dropdown
  - Word limit setting
- Action buttons:
  - "Cancel"
  - "Save as Draft" (for prepared questions)
  - "Publish Now"

---

### 2.5 Live Question View (Teacher)
**URL**: `/teacher/class/{classId}/question/{questionId}`

**UI Components**:
- Question display area:
  - Question number
  - Question text
  - Timer (optional)
- Real-time statistics panel:
  - Total responses counter
  - Response rate percentage
  - Live updating chart/graph
- Student response feed (for short answers)
- Control panel:
  - "End Question" button
  - "Show Results to Students" toggle
  - "Next Question" button (if multiple prepared)

**Real-time Updates**:
- WebSocket connection for live data
- Response counter updates every 500ms
- Chart animation for new responses
- Connection status indicator

---

### 2.6 Results Display (Teacher View)
**Displayed after**: Ending a question

**UI Components**:
- Question text reminder
- For Multiple Choice:
  - Bar chart showing response distribution
  - Percentage and count for each option
  - Correct answer indicator
- For Short Answer:
  - Word cloud (if many similar responses)
  - Scrollable list of all responses
  - Filter/search responses
- Export options:
  - "Download as CSV"
  - "Save to Question Bank"
  - "Share Results"

---

## 3. Student Portal - Detailed Page Specifications

### 3.1 Join Class Page
**URL**: `/join` or `/join/{classCode}`

**UI Components**:
- Minimal header with app logo
- Large input field for class code
- "Join Class" button
- Optional: "Enter your name" field
- Help text: "Ask your teacher for the class code"

**Functionality**:
- Auto-focus on code input
- Real-time validation of code format
- Error messaging for invalid codes
- Loading state during join process
- Redirect to waiting room upon success

**Mobile Optimization**:
- Large touch targets
- Numeric keyboard for code input
- Full-screen experience

---

### 3.2 Student Waiting Room
**URL**: `/student/class/{classId}/waiting`

**UI Components**:
- Class name display
- Teacher name
- Waiting message: "Waiting for teacher to start..."
- Animated waiting indicator
- Student count in class
- "Leave Class" button

**Functionality**:
- Auto-refresh every 5 seconds
- Instant redirect when question is published
- Maintain connection indicator
- Rejoin capability if disconnected

---

### 3.3 Active Question View (Student)
**URL**: `/student/class/{classId}/question/{questionId}`

**UI Components**:
- Question number indicator
- Question text (large, readable font)
- For Multiple Choice:
  - Large, tappable option buttons
  - Selected state indication
  - "Submit Answer" button
- For Short Answer:
  - Text input area
  - Character/word counter
  - "Submit Answer" button
- Submission confirmation animation

**Functionality**:
- Disable interaction after submission
- Show "Answer Submitted" state
- Loading state during submission
- Error handling for failed submissions
- Auto-save draft for short answers

---

### 3.4 Results Display (Student View)
**URL**: `/student/class/{classId}/results/{questionId}`

**UI Components**:
- Question text reminder
- "Your Answer" highlight
- For Multiple Choice:
  - Bar chart showing class results
  - Your answer marked differently
  - Percentage for each option
- For Short Answer:
  - Your response displayed
  - Sample of other responses (anonymized)
  - Common themes/keywords
- "Waiting for next question..." message

---

## 4. Common UI Components

### 4.1 Navigation Bar (Teacher)
- Sticky positioning
- Consistent across all pages
- Mobile: Hamburger menu
- Desktop: Horizontal menu

### 4.2 Loading States
- Skeleton screens for content loading
- Spinner for action processing
- Progress bars for bulk operations

### 4.3 Error States
- Toast notifications for minor errors
- Full-page error for major issues
- Retry mechanisms
- Clear error messaging

### 4.4 Modals
- Dark overlay background
- Close on escape key
- Close on background click
- Centered positioning
- Smooth open/close animations

---

## 5. Responsive Design Specifications

### 5.1 Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

### 5.2 Teacher Portal Adaptations
- Mobile: Single column layouts, bottom navigation
- Tablet: Two column layouts where applicable
- Desktop: Full featured with sidebars

### 5.3 Student Portal Adaptations
- Mobile-first design
- Large touch targets (min 44px)
- Simplified navigation
- Full-screen question views

---

## 6. Interaction Patterns

### 6.1 Real-time Updates
- WebSocket for live data
- Optimistic UI updates
- Automatic reconnection
- Offline queue for actions

### 6.2 Animations
- Page transitions: 300ms ease
- Button hover: 150ms ease
- Chart updates: 500ms ease
- Success confirmations: 400ms bounce

### 6.3 Keyboard Navigation
- Tab order for all interactive elements
- Enter key for primary actions
- Escape key for cancel/close
- Arrow keys for option selection

---

## 7. Accessibility Requirements

### 7.1 WCAG 2.1 AA Compliance
- Minimum contrast ratio 4.5:1
- Focus indicators for all interactive elements
- Screen reader compatible markup
- Keyboard navigation support

### 7.2 Student Accessibility
- Large, clear fonts (min 16px)
- High contrast mode option
- Simple, uncluttered layouts
- Clear action labels

---

## 8. Performance Specifications

### 8.1 Page Load Times
- Initial load: < 3 seconds
- Subsequent navigation: < 1 second
- Question delivery: < 500ms
- Result updates: < 2 seconds

### 8.2 Optimization Strategies
- Lazy loading for images
- Code splitting by route
- CDN for static assets
- WebSocket connection pooling