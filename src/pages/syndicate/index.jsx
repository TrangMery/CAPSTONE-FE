import React, { useState } from "react";
import {
  Layout,
  Menu,
  Card,
  Button,
  message,
  Form,
  Input,
  Collapse,
  theme,
  InputNumber,
  Tabs,
} from "antd";
import Sider from "antd/es/layout/Sider";
import TabPane from "antd/es/tabs/TabPane";
const { Header, Content } = Layout;
const { Panel } = Collapse;

const stages = [
  {
    name: "Giai đoạn đầu kì",
    apis: [
      { id: 1, name: "API 1", url: "https://mockapi.example.com/api1" },
      { id: 2, name: "API 2", url: "https://mockapi.example.com/api2" },
    ],
  },
  {
    name: "Stage 2",
    apis: [
      { id: 3, name: "API 3", url: "https://mockapi.example.com/api3" },
      { id: 4, name: "API 4", url: "https://mockapi.example.com/api4" },
    ],
  },
  // Add remaining stages and APIs
];

const Syndicate = () => {
  const [loading, setLoading] = useState(false);
  const [activeStage, setActiveStage] = useState('1');
  const [form] = Form.useForm();
  const { token } = theme.useToken();
  const panelStyle = {
    marginBottom: 24,
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    border: "none",
  };
  const handleStageChange = (key) => {
    setActiveStage(key);
  };
  const renderAPIForms = (stage) => {
    const apis = [
      { url: '/api1', label: 'API 1' },
      { url: '/api2', label: 'API 2' },
      { url: '/api3', label: 'API 3' },
      { url: '/api4', label: 'API 4' },
      { url: '/api5', label: 'API 5' },
    ]; // You need to populate this array with actual API data based on stage

    return apis.map((api) => (
      <Form key={api.url} form={form} layout="inline" onFinish={() => handleSubmit(api.url)}>
        <Form.Item name="data" label={api.label} rules={[{ required: true, message: 'Please input data' }]}>
          <Input placeholder="Enter data" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Call API
          </Button>
        </Form.Item>
      </Form>
    ));
  };


  return (
    <Layout>
      <Header>
        <div className="logo" />
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["1"]}>
          <Menu.Item key="1">SRMS</Menu.Item>
        </Menu>
      </Header>
      <Layout>
        <Sider width={200} className="site-layout-background">
          <Menu
            mode="inline"
            defaultSelectedKeys={['1']}
            style={{ height: '100%', borderRight: 0 }}
            onClick={(e) => handleStageChange(e.key)}
          >
            <Menu.Item key="1">Stage 1</Menu.Item>
            <Menu.Item key="2">Stage 2</Menu.Item>
            <Menu.Item key="3">Stage 3</Menu.Item>
            <Menu.Item key="4">Stage 4</Menu.Item>
          </Menu>
        </Sider>
        <Layout style={{ padding: '0 24px 24px' }}>
          <Content
            className="site-layout-background"
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
            }}
          >
            <Tabs activeKey={activeStage} onChange={handleStageChange}>
              <TabPane tab="Stage 1" key="1">
                {renderAPIForms(1)}
              </TabPane>
              <TabPane tab="Stage 2" key="2">
                {renderAPIForms(2)}
              </TabPane>
              <TabPane tab="Stage 3" key="3">
                {renderAPIForms(3)}
              </TabPane>
              <TabPane tab="Stage 4" key="4">
                {renderAPIForms(4)}
              </TabPane>
            </Tabs>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default Syndicate;
