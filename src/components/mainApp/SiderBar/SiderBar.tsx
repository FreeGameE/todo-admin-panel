import { Divider, Flex, Image, Typography } from "antd";
import { Link } from "react-router-dom";
import Sider from "antd/es/layout/Sider";
import "./SiderBar.css";
import { ProfileOutlined, TeamOutlined, UserOutlined } from "@ant-design/icons";
import { Roles } from "../../../types/users";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";

const SiderBar: React.FC = () => {
  const finalUserRoles = useSelector(
    (state: RootState) => state.userRole.roles
  );

  return (
    <Sider width={"15rem"} className="sider">
      <Link to="/">
        <Flex justify="center" style={{ marginTop: "1rem" }}>
          <Image
            src="/favicon.ico"
            alt="Изображение"
            preview={false}
            style={{ width: "3rem", height: "3rem" }}
          />
          <Typography.Title style={{ color: "white", marginBottom: "0" }}>
            TODO
          </Typography.Title>
        </Flex>
      </Link>
      <Divider style={{ borderColor: "rgba(255, 255, 255, 0.386)" }} />
      <Flex vertical align="flex-start" style={{ margin: "0rem 2rem" }}>
        <Link className="sider-link" to="/">
          <ProfileOutlined /> Список задач
        </Link>
        <Link className="sider-link" to="/profile">
          <UserOutlined /> Личный кабинет
        </Link>
        {finalUserRoles.includes(Roles.ADMIN || Roles.MODERATOR) ? (
          <Link className="sider-link" to="/users">
            <TeamOutlined /> Пользователи
          </Link>
        ) : undefined}
      </Flex>
    </Sider>
  );
};

export default SiderBar;
