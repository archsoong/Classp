
# 3. UI Specifications

## 1. Login Page (`/login`)

### UI Components
| Component Type | Label/Content | Action/Trigger |
|----------------|---------------|----------------|
| Image | App Logo | None |
| Heading (H1) | "Classp" | None |
| Text Input | Placeholder: "Enter Teacher ID" | Validates on change |
| Button (Primary) | "Login" | Triggers `handleTeacherLogin()` |
| Text (Error) | Dynamic error message | Shows on validation failure |

### Functions
| Function Name | Description | Database Tables/Data |
|---------------|-------------|---------------------|
| `handleTeacherLogin()` | Validates teacher ID and creates session | **Read**: `teachers` (teacher_id) |
| `validateTeacherId()` | Checks ID format (alphanumeric, 3-20 chars) | None |
| `createTeacherSession()` | Stores teacher ID in session/cookie | **Update**: `teachers` (last_login) |
| `redirectToDashboard()` | Navigate to teacher dashboard | None |

### UI Specifications
```
- Container: 400px width, centered
- Card: 8px black border, 8px offset shadow
- Input: 60px height, 4px border
- Primary Button: Blue (#0066FF) bg, black text
- Error Text: Red (#FF0000), bold
- Spacing: 24px between elements
```

## 2. Teacher Dashboard (`/teacher/dashboard`)

### UI Components
| Component Type | Label/Content | Action/Trigger |
|----------------|---------------|----------------|
| Heading (H1) | "Welcome, {teacher_id}" | None |
| Button (Primary) | "+ Create New Class" | Triggers `showCreateClassModal()` |
| Tab Group | "Active Classes" / "Past Classes" | Triggers `filterClasses()` |
| Card Grid | Class cards list | None |
| **Per Class Card:** | | |
| Card Container | Class info wrapper | Click triggers `navigateToClass()` |
| Text (Title) | "{class_name}" | None |
| Text (Code) | "Code: {class_code}" | None |
| Text (Meta) | "{date} • {participant_count} students" | None |
| Text (Meta) | "{question_count} questions" | None |
| Button (Secondary) | "Manage" | Navigate to `/teacher/class/{id}` |
| Button (Ghost) | "Export Data" | Triggers `exportClassData()` |
| **Modal Components:** | | |
| Modal Overlay | Semi-transparent background | Click triggers `closeModal()` |
| Text Input | Placeholder: "Class Name" | Updates state |
| Button (Primary) | "Create Class" | Triggers `createNewClass()` |
| Button (Secondary) | "Cancel" | Triggers `closeModal()` |

### Functions
| Function Name | Description | Database Tables/Data |
|---------------|-------------|---------------------|
| `loadTeacherClasses()` | Fetches all classes for logged-in teacher | **Read**: `classes` (all fields WHERE teacher_id) |
| `showCreateClassModal()` | Opens class creation modal | None |
| `createNewClass()` | Creates new class with generated code | **Create**: `classes` (class_name, class_code, teacher_id, status) |
| `generateClassCode()` | Generates unique 8-char code | **Read**: `classes` (class_code for uniqueness check) |
| `filterClasses()` | Filters between active/past classes | None (client-side) |
| `navigateToClass()` | Opens class management page | None |
| `exportClassData()` | Generates JSON export of class data | **Read**: `classes`, `questions`, `class_participants` (all fields for specific class_id) |

### UI Specifications
```
- Header: Full width, 80px height
- Create Button: Fixed top-right, pink (#FF0066) bg
- Card Grid: Responsive grid, maintains card proportions
- Class Cards: White bg, 6px border, hover lift effect
- Modal: Centered, max-width 500px, scales down on mobile
- Tab underline: 4px thick, blue (#0066FF)
- Unified layout: Same visual structure on all devices
```

## 3. Classroom Management Page (`/teacher/class/:id`)

### UI Components

