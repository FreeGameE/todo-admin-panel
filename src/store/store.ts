import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import userRoleReducer from "./userRoleSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    userRole: userRoleReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
