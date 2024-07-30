import { FundViewOutlined, SearchOutlined } from "@ant-design/icons";
import {
  Badge,
  Button,
  ConfigProvider,
  Input,
  Space,
  Table,
  Tabs,
  Tag,
} from "antd";
import React, { useEffect, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import "../../staff/project/project.scss";
import { useNavigate } from "react-router-dom";
import "./table.scss";
import { getTopicByUserId } from "../../../services/api";
import viVN from "antd/lib/locale/vi_VN";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import ModalMeetingInfor from "./ModalMeetingInfor";
dayjs.extend(customParseFormat);
const dateFormat = "DD/MM/YYYY";
// import ModalInfor from "../../modalInfor.jsx";
const ProjectForTrack = () => {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  // const [status, setStatus] = useState(true);
  const [dataTopicForMember, setdataTopicForMember] = useState([]);
  const getProjectProcess = async () => {
    try {
      const res = await getTopicByUserId({
        userId: sessionStorage.getItem("userId"),
        status: true,
      });
      if (res && res.isSuccess) {
        console.log(res);
        setdataTopicForMember(res.data);
      }
    } catch (error) {
      console.log("====================================");
      console.log("Có lỗi tại theo dõi đề tài: " + error.message);
      console.log("====================================");
    }
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Tìm kiếm`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Tìm kiếm
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters, confirm)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Xóa tìm kiếm
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            Đóng
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1677ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase().trim()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const columns = [
    {
      title: "Mã đề tài",
      key: "code",
      color: "red",
      dataIndex: "code",
      width: "10%",
    },
    {
      title: "Tên Đề Tài",
      dataIndex: "topicName",
      key: "topicName",
      ...getColumnSearchProps("topicName"),
      width: "30%",
    },
    {
      title: "Lĩnh Vực",
      dataIndex: "categoryName",
      key: "categoryName",
    },
    {
      title: "Ngày nộp",
      render: (text, record, index) => {
        return <div>{dayjs(record.createdAt).format(dateFormat)}</div>;
      },
      key: "createdAt",
    },
    {
      title: "Trạng thái",
      sorter: (a, b) => {
        if (a.status < b.status) return -1;
        if (a.status > b.status) return 1;
        return 0;
      },
      render: (text, record, index) => {
        const content =
          record.status === true ? "Đang thực hiện" : "Bị hủy đề tài";
        const color = record.status === true ? "processing" : "red";
        if (record.progress !== "Completed")
          return (
            <Tag
              style={{
                fontSize: "13px",
              }}
              color={color}
            >
              {content}
            </Tag>
          );
        return (
          <Tag
            style={{
              fontSize: "13px",
            }}
            color={"success"}
          >
            Đã hoàn thành
          </Tag>
        );
      },
    },

    {
      title: "Hành động",
      render: (text, record, index) => {
        const style1 = {
          color: "green",
          fontSize: "20px",
          cursor: "pointer",
          paddingTop: "2px",
        };
        return (
          <div>
            <FundViewOutlined
              onClick={() => {
                navigate(`/user/track/track-topic/${record.topicId}`, {
                  state: { title: record.topicName },
                });
              }}
              style={style1}
            />
          </div>
        );
      },
      align: "center",
    },
  ];

  //search
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0].trim());
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters, confirm) => {
    clearFilters();
    setSearchText("");
    confirm();
  };
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
  useEffect(() => {
    getProjectProcess();
  }, []);
  const locale = {
    // Tùy chỉnh thông báo sắp xếp
    sortTitle: "Sắp xếp theo trạng thái đề tài",
    triggerDesc: "Đang thực hiện",
    triggerAsc: "Bị hủy đề tài",
    cancelSort: "Hủy sắp xếp",
  };
  return (
    <>
      <h2 style={{ fontWeight: "bold", fontSize: "30px", color: "#303972" }}>
        Theo dõi tiến độ đề tài
      </h2>
      <ConfigProvider locale={viVN}>
        <Table
          rowClassName={(record, index) =>
            index % 2 === 0 ? "table-row-light" : "table-row-dark"
          }
          bordered={true}
          columns={columns}
          dataSource={dataTopicForMember}
          onChange={onChange}
          rowKey={"_id"}
          pagination={{
            current: current,
            pageSize: pageSize,
            showSizeChanger: true,
            pageSizeOptions: ["5", "10", "15"],
            showTotal: (total, range) => {
              return (
                <div>
                  {range[0]} - {range[1]} tên {total} hàng
                </div>
              );
            },
          }}
          locale={locale}
        />
      </ConfigProvider>
    </>
  );
};

export default ProjectForTrack;
