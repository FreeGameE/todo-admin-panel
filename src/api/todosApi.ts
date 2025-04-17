import axios from "axios";
import {TodoRequest} from "../types/todos"

const api = axios.create({
  baseURL: "https://easydev.club/api/v1",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json; charset=UTF-8",
  },
});

export const getData = async (status: "all" | "completed" | "inWork") => {
  try {
    const response = await api.get("/todos", {
      params: status ? { filter: status } : {},
    });
    return response.data;
  } catch (error) {
    console.error("Ошибка при получении данных:", error);
  }
};

export const postData = async (updatedData: TodoRequest) => {
  try {
    await api.post("todos", updatedData);
  } catch (error) {
    console.error("Ошибка при отправке данных:", error);
  }
};

export const changeData = async (id: number, changedData?: TodoRequest) => {
  try {
    await api.put(`/todos/${id}`, changedData);
  } catch (error) {
    console.error("Ошибка при отправке данных:", error);
  }
};

export const deleteData = async (id: number) => {
  try {
    const response = await api.delete(`/todos/${id}`);
    if (response.status !== 200) {
      alert("Ошибка при удалении данных");
    }
  } catch (error) {
    console.error("Ошибка при удалении данных:", error);
  }
};
