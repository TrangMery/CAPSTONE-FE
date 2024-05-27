import React, { useEffect, useState } from "react";
import { Table, Tag, DatePicker } from "antd";
import { getTopicCompleted } from "../../../services/api";
import dayjs from "dayjs";
const ViewTopic = () => {
  const [loading, setLoading] = useState(false);
  const [listTopic, setListTopic] = useState();
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [year, setYear] = useState(dayjs().year());
  const getTopicComplete = async () => {
    try {
      setLoading(true);
      const res = await getTopicCompleted({
        CompleteYear: year,
      });
      console.log("====================================");
      console.log(res);
      console.log("====================================");
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
  const onChangeYear = (date, dateString) => {
    setYear(dayjs(date).format("YYYY"));
  };
  const disabledYear = (current) => {
    // Không cho phép chọn năm sau năm hiện tại
    return current && current > dayjs().endOf("year");
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
    }
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
      <DatePicker
        defaultValue={dayjs()}
        disabledDate={disabledYear}
        onChange={onChangeYear}
        picker="year"
      />
    </div>
  );

  useEffect(() => {
    getTopicComplete();
  }, [year]);
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
export default ViewTopic;
