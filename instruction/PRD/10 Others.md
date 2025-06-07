## 8. MVP Constraints

**Teacher Interface** (`/teacher/*`):
- Full classroom management capabilities
- Question creation and queue management
- Real-time participant list with names/IDs
- Live response tracking and analytics
- Class start/stop controls
- Data export functionality

**Student Interface** (`/student/*` or `/join/*`):
- Minimal UI focused on answering
- Only sees active question and results
- No access to participant list
- No classroom controls
- Anonymous result display only
- Access only via teacher-generated links

# Out of Scope
- User authentication (passwords, OAuth)
- Student account management
- Question templates/bank sharing between teachers
- Grading system
- File uploads
- Video/audio questions
- Breakout rooms
- Chat functionality
- Student history tracking across classes

# Limitations
- Single active question at a time
- No question editing after publish
- Basic analytics only
- English language only
- Desktop/tablet optimized (mobile functional)