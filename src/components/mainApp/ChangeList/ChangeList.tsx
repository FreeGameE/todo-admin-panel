import { TodoInfo, Status } from "../../../types/todos";
import { Button, Flex } from "antd";
import "./ChangeList.css";

type ChangeListProps = {
  setFilteredTodoStatus: React.Dispatch<React.SetStateAction<Status>>;
  filteredTodoStatus: Status;
  todosInfo: TodoInfo
};

const ChangeList: React.FC<ChangeListProps> = ({
  setFilteredTodoStatus,
  filteredTodoStatus,
  todosInfo,
}) => {
  const handleFilterChange = (filter: Status) => {
    setFilteredTodoStatus(filter);
  };

  return (
    <Flex className="todo-status" style={{ marginTop: "0" }}>
      <Button
        onClick={() => handleFilterChange("all")}
        className={filteredTodoStatus === "all" ? "active" : undefined}
      >
        Все({todosInfo?.all})
      </Button>
      <Button
        onClick={() => handleFilterChange("inWork")}
        className={filteredTodoStatus === "inWork" ? "active" : undefined}
      >
        В работе({todosInfo?.inWork})
      </Button>
      <Button
        onClick={() => handleFilterChange("completed")}
        className={filteredTodoStatus === "completed" ? "active" : undefined}
      >
        Завершённые({todosInfo?.completed})
      </Button>
    </Flex>
  );
};

export default ChangeList;
