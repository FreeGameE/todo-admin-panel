import { Button, Flex, Typography } from "antd";
import "./UsersPage.css";
import UsersList from "../UsersList/UsersList";
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import {
  MetaResponse,
  User,
  UserFilters,
  SortOrder,
} from "../../../types/users";
import { getUsers } from "../../../api/usersApi";
import UsersPagePagination from "../UsersPagePagination/UsersPagePagination";

const UsersPage: React.FC = () => {
  const [usersData, setUsersData] = useState<MetaResponse<User> | null>(null);
  const [userFilters, setUserFilters] = useState<UserFilters>({
    search: "",
    sortBy: "date",
    sortOrder: "asc",
    isBlocked: undefined,
    limit: 20,
    offset: 0,
  });
  const [usernameSortOrder, setUsernameSortOrder] = useState<SortOrder>("asc");
  const [emailSortOrder, setEmailSortOrder] = useState<SortOrder>("asc");
  const [currentSortBy, setCurrentSortBy] = useState<"username" | "email">(
    "username"
  );

  const toggleUsernameSortOrder = async () => {
    const newUserFilters: UserFilters = {
      ...userFilters,
      sortOrder: usernameSortOrder === "asc" ? "desc" : "asc",
      sortBy: "username",
    };
    setUserFilters(newUserFilters);
    setUsernameSortOrder(usernameSortOrder === "asc" ? "desc" : "asc");
    setCurrentSortBy("username");
    loadUsersList(newUserFilters);
  };

  const toggleEmailSortOrder = async () => {
    const newUserFilters: UserFilters = {
      ...userFilters,
      sortOrder: emailSortOrder === "asc" ? "desc" : "asc",
      sortBy: "email",
    };
    setUserFilters(newUserFilters);
    setEmailSortOrder(emailSortOrder === "asc" ? "desc" : "asc");
    setCurrentSortBy("email");
    loadUsersList(newUserFilters);
  };

  const loadUsersList = async (filters: UserFilters) => {
    try {
      const response = await getUsers(filters);
      setUsersData(response.data);
    } catch (error) {}
  };

  useEffect(() => {
    loadUsersList(userFilters);
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
            borderBottom: "1px solid #ccc",
          }}
        >
          <Typography className="table-header">
            <Typography.Text
              type={currentSortBy === "username" ? "success" : undefined}
            >
              Имя
            </Typography.Text>
            <Button
              className="table-header-button"
              htmlType="button"
              onClick={toggleUsernameSortOrder}
              color="default"
              variant="link"
              icon={
                usernameSortOrder === "asc" ? (
                  <ArrowUpOutlined />
                ) : (
                  <ArrowDownOutlined />
                )
              }
            />
          </Typography>

          <Typography className="table-header">
            <Typography.Text
              type={currentSortBy === "email" ? "success" : undefined}
            >
              Email
            </Typography.Text>
            <Button
              className="table-header-button"
              // form={`change${todo.id}`}
              // className="accept-Button"
              htmlType="button"
              onClick={toggleEmailSortOrder}
              color="default"
              variant="link"
              icon={
                emailSortOrder === "asc" ? (
                  <ArrowUpOutlined />
                ) : (
                  <ArrowDownOutlined />
                )
              }
            />
          </Typography>
          <Typography className="table-header">Дата регистрации</Typography>
          <Typography className="table-header">Статус блокировки</Typography>
          <Typography className="table-header">Роль</Typography>
          <Typography className="table-header">Номер телефона</Typography>
        </Flex>
        <UsersList usersData={usersData} />
        {Number(usersData?.meta.totalAmount) > 20 ? (
          <UsersPagePagination usersData={usersData} userFilters={userFilters} />
        ) : undefined}
      </Flex>
    </Flex>
  );
};

export default UsersPage;
