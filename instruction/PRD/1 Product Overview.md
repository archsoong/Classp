# 1. Product Overview

## 1.1 Purpose
A real-time classroom interaction platform that enables teachers to create interactive questions and receive instant feedback from students through a web interface.

## 1.2 Target Users
- **Primary**: Teachers conducting live classes (have dedicated accounts and full control)
- **Secondary**: Students participating in live classes (no accounts, join via links)

## 1.3 Core Value Proposition
Enable seamless, real-time interaction between teachers and students through instant polling, questions, and live result visualization.

## 1.4 Key Design Principles
- **Separate Interfaces**: Teachers have full management UI, students have simplified view
- **Link-based Access**: Students can only join via links generated after teacher starts class
- **Anonymous Participation**: Student responses are tracked but displayed anonymously
- **Real-time Sync**: All updates happen instantly across all connected devices
- **Unified Responsive Design**: For student pages, The desktop and mobile versions maintain identical layouts with only ratio adjustments. The desktop version intentionally looks like a scaled mobile interface, ensuring consistency across devices. Only header elements may have minor variations for different screen sizes. For teacher version, only desktop versions are available.

## 1.6 Technical Requirements

### Real-time Communication
- WebSocket connection for live updates
- Fallback to polling if WebSocket fails
- Message queue for reliability

### State Management
- Synchronized state between teacher and students
- Optimistic UI updates
- Conflict resolution for simultaneous actions

### Data Persistence
- Session storage for active classes
- Database storage for:
  - Teacher accounts
  - Class history
  - Question bank with options (JSON)
  - Participant data with responses (JSON)
- Student data is ephemeral (tied to class session only)
- Aggregated export data in JSON format

### Performance
- Support 100+ concurrent students per class
- Response latency < 500ms
- Page load time < 2 seconds

## 1.7 Success Metrics
- Average response time < 10 seconds
- 90%+ student participation rate
- < 1% connection drop rate
- Teacher satisfaction score > 4/5