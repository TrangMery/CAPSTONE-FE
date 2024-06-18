import React, { useEffect, useState } from "react";
import { Table, Tooltip, message, Row, Col } from "antd";
import { CloudDownloadOutlined, ExportOutlined } from "@ant-design/icons";
import { exportFileAmdin, getTopicCompleted } from "../../services/api";
import TopicSearchForm from "./TopicSearch";
const ExportFile = () => {
  const [loading, setLoading] = useState(false);
  const [listTopic, setListTopic] = useState();
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [filters, setFilters] = useState("");
  const getTopicComplete = async () => {
    try {
      setLoading(true);
      const res = await getTopicCompleted(filters);
      if (res && res.statusCode === 200) {
        setListTopic(res.data.topics);
        setLoading(false);
      }
    } catch (error) {
      console.log("====================================");
      console.log("có lỗi tại admin account", error);
      console.log("====================================");
    }
  };

  // edit working process
  const handleExport = async (topicId) => {
    setLoading(true);
    try {
      const res = await exportFileAmdin({
        topicId: topicId,
      });
      if (res && res.statusCode === 200) {
        setLoading(false);
        const link = document.createElement("a");
        link.href = res.data;
        link.setAttribute("download", "");
        document.body.appendChild(link);
        link.click();
        link.remove();
      } else {
        setLoading(false);
        message.error("Vui lòng thử lại sau");
      }
    } catch (error) {
      console.log("Error tại xuất file admin: ", error);
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
      title: "Lĩnh vực ",
      dataIndex: "categoryName",
    },
    {
      title: "Hành động",
      render: (text, record, index) => {
        const style1 = {
          color: "blue",
          fontSize: "18px",
          cursor: "pointer",
          paddingTop: "2px",
        };
        return (
          <div>
            <Tooltip placement="top" title="Xuất file tổng kết">
              <CloudDownloadOutlined
                onClick={() => handleExport(record.topicId)}
                style={style1}
              />
            </Tooltip>
          </div>
        );
      },
      align: "center",
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
          <TopicSearchForm handleSearchTopic={handleSearchTopic} />
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
export default ExportFile;
