import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: number = 0;

const selectedUserSlice = createSlice({
  name: "selectedUser",
  initialState: initialState,
  reducers: {
    selectedUserChange(state, action: PayloadAction<number>) {
      return action.payload;
    },
  },
});

export const { selectedUserChange } = selectedUserSlice.actions;
export default selectedUserSlice.reducer;