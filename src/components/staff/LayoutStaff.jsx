import {
  BellOutlined,
  CalendarOutlined,
  DownOutlined,
  FlagOutlined,
  FolderViewOutlined,
  HomeOutlined,
  HourglassOutlined,
  UnorderedListOutlined,
  UploadOutlined,
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
import React, { useEffect, useState } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import "./staff.scss";
import logo from "../../assets/logoBV.png";
import { jwtDecode } from "jwt-decode";
import { getStateApi } from "../../services/api";
import { ConfigAppContext } from "./ConfigAppContext";
const { Header, Content, Sider } = Layout;
const items = [
  {
    label: <Link to="/staff">Bảng điều khiển</Link>,
    key: "dashboard",
    icon: <HomeOutlined />,
  },
  {
    label: <span>Quản lý đề tài</span>,
    key: "manager",
    icon: <UnorderedListOutlined />,
    children: [
      {
        label: <Link to="/staff/earlyterm">Đề cương</Link>,
        key: "earlyterm",
        icon: <CalendarOutlined />,
      },
      {
        label: <Link to="/staff/midterm">Giữa kỳ</Link>,
        key: "midterm",
        icon: <HourglassOutlined />,
      },
      {
        label: <Link to="/staff/finalterm">Cuối kỳ</Link>,
        key: "finalterm",
        icon: <FlagOutlined />,
      },
    ],
  },
  {
    label: <Link to="/staff/upload-document">Tải tài liệu lên </Link>,
    key: "upload-document",
    icon: <UploadOutlined />,
  },
  {
    label: <Link to="/staff/view-topic"> Xem đề tài </Link>,
    key: "view-topic",
    icon: <FolderViewOutlined />,
  },
];

const LayoutStaff = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [config, setConfig] = useState({});
  const navigate = useNavigate();
  const handleLogout = async () => {
    message.success("Đăng xuất thành công");
    navigate("/login");
    localStorage.removeItem("token");
    sessionStorage.removeItem("userId");
  };
  const name = jwtDecode(localStorage.getItem("token")).role;
  const itemDropdown = [
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
    "https://static.vecteezy.com/system/resources/previews/020/429/953/non_2x/admin-icon-vector.jpg";
  const getConfig = async () => {
    try {
      const res = await getStateApi();
      if (res && res.statusCode === 200) {
        setConfig(res.data);
      }
    } catch (error) {
      console.log("====================================");
      console.log("có lỗi tại getState: ", error);
      console.log("====================================");
    }
  };

  useEffect(() => {
    getConfig();
  }, []);
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
        <Header
          className="staff-header"
          style={{
            padding: 0,
            background: colorBgContainer,
          }}
        >
          <div className="staff-header">
            <BellOutlined
              style={{ marginRight: "20px", fontSize: "18px" }}
              onClick={() => {}}
            />
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
        </Header>

        <Content className="layout-content">
          <ConfigAppContext.Provider value={config}>
            <Outlet />
          </ConfigAppContext.Provider>
        </Content>
      </Layout>
    </Layout>
  );
};
export default LayoutStaff;
