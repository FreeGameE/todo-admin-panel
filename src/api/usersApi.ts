import axios from "axios";
import { UserFilters, UserRequest, UserRolesRequest } from "../types/users";
import { tokenManager } from "../services/tokenManager";
import { refreshAccessToken } from "./authApi";

const api = axios.create({
  baseURL: "https://easydev.club/api/v1",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json; charset=UTF-8",
  },
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

export const getUsers = async (userFilters: UserFilters) => {
  try {
    const response = await api.get("/admin/users", { params: userFilters });
    return response;
  } catch (error: any) {
    throw error;
  }
};

export const getManagedUserProfile = async (id: number) => {
  try {
    const response = await api.get(`/admin/users/${id}`);
    return response;
  } catch (error: any) {
    throw error;
  }
};

export const updateUserPermissions = async (
  id: number,
  userRolesRequest: UserRolesRequest
) => {
  try {
    const response = await api.post(
      `/admin/users/${id}/rights`,
      userRolesRequest
    );
    return response;
  } catch (error: any) {
    console.error(error);
    throw error;
  }
};

export const updateUserData = async (id: number, userRequest: UserRequest) => {
  try {
    const response = await api.put(`/admin/users/${id}`, userRequest);
    return response;
  } catch (error: any) {
    throw error;
  }
};

export const banUser = async (id: number) => {
  try {
    const response = await api.post(`/admin/users/${id}/block`);
    return response;
  } catch (error: any) {
    throw error;
  }
};

export const unbanUser = async (id: number) => {
  try {
    const response = await api.post(`/admin/users/${id}/unblock`);
    return response;
  } catch (error: any) {
    throw error;
  }
};

export const deleteUser = async (id: number) => {
  try {
    const response = await api.delete(`/admin/users/${id}`);
    return response;
  } catch (error: any) {
    throw error;
  }
};
