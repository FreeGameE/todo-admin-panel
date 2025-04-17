import { Button, Flex, Form, Input, Typography } from "antd";
import { newUser } from "../../../api/authApi";
import { UserRegistration } from "../../../types/auth";
import "./RegistrationBox.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const RegistrationBox: React.FC = () => {
  const navigate = useNavigate();
  const [isExistingUser, setIsExistingUser] = useState<boolean>(false);

  const onFinish = async (values: any) => {
    const registrationData: UserRegistration = {
      username: values.username,
      login: values.login,
      password: values.password,
      email: values.email,
      phoneNumber: values.phone,
    };

    try {
      const userData = await newUser(registrationData);
      navigate("/register-success");
      console.log(userData);
      alert("Регистрация успешна!");
    } catch (error: any) {
      if (error.response?.status === 409) {
        setIsExistingUser(true);
      } else {
        alert("Произошла ошибка. Попробуйте позже.");
      }
    } finally {
    }
  };

  return (
    <Flex vertical align="center" className="registration-box">
      <Flex vertical className="registration-box-heading">
        <Typography style={{ fontSize: "36px" }}>Создание аккаунта</Typography>
        <Flex justify="center">
          <Typography style={{ marginRight: "0.3rem" }}>
            Уже зарегистрированы?
          </Typography>
          <Typography.Link href="/login">Войти в аккаунт</Typography.Link>
        </Flex>
      </Flex>

      <Form style={{ width: "100%" }} layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Имя пользователя"
          layout="vertical"
          name="username"
          rules={[
            { required: true, message: "Введите имя пользователя" },
            {
              max: 60,
              message: "Имя пользователя должно содержать не более 60 символов",
            },
            {
              pattern: /^[a-zA-Zа-яА-Я]{1,999}$/,
              message: "Допустимы только буквы русского и латинского алфавитов",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Логин"
          layout="vertical"
          name="login"
          rules={[
            { required: true, message: "Введите логин" },
            {
              min: 2,
              message: "Логин должен содержать не менее 2 символов",
            },
            {
              max: 20,
              message: "Логин должен содержать не более 20 символов",
            },
            {
              pattern: /^[a-zA-Z]{1,999}$/,
              message: "Допустимы только буквы латинского алфавита",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Пароль"
          layout="vertical"
          name="password"
          rules={[
            { required: true, message: "Введите пароль" },
            {
              min: 6,
              message: "Пароль должен содержать не менее 6 символов",
            },
            {
              max: 60,
              message: "Логин должен содержать не более 60 символов",
            },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          label="Повторите пароль"
          layout="vertical"
          name="repeatPassword"
          rules={[
            { required: true, message: "" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Пароли не совпадают"));
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          label="Почтовый адрес"
          layout="vertical"
          name="email"
          validateTrigger="onChange"
          rules={[
            { required: true, message: "" },
            { type: "email", message: "Введите корректный email" },
          ]}
        >
          <Input type="email" />
        </Form.Item>

        <Form.Item
          label="Телефон"
          layout="vertical"
          name="phone"
          validateTrigger="onChange"
          rules={[
            {
              pattern: /^[+]?[0-9]{11}$/,
              message: "Введите корректный номер телефона",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Button
          style={{ width: "100%", margin: "0" }}
          type="primary"
          htmlType="submit"
        >
          Зарегистрироваться
        </Button>
        {isExistingUser ? (
          <Flex style={{ position: "relative", width: "100%" }}>
            <Typography.Text
              type="danger"
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                marginTop: "1rem",
                width: "100%",
                textAlign: "center",
              }}
            >
              Пользователь с таким логином или почтой уже существует.
            </Typography.Text>
          </Flex>
        ) : undefined}
      </Form>
    </Flex>
  );
};

export default RegistrationBox;
