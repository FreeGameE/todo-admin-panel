import { Button, Form, Input, Typography } from "antd";
import { Flex } from "antd";
import "./ProfilePage.css";
import { useDispatch } from "react-redux";
import { authStatusChange } from "../../../store/authSlice";
import { useCallback, useEffect, useState } from "react";
import { Profile, ProfileRequest } from "../../../types/auth";
import {
  getUserProfile,
  logoutUser,
  putUserProfile,
} from "../../../api/authApi";
import { tokenManager } from "../../../services/tokenManager";

const ProfilePage: React.FC = () => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [profileConflictStatus, setProfileConflictStatus] =
    useState<boolean>(false);
  const [userProfileData, setUserProfileData] = useState<Profile>();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    dispatch(authStatusChange(false));
    if (tokenManager.getToken())
      try {
        await logoutUser();
        tokenManager.clearToken();
        localStorage.setItem("refreshToken", "");
        console.log("Успешный логаут. Токены невалидны.");
      } catch (error) {
        console.error("Ошибка запроса:", error);
      }
  };

  const checkRefreshToken = useCallback(() => {
    if (!localStorage.getItem("refreshToken")) {
      dispatch(authStatusChange(false));
    }
  }, [dispatch]);

  const initUserProfile = useCallback(async () => {
    checkRefreshToken();
    let retryCount: number = 0;
    if (retryCount < 2) {
      //защита от бесконечного цикла при отсутствии соединения
      if (tokenManager.getToken()) {
        try {
          const response = await getUserProfile();
          setUserProfileData(response);
          retryCount = 0;
        } catch (error) {
          console.error("Ошибка авторизации.");
        }
      }
      retryCount++;
    }
  }, [checkRefreshToken]);

  const onFinish = async (values: any) => {
    const newUserPrifileData: ProfileRequest = {
      username: values.username,
      email: values.email === userProfileData?.email ? "" : values?.email,
      phoneNumber: values.phoneNumber,
    };

    try {
      await putUserProfile(newUserPrifileData);
      setIsEditing(false);
      setProfileConflictStatus(false);
      initUserProfile();
    } catch (error: any) {
      if (error.response?.status === 400) {
        setProfileConflictStatus(true);
      }
    }
  };

  useEffect(() => {
    initUserProfile();
  }, [initUserProfile]);

  return (
    <Flex vertical align="center">
      <Typography.Title
        level={2}
        style={{ color: "white", textAlign: "center", marginTop: "0.6rem" }}
      >
        ЛИЧНЫЙ КАБИНЕТ
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
                    {userProfileData?.username}
                  </Typography.Text>
                </Flex>

                <Flex>
                  <Flex style={{ minWidth: "8.5rem" }}>
                    <Typography.Text>Почтовый адрес:</Typography.Text>
                  </Flex>
                  <Typography.Text style={{ fontWeight: "500" }}>
                    {userProfileData?.email}
                  </Typography.Text>
                </Flex>

                <Flex>
                  <Flex style={{ minWidth: "8.5rem" }}>
                    <Typography.Text>Номер телефона:</Typography.Text>
                  </Flex>
                  <Typography.Text style={{ fontWeight: "500" }}>
                    {userProfileData?.phoneNumber || "не указано"}
                  </Typography.Text>
                </Flex>

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
              </Flex>
            </Flex>
          ) : (
            <Flex vertical>
              <Form
                // form={form}
                onFinish={onFinish}
                initialValues={{
                  username: userProfileData?.username,
                  email: userProfileData?.email,
                  phoneNumber: userProfileData?.phoneNumber,
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
                      defaultValue={userProfileData?.username}
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
                      defaultValue={userProfileData?.email}
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
                      defaultValue={userProfileData?.phoneNumber}
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
                {profileConflictStatus ? (
                  <Typography.Paragraph type="danger">
                    Почта или номер заняты другим пользователем
                  </Typography.Paragraph>
                ) : undefined}
              </Form>
            </Flex>
          )}

          <Flex justify="center" align="flex-end" style={{ flex: 1 }}>
            <Button
              color="blue"
              variant="solid"
              style={{ width: "5rem" }}
              onClick={() => handleLogout()}
            >
              Выйти
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default ProfilePage;
