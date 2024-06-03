import React, { useEffect, useState } from "react";
import { Button, Empty, Space, Table, Tabs, Tag, Tooltip, message } from "antd";
import { BulbOutlined, CloudDownloadOutlined } from "@ant-design/icons";

import { getAllCompletedTopics } from "../../../services/api";
import dayjs from "dayjs-ext";
import ViewDetailTopic from "./viewDetailTopic";

const CompletedTopic = () => {
  const [loading, setLoading] = useState(false);
  const [listTopic, setListTopic] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [topicId, setTopicId] = useState();
  const userId = localStorage.getItem("userId");
  const getTopic = async () => {
    try {
      setLoading(true);
      const res = await getAllCompletedTopics({
        userId: userId,
      });
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
      title: "Lĩnh vực",
      dataIndex: "categoryName",
    },
    {
      title: "Ngày hoàn thành",
      render: (text, record, index) => {
        return <>{dayjs(record.completedDate).format("DD/MM/YYYY")}</>;
      },
    },
    {
      title: "Hành động",
      render: (_, record) => {
        return (
          <>
            <Tooltip title="Xem chi tiết">
              <BulbOutlined
                onClick={() => {
                  setIsOpen(true);
                  setTopicId(record.topicId);
                }}
              />
            </Tooltip>
          </>
        );
      },
    },
  ];
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
          Danh sách các đề tài đã hoàn thành
        </h2>
      </div>
    </div>
  );

  useEffect(() => {
    getTopic();
  }, []);
  const onChange = (pagination, filters, sorter, extra) => {
    if (pagination.current !== current) {
      setCurrent(pagination.current);
    }
    if (pagination.pageSize !== pageSize) {
      setPageSize(pagination.pageSize);
      setCurrent(1);
    }
    console.log("parms: ", pagination, filters, sorter, extra);
  };
  return (
    <div>
      {listTopic.length === 0 ? (
        <Empty
          style={{ marginTop: 100 }}
          description={<span>Chưa hoàn thành đề tài nào</span>}
        />
      ) : (
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
      )}
      <ViewDetailTopic open={isOpen} setOpen={setIsOpen} topicId={topicId} />
    </div>
  );
};
export default CompletedTopic;