#### Header Section
| Component Type | Label/Content | Action/Trigger |
|----------------|---------------|----------------|
| Heading (H1) | "{class_name}" | None |
| Text (Code) | "Class Code: {class_code}" | Copy to clipboard on click |
| Badge (Live) | "👥 {participant_count} Students" | Auto-updates via WebSocket |
| Button (Primary) | "Start Class" / "End Class" | Triggers `toggleClassStatus()` |
| Status Indicator | "⚫ Preparing" / "🟢 Active" / "🔴 Ended" | None |
| Button (Secondary) | "Copy Join Link" | Copies shareable link (only when active) |
| **Participant List (Teacher Only):** | | |
| Dropdown Toggle | "View Participants ▼" | Triggers `toggleParticipantList()` |
| List (Scrollable) | "{student_name} ({student_id})" | Real-time updated list |
| Text (Small) | "Joined {time} ago" | Per participant |

#### Question Queue Panel (Left Side)
| Component Type | Label/Content | Action/Trigger |
|----------------|---------------|----------------|
| Heading (H2) | "Question Queue" | None |
| Button (Primary) | "+ Add Question" | Triggers `showQuestionForm()` |
| List (Draggable) | Question queue items | Drag triggers `reorderQueue()` |
| **Per Queue Item:** | | |
| Card (Draggable) | Question preview | None |
| Text (Number) | "#{queue_order}" | None |
| Text (Preview) | "{question_text}" (truncated) | None |
| Badge | "MC" or "SA" | None |
| Button (Icon) | "✏️" | Triggers `editQuestion()` |
| Button (Icon) | "🗑️" | Triggers `deleteQuestion()` |
| Button (Primary) | "Publish" | Triggers `publishQuestion()` |

#### Question Creation Form (Toggleable)
| Component Type | Label/Content | Action/Trigger |
|----------------|---------------|----------------|
| Select Dropdown | "Question Type" | Changes form fields |
| Textarea | Placeholder: "Enter your question..." | Updates state |
| **For Multiple Choice:** | | |
| Input Array | Option inputs (2-6) | Updates options array |
| Button (Icon) | "+" | Triggers `addOption()` |
| Button (Icon) | "-" | Triggers `removeOption()` |
| **Form Actions:** | | |
| Button (Primary) | "Add to Queue" | Triggers `saveToQueue()` |
| Button (Secondary) | "Cancel" | Triggers `hideQuestionForm()` |

#### Active Question Display (Center)
| Component Type | Label/Content | Action/Trigger |
|----------------|---------------|----------------|
| Heading (H2) | "Active Question" | None |
| Card (Highlighted) | Question content | None |
| Text (Question) | "{question_text}" | None |
| Progress Bar | Response progress | Auto-updates |
| Text (Counter) | "{response_count}/{total_participants}" | Live update |
| Timer | Time elapsed | Auto-increments |
| Button (Danger) | "End Question" | Triggers `endQuestion()` |

#### Results Display (Center, after Active Question Display Ended)
| Component Type | Label/Content | Action/Trigger |
|----------------|---------------|----------------|
| Heading (H2) | "Results" | None |
| Tab Group | "Current" / "History" | Triggers `switchResultView()` |
| **For Multiple Choice:** | | |
| Bar Chart | Response distribution | None |
| Legend | Option text with counts | None |
| **For Short Answer:** | | |
| List (Scrollable) | Anonymous answers | None |
| Text Item | "{answer_text}" | None |
| **Summary Stats:** | | |
| Text (Stat) | "Total Responses: {count}" | None |
| Text (Stat) | "Response Rate: {percentage}%" | None |

### Functions
| Function Name | Description | Database Tables/Data |
|---------------|-------------|---------------------|
| `loadClassData()` | Loads class info and questions | **Read**: `classes` (all fields), `questions` (all fields WHERE class_id) |
| `toggleClassStatus()` | Starts or ends class | **Update**: `classes` (status, started_at, ended_at) |
| `generateShareableLink()` | Creates student join link | Uses class_code to build URL |
| `copyJoinLink()` | Copies link to clipboard | None |
| `connectWebSocket()` | Establishes real-time connection | None |
| `trackParticipants()` | Updates participant count and list | **Read**: `class_participants` (all fields WHERE class_id) |
| `toggleParticipantList()` | Shows/hides participant details | None |
| `showQuestionForm()` | Displays question creation form | None |
| `saveToQueue()` | Adds question to queue | **Create**: `questions` (all fields with status='draft') |
| `reorderQueue()` | Updates question order | **Update**: `questions` (queue_order) |
| `editQuestion()` | Loads question for editing | **Read**: `questions` (all fields WHERE question_id) |
| `deleteQuestion()` | Removes question from queue | **Delete**: `questions` (WHERE question_id AND status='draft') |
| `publishQuestion()` | Makes question active | **Update**: `questions` (status='published', published_at) |
| `trackResponses()` | Real-time response counting | **Read**: `class_participants` (responses JSON) |
| `endQuestion()` | Closes question for responses | **Update**: `questions` (status='ended', ended_at) |
| `calculateResults()` | Aggregates response data | **Read**: `class_participants` (responses JSON for specific question) |
| `exportResults()` | Exports class data as JSON | **Read**: All tables for class_id |

