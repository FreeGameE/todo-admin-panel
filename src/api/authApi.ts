import axios from "axios";
import { UserRegistration, AuthData, ProfileRequest } from "../types/auth";
import { tokenManager } from "../services/tokenManager";

const api = axios.create({
  baseURL: "https://easydev.club/api/v1",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json; charset=UTF-8",
  },
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = tokenManager.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (401 === error.response.status && !originalRequest._retry) {

      try {
        originalRequest._retry = true;
        const data = await refreshAccessToken();
        tokenManager.setToken(data.accessToken);
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${data.accessToken}`;
        originalRequest.headers["Authorization"] = `Bearer ${data.accessToken}`;
        return api(originalRequest);
      } catch (error) {
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
    
  }
);

export const registrationUser = async (registrationData: UserRegistration) => {
  try {
    const response = await api.post("/auth/signup", registrationData);

    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const authUser = async (authData: AuthData) => {
  try {
    const response = await api.post("/auth/signin", authData);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    const response = await api.post("user/logout", null);
    console.log(response);
  } catch (error) {
    console.error("Ошибка запроса:", error);
  }
};

export const refreshAccessToken = async () => {
  try {
    const response = await api.post("/auth/refresh", {
      refreshToken: localStorage.getItem("refreshToken"),
    });
    tokenManager.setToken(response.data.accessToken);
    localStorage.setItem("refreshToken", response.data.refreshToken);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const getUserProfile = async () => {
  try {
    const response = await api.get("/user/profile");
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const putUserProfile = async (changedUserData: ProfileRequest) => {
  try {
    await api.put("/user/profile", changedUserData);
  } catch (error: any) {
    throw error;
  }
};
