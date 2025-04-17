import { Button, Flex, Form, Input, Typography } from "antd";
import "./ForgotPasswordBox.css";
const ForgotPasswordBox: React.FC = () => {
  return (
    <Flex vertical align="center" className="forgot-password-box">
      <Typography style={{ fontSize: "24px" }}>
        Восстановление пароля
      </Typography>
      <Flex>
        <Form>
          <Form.Item
            label="Почтовый адрес"
            name="email"
            validateTrigger="onChange"
            layout="vertical"
            rules={[
              { required: true, message: "" },
              { type: "email", message: "Введите корректный email" },
            ]}
          >
            <Input type="email" />
          </Form.Item>
          <Form.Item>
            <Button style={{ margin: "1rem" }} type="primary" htmlType="submit">
              Восстановить пароль
            </Button>
          </Form.Item>
        </Form>
      </Flex>
      <Flex justify="center">
        <Typography.Text style={{ marginRight: "0.5rem" }}>
          Знаете пароль?
        </Typography.Text>
        <Typography.Link href="/login">Войти в аккаунт</Typography.Link>
      </Flex>
    </Flex>
  );
};

export default ForgotPasswordBox;
