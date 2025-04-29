import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Roles } from "../types/users";

const initialState: { roles: Roles[] } = {
  roles: [Roles.USER],
};

const userRoleSlice = createSlice({
  name: "userRole",
  initialState: initialState,
  reducers: {
    userRoleChange(state, action: PayloadAction<Roles[]>) {
      state.roles = action.payload;
    },
  },
});

export const { userRoleChange } = userRoleSlice.actions;
export default userRoleSlice.reducer;
