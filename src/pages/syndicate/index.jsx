import React, { useState } from 'react';
import { Layout, Menu, Card, Button, Row, Col, message } from 'antd';
import axios from 'axios';

const { Header, Content } = Layout;

const mockApis = [
  // Array of 20 mock API endpoints
  { id: 1, name: 'API 1', url: 'https://mockapi.example.com/api1' },
  { id: 2, name: 'API 2', url: 'https://mockapi.example.com/api2' },
  // Add remaining 18 API endpoints
];

const ManagerSyndicate = () => {
  const [loading, setLoading] = useState(false);

  const callApi = async (url) => {
    setLoading(true);
    try {
      const response = await axios.get(url);
      message.success(`Response: ${JSON.stringify(response.data)}`);
    } catch (error) {
      message.error(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Header>
        <div className="logo" />
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
          <Menu.Item key="1">SRMS</Menu.Item>
        </Menu>
      </Header>
      <Content style={{ padding: '50px' }}>
        <Row gutter={[16, 16]}>
          {mockApis.map((api) => (
            <Col key={api.id} span={6}>
              <Card title={api.name}>
                <Button type="primary" onClick={() => callApi(api.url)} loading={loading}>
                  Call {api.name}
                </Button>
              </Card>
            </Col>
          ))}
        </Row>
      </Content>
    </Layout>
  );
};

export default ManagerSyndicate;



