import React from "react";
import {
  Card,
  Row,
  Col,
  Statistic,
  Layout,
  Typography,
  Divider,
  Space,
} from "antd";
import {
  FundOutlined,
  PlayCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";

const { Content } = Layout;
const { Title } = Typography;

const Dashboard = ({
  totalProjects,
  runningProjects,
  completedProjects,
  rejectedProjects,
  projectStages,
}) => {
  const renderStageCard = (status, stages, color) => {
    const cardStyle = {
      borderLeft: `5px solid ${color}`,
    };

    const titleStyle = {
      maxWidth: '100%',
    };
  
    const statisticCardStyle = {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      height: '150px', // Allow height to adjust as needed
      minHeight: '120px', // Set a minimum height to ensure uniformity
    };
    return (
      <Col span={24} key={status} style={{ marginBottom: "20px" }}>
        <Card title={status} style={cardStyle}>
          <Row gutter={[16, 16]}>
            {stages.map((stage, index) => (
              <Col span={6} key={index}>
                <Card style={statisticCardStyle}>
                  <Statistic
                    title={<div style={titleStyle}>{stage.title}</div>}
                    value={stage.value + " " + "đề tài"}
                    valueStyle={{ color }}
                  />
                </Card>
              </Col>
            ))}
          </Row>
        </Card>
      </Col>
    );
  };
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Content style={{ padding: "50px" }}>
        <Title level={2} style={{ textAlign: "center", marginBottom: "40px" }}>
          Quản lý Đề tài
        </Title>
        <Row gutter={16}>
          <Col span={6}>
            <Card>
              <Statistic
                title="Tổng số đề tài"
                value={totalProjects}
                valueStyle={{ color: "#3f8600" }}
                prefix={<FundOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Đề tài đang chạy"
                value={runningProjects}
                valueStyle={{ color: "#1890ff" }}
                prefix={<PlayCircleOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Đề tài đã hoàn thành"
                value={completedProjects}
                valueStyle={{ color: "#cf1322" }}
                prefix={<CheckCircleOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Đề tài bị từ chối"
                value={rejectedProjects}
                valueStyle={{ color: "#d9534f" }}
                prefix={<CloseCircleOutlined />}
              />
            </Card>
          </Col>
        </Row>
        <Divider />
        <Title level={4} style={{ marginTop: "40px" }}>
          Giai đoạn của đề tài
        </Title>
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <Row gutter={16}>
            {Object.keys(projectStages).map((status, index) =>
              renderStageCard(
                status,
                projectStages[status],
                status === "Đăng kí đề tài"
                  ? "#3f8600"
                  : status === "Đề tài giữa kỳ"
                  ? "#1890ff"
                  : status === "Đề tài cuối kỳ"
                  ? "#cf1322"
                  : "#d9534f"
              )
            )}
          </Row>
        </Space>
      </Content>
    </Layout>
  );
};

export default Dashboard;
