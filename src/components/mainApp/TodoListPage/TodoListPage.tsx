import { useCallback, useEffect, useState } from "react";
import { getData } from "../../../api/todosApi";
import { Status, Todo, TodoInfo } from "../../../types/todos";
import AddTodo from "../AddTodo/AddTodo";
import ChangeList from "../ChangeList/ChangeList";
import TodoList from "../TodoList/TodoList";
import "./TodoListPage.css";
import { Flex, Typography } from "antd";
import { authStatusChange } from "../../../store/authSlice";
import { useDispatch } from "react-redux";

const TodoListPage: React.FC = () => {
  const [filteredTodoStatus, setFilteredTodoStatus] = useState<Status>("all");
  const [todosData, setTodosData] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [todosInfo, setTodosInfo] = useState<TodoInfo>({
    all: 0,
    completed: 0,
    inWork: 0,
  });

  const dispatch = useDispatch();

  const checkRefreshToken = useCallback(() => {
    if (!localStorage.getItem("refreshToken")) {
      dispatch(authStatusChange(false));
    }
  }, [dispatch]);

  const loadTodoList = useCallback(async () => {
    checkRefreshToken();
    try {
      const response = await getData(filteredTodoStatus);
      const newData: Todo[] = response.data;
      setTodosData(newData);
      setTodosInfo(response.info);
    } catch (error) {
      console.error("Ошибка при загрузке данных:", error);
    } finally {
      setLoading(false);
    }
  }, [filteredTodoStatus, checkRefreshToken]);

  useEffect(() => {
    setLoading(true);
    loadTodoList();
  }, [filteredTodoStatus, loadTodoList]);

  return (
    <Flex vertical className="todo-list-page">
      <Typography.Title
        level={2}
        style={{ color: "white", textAlign: "center", marginTop: "0.6rem" }}
      >
        СПИСОК ЗАДАЧ
      </Typography.Title>
      <Flex className="main-board">
        <AddTodo
          loadTodoList={loadTodoList}
          filteredTodoStatus={filteredTodoStatus}
        />
        <ChangeList
          setFilteredTodoStatus={setFilteredTodoStatus}
          filteredTodoStatus={filteredTodoStatus}
          todosInfo={todosInfo}
        />
        <TodoList
          filteredTodoStatus={filteredTodoStatus}
          todosData={todosData}
          loading={loading}
          loadTodoList={loadTodoList}
        />
      </Flex>
    </Flex>
  );
};

export default TodoListPage;
