import React, { useEffect, useState } from "react";
import { Table, Tooltip, Tag } from "antd";
import { ExportOutlined } from "@ant-design/icons";
import { getTopicCompleted } from "../../services/api";

const ExportFile = () => {
  const [loading, setLoading] = useState(false);
  const [listTopic, setListTopic] = useState();
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const getTopicComplete = async () => {
    try {
      setLoading(true);
      const res = await getTopicCompleted();
      console.log(res);
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
    try {
      const data = {
        topicId: topicId,
      };
      // const res = await assignDeanByAdmin(data);
      // if (res && res.statusCode === 200) {
      //   message.success("Xuất file thành công");
      //   getTopicComplete();
      // }
    } catch (error) {
      console.log("====================================");
      console.log("Có lỗi tại đăng kí dean");
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
      title: "Loại đề tài",
      dataIndex: "categoryName",
    },
    {
      title: "Trạng thái",
      render: (text, record, index) => {
        return <Tag color="green">Đã hoàn thành</Tag>;
      },
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
              <ExportOutlined
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
        <h2 style={{ fontWeight: "bold", fontSize: "30px", color: "#303972" }}>
          Danh sách đề tài đã hoàn thành
        </h2>
      </div>
    </div>
  );

  useEffect(() => {
    getTopicComplete();
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
    </div>
  );
};
export default ExportFile;
