# Classroom Interactive App - MVP Feature Specifications

## 1. MVP Application Structure

### Total Pages: 4
1. **Login Page** - Simple ID-based entry for both teachers and students
2. **Teacher Dashboard** - Create classes and view all class statistics
3. **Teacher Classroom** - Manage live sessions, questions, and view results
4. **Student Classroom** - Join, answer questions, and view results

---

## 2. Login Page
**URL**: `/login`

### UI Layout
```
+----------------------------------+
|          App Logo                |
|     Classroom Interactive        |
|                                  |
|   [Enter Your ID]                |
|                                  |
|   [I'm a Teacher] [I'm a Student]|
|                                  |
+----------------------------------+
```

### Components
- **Header Section**
  - App logo (centered)
  - App name

- **Login Form**
  - Single input field: "Enter Your ID" (text input)
  - Two large buttons side by side:
    - "I'm a Teacher" (primary button)
    - "I'm a Student" (secondary button)

### Functionality
- No password required
- ID validation: alphanumeric, 3-20 characters
- Teacher login → redirect to `/teacher/dashboard`
- Student login → show class code input → redirect to `/student/classroom/{classCode}`
- Store user type and ID in session

### Mobile Behavior
- Stack buttons vertically on mobile
- Large touch targets (min 48px height)

---

## 3. Teacher Dashboard
**URL**: `/teacher/dashboard`

### UI Layout
```
+----------------------------------+
| Teacher: [ID]          [Logout]  |
|----------------------------------|
|                                  |
| [+ Create New Class]             |
|                                  |
| My Classes                       |
| +------------------------------+ |
| | Class: Math 101              | |
| | Code: ABC123  Students: 25   | |
| | Last Active: 2 hours ago     | |
| | Questions: 15  Avg Rate: 85% | |
| | [Enter Class]                | |
| +------------------------------+ |
| | Class: Science 202           | |
| | Code: XYZ789  Students: 30   | |
| | Last Active: Yesterday       | |
| | Questions: 8   Avg Rate: 72% | |
| | [Enter Class]                | |
| +------------------------------+ |
+----------------------------------+
```

### Components

#### Header Bar
- Teacher ID display
- Logout button

#### Create Class Section
- Single prominent button: "+ Create New Class"
- Inline creation: Clicking button shows input field below
  - Class name input
  - "Create" and "Cancel" buttons
  - Auto-generates 6-character class code

#### Class List
- **Class Cards** showing:
  - Class name (bold, large)
  - Class code with copy button
  - Total students enrolled
  - Last activity timestamp
  - Total questions asked
  - Average response rate
  - "Enter Class" button

### Functionality
- Sort classes by last activity (most recent first)
- Click "Enter Class" → redirect to `/teacher/classroom/{classCode}`
- Copy class code to clipboard with toast confirmation
- Delete class option (hold to delete on mobile, right-click on desktop)

### Empty State
- Message: "No classes yet. Create your first class to get started!"
- Arrow pointing to create button

---

## 4. Teacher Classroom
**URL**: `/teacher/classroom/{classCode}`

### UI Layout
```
+----------------------------------------+
| ← Back | Math 101 (ABC123) | 15 Active |
|----------------------------------------|
| Create Question          | History     |
| +------------------------------------+ |
| | What is 2+2?                    MC | |
| | O 2  O 3  O 4  O 5                | |
| | [Publish Question]                 | |
| +------------------------------------+ |
|                                        |
| Live Status                            |
| +------------------------------------+ |
| | Question: What is 2+2?             | |
| | Responses: 12/15 (80%)             | |
| | [=============    ] 12 responses   | |
| |                                    | |
| | Results:                           | |
| | 4: ████████████ 10 (83%)          | |
| | 3: ██ 1 (8%)                      | |
| | 2: ██ 1 (8%)                      | |
| | 5: 0 (0%)                         | |
| |                                    | |
| | [End Question] [Show to Students]  | |
| +------------------------------------+ |
|                                        |
| Previous Questions                     |
| +------------------------------------+ |
| | Q1: What is 2+2? | 15/15 | 2min ago| |
| | Q2: Capital of France? | 14/15 | 5m| |
| +------------------------------------+ |
+----------------------------------------+
```

### Components

#### Navigation Header
- Back arrow to dashboard
- Class name and code
- Live student counter (green dot for active)
- Share button (copies join link)

#### Question Creation Panel
- **Toggle**: "Create Question" / "History" tabs
- **Question Input**:
  - Text area for question (auto-resize)
  - Question type toggle: [MC] [Text]
- **For Multiple Choice**:
  - 4 option inputs (labeled A, B, C, D)
  - Add/remove options (2-6 range)
