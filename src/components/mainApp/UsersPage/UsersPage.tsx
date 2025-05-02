import { Flex, Typography } from "antd";
import "./UsersPage.css"

const UsersPage: React.FC = () => {
  return (
    <Flex vertical align="center">
      <Typography.Title
        level={2}
        style={{ color: "white", textAlign: "center", marginTop: "0.6rem" }}
      >
        ПОЛЬЗОВАТЕЛИ
      </Typography.Title>
      <Flex vertical className="users-board">
123
      </Flex>
    </Flex>
  );
};

export default UsersPage;
