import { Divider, Flex, Image, Typography } from "antd";
import { Link } from "react-router-dom";
import Sider from "antd/es/layout/Sider";
import "./SiderBar.css";
import {
  ProfileOutlined,
  UserOutlined,
  // LeftOutlined,
  // RightOutlined,
} from "@ant-design/icons";

const SiderBar: React.FC = () => {
  return (
    <Sider width={"15rem"} className="sider">
      {/* <Flex className="slider">
        <LeftOutlined style={{ margin: "0px" }} />
        <RightOutlined style={{ margin: "0px" }} />
      </Flex> */}
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
      </Flex>
    </Sider>
  );
};

export default SiderBar;
