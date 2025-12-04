<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->
- [x] Verify that the copilot-instructions.md file in the .github directory is created.

- [x] Clarify Project Requirements

- [x] Scaffold the Project

- [x] Customize the Project

- [x] Install Required Extensions

- [x] Compile the Project

- [x] Create and Run Task

- [x] Launch the Project

- [x] Ensure Documentation is Complete

## Project Summary

This is a Live Polling System built with:
- **Frontend**: React 18 + Vite + Redux Toolkit
- **Backend**: Express.js + Socket.io
- **Features**: Real-time polling, teacher/student roles, chat, kick functionality, poll history

### Running the Application

**Backend** (Terminal 1):
```bash
cd server
npm run dev
```
Server runs on http://localhost:4000

**Frontend** (Terminal 2):
```bash
cd client
npm run dev
```
Client runs on http://localhost:5174

### Key Components
- `RoleSelection.jsx` - Initial role selection (teacher/student)
- `StudentNameEntry.jsx` - Student name input
- `TeacherDashboard.jsx` - Teacher interface for creating polls
- `PollQuestion.jsx` - Active poll display
- `PollResults.jsx` - Results visualization
- `ChatPopup.jsx` - Real-time chat interface
- `WaitingScreen.jsx` - Student waiting state
- `KickedScreen.jsx` - Removed student notification

### Socket.io Events
- Teacher: `teacher:join`, `teacher:ask-question`, `teacher:kick-student`
- Student: `student:join`, `student:answer`
- Shared: `poll:question`, `poll:results`, `chat:message`

Work through each checklist item systematically.
Keep communication concise and focused.
Follow development best practices.
