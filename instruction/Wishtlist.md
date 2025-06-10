# Wishlist Feature - Product Requirements Document

## 1. Feature Overview

### 1.1 Purpose
The Wishlist feature enables teachers to suggest new features, improvements, and ideas for Classroom Interactive while providing a democratic voting system to prioritize development efforts based on community needs.

### 1.2 Target Users
- **Primary**: Logged-in teachers with existing Classroom Interactive accounts
- **Secondary**: Product development team (for prioritization insights)

### 1.3 Core Value Proposition
- **Community-Driven Development**: Teachers directly influence product roadmap
- **Democratic Prioritization**: Most-wanted features rise to the top through voting
- **Engagement**: Teachers feel heard and invested in the platform's evolution
- **Product Intelligence**: Development team gets clear signals on user priorities

## 2. Feature Requirements

### 2.1 Wish Creation System

#### 2.1.1 Monthly Wish Allocation
- **Limitation**: Each teacher can submit **only 1 wish per calendar month**
- **Reset**: Wish quota resets on the 1st of each month at 00:00 UTC
- **No Accumulation**: Unused wishes do not carry over to the next month
- **Override**: Previous month's unsubmitted wish is automatically discarded when new month begins

#### 2.1.2 Wish Submission Process
- **Access**: Available only to logged-in teachers
- **Form Fields**:
  - **Title**: 3-100 characters, required
  - **Description**: 10-500 characters, required, supports basic markdown
  - **Category**: Dropdown selection (Questions, UI/UX, Analytics, Integration, Other)
  - **Priority**: Personal priority (Low, Medium, High) - for internal reference only
- **Validation**: Duplicate detection based on title similarity (>80% match)
- **Status Tracking**: Draft → Submitted → Under Review → Planned/Rejected

#### 2.1.3 Wish Status Indicator
- **Available This Month**: Green indicator showing "✓ You can submit 1 wish this month"
- **Already Used**: Red indicator showing "✗ Wish used this month. Next available: [Date]"
- **Countdown**: Show days remaining until next wish becomes available
- **Encouragement**: "Your voice matters! Use your monthly wish to shape Classroom Interactive."

### 2.2 Voting System

#### 2.2.1 Vote Mechanics
- **Limitation**: Each teacher can vote **once per wish**
- **Vote Types**: Upvote only (simplified system)
- **Vote Tracking**: Permanent record, no vote changes/withdrawals allowed
- **Vote Display**: Show total vote count per wish
- **Sorting**: Wishes sorted by vote count (highest first) by default

#### 2.2.2 Voting with Comments
- **Requirement**: Optional comment when voting (0-200 characters)
- **Comment Types**:
  - Support reasoning ("This would save me 10 minutes per class")
  - Implementation suggestions ("Could work with existing quiz feature")
  - Use case examples ("Perfect for large lecture halls")
- **Comment Display**: Show all comments under each wish, attributed to "Teacher #123" (anonymized)
- **Comment Moderation**: Basic profanity filter, no editing after submission

#### 2.2.3 Vote Restrictions
- **Self-Voting**: Teachers cannot vote on their own wishes
- **Authentication**: Must be logged in to vote
- **Rate Limiting**: Maximum 10 votes per day per teacher (prevent spam)
- **Visual Feedback**: Clear indication when vote is successfully cast

### 2.3 Wishlist Display & Navigation

#### 2.3.1 Wishlist Page Layout
- **Header Section**:
  - Current month's wish status indicator
  - "Submit New Wish" button (if available)
  - Filter and sort controls
- **Wish Cards**: Grid layout displaying:
  - Wish title and description (preview)
  - Vote count with upvote button
  - Category badge
  - Submission date
  - Status indicator (Under Review, Planned, etc.)
  - Comment count
- **Pagination**: 20 wishes per page

#### 2.3.2 Sorting & Filtering Options
- **Sort Options**:
  - Most Voted (default)
  - Most Recent
  - Oldest First
  - Most Commented
- **Filter Options**:
  - By Category
  - By Status
  - By Date Range
  - My Wishes Only
  - Wishes I Voted On

#### 2.3.3 Wish Detail View
- **Full Description**: Complete wish text with formatting
- **Voting Section**: Vote button with count and comment form
- **Comments Section**: All comments with timestamps
- **Related Wishes**: Algorithm-suggested similar wishes
- **Status Updates**: Development team updates and timeline

## 3. User Interface Specifications

