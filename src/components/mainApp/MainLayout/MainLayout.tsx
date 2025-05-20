import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import SiderBar from "../SiderBar/SiderBar";
import { refreshAccessToken } from "../../../api/authApi";
import { authStatusChange } from "../../../store/authSlice";
import { useDispatch } from "react-redux";
import { useCallback, useEffect } from "react";

const MainLayout = () => {
  const dispatch = useDispatch();

  const checkAuth = useCallback(async () => {
    try {
      await refreshAccessToken();
    } catch (error: any) {
      console.log("checkAuth error");
      if (error.response?.status === 401) {
        dispatch(authStatusChange(false));
      }
    }
  }, [dispatch]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

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
