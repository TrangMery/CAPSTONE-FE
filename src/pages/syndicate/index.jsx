import React, { useState } from "react";
import { Breadcrumb, Layout, Menu, Space, theme } from "antd";
import Stage1 from "../../components/stage/Stage1";
import Stage2 from "../../components/stage/Stage2";
import Stage3 from "../../components/stage/Stage3";
import Stage4 from "../../components/stage/Stage4";
const { Header, Content, Footer } = Layout;
const items = [
  {
    key: 1,
    label: "Giai đoạn đầu kỳ",
  },
  {
    key: 2,
    label: "Giai đoạn giữa kỳ",
  },
  {
    key: 3,
    label: "Giai đoạn cuối kỳ",
  },
  {
    key: 4,
    label: "Giai đoạn kết thúc",
  },
];
const apiContent = {
  1: "API cho giai đoạn đầu kỳ",
  2: "API cho giai đoạn giữa kỳ",
  3: "API cho giai đoạn cuối kỳ",
  4: "API cho giai đoạn kết thúc",
};
const Syndicate = () => {
  const [selectedStage, setSelectedStage] = useState("1");
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const handleMenuClick = (e) => {
    setSelectedStage(e.key);
  };
  const renderStageComponent = () => {
    switch (selectedStage) {
      case "1":
        return <Stage1 />;
      case "2":
        return <Stage2 />;
      case "3":
        return <Stage3 />;
      case "4":
        return <Stage4 />;
      default:
        return null;
    }
  };
  return (
    <Layout>
      <Header
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Space size={"middle"}>
          <h2 style={{ color: "white", marginTop: "10px" }}>RMS</h2>
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={["1"]}
            items={items}
            style={{
              flex: 1,
              minWidth: 0,
            }}
            onClick={handleMenuClick}
          />
        </Space>
      </Header>
      <Content
        style={{
          padding: "0 48px",
        }}
      >
        <Breadcrumb
          style={{
            margin: "16px 0",
          }}
        ></Breadcrumb>
        <div
          style={{
            background: colorBgContainer,
            minHeight: 500,
            padding: 24,
            borderRadius: borderRadiusLG,
          }}
        >
          <h3>{apiContent[selectedStage]}</h3>
          {renderStageComponent()}
        </div>
      </Content>
      <Footer
        style={{
          textAlign: "center",
        }}
      >
        RMS Mock Api ©{new Date().getFullYear()}
      </Footer>
    </Layout>
  );
};
export default Syndicate;
