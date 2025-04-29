import MainLayout from "./components/mainApp/MainLayout/MainLayout";
import TodoListPage from "./components/mainApp/TodoListPage/TodoListPage";
import ProfilePage from "./components/mainApp/ProfilePage/ProfilePage";
import AuthPage from "./components/auth/AuthPage/AuthPage";
import PrivateRoute from "./components/auth/PrivateRoute/PrivateRoute";
import { createBrowserRouter, Navigate } from "react-router-dom";
import UsersPage from "./components/mainApp/UsersPage/UsersPage";
import RoleProtectedRoute from "./components/auth/RoleProtectedRoute/RoleProtectedRoute";
import { Roles } from "./types/users";

export const AppRouter = createBrowserRouter([
  {
    path: "/",
    element: (
      <PrivateRoute>
        <MainLayout />
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        element: <TodoListPage />,
      },
      {
        path: "profile",
        element: <ProfilePage />,
      },
      {
        path: "users",
        element: (
          <RoleProtectedRoute allowedRoles={[Roles.ADMIN, Roles.MODERATOR]}>
            <UsersPage />
          </RoleProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "/login",
    element: <AuthPage />,
  },
  {
    path: "/register",
    element: <AuthPage />,
  },
  {
    path: "/register-success",
    element: <AuthPage />,
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);