### UI Specifications
```
- Layout: Flexible grid that maintains proportions
- Header: Fixed top, white bg, bottom border
- Panels: Scrollable, responsive height
- Queue Items: Draggable with grab cursor
- Active Question: Yellow (#FFF59D) background
- Charts: Canvas-based, responsive
- Real-time updates: Subtle pulse animation
- Borders: 4px black on major sections
- Unified design: Same layout structure across all devices
```

## 4.4 Student Join Page (`/join` or `/join/:code`)

### UI Components
| Component Type | Label/Content | Action/Trigger |
|----------------|---------------|----------------|
| Image | App Logo | None |
| Heading (H1) | "Join Class" | None |
| **Active Class State:** | | |
| Text Input | Placeholder: "Your Name" | Validates on change |
| Text Input | Placeholder: "Student ID" | Validates on change |
| Text Input | Placeholder: "Class Code" | Pre-filled if from link |
| Button (Primary) | "Join Class" | Triggers `handleJoinClass()` |
| **Ended Class State:** | | |
| Icon | "🔴" | None |
| Heading (H2) | "Class Has Ended" | None |
| Text | "This class is no longer active" | None |
| Button (Secondary) | "Back to Home" | Navigate to `/login` |
| **Not Started State:** | | |
| Icon | "⏳" | None |
| Heading (H2) | "Class Not Started" | None |
| Text | "Please wait for your teacher to start the class" | None |
| Button (Secondary) | "Refresh" | Triggers `checkClassStatus()` |
| **Common Elements:** | | |
| Link | "← Back to Home" | Navigate to `/login` |
| Alert (Error) | Dynamic error message | Shows on failure |

### Functions
| Function Name | Description | Database Tables/Data |
|---------------|-------------|---------------------|
| `extractClassCode()` | Gets code from URL params | None |
| `checkClassStatus()` | Verifies class state | **Read**: `classes` (status WHERE class_code) |
| `renderClassState()` | Shows appropriate UI based on status | None |
| `validateInputs()` | Checks all fields are filled | None |
| `handleJoinClass()` | Creates participant record | **Create**: `class_participants` (class_id, student_name, student_id) |
| `checkDuplicateStudent()` | Prevents duplicate joins | **Read**: `class_participants` (WHERE class_id AND student_id) |
| `createStudentSession()` | Stores student info in session | None |
| `redirectToClass()` | Navigate to class page | None |

### UI Specifications
```
- Container: 400px max-width, centered, scales with viewport
- Card: White bg, 8px border, large shadow
- State Icons: 80px size, centered
- Inputs: 60px height, 4px border, 16px font
- Primary Button: Green (#00FF66) bg
- Error/Info States: Full card replacement
- Responsive: Maintains same layout, only scales proportionally
```

## 4.5 Student Class Page (`/student/class/:code`)

### UI Components

#### Header
| Component Type | Label/Content | Action/Trigger |
|----------------|---------------|----------------|
| Text (Small) | "Class: {class_name}" | None |
| Text (Small) | "Hi, {student_name}" | None |
| Badge | "🟢 Connected" / "🔴 Disconnected" | None |

#### Waiting State
| Component Type | Label/Content | Action/Trigger |
|----------------|---------------|----------------|
| Animation | Pulsing dots or spinner | None |
| Heading (H2) | "Waiting for question..." | None |
| Text | "Your teacher will start soon" | None |