### 3.1 Wish Status Banner
```
┌─────────────────────────────────────────────────────────────┐
│ 🌟 Your Monthly Wish                                        │
│ ✓ Available: You can submit 1 wish this month             │
│ ⏰ Resets in 23 days                                       │
│ [ Submit New Wish ]                                        │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 Wish Card Component
```
┌─────────────────────────────────────────────────────────────┐
│ [Category Badge] Better Mobile UI                    ▲ 47   │
│                                                     ☐ Vote │
│ The mobile interface needs better touch targets...          │
│                                                            │
│ 👤 Teacher #456 • 3 days ago • 💬 12 comments             │
│ 🏷️ Status: Under Review                                    │
└─────────────────────────────────────────────────────────────┘
```

### 3.3 Vote with Comment Form
```
┌─────────────────────────────────────────────────────────────┐
│ Cast Your Vote                                              │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Add comment (optional)                                  │ │
│ │ This would help with my 200+ student lectures...       │ │
│ │                                                         │ │
│ └─────────────────────────────────────────────────────────┘ │
│ Character count: 45/200                                     │
│ [ Cancel ] [ ▲ Vote & Comment ]                            │
└─────────────────────────────────────────────────────────────┘
```

## 4. Technical Requirements

### 4.1 Database Schema

#### `wishes` Table
| Column | Data Type | Constraints | Description |
|--------|-----------|-------------|-------------|
| wish_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique wish identifier |
| teacher_id | VARCHAR(20) | FOREIGN KEY → teachers(teacher_id) | Wish creator |
| title | VARCHAR(100) | NOT NULL | Wish title |
| description | TEXT | NOT NULL | Full wish description |
| category | ENUM('questions', 'ui_ux', 'analytics', 'integration', 'other') | NOT NULL | Wish category |
| priority | ENUM('low', 'medium', 'high') | DEFAULT 'medium' | Creator's priority |
| status | ENUM('draft', 'submitted', 'under_review', 'planned', 'in_progress', 'completed', 'rejected') | DEFAULT 'submitted' | Development status |
| vote_count | INT | DEFAULT 0 | Cached vote total |
| comment_count | INT | DEFAULT 0 | Cached comment total |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Submission time |
| month_year | VARCHAR(7) | NOT NULL | Format: "2024-01" for tracking monthly limit |
| INDEX | (teacher_id, month_year) | | Quick monthly limit check |
| INDEX | (status, vote_count DESC) | | Efficient sorting |

#### `wish_votes` Table
| Column | Data Type | Constraints | Description |
|--------|-----------|-------------|-------------|
| vote_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique vote identifier |
| wish_id | INT | FOREIGN KEY → wishes(wish_id) | Voted wish |
| teacher_id | VARCHAR(20) | FOREIGN KEY → teachers(teacher_id) | Voting teacher |
| comment | TEXT | NULL | Optional vote comment |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Vote time |
| UNIQUE | (wish_id, teacher_id) | | Prevent duplicate votes |

### 4.2 Business Logic Functions

#### Monthly Wish Tracking
```javascript
function canTeacherWishThisMonth(teacherId) {
    const currentMonth = getCurrentMonthYear(); // "2024-01"
    const existingWish = getWishByTeacherAndMonth(teacherId, currentMonth);
    return existingWish === null;
}

function getNextWishAvailableDate(teacherId) {
    const nextMonth = getNextMonthYear();
    return `${nextMonth}-01`;
}
```

#### Vote Validation
```javascript
function canTeacherVote(teacherId, wishId) {
    const wish = getWishById(wishId);
    
    // Cannot vote on own wish
    if (wish.teacher_id === teacherId) return false;
    
    // Cannot vote twice
    const existingVote = getVote(wishId, teacherId);
    if (existingVote) return false;
    
    // Check daily vote limit
    const todayVotes = getTodayVoteCount(teacherId);
    if (todayVotes >= 10) return false;
    
    return true;
}
```

## 5. User Experience Flow

### 5.1 Monthly Wish Submission Flow
1. Teacher logs in and navigates to Wishlist
2. System checks monthly wish availability
3. **If available**: Show green status + "Submit New Wish" button
4. **If used**: Show red status + countdown to next month
5. Teacher clicks "Submit New Wish" (if available)
6. Form validation and duplicate checking
7. Wish submitted → confirmation message
8. Status updates to "already used this month"

### 5.2 Voting Flow
1. Teacher browses wishlist (sorted by votes)
2. Finds interesting wish → clicks to view details
3. **If eligible to vote**: Shows vote button + comment form
4. **If already voted**: Shows "You voted on this" message
5. **If own wish**: Shows "Your wish" indicator (no vote option)
6. Teacher adds optional comment and votes
7. Vote confirmed → wish vote count updates immediately
8. Comment appears in wish comments section

### 5.3 Admin Development Flow
1. Development team reviews wishes monthly
2. Update wish status based on roadmap decisions
3. Teachers receive notifications when their wishes get updates
4. Completed features reference original wishes for closure