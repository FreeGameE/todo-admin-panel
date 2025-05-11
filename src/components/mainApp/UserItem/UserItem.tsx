import { Button, Flex, Modal, Tooltip, Typography } from "antd";
import { Roles, User, UserFilters } from "../../../types/users";
import "./UserItem.css";
import {
  UserOutlined,
  DeleteOutlined,
  CloseCircleOutlined,
  EditOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { banUser, deleteUser, unbanUser } from "../../../api/usersApi";
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";

type UserItemProps = {
  user: User;
  loadUsersList: (filters: UserFilters) => Promise<void>;
  userFilters: UserFilters;
};

type ActionType = "delete" | "ban" | "unban";

const UserItem: React.FC<UserItemProps> = ({
  user,
  loadUsersList,
  userFilters,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalActionType, setModalActionType] = useState<ActionType | null>(
    null
  );

  const finalUserRoles = useSelector(
    (state: RootState) => state.userRole.roles
  );

  const { id, username, email, date, isBlocked, roles, phoneNumber } = user;

  const showModal = (action: ActionType) => {
    setModalActionType(action);
    setIsModalOpen(true);
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
            : "Разблокировать пользователя?"
        }
        open={isModalOpen}
        onOk={handleModalConfirm}
        onCancel={handleCancel}
        okText={
          modalActionType === "delete"
            ? "Удалить"
            : modalActionType === "ban"
            ? "Заблокировать"
            : "Разблокировать"
        }
        cancelText="Отмена"
        okButtonProps={{
          style: {
            // color: "white",
            // backgroundColor: "indianred",
          },
        }}
        width={"25rem"}
      />
      <Flex className="table-row" style={{ justifyContent: "space-between" }}>
        <Tooltip title="Перейти к профилю">
          <Button
            onClick={() => {}}
            icon={<UserOutlined />}
            color="blue"
            variant="link"
          />
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

      <Flex className="table-row" style={{ position: "relative" }}>
        <Typography style={{ width: "70%" }}>
          {roles?.join(", ") || ""}
        </Typography>
        <Tooltip title="Редактировать роли">
          <Button
            style={{ position: "absolute", right: "5px" }}
            onClick={() => {}}
            icon={<EditOutlined />}
            color="geekblue"
            variant="link"
          />
        </Tooltip>
      </Flex>
      <Typography className="table-row">{phoneNumber}</Typography>
    </Flex>
  );
};
export default UserItem;
