import {
  InfoCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Button, Input, Space, Table, Tabs, Tag, ConfigProvider  } from "antd";
import React, { useEffect, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import "../../staff/project/project.scss";
import ModalInfor from "./ModalInfor";
import "./table.scss";
// sơ duyệt
import {
  getTopicReviewerAPI,
  getReviewedByMember,
} from "../../../services/api";
import viVN from 'antd/lib/locale/vi_VN';
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);
const dateFormat = "DD/MM/YYYY";
// import ModalInfor from "../../modalInfor.jsx";
const ProjectManagerUser = () => {
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setDataUser] = useState({});
  const [status, setStatus] = useState(false);
  const [activeTab, setActiveTab] = useState("notpassyet");
  const [dataTopicForMember, setdataTopicForMember] = useState([]);
  const userId = sessionStorage.getItem("userId");
  useEffect(() => {
    getTopicReviewer();
  }, [status]);
  const items = [
    {
      key: "notpassyet",
      label: `Chưa duyệt`,
      children: <></>,
    },
    {
      key: "done",
      label: `Đã duyệt`,
      children: <></>,
    },
  ];
  const getTopicReviewer = async () => {
    try {
      const res = await getTopicReviewerAPI({
        memberId: userId, 
      });
      if (res && res?.data) {
        setdataTopicForMember(res.data);
      } else {
        console.log("ko load dc api");
      }
    } catch (error) {
      console.log("có lỗi tại getTopicReviewe: ", error);
    }
  };
  const getTopicHadReviwed = async () => {
    try {
      const res = await getReviewedByMember({
        memberId: userId,
      });
      if (res && res?.data) {
        setdataTopicForMember(res.data);
      } else {
        console.log("ko load dc api");
      }
    } catch (error) {
      console.log("có lỗi tại getTopicReviewe: ", error);
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
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase().trim()),
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
      title: "STT",
      key: "index",
      render: (text, record, index) => index + 1,
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
      title: "Lĩnh Vực",
      dataIndex: "categoryName",
      key: "categoryName",
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
        const color = record.memberDecision ? "green" : "red";
        const status = record.memberDecision ? "Đồng ý" : "Từ chối";
        return (
          <div style={{ textAlign: "center" }}>
            <InfoCircleOutlined
              style={style1}
              onClick={() => {
                setIsModalOpen(true);
                setDataUser(record);
              }}
            />
            {activeTab === "done" && (
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
            getTopicHadReviwed();
          } else {
            getTopicReviewer();
          }
        }}
        style={{ overflowX: "auto", marginLeft: "30px" }}
      />
    </div>
  );
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
  const customLocale = {
    emptyText: 'Không có dữ liệu',
  };
  return (
    <div>
      <h2 style={{ fontWeight: "bold", fontSize: "30px", color: "#303972" }}>
        Danh sách đề tài chờ sơ duyệt
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
        {...customLocale}
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
        title={renderHeader}
      />
      </ConfigProvider>
      <ModalInfor
        currentTab={activeTab}
        data={data}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        status={status}
        setStatus={setStatus}
      />
    </div>
  );
};

export default ProjectManagerUser;
