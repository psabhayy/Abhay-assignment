import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  role: null,
  studentId: null,
  studentName: null,
  isKicked: false
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setRole: (state, action) => {
      state.role = action.payload;
    },
    setStudent: (state, action) => {
      state.studentId = action.payload.id;
      state.studentName = action.payload.name;
    },
    setKicked: (state) => {
      state.isKicked = true;
    },
    resetUser: () => initialState
  }
});

export const { setRole, setStudent, setKicked, resetUser } = userSlice.actions;
export default userSlice.reducer;
