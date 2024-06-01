import React from 'react';
import { Card, Row, Col, Statistic, Layout, Typography } from 'antd';
import { FundOutlined, PlayCircleOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

const { Content } = Layout;
const { Title } = Typography;

const Dashboard = ({ totalProjects, runningProjects, completedProjects, rejectedProjects }) => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Content style={{ padding: '50px' }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: '40px' }}>Dashboard Quản lý Đề tài</Title>
        <Row gutter={16}>
          <Col span={6}>
            <Card>
              <Statistic
                title="Tổng số đề tài"
                value={totalProjects}
                valueStyle={{ color: '#3f8600' }}
                prefix={<FundOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Đề tài đang tiến hành"
                value={runningProjects}
                valueStyle={{ color: '#1890ff' }}
                prefix={<PlayCircleOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Đề tài đã hoàn thành"
                value={completedProjects}
                valueStyle={{ color: '#cf1322' }}
                prefix={<CheckCircleOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Đề tài bị từ chối"
                value={rejectedProjects}
                valueStyle={{ color: '#d9534f' }}
                prefix={<CloseCircleOutlined />}
              />
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default Dashboard;
