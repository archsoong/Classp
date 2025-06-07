# 2. Flow & Feature Overview

## 2.1 System Overview
The system consists of 5 distinct pages with clear separation between teacher and student interfaces:

| Page Name | URL Path | User Type | Purpose |
|-----------|----------|-----------|----------|
| Login Page | `/login` | Teachers Only | Teacher authentication entry point |
| Teacher Dashboard | `/teacher/dashboard` | Teachers Only | Class management hub |
| Classroom Management | `/teacher/class/:id` | Teachers Only | Live class control center |
| Student Join Page | `/join/:code` | Students Only | Class entry point via link |
| Student Class Page | `/student/class/:code` | Students Only | Question answering interface |

## 2.2 UI Flows

### Teacher UI Flow
1. Login with Teacher ID (only teachers have accounts)
2. Dashboard → Create new class (status: preparing)
3. Enter class management page
4. Prepare questions → Add to queue
5. Click "Start Class" → Generates shareable link/code
6. Share link with students (via screen/email/chat)
7. Monitor real-time participant count
8. Publish question from queue
9. View live response count (no student names)
10. End question → Show anonymous results
11. Repeat for all questions
12. Click "End Class" → Links become invalid
13. Export aggregated data (JSON)

### Student UI Flow
1. Receive shareable link from teacher (only after class starts)
2. Open link → Directed to join page with code pre-filled
3. Enter name and student ID (no account needed)
4. If class not started → See "waiting" message
5. If class ended → See "class ended" message  
6. If class active → Join successfully
7. Wait for teacher to publish question
8. Answer question (can update before deadline)
9. Automatically see anonymous results when teacher ends question
10. Wait for next question
11. Repeat until class ends
12. Session terminated when teacher ends class

## 2.3 Core Features

### Authentication & Access
- **Teacher Login**: Simple ID-based login (no password required for MVP)
- **Student Join**: Enter name and ID when joining class (no account creation)
- Session persistence during class
- **Access Control**:
  - Teachers: Must have account, full access to teacher pages
  - Students: No account needed, access via links only

### Class Management
- **Class Creation**: Teachers create new classes with auto-generated class codes
- **Class States**:
  - Preparing: Class created but not started (no student access)
  - Active: Teacher started class, shareable link generated
  - Ended: Class finished, links show "class ended" message
- **Shareable Links**: Generated only after teacher clicks "Start Class"
- **Student Access**: Students can ONLY join active classes via link
- **Active Session Tracking**: Real-time participant count for teachers only

### Question System
- **Question Types**:
  - Multiple Choice (2-6 options)
  - Short Answer (text input, max 200 characters)
- **Question Queue**: Teachers can prepare multiple questions and publish sequentially
- **Question States**:
  - Draft (in queue, not visible to students)
  - Published (active, students can answer)
  - Ended (results visible, anonymous)
- **Answer Updates**: Students can modify answers until question ends
- **Real-time Sync**: Instant updates across all connected devices

### Response & Analytics
- **Live Response Collection**: Real-time answer submission with update capability
- **Response Storage**: Stored as JSON in participant record
- **Answer Tracking**: Only latest answer per question stored in participant's response JSON
- **Anonymous Results**: No student names shown in result display
- **Result Visualization**:
  - Bar charts with counts for multiple choice
  - Anonymous text list for short answers
  - Total response count and percentage display
- **Data Export**: JSON format with aggregated statistics only

## 2.4 Page Capabilities by User

### Teacher Pages

**1. Login Page (`/login`)**
- **Purpose**: Secure entry point for teachers only
- **What teachers can do**:
  - Enter teacher ID to access the system
  - Navigate to dashboard upon successful login
- **Key information displayed**:
  - App branding and welcome message
  - Login form
  - Simple, focused interface

**2. Teacher Dashboard (`/teacher/dashboard`)**
- **Purpose**: Central hub for all class management
- **What teachers can do**:
  - Create new classes with auto-generated codes
  - View all classes (active and past)
  - Access any class for management
  - Export historical class data as JSON
- **Key information displayed**:
  - List of all classes with status
  - Participant counts per class
  - Question counts per class
  - Class creation dates

**3. Classroom Management Page (`/teacher/class/:id`)**
- **Purpose**: Real-time class orchestration and monitoring
- **What teachers can do**:
  - Start/end the class session
  - Copy and share join links (when class is active)
  - Create and queue multiple questions
  - Publish questions one at a time
  - Monitor live participant count and list
  - Track real-time response rates
  - End questions and view results
  - Export complete class data
- **Key information displayed**:
  - Class details (name, code, status)
  - Live participant list with names/IDs
  - Question queue with full management
  - Active question with response tracking
  - Anonymous aggregated results
  - Historical question results

### Student Pages

**4. Student Join Page (`/join/:code`)**
- **Purpose**: Controlled entry point for students via teacher-shared links
- **What students can do**:
  - Enter their name and student ID
  - Join active classes only
  - See status if class hasn't started
  - See notification if class has ended
- **Key information displayed**:
  - Class join form (if active)
  - Class status messages
  - Simple, focused interface

**5. Student Class Page (`/student/class/:code`)**
- **Purpose**: Streamlined question-answering experience
- **What students can do**:
  - Answer multiple choice questions
  - Submit short text answers
  - Update answers before teacher ends question
  - View anonymous results automatically
  - Wait for next question
- **Key information displayed**:
  - Current question only
  - Answer submission status
  - Anonymous result charts/lists
  - Total participant count
  - Connection status