import {
  CalendarOutlined,
  DownOutlined,
  FileOutlined,
  FolderAddOutlined,
  FolderOutlined,
  HomeOutlined,
  SolutionOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import {
  Layout,
  Menu,
  Dropdown,
  Space,
  message,
  Avatar,
  theme,
  ConfigProvider,
} from "antd";
import React, { useState } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import "../staff/staff.scss";
import logo from "../../assets/logoBV.png";
import { jwtDecode } from "jwt-decode";
import ManagerFileType from "./ManagerFile";
const { Header, Content, Sider } = Layout;
const items = [
  {
    label: <Link to="/admin">Bảng điều khiển</Link>,
    key: "dashboard",
    icon: <HomeOutlined />,
  },
  {
    label: <Link to="/admin/accounts">Quản lý tài khoản</Link>,
    key: "accounts",
    icon: <UnorderedListOutlined />,
  },
  // {
  //   label: <Link to="/admin/add-holiday">Thêm ngày nghỉ lễ</Link>,
  //   key: "add-holiday",
  //   icon: <CalendarOutlined />,
  // },
  {
    label: <Link to="/admin/add-department">Quản lý các khoa</Link>,
    key: "add-department",
    icon: <SolutionOutlined />,
  },
  {
    label: <Link to="/admin/file">Quản lý tài liệu</Link>,
    key: "file",
    icon: <FileOutlined />,
  },
  {
    label: <Link to="/admin/contract">Quản lý hợp đồng</Link>,
    key: "contract",
    icon: <FolderOutlined />,
  },
  {
    label: <Link to="/admin/export-file">Xuất file báo cáo</Link>,
    key: "export-file",
    icon: <FolderAddOutlined />,
  },
];

const LayoutAdmin = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const navigate = useNavigate();
  const handleLogout = async () => {
    message.success("Đăng xuất thành công");
    navigate("/login");
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
  };
  const name = jwtDecode(localStorage.getItem("token")).role;
  const itemDropdown = [
    {
      label: <label>Account Manager</label>,
      key: "account",
    },
    {
      label: <a href="/">Trang chủ</a>,
      key: "homepage",
    },
    {
      label: (
        <label style={{ cursor: "pointer" }} onClick={() => handleLogout()}>
          Đăng xuất
        </label>
      ),
      key: "logout",
    },
  ];
  const location = useLocation();
  let path = location.pathname.split("/");
  path = path[2];
  if (path === undefined) {
    path = "dashboard";
  }
  const url =
    "data:image/png;base64,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";
  return (
    <Layout className="layout-staff">
      <ConfigProvider
        theme={{
          components: {
            Menu: {
              colorBgContainer: "#42BC81",
              colorText: "#FFFFFF",
              colorPrimary: "#070707",
            },
          },
        }}
      >
        <Sider>
          <div style={{ margin: 16, textAlign: "center" }}>
            {" "}
            <img
              style={{ height: 100, width: 130 }}
              src={logo}
              alt="logo bệnh viện"
            />
          </div>
          <Menu
            defaultSelectedKeys={[activeMenu]}
            selectedKeys={path}
            mode="inline"
            items={items}
            onClick={(e) => setActiveMenu(e.key)}
          />
        </Sider>
      </ConfigProvider>
      <Layout className="site-layout">
        <div
          style={{
            padding: 0,
            background: colorBgContainer,
          }}
        >
          <div className="staff-header">
            <Dropdown
              menu={{
                items: itemDropdown,
              }}
              trigger={["click"]}
            >
              <a className="staff-href" onClick={(e) => e.preventDefault()}>
                <Space>
                  <Avatar src={url} />
                  {name}
                  <DownOutlined />
                </Space>
              </a>
            </Dropdown>
          </div>
        </div>

        <Content className="layout-content">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};
export default LayoutAdmin;
