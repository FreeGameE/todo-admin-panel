import { RouterProvider } from "react-router-dom";
import { Flex, Typography } from "antd";
import { useCallback, useEffect, useState } from "react";
import { refreshAccessToken } from "./api/authApi";
import { authStatusChange } from "./store/authSlice";
import { useDispatch } from "react-redux";
import { AppRouter } from "./AppRouter";

function App() {
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useDispatch();

  const getTokens = useCallback(async () => {
    setLoading(true);
    const refreshToken = localStorage.getItem("refreshToken");

    if (refreshToken) {
      try {
        await refreshAccessToken();
        dispatch(authStatusChange(true));
      } catch (error: any) {
        console.error("Ошибка запроса:", error);
        if (error.response?.status === 401) {
          localStorage.removeItem("refreshToken");
          dispatch(authStatusChange(false));
        }
      }
    }

    setLoading(false);
  }, [dispatch]);

  useEffect(() => {
    getTokens();
  }, [getTokens]);

  return loading ? (
    <Flex justify="center" align="center" style={{ height: "100vh" }}>
      <Typography.Title level={3} style={{ color: "white" }}>
        Загрузка...
      </Typography.Title>
    </Flex>
  ) : (
    <RouterProvider router={AppRouter} />
  );
}

export default App;
