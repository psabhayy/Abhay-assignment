# Live Polling System

A real-time polling system built with React, Redux, Express.js, and Socket.io, featuring separate interfaces for teachers and students.

## Features

### Teacher Features
- Create and manage polls with custom questions
- Configure poll duration (10-120 seconds)
- Add multiple choice options (2-6 options)
- Mark correct answers
- View live polling results in real-time
- Remove students from active sessions
- View participants list
- Chat with students
- View poll history (up to 25 polls)

### Student Features
- Enter name on first visit (persisted per browser tab)
- Submit answers to active polls
- View live polling results after submission
- Maximum 60 seconds to answer (configurable by teacher)
- See countdown timer
- Chat with teacher and other students
- Automatic results display after time expires

## Technology Stack

- **Frontend**: React 18 + Vite
- **State Management**: Redux Toolkit
- **Backend**: Express.js
- **Real-time Communication**: Socket.io
- **Styling**: Custom CSS (following Figma design)

## Project Structure

```
Abhay/
├── client/              # React frontend
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── hooks/       # Custom hooks (useSocket)
│   │   ├── services/    # Socket.io service
│   │   ├── store/       # Redux store and slices
│   │   ├── App.jsx      # Main app component
│   │   └── main.jsx     # Entry point
│   ├── .env.example     # Environment variables template
│   └── package.json
├── server/              # Express backend
│   ├── src/
│   │   └── index.js     # Main server file
│   ├── .env.example     # Environment variables template
│   └── package.json
└── README.md
```

## Installation

### Prerequisites
- Node.js (v20.19.0 or >=22.12.0 recommended)
- npm or yarn

### Setup

1. **Clone the repository**
   ```bash
   cd /path/to/Abhay
   ```

2. **Install server dependencies**
   ```bash
   cd server
   npm install
   cp .env.example .env
   ```

3. **Install client dependencies**
   ```bash
   cd ../client
   npm install
   cp .env.example .env
   ```

4. **Configure environment variables**
   
   Server (`.env`):
   ```
   PORT=4000
   CLIENT_ORIGIN=http://localhost:5173
   ```
   
   Client (`.env`):
   ```
   VITE_SERVER_URL=http://localhost:4000
   ```

## Running the Application

### Development Mode

1. **Start the backend server** (Terminal 1):
   ```bash
   cd server
   npm run dev
   ```
   Server runs on http://localhost:4000

2. **Start the frontend** (Terminal 2):
   ```bash
   cd client
   npm run dev
   ```
   Client runs on http://localhost:5173

### Production Mode

1. **Build the client**:
   ```bash
   cd client
   npm run build
   ```

2. **Start the server**:
   ```bash
   cd server
   npm start
   ```

## Usage

### As a Teacher
1. Open http://localhost:5173
2. Select "I'm a Teacher" role
3. Create a poll by entering:
   - Question text
   - Poll duration (10-120 seconds)
   - Answer options (2-6 options)
   - Mark the correct answer
4. Click "Ask Question"
5. View live results as students answer
6. Manage participants (view list, kick students)
7. View poll history

### As a Student
1. Open http://localhost:5173 in a new tab/window
2. Select "I'm a Student" role
3. Enter your name
4. Wait for teacher to ask a question
5. Select your answer and submit
6. View results after submission or timeout
7. Chat with teacher and peers

## API Endpoints

### REST Endpoints
- `GET /health` - Server health check
- `GET /polls/history` - Get poll history
- `GET /polls/current` - Get current active poll

### Socket.io Events

#### Teacher Events
- `teacher:join` - Join as teacher
- `teacher:ask-question` - Create new poll
- `teacher:kick-student` - Remove student
- `teacher:request-history` - Request poll history
- `teacher:state` - Receive teacher state updates
- `teacher:welcome` - Initial state on connection

#### Student Events
- `student:join` - Join as student
- `student:answer` - Submit answer
- `student:kicked` - Notification of removal
- `poll:answer-confirmed` - Answer confirmation

#### Shared Events
- `poll:question` - New question broadcast
- `poll:results` - Results broadcast
- `poll:history` - Poll history data
- `chat:message` - Chat messages

## Features Implementation

✅ Real-time polling with Socket.io
✅ Teacher can create polls with configurable duration
✅ Students can submit answers
✅ Live results visualization with percentages
✅ Countdown timer (configurable by teacher)
✅ Student kick functionality
✅ Chat system for teacher-student interaction
✅ Poll history (not stored locally, in-memory)
✅ Responsive UI following Figma design
✅ Role-based authentication (teacher/student)
✅ Persistent student identity per tab
✅ Automatic results display on timeout

## Deployment

### Backend (Render/Railway/Heroku)
1. Push code to GitHub
2. Connect repository to hosting platform
3. Set environment variables:
   - `PORT=4000`
   - `CLIENT_ORIGIN=<your-frontend-url>`
4. Deploy

### Frontend (Vercel/Netlify)
1. Build the client: `npm run build`
2. Deploy `dist` folder
3. Set environment variable:
   - `VITE_SERVER_URL=<your-backend-url>`

## Notes

- Poll history is stored in-memory (up to 25 polls)
- Chat history is stored in-memory (up to 100 messages)
- Student identity persists per browser tab using localStorage
- Teachers can manage one active poll at a time
- Polls auto-close when all students answer or time expires

## Support

For issues or questions, please check the code documentation or create an issue in the repository.
