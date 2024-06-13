import React, { useEffect, useState } from "react";
import { Table, Tag, DatePicker, Row, Col } from "antd";
import { getAllTopics } from "../../../services/api";
import TopicSearchFormStaff from "./TopicSearchStaff";
const ViewTopic = () => {
  const [loading, setLoading] = useState(false);
  const [listTopic, setListTopic] = useState();
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [filters, setFilters] = useState("");
  const getTopicComplete = async () => {
    try {
      setLoading(true);
      const res = await getAllTopics(filters);
      if (res && res.statusCode === 200) {
        setListTopic(res.data);
        setLoading(false);
      }
    } catch (error) {
      console.log("====================================");
      console.log("có lỗi tại admin account", error);
      console.log("====================================");
    }
  };
  const columns = [
    {
      title: "Mã đề tài",
      dataIndex: "code",
    },
    {
      title: "Tên đề tài",
      dataIndex: "topicName",
    },
    {
      title: "Chủ nhiệm đề tài",
      dataIndex: "leaderName",
    },
    {
      title: "Loại đề tài",
      dataIndex: "categoryName",
    },
  ];
  const handleSearchTopic = (query) => {
    setFilters(query);
  };
  const renderHeader = () => (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {" "}
        <h2 style={{ fontWeight: "bold", fontSize: "20px", color: "#303972" }}>
          Danh sách đề tài đã hoàn thành
        </h2>
      </div>
    </div>
  );

  useEffect(() => {
    getTopicComplete();
  }, [filters]);
  const onChange = (pagination, filters, sorter, extra) => {
    if (pagination.current !== current) {
      setCurrent(pagination.current);
    }
    if (pagination.pageSize !== pageSize) {
      setPageSize(pagination.pageSize);
      setCurrent(1);
    }
  };
  return (
    <>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <TopicSearchFormStaff handleSearchTopic={handleSearchTopic} />
        </Col>
        <Col span={24}>
          <Table
            title={renderHeader}
            columns={columns}
            dataSource={listTopic}
            loading={loading}
            onChange={onChange}
            pagination={{
              current: current,
              pageSize: pageSize,
              showSizeChanger: true,
              pageSizeOptions: ["7", "10", "15"],
              showTotal: (total, range) => {
                return (
                  <div>
                    {range[0]} - {range[1]} on {total} rows
                  </div>
                );
              },
            }}
          />
        </Col>
      </Row>
    </>
  );
};
export default ViewTopic;
