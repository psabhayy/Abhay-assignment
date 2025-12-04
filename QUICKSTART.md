# Quick Start Guide

## Live Polling System - Quick Setup

### 1. Install Dependencies

```bash
# Backend
cd server
npm install

# Frontend (in new terminal)
cd client
npm install
```

### 2. Configure Environment

```bash
# Server .env
PORT=4000
CLIENT_ORIGIN=http://localhost:5174

# Client .env
VITE_SERVER_URL=http://localhost:4000
```

### 3. Run the Application

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```
✅ Server starts on http://localhost:4000

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```
✅ Client starts on http://localhost:5174

### 4. Test the Application

1. **Open as Teacher:**
   - Visit http://localhost:5174
   - Click "I'm a Teacher"
   - Create a poll with question and options
   - Set duration (10-120 seconds)
   - Click "Ask Question"

2. **Open as Student (new tab):**
   - Visit http://localhost:5174 in new tab
   - Click "I'm a Student"
   - Enter your name
   - Wait for poll or answer active question

3. **Test Features:**
   - ✅ Create and submit polls
   - ✅ Real-time results
   - ✅ Countdown timer
   - ✅ Chat between teacher/students
   - ✅ Kick students (teacher)
   - ✅ View participants
   - ✅ Poll history

### Common Issues

**Port 5173 in use:**
- Vite will automatically use port 5174
- Update server .env: `CLIENT_ORIGIN=http://localhost:5174`

**Socket connection issues:**
- Ensure backend is running on port 4000
- Check CORS settings in server/src/index.js

**nanoid import error:**
- Using nanoid@3.3.7 for CommonJS compatibility
- Run: `npm install nanoid@3.3.7` in server directory

### Project Structure

```
Abhay/
├── server/          # Backend (Express + Socket.io)
│   ├── src/
│   │   └── index.js # Main server file
│   └── package.json
├── client/          # Frontend (React + Redux)
│   ├── src/
│   │   ├── components/
│   │   ├── store/
│   │   ├── hooks/
│   │   └── services/
│   └── package.json
└── README.md
```

### Available Scripts

**Server:**
- `npm run dev` - Start with nodemon (auto-reload)
- `npm start` - Production start

**Client:**
- `npm run dev` - Development server
- `npm run build` - Production build
- `npm run preview` - Preview production build

### Next Steps

- Test all features (polls, chat, kick, history)
- Deploy to Render/Vercel for hosting
- Review code and customize styling
- Add additional features as needed
