import ReactDOM from "react-dom/client";
import App from "./App";
import "antd/dist/reset.css";

import "./index.css";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { ConfigProvider } from "antd";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <Provider store={store}>
    <ConfigProvider>
      <App />
    </ConfigProvider>
  </Provider>
);