#### Active Question State
| Component Type | Label/Content | Action/Trigger |
|----------------|---------------|----------------|
| Card (Main) | Question container | None |
| Heading (H2) | "Question {number}" | None |
| Text (Question) | "{question_text}" | None |
| **For Multiple Choice:** | | |
| Radio Group | Option list | Select triggers `selectOption()` |
| Radio Button | "{option_text}" | Updates selection |
| **For Short Answer:** | | |
| Textarea | Placeholder: "Type your answer..." | Updates on change |
| Text (Counter) | "{chars}/200" | None |
| **Answer Actions:** | | |
| Button (Primary) | "Submit Answer" | Triggers `submitAnswer()` |
| Button (Secondary) | "Update Answer" | Triggers `updateAnswer()` |
| Badge (Success) | "✓ Answer Submitted" | Shows after submit |

#### Results Display State
| Component Type | Label/Content | Action/Trigger |
|----------------|---------------|----------------|
| Card (Results) | Results container | None |
| Heading (H2) | "Results" | None |
| **For Multiple Choice:** | | |
| Bar Chart | Response distribution | None |
| Text (Option) | "{option}: {count} votes" | None |
| Highlight | Your answer highlighted | None |
| **For Short Answer:** | | |
| List (Scrollable) | All answers (anonymous) | None |
| Card (Answer) | "{answer_text}" | None |
| Badge | "Your answer" indicator | None |
| **Summary:** | | |
| Text (Large) | "{total} students responded" | None |
| Text | "Waiting for next question..." | None |

#### Error State
| Component Type | Label/Content | Action/Trigger |
|----------------|---------------|----------------|
| Alert (Error) | "Connection lost" | None |
| Button (Primary) | "Reconnect" | Triggers `reconnectWebSocket()` |

### Functions
| Function Name | Description | Database Tables/Data |
|---------------|-------------|---------------------|
| `loadStudentInfo()` | Gets student data from session | None |
| `connectToClass()` | Establishes WebSocket connection | None |
| `listenForQuestions()` | Receives published questions | Real-time data stream |
| `displayQuestion()` | Shows current question | None |
| `selectOption()` | Stores selected MC option | Local state only |
| `submitAnswer()` | Sends first answer | **Update**: `class_participants` (responses JSON) |
| `updateAnswer()` | Updates existing answer | **Update**: `class_participants` (responses JSON) |
| `receiveResults()` | Gets aggregated results | Real-time broadcast |
| `displayResults()` | Shows anonymous results | None |
| `highlightOwnAnswer()` | Marks student's choice | Local comparison |
| `resetForNextQuestion()` | Clears current state | None |
| `handleDisconnect()` | Shows error state | None |
| `reconnectWebSocket()` | Attempts reconnection | None |

### UI Specifications
```
- Container: Max 600px width, centered, responsive scaling
- Header: Fixed top, 60px height (may collapse on mobile)
- Main Area: Padding 20px, scroll if needed
- Question Card: White bg, 6px border
- Options: 50px min-height, hover effect
- Submit Button: Full width, 60px height
- Results Chart: Responsive height, maintains aspect ratio
- Touch-optimized: Larger tap targets maintained
- Animations: Smooth transitions between states
- Unified design: Desktop mirrors mobile layout
```


## 3.6 Neo-Brutalism Design System

### 1. Visual Elements
- **Borders**: 4-8px solid black borders
- **Shadows**: Offset box shadows (8px right, 8px down)
- **Layout**: Unified responsive design - desktop intentionally mirrors mobile
- **Colors**: High contrast palette
  - Primary: Electric blue (#0066FF)
  - Secondary: Hot pink (#FF0066)
  - Success: Lime green (#00FF66)
  - Error: Bright red (#FF0000)
  - Warning: Orange (#FF9900)
  - Background: Off-white (#FFFEF5)
  - Text: Pure black (#000000)
  - Muted: Medium gray (#666666)

### 2. Typography
- **Headings**: Bold, sans-serif (Inter Black)
- **Body**: Regular sans-serif (Inter Regular)
- **Data**: Monospace (JetBrains Mono)

### 3. Interactive Elements
- Hover states with color inversion
- Active states with reduced shadows
- Disabled states with dotted borders

### 4. Responsive Design Philosophy
- **Unified Layout**: Desktop version intentionally looks like a scaled mobile interface
- **Consistent Experience**: Same visual hierarchy and component arrangement across all devices
- **Proportional Scaling**: Elements maintain their relative sizes and positions
- **Minimal Variations**: Only header elements may have minor responsive adjustments
- **No Layout Shifts**: Users see the same interface structure regardless of device
- **Touch-First**: All interactions designed for touch, work equally well with mouse