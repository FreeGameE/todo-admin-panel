import { Flex, Typography } from "antd";
import Link from "antd/es/typography/Link";

const RegistrationCompletedBox: React.FC = () => {
  return (
    <Flex vertical align="center" justify="center" style={{height: "100%"}}>
      <Typography style={{ fontSize: "24px" }}>
        Регистрация прошла успешно!
      </Typography>
      <Link href="/login">Перейти на страницу авторизации для входа в систему</Link>
    </Flex>
  );
};

export default RegistrationCompletedBox;
