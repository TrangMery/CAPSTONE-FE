import {
  BellOutlined,
  ContainerOutlined,
  DownOutlined,
  FileDoneOutlined,
  FileProtectOutlined,
  FileSearchOutlined,
  FileSyncOutlined,
  UserOutlined,
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
  Button,
  Popover,
  Badge,
  Divider,
} from "antd";
import React, { useEffect, useState } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import "./user.scss";
import "./global.scss";
import logo from "../../assets/logoBV.png";
import { jwtDecode } from "jwt-decode";
import ChangePassword from "./modalChangePass";
import { getNotifications, readNotifications } from "../../services/api";
const { Header, Content, Sider } = Layout;

const LayoutUser = () => {
  const token = localStorage.getItem("token");
  const [isOpen, setIsOpen] = useState(false);
  let decoded;
  if (token !== null) {
    decoded = jwtDecode(token);
  }
  const role = decoded?.role;
  const name = decoded?.fullname;
  const email = decoded?.email;
  const userId = localStorage.getItem("userId");
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [listNotify, setListNotify] = useState([]);
  const conditions = [
    {
      state: "PreliminaryReview",
      progress: "WaitingForCouncilFormation",
      isReject: true,
      message: "Đã được trưởng phòng duyệt",
    },
    {
      state: "PreliminaryReview",
      progress: "WaitingForDean",
      isReject: false,
      message: "Đề tài không được phê duyệt",
    },
    {
      state: "PreliminaryReview",
      progress: "WaitingForCouncilDecision",
      isReject: true,
      message: "Đề tài đã được thông qua",
    },
    {
      state: "EarlyTermReport",
      progress: "WaitingForConfigureConference",
      isReject: true,
      message: "Đã được các thành viên thông qua",
    },
    {
      state: "EarlyTermReport",
      progress: "WaitingForMeeting",
      isReject: true,
      message: "Tham gia cuộc họp",
    },
    {
      state: "EarlyTermReport",
      progress: "WaitingForCouncilDecision",
      isReject: false,
      message: "Không được các thành viên thông qua",
    },
    {
      state: "EarlyTermReport",
      progress: "WaitingForUploadMeetingMinutes",
      isReject: true,
      message: "Đã tạo lịch meeting",
    },
    {
      state: "EarlyTermReport",
      progress: "WaitingForUploadMeetingMinutes",
      isReject: false,
      message: 'Đã có kết quả của hội đồng: "Đề tài không được phê duyệt"',
    },
    {
      state: "EarlyTermReport",
      progress: "WaitingForDocumentEditing",
      isReject: true,
      message: "Chỉnh sửa tài liệu theo yêu cầu",
    },
    {
      state: "EarlyTermReport",
      progress: "WaitingForUploadContract",
      isReject: true,
      message: 'Đã có kết quả của hội đồng: "Đề tài được thông qua"',
    },
    {
      state: "EarlyTermReport",
      progress: "Completed",
      isReject: true,
      message: "Hoàn thành giai đoạn đề cương",
    },
    {
      state: "MidtermReport",
      progress: "WaitingForMakeReviewSchedule",
      isReject: true,
      message: "Đề tài chuyển sang giai đoạn giữa kỳ",
    },
    {
      state: "MidtermReport",
      progress: "WaitingForDocumentSupplementation",
      isReject: true,
      message: "Bổ sung tài liệu theo yêu cầu",
    },
    {
      state: "MidtermReport",
      progress: "WaitingForUploadMeetingMinutes",
      isReject: true,
      message: "Kiểm tra thời gian để tham gia meeting",
    },
    {
      state: "MidtermReport",
      progress: "Completed",
      isReject: true,
      message: "Hoàn thành giai đoạn giữa kỳ",
    },
    {
      state: "FinaltermReport",
      progress: "WaitingForDocumentSupplementation",
      isReject: true,
      message: "Bổ sung tài liệu theo yêu cầu",
    },
    {
      state: "FinaltermReport",
      progress: "WaitingForUploadMeetingMinutes",
      isReject: true,
      message: "Kiểm tra thời gian để tham gia meeting",
    },
    {
      state: "FinaltermReport",
      progress: "WaitingForUploadMeetingMinutes",
      isReject: false,
      message: 'Đã có kết quả của hội đồng: "Đề tài không được phê duyệt"',
    },
    {
      state: "FinaltermReport",
      progress: "WaitingForDocumentEditing",
      isReject: true,
      message: "Chỉnh sửa tài liệu theo yêu cầu",
    },
    {
      state: "EndingPhase",
      progress: "WaitingForSubmitRemuneration",
      isReject: true,
      message: "Nộp file tính thù lao",
    },
    {
      state: "EndingPhase",
      progress: "WaitingForUploadContract",
      isReject: true,
      message: "File tính thù lao đã được duyệt",
    },
    {
      state: "EndingPhase",
      progress: "Completed",
      isReject: true,
      message: "Đề tài đã hoàn tất",
    },
  ];
  const navigate = useNavigate();
  const handleLogout = async () => {
    message.success("Đăng xuất thành công");
    navigate("/login");
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
  };
  const getNotify = async () => {
    try {
      const res = await getNotifications({
        UserId: userId,
      });
      console.log("check notification: ", res);
      if (res && res.statusCode === 200) {
        setListNotify(res.data);
      }
    } catch (error) {
      console.log("====================================");
      console.log("Có lối tại getNotify: ", error);
      console.log("====================================");
    }
  };
  const markAsRead = async (notifiId) => {
    try {
      const res = await readNotifications({
        NotifyId: notifiId,
      });
      if (res && res.statusCode === 200) {
        getNotify();
      }
    } catch (error) {
      console.log("====================================");
      console.log("Có lỗi tại đọc thông báo: ", error);
      console.log("====================================");
    }
  };
  const items = [
    {
      label: <Link to="/user">Hồ sơ cá nhân</Link>,
      key: "dashboard",
      icon: <UserOutlined />,
    },
    {
      label: <Link to="/user/register">Đăng ký đề tài</Link>,
      key: "register",
      icon: <ContainerOutlined />,
      hidden: role !== "User",
    },
    {
      label: <Link to="/user/manager-review">Đề tài thông qua</Link>,
      key: "manager-review",
      icon: <FileSearchOutlined />,
      hidden: role !== "Dean",
    },
    {
      label: <Link to="/user/manager">Đề tài sơ duyệt</Link>,
      key: "manager",
      icon: <FileProtectOutlined />,
    },
    {
      label: <Link to="/user/review">Xem đề tài</Link>,
      key: "review",
      icon: <FileSyncOutlined />,
    },
    {
      label: <Link to="/user/track">Theo dõi tiến độ</Link>,
      key: "track",
      icon: <FileDoneOutlined />,
    },
  ];
  const itemDropdown = [
    {
      label: (
        <label style={{ cursor: "pointer" }} onClick={() => setIsOpen(true)}>
          Đổi mật khẩu
        </label>
      ),
      key: "account",
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
    "https://cdn1.vectorstock.com/i/1000x1000/14/80/doctor-web-icon-therapist-avatar-vector-18531480.jpg";

  const notifyIsEmpty =
    listNotify.unreadNotificationsNumber === 0 ? true : false;
  const getMessage = (notifi) => {
    for (const condition of conditions) {
      if (
        notifi.state === condition.state &&
        notifi.progress === condition.progress &&
        notifi.isReject === condition.isReject
      ) {
        return condition.message;
      }
    }
  };

  const content = (
    <div className="popover-cart-body">
      {notifyIsEmpty ? (
        <div className="image-cart">
          <p>Hiện chưa có thông báo</p>
        </div>
      ) : (
        <div className="popover-cart-content">
          {listNotify?.notifies?.map((notifi, index) => {
            const message = getMessage(notifi);
            if (notifi.hasRead === false) {
              if (message) {
                return (
                  <div
                    key={`notifi-${index}`}
                    className={`notification-item ${
                      !notifi.hasRead ? "unread" : ""
                    }`}
                    onClick={() => markAsRead(notifi.notifyId)}
                    role="button"
                    aria-pressed="false"
                    tabIndex="0"
                  >
                    <div className="content">
                      <p className="notification-topic">
                        Đề tài: {notifi?.topicName}
                      </p>
                      <p className="notification-message">{message}</p>
                    </div>
                  </div>
                );
              }
            }
            return null;
          })}
        </div>
      )}
    </div>
  );
  const CustomTitle = (
    <div>
      <h3 style={{ color: "red" }}>Thông báo</h3>
    </div>
  );
  useEffect(() => {
    getNotify();
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
          >
            {items.map((item) => {
              if (!item.hidden || role === "Dean") {
                return (
                  <Menu.Item key={item.key} icon={item.icon}>
                    {item.label}
                  </Menu.Item>
                );
              }
              return null;
            })}
          </Menu>
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
            <Popover
              content={content}
              title={CustomTitle}
              placement="topRight"
              arrow={true}
              className="popover-carts"
              rootClassName="popover-carts"
            >
              <Badge
                count={listNotify.unreadNotificationsNumber}
                showZero
                size={"small"}
                style={{ marginRight: "20px" }}
              >
                <BellOutlined
                  className="icon-cart"
                  style={{ fontSize: "18px", marginRight: "20px" }}
                />
              </Badge>
            </Popover>

            <Dropdown
              menu={{
                items: itemDropdown,
              }}
              trigger={["click"]}
            >
              <a className="staff-href" onClick={(e) => e.preventDefault()}>
                <Space>
                  <Avatar src={url} />
                  <div style={{ marginTop: "15px" }}>
                    {name}
                    <p style={{ display: "flex", justifyContent: "center" }}>
                      {role === "User" ? "Bác sĩ" : "Trưởng Khoa"}
                    </p>
                  </div>

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
      <ChangePassword
        openModal={isOpen}
        setOpenModal={setIsOpen}
        handleLogout={handleLogout}
        email={email}
      />
    </Layout>
  );
};
export default LayoutUser;
