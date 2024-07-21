import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { ConfigProvider } from "antd";
import viVn from 'antd/locale/vi_VN';
ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
    <ConfigProvider locale={viVn}>
      <App />
    </ConfigProvider>
  // </React.StrictMode>
);
