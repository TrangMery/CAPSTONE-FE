import {
  CheckOutlined,
  CloseOutlined,
  FileSyncOutlined,
  FundViewOutlined,
  InfoCircleOutlined,
  ScheduleOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Button, Input, Space, Table, Tabs, Tag } from "antd";
import React, { useEffect, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import "../../staff/project/project.scss";
import { useNavigate } from "react-router-dom";
import "./table.scss";
import {
  getReviewDocumentsDone,
  getTopicForCouncilMeeting,
} from "../../../services/api";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import ModalInfor from "./ModalInfor";
import ModalInforMeeting from "./ModalMeeting";
dayjs.extend(customParseFormat);
const dateFormat = "DD/MM/YYYY";
// import ModalInfor from "../../modalInfor.jsx";
const ProjectResubmit = () => {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [data, setDataUser] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("notyet");
  const [dataTopicForCouncil, setdataTopicForCouncil] = useState([]);
  const userId = localStorage.getItem("userId");
  const items = [
    {
      key: "notyet",
      label: `Chưa thông qua`,
      children: <></>,
    },
    {
      key: "done",
      label: `Đã thông qua`,
      children: <></>,
    },
  ];
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
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Xóa
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
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
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
      dataIndex: "code",
      key: "code",
      color: "red",
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
      title: "Giai đoạn",
      key: "state",
      render: (text, record, index) => {
        return (
          <>
            {record.state === "EarlytermReport"
              ? "Đăng kýđề tài"
              : record.state === "MidtermReport"
              ? "Báo cáo giữa kỳ"
              : "Báo cáo cuối kỳ"}
          </>
        );
      },
    },
    {
      title: "Ngày",
      render: (text, record, index) => {
        return <div>{dayjs(record.createdAt).format(dateFormat)}</div>;
      },
      key: "createdAt",
    },
    {
      title: "Hành động",
      render: (text, record, index) => {
        const style1 = {
          color: "blue",
          fontSize: "1.5em",
          cursor: "pointer",
        };
        const style2 = {
          color: "green",
          fontSize: "1.5em",
          margin: "0 10px",
          cursor: "pointer",
        };
        const color = record.ChairmanDecision ? "green" : "red";
        const status = record.ChairmanDecision ? "Đồng ý" : "Từ chối";
        return (
          <div style={{ textAlign: "center" }}>
            <InfoCircleOutlined
              style={style1}
              onClick={() => {
                setIsModalOpen(true);
                setDataUser(record);
              }}
            />
            {record.hasResultFile && (
              <FileSyncOutlined
                onClick={() => {
                  navigate(`/user/review/review-topic/${record.topicId}`);
                }}
                style={style2}
              />
            )}
            {activeTab == "done" && (
              <>
                <Tag
                  style={{
                    marginLeft: "10px",
                    fontSize: "13px",
                    padding: "5px 8px",
                  }}
                  color={color}
                >
                  {status}
                </Tag>
              </>
            )}
          </div>
        );
      },
      align: "center",
    },
  ];

  const renderHeader = () => (
    <div>
      <Tabs
        defaultActiveKey="notyet"
        items={items}
        onChange={(value) => {
          setActiveTab(value);
          if (value === "done") {
            getTopicDoneForCouncil();
          } else {
            getTopicForCouncil();
          }
        }}
        style={{ overflowX: "auto", marginLeft: "30px" }}
      />
    </div>
  );
  const getTopicForCouncil = async () => {
    const res = await getTopicForCouncilMeeting({
      councilId: userId,
    });
    if (res && res?.data) {
      setdataTopicForCouncil(res.data);
    }
  };
  const getTopicDoneForCouncil = async () => {
    const res = await getReviewDocumentsDone({
      councilId: userId,
    });
    if (res && res?.data) {
      setdataTopicForCouncil(res.data);
    }
  };
  useEffect(() => {
    getTopicForCouncil();
  }, []);
  //search
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
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
  return (
    <div>
      <h2 style={{ fontWeight: "bold", fontSize: "30px", color: "#303972" }}>
        Đề tài đang tham gia hội đồng
      </h2>
      <Table
        rowClassName={(record, index) =>
          index % 2 === 0 ? "table-row-light" : "table-row-dark"
        }
        bordered={true}
        columns={columns}
        dataSource={dataTopicForCouncil}
        onChange={onChange}
        rowKey={"_id"}
        pagination={{
          current: current,
          pageSize: pageSize,
          showSizeChanger: true,
          pageSizeOptions: ["5", "10", "15"],
        }}
        title={renderHeader}
        loading={isLoading}
      />
      <ModalInfor
        data={data}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
    </div>
  );
};

export default ProjectResubmit;
