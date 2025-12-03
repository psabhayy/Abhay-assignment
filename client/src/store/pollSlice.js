import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentQuestion: null,
  pollHistory: [],
  students: [],
  selectedAnswer: null,
  hasAnswered: false,
  results: null,
  timeRemaining: null
};

const pollSlice = createSlice({
  name: 'poll',
  initialState,
  reducers: {
    setCurrentQuestion: (state, action) => {
      state.currentQuestion = action.payload;
      state.hasAnswered = false;
      state.selectedAnswer = null;
      state.results = null;
      if (action.payload) {
        const now = Date.now();
        state.timeRemaining = Math.max(0, Math.floor((action.payload.expiresAt - now) / 1000));
      } else {
        state.timeRemaining = null;
      }
    },
    setTimeRemaining: (state, action) => {
      state.timeRemaining = action.payload;
    },
    setPollHistory: (state, action) => {
      state.pollHistory = action.payload;
    },
    addToPollHistory: (state, action) => {
      state.pollHistory.unshift(action.payload);
    },
    setStudents: (state, action) => {
      state.students = action.payload;
    },
    setSelectedAnswer: (state, action) => {
      state.selectedAnswer = action.payload;
    },
    setHasAnswered: (state, action) => {
      state.hasAnswered = action.payload;
    },
    setResults: (state, action) => {
      state.results = action.payload;
      state.currentQuestion = null;
      state.timeRemaining = null;
    },
    clearCurrentQuestion: (state) => {
      state.currentQuestion = null;
      state.selectedAnswer = null;
      state.hasAnswered = false;
      state.timeRemaining = null;
    },
    resetPoll: () => initialState
  }
});

export const {
  setCurrentQuestion,
  setTimeRemaining,
  setPollHistory,
  addToPollHistory,
  setStudents,
  setSelectedAnswer,
  setHasAnswered,
  setResults,
  clearCurrentQuestion,
  resetPoll
} = pollSlice.actions;

export default pollSlice.reducer;
