import { Status, Todo } from "../../../types/todos";
import { useEffect } from "react";
import TodoItem from "../TodoItem/TodoItem";
import { Flex } from "antd";

type TodoListProps = {
  filteredTodoStatus: Status;
  todosData: Todo[];
  loading: boolean;
  loadTodoList: () => Promise<void>;
};

const TodoList: React.FC<TodoListProps> = ({
  filteredTodoStatus,
  todosData,
  loading,
  loadTodoList,
}) => {
  useEffect(() => {
    loadTodoList();
  }, [filteredTodoStatus, loadTodoList]);

  useEffect(() => {
    const interval = setInterval(() => {
      loadTodoList();
    }, 5000);
    return () => clearInterval(interval); // сбросить счётчик
  }, [filteredTodoStatus, loadTodoList]);

  return (
    <Flex vertical>
      {loading ? (
        <p style={{ textAlign: "center" }}>Загрузка...</p>
      ) : (
        todosData.map((todo) => {
          return (
            <Flex vertical key={`div${todo.id}`}>
              <TodoItem key={todo.id} todo={todo} loadTodoList={loadTodoList} />
            </Flex>
          );
        })
      )}
    </Flex>
  );
};

export default TodoList;
