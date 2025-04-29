import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import SiderBar from "../SiderBar/SiderBar";
import { getUserProfile, refreshAccessToken } from "../../../api/authApi";
import { authStatusChange } from "../../../store/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useCallback, useEffect } from "react";
import { userRoleChange } from "../../../store/userRoleSlice";
import { RootState } from "../../../store/store";
import { Roles } from "../../../types/users";

const MainLayout = () => {
  const dispatch = useDispatch();
  const finalUserRoles = useSelector(
    (state: RootState) => state.userRole.roles
  );

  const checkAuth = useCallback(async () => {
    try {
      await refreshAccessToken();
      initUserRole();
    } catch (error: any) {
      console.log("checkAuth error");
      if (error.response?.status === 401) {
        dispatch(authStatusChange(false));
      }
    }
  }, [dispatch]);

  const initUserRole = async () => {
    try {
      console.log("Получение данных профиля...");
      const response = await getUserProfile();
      console.log("Данные профиля получены");
      const roles = response.roles;
      dispatch(userRoleChange(roles));
    } catch {}
  };

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    console.log(finalUserRoles);
    if (finalUserRoles.includes(Roles.ADMIN)) {
      console.log("Пользователь - админ");
    }
  }, [finalUserRoles]);

  return (
    <Layout>
      <SiderBar />
      <Layout
        style={{
          backgroundColor: "rgb(74, 137, 200)",
          minHeight: "100vh",
        }}
      >
        <Layout.Content>
          <Outlet />
        </Layout.Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
