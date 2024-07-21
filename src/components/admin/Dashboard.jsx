import React, { useEffect, useState } from "react";
import { Card, Col, Layout, Row, Typography } from "antd";
import BypassSwitch from "./dashboardComponent/BypassSwitch";
import BreakTimeInput from "./dashboardComponent/BreakTimeInput";
import CancelTimeInput from "./dashboardComponent/CancelTimeInput";
import HolidaysPicker from "./dashboardComponent/HolidaysPicker";
import "./AdminPanel.scss";
import { getStateApi } from "../../services/api";
const { Content } = Layout;
const { Title } = Typography;
const Dashboard = () => {
  const [config, setConfig] = useState({});
  const getState = async () => {
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
    getState();
  }, []);
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Content>
        <Title level={2} style={{ textAlign: "center", marginBottom: "40px" }}>
          Quản lý các trạng thái
        </Title>
        <Row gutter={[20, 20]} className="admin-panel">
          <Col span={8}>
            <Card title="Thêm trường phòng duyệt" className="admin-card">
              <BypassSwitch state={config.isBypassCensorship} />
            </Card>
          </Col>
          <Col span={8}>
            <Card title="Thời gian chuẩn bị cuộc họp" className="admin-card">
              <BreakTimeInput
                timeDefault={config.breakTimeInMinutes}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card
              title="Thời gian cho phép hủy cuộc họp"
              className="admin-card"
            >
              <CancelTimeInput
                timeDefault={parseInt(config.cancelMeetingMinTimeInMinutes)/60}
              />
            </Card>
          </Col>
          <Col span={24}>
            <Card title="Các ngày nghỉ lễ" className="admin-card">
              <HolidaysPicker />
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default Dashboard;
