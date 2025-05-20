import { Button, Flex, Typography } from "antd";
import "./UsersPage.css";
import UsersList from "../UsersList/UsersList";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  MetaResponse,
  User,
  UserFilters,
  SortOrder,
  Roles,
} from "../../../types/users";
import { getUsers } from "../../../api/usersApi";
import UsersPagePagination from "../UsersPagePagination/UsersPagePagination";
import UsersPageSearch from "../UsersPageSearch/UsersPageSearch";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { authStatusChange } from "../../../store/authSlice";

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
  const [isUsersFound, setIsUsersFound] = useState<boolean>(true);

  const finalUserRoles = useSelector(
    (state: RootState) => state.userRole.roles
  );

  const usersCount = 20;
  let pageCount = useMemo(() => {
    return Math.ceil(Number(usersData?.meta.totalAmount) / usersCount);
  }, [usersData?.meta.totalAmount, usersCount]);
  const dispatch = useDispatch();

  const checkRefreshToken = useCallback(() => {
    if (!localStorage.getItem("refreshToken")) {
      dispatch(authStatusChange(false));
    }
  }, [dispatch]);

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

  const toggleStatusFilter = async (status: boolean | undefined) => {
    const newUserFilters: UserFilters = {
      ...userFilters,
      isBlocked: status,
      offset: 0,
    };
    setUserFilters(newUserFilters);
    loadUsersList(newUserFilters);
  };

  const getVisiblePagesList = useCallback(() => {
    const pageList: number[] = [];
    const range = 3;
    const currentPageNumber = Number(userFilters.offset) + 1;

    const start = Math.max(1, currentPageNumber - range);
    const end = Math.min(pageCount, currentPageNumber + range);
    for (let i = start; i <= end; i++) {
      pageList.push(i);
    }
    return pageList;
  }, [userFilters.offset, pageCount]);

  const loadUsersList = useCallback(
    async (filters: UserFilters) => {
      checkRefreshToken();
      try {
        const response = await getUsers(filters);
        if (response.data.data) {
          setUsersData(response.data);
          getVisiblePagesList();
          setIsUsersFound(true);
        } else {
          setIsUsersFound(false);
        }
      } catch (error) {}
    },
    [checkRefreshToken, getVisiblePagesList]
  );
  useEffect(() => {
    loadUsersList(userFilters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        <UsersPageSearch
          usersData={usersData}
          userFilters={userFilters}
          setUserFilters={setUserFilters}
          loadUsersList={loadUsersList}
          isUsersFound={isUsersFound}
        />
        {finalUserRoles.includes(Roles.ADMIN) && (
          <Flex align="center" style={{ marginBottom: "0.3rem" }}>
            <Button
              onClick={() => toggleStatusFilter(undefined)}
              variant="link"
              color="blue"
              className="user-status-filter-button"
              style={{
                fontWeight: `${
                  userFilters.isBlocked === undefined ? "bold" : "normal"
                }`,
              }}
            >
              Все пользователи
            </Button>
            <Typography.Text>/</Typography.Text>
            <Button
              onClick={() => toggleStatusFilter(true)}
              variant="link"
              color="blue"
              className="user-status-filter-button"
              style={{
                fontWeight: `${
                  userFilters.isBlocked === true ? "bold" : "normal"
                }`,
              }}
            >
              Заблокированные
            </Button>
            <Typography.Text>/</Typography.Text>
            <Button
              onClick={() => toggleStatusFilter(false)}
              variant="link"
              color="blue"
              className="user-status-filter-button"
              style={{
                fontWeight: `${
                  userFilters.isBlocked === false ? "bold" : "normal"
                }`,
              }}
            >
              Активные
            </Button>
          </Flex>
        )}

        {isUsersFound ? (
          <Flex vertical>
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
              <Typography className="table-header">
                Статус блокировки
              </Typography>
              <Typography className="table-header">Роль</Typography>
              <Typography className="table-header">Номер телефона</Typography>
            </Flex>
            <UsersList
              usersData={usersData}
              loadUsersList={loadUsersList}
              userFilters={userFilters}
            />
            {Number(usersData?.meta.totalAmount) > 20 ? (
              <UsersPagePagination
                usersData={usersData}
                userFilters={userFilters}
                setUserFilters={setUserFilters}
                getVisiblePagesList={getVisiblePagesList}
                loadUsersList={loadUsersList}
                pageCount={pageCount}
                key={pageCount}
              />
            ) : undefined}
          </Flex>
        ) : !isUsersFound ? (
          <Typography>Пользователи не найдены</Typography>
        ) : undefined}
      </Flex>
    </Flex>
  );
};

export default UsersPage;
