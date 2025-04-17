import { Image, Layout, Typography } from "antd";
import React from "react";
import { useLocation } from "react-router-dom";
import LoginBox from "../LoginBox/LoginBox";
import RegistrationBox from "../RegistrationBox/RegistrationBox";
import RegistrationCompletedBox from "../RegistrationCompletedBox/RegistrationCompletedBox";
import "./AuthPage.css";
import ForgotPasswordBox from "../ForgotPasswordBox/ForgotPasswordBox";
// import { useSelector } from "react-redux";
// import { RootState } from "../../../store/store";

const { Content, Sider } = Layout;

const AuthPage: React.FC = () => {
  // const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const location = useLocation();

  let formComponent;
  switch (location.pathname) {
    case "/register":
      formComponent = <RegistrationBox />;
      break;
    case "/register-success":
      formComponent = <RegistrationCompletedBox />;
      break;
    case "/forgot-password":
      formComponent = <ForgotPasswordBox />;
      break;
    default:
      formComponent = <LoginBox />;
  }

  return (
    <Layout className="frame" style={{ height: "95vh" }}>
      <Sider width="56%" style={{ position: "relative", overflow: "hidden" }}>
        <Image
          src="/login-illustration.jpg"
          alt="Изображение"
          preview={false}
          style={{
            width: "100%",
            height: "100%",
            minHeight: "100vh",
            objectFit: "cover",
          }}
        />
        <Typography
          style={{
            position: "absolute",
            bottom: "5%",
            left: "50%",
            transform: "translateX(-50%)",
            color: "white",
            fontSize: "20px",
            fontWeight: "bold",
            textShadow: "2px 2px 4px rgba(0,0,0,0.6)",
            whiteSpace: "nowrap",
          }}
        >
          Воплоти свои идеи в реальность.
        </Typography>
      </Sider>

      <Content className="right-side">{formComponent}</Content>
    </Layout>
  );
};

export default AuthPage;
