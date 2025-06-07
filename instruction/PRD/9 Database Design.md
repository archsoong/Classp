
# 9. Database Schema (MySQL)

## 9.1 Tables Overview

### `teachers` Table
| Column | Data Type | Constraints | Description |
|--------|-----------|-------------|-------------|
| teacher_id | VARCHAR(20) | PRIMARY KEY | Unique teacher identifier |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Account creation time |
| last_login | TIMESTAMP | NULL | Last login timestamp |

### `classes` Table
| Column | Data Type | Constraints | Description |
|--------|-----------|-------------|-------------|
| class_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique class identifier |
| class_code | VARCHAR(8) | UNIQUE, NOT NULL | Shareable class code |
| class_name | VARCHAR(100) | NOT NULL | Class display name |
| teacher_id | VARCHAR(20) | FOREIGN KEY → teachers(teacher_id) | Class creator |
| status | ENUM('preparing', 'active', 'ended') | DEFAULT 'preparing' | Class state |
| started_at | TIMESTAMP | NULL | Class start time |
| ended_at | TIMESTAMP | NULL | Class end time |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation time |

### `questions` Table
| Column | Data Type | Constraints | Description |
|--------|-----------|-------------|-------------|
| question_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique question identifier |
| class_id | INT | FOREIGN KEY → classes(class_id) | Associated class |
| question_text | TEXT | NOT NULL | Question content |
| question_type | ENUM('multiple_choice', 'short_answer') | NOT NULL | Question format |
| options | JSON | NULL | Array of options for multiple choice |
| queue_order | INT | NOT NULL | Position in queue |
| status | ENUM('draft', 'published', 'ended') | DEFAULT 'draft' | Question state |
| published_at | TIMESTAMP | NULL | When published |
| ended_at | TIMESTAMP | NULL | When ended |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation time |

**Example `options` JSON structure for multiple choice:**
```json
[
  {"id": 1, "text": "Option A"},
  {"id": 2, "text": "Option B"},
  {"id": 3, "text": "Option C"},
  {"id": 4, "text": "Option D"}
]
```

### `class_participants` Table
| Column | Data Type | Constraints | Description |
|--------|-----------|-------------|-------------|
| participant_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique participation record |
| class_id | INT | FOREIGN KEY → classes(class_id) | Class joined |
| student_name | VARCHAR(50) | NOT NULL | Student display name |
| student_id | VARCHAR(20) | NOT NULL | Student identifier |
| responses | JSON | DEFAULT '{}' | All responses for this participant |
| joined_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Join time |
| left_at | TIMESTAMP | NULL | Leave time |
| INDEX | (class_id, student_id) | | Quick lookup |

**Example `responses` JSON structure:**
```json
{
  "question_1": {
    "answer": "Option A",
    "option_id": 1,
    "submitted_at": "2024-01-15 10:30:00",
    "updated_at": "2024-01-15 10:31:00"
  },
  "question_2": {
    "answer": "This is my short answer text",
    "submitted_at": "2024-01-15 10:35:00",
    "updated_at": "2024-01-15 10:35:00"
  }
}
```

## 9.2 Indexes
- `classes`: INDEX on `teacher_id`, `status`
- `questions`: INDEX on `class_id`, `status`, `queue_order`
- `class_participants`: INDEX on `class_id`

## 9.3 Database Relationships
```
teachers (1) ← → (N) classes (via teacher_id)
classes (1) ← → (N) questions
classes (1) ← → (N) class_participants
```

## 9.4 Data Export Structure
When exporting class data to JSON, the structure will be:
```json
{
  "class_info": {
    "class_id": 123,
    "class_name": "Math 101",
    "class_code": "ABC123",
    "teacher_id": "teacher001",
    "total_participants": 25,
    "duration": "45 minutes"
  },
  "questions": [
    {
      "question_id": 1,
      "question_text": "What is 2+2?",
      "question_type": "multiple_choice",
      "total_responses": 24,
      "results": {
        "Option A": 2,
        "Option B": 20,
        "Option C": 1,
        "Option D": 1
      }
    }
  ]
}
```