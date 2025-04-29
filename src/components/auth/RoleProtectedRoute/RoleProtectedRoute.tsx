import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { JSX } from "react";
import { Roles } from "../../../types/users";

interface Props {
  children: JSX.Element;
  allowedRoles: Roles[]
}

const RoleProtectedRoute = ({ children, allowedRoles }: Props) => {
  const finalUserRoles = useSelector(
    (state: RootState) => state.userRole.roles
  );

  const hasAccess = finalUserRoles.some(role => allowedRoles.includes(role));

  return hasAccess ? children : <Navigate to="/" replace />;
};

export default RoleProtectedRoute;
