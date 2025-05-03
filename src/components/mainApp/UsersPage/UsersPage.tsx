import { Button, Flex, Typography } from "antd";
import "./UsersPage.css";
import UsersList from "../UsersList/UsersList";
import { ArrowUpOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { MetaResponse, User, UserFilters } from "../../../types/users";
import { getUsers } from "../../../api/usersApi";

const UsersPage: React.FC = () => {
  const [usersData, setUsersData] = useState<MetaResponse<User> | null>(null);
  const [userFilters, setUserFilters] = useState<UserFilters>({
    search: "",
    sortBy: "date",
    sortOrder: "asc",
    isBlocked: undefined,
    limit: 10,
    offset: 0,
  });

  const loadUsersList = async () => {
    try {
      const response = await getUsers(userFilters);
      setUsersData(response.data);
    } catch (error) {}
  };

  useEffect(() => {
    loadUsersList();
  }, []);
  return (
    <Flex vertical align="center">
      <Typography.Title
        level={2}
        style={{ color: "white", textAlign: "center", marginTop: "0.6rem" }}
      >
        ПОЛЬЗОВАТЕЛИ
      </Typography.Title>
      <Flex vertical className="users-board">
        <Flex
          style={{
            fontWeight: 600,
            // padding: "8px 0",
            borderBottom: "1px solid #ccc",
          }}
        >
          <Typography className="table-header" style={{position: "relative"}}>
            <Typography className="header-text">Имя</Typography>
            <Button
              style={{
                padding: 0,
                height: "auto",
              }}
              // form={`change${todo.id}`}
              // className="accept-Button"
              htmlType="submit"
              color="default"
              variant="link"
              icon={<ArrowUpOutlined />}
            ></Button>
          </Typography>

          <Typography className="table-header">Email</Typography>
          <Typography className="table-header">Дата регистрации</Typography>
          <Typography className="table-header">Статус блокировки</Typography>
          <Typography className="table-header">Роль</Typography>
          <Typography className="table-header">Номер телефона</Typography>
        </Flex>
        <UsersList usersData={usersData} />
      </Flex>
    </Flex>
  );
};

export default UsersPage;