- **For Short Answer**:
  - Placeholder: "Students will type their answer"
- **Publish Button**: Large, primary color

#### Live Status Panel (Shows when question is active)
- Question text display
- Real-time response counter with progress bar
- Live updating results:
  - **Multiple Choice**: Horizontal bar chart
  - **Short Answer**: Scrolling list of responses
- Control buttons:
  - "End Question" (red)
  - "Show to Students" toggle

#### Question History (Shows when no active question)
- List of previous questions showing:
  - Question number and text (truncated)
  - Response rate
  - Time ago
- Click to expand and see full results

### Functionality
- Auto-save question draft every 5 seconds
- WebSocket for real-time updates
- Keyboard shortcut: Enter to publish (with confirmation)
- Results update every 500ms when question is live
- "Show to Students" automatically ends collection

### Mobile Adaptations
- Swipe between Create/History tabs
- Bottom sheet for question creation
- Collapsible panels for space efficiency

---

## 5. Student Classroom
**URL**: `/student/classroom/{classCode}`

### UI Layout

#### State 1: Waiting
```
+----------------------------------+
| Math 101                         |
| Teacher: Mr. Smith               |
|                                  |
|     Waiting for question...      |
|         ⏳                       |
|                                  |
| Connected: 15 students           |
|                                  |
| [Leave Class]                    |
+----------------------------------+
```

#### State 2: Active Question
```
+----------------------------------+
| Math 101                Question 3|
|----------------------------------|
|                                  |
| What is 2+2?                     |
|                                  |
| [ ] 2                            |
| [ ] 3                            |
| [✓] 4                            |
| [ ] 5                            |
|                                  |
| [Submit Answer]                  |
|                                  |
+----------------------------------+
```

#### State 3: Results
```
+----------------------------------+
| Math 101              Question 3 |
|----------------------------------|
| What is 2+2?                     |
|                                  |
| Results:                         |
| 4: ████████████ 10 (83%) ← You  |
| 3: ██ 1 (8%)                    |
| 2: ██ 1 (8%)                    |
| 5: 0 (0%)                        |
|                                  |
| ✓ Your answer was correct!       |
|                                  |
| Waiting for next question...     |
+----------------------------------+
```

### Components

#### Waiting State
- Class name (large, centered)
- Teacher name
- Animated waiting indicator
- Connected students count
- "Leave Class" button (bottom)

#### Active Question State
- Question number (top right)
- Question text (large font)
- **For Multiple Choice**:
  - Large, tappable option buttons
  - Radio button selection
  - Selected state (highlighted)
- **For Short Answer**:
  - Large text input area
  - Character counter
- Submit button (disabled until answered)

#### Results State  
- Question and your answer reminder
- Results visualization:
  - Bar chart for multiple choice
  - Sample responses for short answer
- Your answer highlighted
- Correct/incorrect indicator (if applicable)
- Return to waiting state message

### Functionality
- Auto-submit when teacher ends question
- Prevent multiple submissions
- Visual feedback on submit (success animation)
- Connection status indicator (small dot)
- Auto-reconnect if connection lost
- Haptic feedback on mobile for interactions

### Mobile Optimizations
- Full-screen question view
- Large touch targets (min 48px)
- Swipe up to submit (alternative)
- Landscape support for better readability

---

## 6. MVP Technical Specifications

### State Management
- Session-based authentication (no database users)
- LocalStorage for student class history
- WebSocket for real-time updates
- In-memory storage for active sessions

### Data Flow
1. Teacher creates class → generates unique code
2. Students join with code → added to session
3. Teacher publishes question → broadcast to students
4. Students submit → aggregate on server
5. Teacher ends question → broadcast results
6. Cycle repeats

### Responsive Breakpoints
- Mobile: < 768px (stack layouts)
- Tablet/Desktop: ≥ 768px (side-by-side where applicable)

### Performance Targets
- Page load: < 2 seconds
- Question delivery: < 500ms  
- Result aggregation: < 1 second
- Auto-reconnect: < 3 seconds

### Browser Support
- Chrome/Edge (last 2 versions)
- Safari (last 2 versions)
- Firefox (last 2 versions)
- Mobile browsers (iOS Safari, Chrome Android)

---

## 7. MVP Limitations & Future Enhancements

### Current Limitations
- No persistent user accounts
- No question bank/reuse
- No detailed analytics
- No export functionality
- Single question at a time
- No rich media support

### Planned Enhancements
- User registration system
- Question templates
- Detailed analytics dashboard  
- Multiple concurrent questions
- Image/video in questions
- Timed questions
- Grade tracking