# Classroom Interactive App

A modern, neo-brutalist styled classroom interaction application built with React and TypeScript. This MVP allows teachers to create classes, publish questions, and view real-time responses from students.

## Features

### 🎓 For Teachers
- **Dashboard**: Create and manage multiple classes
- **Live Classroom**: Publish questions and view real-time responses
- **Question Types**: Multiple choice and text-based questions
- **Real-time Analytics**: See response rates and answer distributions
- **Question History**: Review previously asked questions

### 👨‍🎓 For Students
- **Simple Join**: Enter class with a 6-character code
- **Interactive Answering**: Respond to multiple choice or text questions
- **Live Results**: See how your answers compare to classmates
- **Real-time Updates**: Automatic question delivery and result display

## Design

The app features a **neo-brutalist design** with:
- Bold, chunky borders and shadows
- High contrast colors
- Space Mono monospace font
- Interactive button animations
- Mobile-responsive layout

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ClassroomIA
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

### For Teachers

1. **Login**: Enter your teacher ID and click "I'M A TEACHER"
2. **Create Class**: Click "+ CREATE NEW CLASS" and enter a class name
3. **Share Code**: Copy the generated 6-character class code to share with students
4. **Enter Class**: Click "ENTER CLASS" to start a live session
5. **Create Questions**: 
   - Type your question
   - Choose between Multiple Choice [MC] or Text [TEXT]
   - For MC: Add 2-4 answer options
   - Click "PUBLISH QUESTION"
6. **Monitor Responses**: Watch real-time response rates and answer distributions
7. **End Question**: Click "END QUESTION" to stop collecting responses and show results

### For Students

1. **Login**: Enter your student ID and click "I'M A STUDENT"
2. **Join Class**: Enter the 6-character class code provided by your teacher
3. **Wait**: You'll see a waiting screen until the teacher publishes a question
4. **Answer**: Select your answer (MC) or type your response (Text)
5. **Submit**: Click "SUBMIT ANSWER"
6. **View Results**: See how your answer compares to other students
7. **Repeat**: Wait for the next question

## Technical Architecture

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for utility styling
- **Custom CSS** for neo-brutalist components
- **Vite** for fast development and building

### State Management
- React hooks (useState, useEffect)
- Session-based authentication (no persistent storage)
- In-memory data storage for MVP

### Components Structure
```
src/
├── pages/
│   ├── LoginPage.tsx
│   ├── TeacherDashboard.tsx
│   ├── TeacherClassroom.tsx
│   └── StudentClassroom.tsx
├── styles/
│   └── neo-brutalism.css
├── App.tsx
└── main.tsx
```

## MVP Limitations

This is an MVP version with the following limitations:
- No persistent user accounts or database
- No real-time WebSocket connections (simulated)
- No question bank or reuse functionality
- No detailed analytics or export features
- Single question at a time
- No rich media support (images/videos)

## Future Enhancements

- User registration and authentication system
- Real-time WebSocket connections
- Question templates and reuse
- Detailed analytics dashboard
- Multiple concurrent questions
- Rich media support
- Timed questions
- Grade tracking and export
- Mobile app versions

## Browser Support

- Chrome/Edge (last 2 versions)
- Safari (last 2 versions)
- Firefox (last 2 versions)
- Mobile browsers (iOS Safari, Chrome Android)

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style

The project uses:
- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting (recommended)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For questions or issues, please create an issue in the repository or contact the development team.
