import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import userRoleReducer from "./userRoleSlice";
import selectedUserReducer from "./selectedUserSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    userRole: userRoleReducer,
    selectedUser: selectedUserReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
