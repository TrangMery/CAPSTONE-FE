import React from "react";
import { Card, Col, Layout, Row, Typography } from "antd";
import BypassSwitch from "./dashboardComponent/BypassSwitch";
import BreakTimeInput from "./dashboardComponent/BreakTimeInput";
import CancelTimeInput from "./dashboardComponent/CancelTimeInput";
import HolidaysPicker from "./dashboardComponent/HolidaysPicker";
import "./AdminPanel.scss";
const { Content } = Layout;
const { Title } = Typography;
const Dashboard = () => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Content>
        <Title level={2} style={{ textAlign: "center", marginBottom: "40px" }}>
          Quản lý các trạng thái 
        </Title>
        <Row gutter={[20, 20]} className="admin-panel">
          <Col span={8}>
            <Card title="Thêm trường phòng duyệt" className="admin-card">
              <BypassSwitch />
            </Card>
          </Col>
          <Col span={8}>
            <Card title="Thời gian chuẩn bị cuộc họp" className="admin-card">
              <BreakTimeInput />
            </Card>
          </Col>
          <Col span={8}>
            <Card title="Thời gian cho phép hủy cuộc họp" className="admin-card">
              <CancelTimeInput />
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
