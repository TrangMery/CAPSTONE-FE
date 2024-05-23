import React, { useEffect, useState } from "react";
import { Table, Tag, Card, Layout, Row, Col, Tabs } from "antd";
import {
  getTopicHadConfig,
  getTopicInCompletedConference,
} from "../../services/api";
const { Header, Content } = Layout;


const StaffPage = () => {
  const [projects, setProjects] = useState([]);
  const columns = [
    {
        title: "Mã đề tài",
        dataIndex: "code",
        key: "code",
      },
    {
      title: "Tên đề tài",
      dataIndex: "topicName",
      key: "name",
    },
    {
      title: "Giai đoạn",
      dataIndex: "state",
      key: "state",
      render: (text, record, index) => {
        return (
          <>
            {record.state === "EarlytermReport"
              ? "Đăng kí đề tài"
              : record.state === "MidtermReport"
              ? "Báo cáo giữa kỳ"
              : "Báo cáo cuối kỳ"}
          </>
        );
      },
    },
  ];
  const items = [
    {
      key: "0",
      label: `Đã thêm hội đồng`,
      children: (
        <>
          <Col span={24}>
            <Card title="Đề tài đã thêm hội đồng" bordered={false}>
              <Table
                dataSource={projects}
                columns={columns}
                pagination={false}
                rowKey="id"
              />
            </Card>
          </Col>
        </>
      ),
    },
    {
      key: "1",
      label: `Chưa tạo hội đồng`,
      children: (
        <>
          <Col span={24}>
            <Card title="Đề tài chưa tạo hội đồng" bordered={false}>
              <Table
                dataSource={projects}
                columns={columns}
                pagination={false}
                rowKey="id"
              />
            </Card>
          </Col>
        </>
      ),
    },
  ];

  const getTopicHasConfig = async () => {
    try {
      const res = await getTopicHadConfig();
      if (res && res.statusCode === 200) {
        setProjects(res.data);
      }
    } catch (error) {
      console.log("Có lỗi tại getTopicHasConfig", error);
    }
  };
  const getTopicHasNotConfig = async () => {
    try {
      const res = await getTopicInCompletedConference();
      if (res && res.statusCode === 200) {
        setProjects(res.data);
      }
    } catch (error) {
      console.log("Có lỗi tại getTopicHasConfig", error);
    }
  };
  useEffect(() => {
    getTopicHasConfig();
  }, []);
  return (
    <>
      <Layout>
        <Header
          style={{ color: "white", textAlign: "center", fontSize: "24px" }}
        >
          Thống kê đề tài
        </Header>
        <Content style={{ padding: "20px" }}>
          <Tabs
            defaultActiveKey="0"
            items={items}
            onChange={(value) => {
              if (value === "0") {
                getTopicHasConfig();
              } else if (value === "1") {
                getTopicHasNotConfig();
              }
            }}
            centered
          />
          <Row gutter={[20, 20]}></Row>
        </Content>
      </Layout>
      ;
    </>
  );
};

export default StaffPage;
