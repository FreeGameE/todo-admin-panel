import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { Button, Flex, Form, Input, Typography } from "antd";
import "./UserProfile.css";
import { Roles, User, UserRequest } from "../../../types/users";
import { getManagedUserProfile, updateUserData } from "../../../api/usersApi";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { authStatusChange } from "../../../store/authSlice";

const UserProfile: React.FC = () => {
  const [userData, setUserData] = useState<User>();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [profileConflictStatus, setProfileConflictStatus] =
    useState<boolean>(false);
  const selectedUserId = useSelector((state: RootState) => state.selectedUser);
  const dispatch = useDispatch();

  const finalUserRoles = useSelector(
    (state: RootState) => state.userRole.roles
  );
  const checkRefreshToken = useCallback(() => {
    if (!localStorage.getItem("refreshToken")) {
      dispatch(authStatusChange(false));
    }
  }, [dispatch]);

  const loadUserProfile = useCallback(async () => {
    checkRefreshToken();
    try {
      const response = await getManagedUserProfile(selectedUserId);
      console.log("start");
      setUserData(response.data);
    } catch (error) {}
  }, [checkRefreshToken, selectedUserId]);

  const onFinish = async (values: any) => {
    const newUserData: UserRequest = {
      username: values.username,
      email: values.email === userData?.email ? "" : values?.email,
      phoneNumber: values.phoneNumber,
    };
    try {
      await updateUserData(selectedUserId, newUserData);
      setIsEditing(false);
      setProfileConflictStatus(false);
      loadUserProfile();
    } catch (error: any) {
      if (error.response?.status === 400) {
        setProfileConflictStatus(true);
      }
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  useEffect(() => {
    loadUserProfile();
  }, [loadUserProfile]);

  return (
    <>
      {selectedUserId}
      <Flex vertical align="center">
        <Typography.Title
          level={2}
          style={{ color: "white", textAlign: "center", marginTop: "0.6rem" }}
        >
          ПОЛЬЗОВАТЕЛЬ {userData?.username}
        </Typography.Title>
        <Flex vertical className="profile-board">
          <Typography.Title level={4}>Данные профиля</Typography.Title>
          <Flex vertical style={{ flex: 1 }}>
            {!isEditing ? (
              <Flex vertical>
                <Flex vertical style={{ width: "auto", gap: "1.5rem" }}>
                  <Flex>
                    <Flex style={{ minWidth: "8.5rem" }}>
                      <Typography.Text>Имя пользователя:</Typography.Text>
                    </Flex>
                    <Typography.Text style={{ fontWeight: "500" }}>
                      {userData?.username}
                    </Typography.Text>
                  </Flex>

                  <Flex>
                    <Flex style={{ minWidth: "8.5rem" }}>
                      <Typography.Text>Почтовый адрес:</Typography.Text>
                    </Flex>
                    <Typography.Text style={{ fontWeight: "500" }}>
                      {userData?.email}
                    </Typography.Text>
                  </Flex>

                  <Flex>
                    <Flex style={{ minWidth: "8.5rem" }}>
                      <Typography.Text>Номер телефона:</Typography.Text>
                    </Flex>
                    <Typography.Text style={{ fontWeight: "500" }}>
                      {userData?.phoneNumber || "не указано"}
                    </Typography.Text>
                  </Flex>
                  {finalUserRoles.includes(Roles.ADMIN) && (
                    <Button
                      color="blue"
                      variant="link"
                      style={{
                        width: "fit-content",
                        height: "fit-content",
                        padding: "0px",
                      }}
                      onClick={() => setIsEditing(true)}
                    >
                      Редактировать
                    </Button>
                  )}
                </Flex>
              </Flex>
            ) : (
              <Flex vertical>
                <Form
                  onFinish={onFinish}
                  initialValues={{
                    username: userData?.username,
                    email: userData?.email,
                    phoneNumber: userData?.phoneNumber,
                  }}
                >
                  <Form.Item
                    className="editing-profile-form-item"
                    name="username"
                    rules={[
                      { required: true, message: "Введите имя пользователя" },
                      {
                        max: 60,
                        message:
                          "Имя пользователя должно содержать не более 60 символов",
                      },
                      {
                        pattern: /^[a-zA-Zа-яА-Я]{1,999}$/,
                        message:
                          "Допустимы только буквы русского и латинского алфавитов",
                      },
                    ]}
                  >
                    <Flex>
                      <Flex style={{ minWidth: "8.5rem" }}>
                        <Typography.Text>Имя пользователя:</Typography.Text>
                      </Flex>
                      <Input
                        className="editing-profile-input"
                        placeholder="username"
                        defaultValue={userData?.username}
                      ></Input>
                    </Flex>
                  </Form.Item>

                  <Form.Item
                    className="editing-profile-form-item"
                    name="email"
                    rules={[
                      { required: true, message: "Введите email" },
                      { type: "email", message: "Введите корректный email" },
                    ]}
                  >
                    <Flex>
                      <Flex style={{ minWidth: "8.5rem" }}>
                        <Typography.Text>Почтовый адрес:</Typography.Text>
                      </Flex>
                      <Input
                        className="editing-profile-input"
                        placeholder="example@email.com"
                        type="email"
                        defaultValue={userData?.email}
                      ></Input>
                    </Flex>
                  </Form.Item>

                  <Form.Item
                    className="editing-profile-form-item"
                    name="phoneNumber"
                    rules={[
                      {
                        pattern: /^[+]?[0-9]{11}$/,
                        message: "Введите корректный номер телефона",
                      },
                    ]}
                  >
                    <Flex>
                      <Flex style={{ minWidth: "8.5rem" }}>
                        <Typography.Text>Номер телефона:</Typography.Text>
                      </Flex>
                      <Input
                        className="editing-profile-input"
                        placeholder="89000000000"
                        defaultValue={userData?.phoneNumber}
                      ></Input>
                    </Flex>
                  </Form.Item>

                  <Button
                    htmlType="submit"
                    color="blue"
                    variant="outlined"
                    style={{ padding: "0px", width: "5rem", height: "1.5rem" }}
                  >
                    Сохранить
                  </Button>
                  <Button
                    htmlType="button"
                    color="red"
                    variant="filled"
                    onClick={handleCancelEdit}
                    style={{
                      marginLeft: "0.5rem",
                      padding: "0px",
                      width: "4rem",
                      height: "1.5rem",
                    }}
                  >
                    Отмена
                  </Button>

                  {profileConflictStatus ? (
                    <Typography.Paragraph type="danger">
                      Почта или номер заняты другим пользователем
                    </Typography.Paragraph>
                  ) : undefined}
                </Form>
              </Flex>
            )}

            <Flex justify="center" align="flex-end" style={{ flex: 1 }}>
              <Link to="/users">
                <Button color="blue" variant="solid" style={{ width: "15rem" }}>
                  Назад к списку пользователей
                </Button>
              </Link>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </>
  );
};

export default UserProfile;
