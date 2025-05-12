import { Button, Flex, Modal, Tooltip, Typography } from "antd";
import { ActionType, Roles, User, UserFilters } from "../../../types/users";
import "./UserItem.css";
import {
  UserOutlined,
  DeleteOutlined,
  CloseCircleOutlined,
  EditOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import {
  banUser,
  deleteUser,
  unbanUser,
  updateUserPermissions,
} from "../../../api/usersApi";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { Link } from "react-router-dom";
import { selectedUserChange } from "../../../store/selectedUserSlice";

type UserItemProps = {
  user: User;
  loadUsersList: (filters: UserFilters) => Promise<void>;
  userFilters: UserFilters;
};

const UserItem: React.FC<UserItemProps> = ({
  user,
  loadUsersList,
  userFilters,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalActionType, setModalActionType] = useState<ActionType>(
    null
  );
  const [currentUserRoles, setCurrentUserRoles] = useState<Roles[]>([]);

  const finalUserRoles = useSelector(
    (state: RootState) => state.userRole.roles
  );

  const { id, username, email, date, isBlocked, roles, phoneNumber } = user;
  const allRoles = Object.values(Roles);
  const dispatch = useDispatch();

  const showModal = (action: ActionType) => {
    setModalActionType(action);
    setIsModalOpen(true);
    setCurrentUserRoles(user.roles);
  };
  const handleOk = () => setIsModalOpen(false);

  const handleCancel = () => setIsModalOpen(false);

  const handleModalConfirm = () => {
    if (modalActionType === "delete") {
      handleUserDelete();
    }
    if (modalActionType === "ban") {
      handleUserBan();
    }
    if (modalActionType === "unban") {
      handleUserUnban();
    }
    if (modalActionType === "roles") {
      handleUserRolesSubmit();
    }
    setIsModalOpen(false);
    setModalActionType(null);
  };

  const handleUserDelete = async () => {
    try {
      await deleteUser(user.id);
      loadUsersList(userFilters);
      handleOk();
    } catch (error) {}
  };

  const handleUserBan = async () => {
    try {
      await banUser(user.id);
      loadUsersList(userFilters);
      handleOk();
    } catch (error) {}
  };

  const handleUserUnban = async () => {
    try {
      await unbanUser(user.id);
      loadUsersList(userFilters);
      handleOk();
    } catch (error) {}
  };

  const handleUserRolesSubmit = async () => {
    try {
      await updateUserPermissions(id, { roles: currentUserRoles });
      loadUsersList(userFilters);
    } catch (error) {}
  };

  const handleUserRolesChange = (role: Roles, action: "add" | "remove") => {
    if (action === "add") {
      if (!currentUserRoles.includes(role)) {
        setCurrentUserRoles((prevRoles) => [...prevRoles, role]);
      }
    }
    if (action === "remove") {
      if (currentUserRoles.includes(role)) {
        setCurrentUserRoles((prevRoles) => prevRoles.filter((r) => r !== role));
      }
    }
  };

  const handleChangeUser = () => {
    dispatch(selectedUserChange(user.id));
  };

  return (
    <Flex
      style={{
        borderBottom: "1px solid #ccc",
        width: "100%",
      }}
    >
      {/* //@ Модальное окно, универсальное */}
      <Modal
        title={
          modalActionType === "delete"
            ? "Удалить профиль?"
            : modalActionType === "ban"
            ? "Заблокировать пользователя?"
            : modalActionType === "unban"
            ? "Разблокировать пользователя?"
            : modalActionType === "roles"
            ? "Роли пользователя"
            : undefined
        }
        open={isModalOpen}
        onOk={handleModalConfirm}
        onCancel={handleCancel}
        okText={
          modalActionType === "delete"
            ? "Удалить"
            : modalActionType === "ban"
            ? "Заблокировать"
            : modalActionType === "unban"
            ? "Разблокировать"
            : "Готово"
        }
        cancelText="Отмена"
        okButtonProps={{
          style: {
            // color: "white",
            // backgroundColor: "indianred",
          },
        }}
        width={"20rem"}
      >
        {/* //$ Кнопки с ролями */}

        {finalUserRoles.includes(Roles.ADMIN || Roles.MODERATOR) &&
        modalActionType === "roles" ? (
          <Flex gap="0.3rem" wrap="wrap">
            {currentUserRoles.map((role) => (
              <Button
                onClick={() => handleUserRolesChange(role, "remove")}
                color="blue"
                variant="solid"
                key={role}
              >
                {role}
              </Button>
            ))}
            {allRoles.map((role) =>
              !currentUserRoles.includes(role) ? (
                <Button
                  key={role}
                  onClick={() => handleUserRolesChange(role, "add")}
                >
                  {role}
                </Button>
              ) : null
            )}
          </Flex>
        ) : undefined}
      </Modal>
      <Flex className="table-row" style={{ justifyContent: "space-between" }}>
        <Tooltip title="Перейти к профилю">
          <Link to="/user-profile">
            <Button
              icon={<UserOutlined />}
              color="blue"
              variant="link"
              onClick={handleChangeUser}
            />
          </Link>
        </Tooltip>
        <Typography>{username} </Typography>
        <Tooltip
          title={
            finalUserRoles.includes(Roles.ADMIN)
              ? "Удалить пользователя"
              : "Доступно только администраторам"
          }
        >
          <Button
            onClick={() => showModal("delete")}
            icon={<DeleteOutlined />}
            color="danger"
            variant="link"
            disabled={!finalUserRoles.includes(Roles.ADMIN)}
          />
        </Tooltip>
      </Flex>
      <Typography className="table-row">{email}</Typography>
      <Typography className="table-row">
        {new Date(date).toLocaleString("ru-RU", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </Typography>

      {isBlocked ? (
        <Flex className="table-row" style={{ position: "relative" }}>
          <Typography>Забанен</Typography>
          <Tooltip title="Разблокировать">
            <Button
              style={{ position: "absolute", right: "5px" }}
              onClick={() => showModal("unban")}
              icon={<ReloadOutlined />}
              color="green"
              variant="link"
            />
          </Tooltip>
        </Flex>
      ) : (
        <Flex className="table-row" style={{ position: "relative" }}>
          <Typography>Не забанен</Typography>
          <Tooltip title="Заблокировать">
            <Button
              style={{ position: "absolute", right: "5px" }}
              onClick={() => showModal("ban")}
              icon={<CloseCircleOutlined />}
              color="orange"
              variant="link"
            />
          </Tooltip>
        </Flex>
      )}

      <Flex className="table-row" style={{}} wrap="wrap">
        <Typography style={{}}>{roles?.join(", ") || ""}</Typography>
        <Tooltip
          title={
            finalUserRoles.includes(Roles.ADMIN)
              ? "Редактировать роли"
              : "Доступно только администраторам"
          }
        >
          <Button
            style={{}}
            onClick={() => {
              showModal("roles");
            }}
            icon={<EditOutlined />}
            color="geekblue"
            variant="link"
            disabled={!finalUserRoles.includes(Roles.ADMIN)}
          />
        </Tooltip>
      </Flex>
      <Typography className="table-row">{phoneNumber}</Typography>
    </Flex>
  );
};
export default UserItem;
