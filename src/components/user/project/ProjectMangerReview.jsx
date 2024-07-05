import {
  CheckOutlined,
  CloseOutlined,
  InfoCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Button, Tag, Input, Space, Table, Tabs } from "antd";
import React, { useEffect, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import "../../staff/project/project.scss";
import ModalInfor from "./ModalInfor";
import "./table.scss";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);
const dateFormat = "DD/MM/YYYY";
import { getTopicForDean, viewDeanDecesion } from "../../../services/api";
const ProjectManagerUserReview = () => {
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setDataUser] = useState({});
  const [status, setStatus] = useState(false);
  const [dataTopicForDean, setdataTopicForDean] = useState([]);
  const [currentTab, setCurrentTab] = useState("notpassyet");
  const userId = sessionStorage.getItem("userId");
  const items = [
    {
      key: "notpassyet",
      label: `Chưa thông qua`,
      children: <></>,
    },
    {
      key: "passed",
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
          placeholder={`Search ${dataIndex}`}
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
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
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
      key: "topicId",
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
      key: "date",
    },
    {
      title: "Hành động",
      render: (text, record, index) => {
        const style1 = {
          color: "blue",
          fontSize: "1.5em",
          cursor: "pointer",
        };
        const color = record.deanDecision ? "green" : "red";
        const status = record.deanDecision ? "Đồng ý" : "Từ chối";
        return (
          <div style={{ textAlign: "center" }}>
            <InfoCircleOutlined
              style={style1}
              onClick={() => {
                setIsModalOpen(true);
                setDataUser(record);
              }}
            />
            {currentTab == "passed" &&
              dataTopicForDean &&
              dataTopicForDean.length > 0 && (
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
  const getTopicForDeanAPI = async () => {
    const res = await getTopicForDean({
      deanId: userId,
    });
    if (res && res?.data) {
      setdataTopicForDean(res.data);
    }
  };
  const getTopicHadReviewed = async () => {
    const res = await viewDeanDecesion({
      deanId: userId,
    });
    if (res && res?.data) {
      setdataTopicForDean(res.data);
    }
  };
  const renderHeader = () => (
    <div>
      <Tabs
        defaultActiveKey="notpassyet"
        items={items}
        onChange={(value) => {
          setCurrentTab(value);
          if (value === "notpassyet") {
            getTopicForDeanAPI();
          } else if (value === "passed") {
            getTopicHadReviewed();
          }
        }}
        style={{ overflowX: "auto", marginLeft: "30px" }}
      />
    </div>
  );

  useEffect(() => {
    getTopicForDeanAPI();
  }, [status]);
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
        Danh sách đề tài chờ thông qua
      </h2>
      <Table
        rowClassName={(record, index) =>
          index % 2 === 0 ? "table-row-light" : "table-row-dark"
        }
        bordered={true}
        columns={columns}
        dataSource={dataTopicForDean}
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
                {range[0]} - {range[1]} on {total} rows
              </div>
            );
          },
        }}
        title={renderHeader}
      />
      <ModalInfor
        currentTab={currentTab}
        data={data}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        status={status}
        setStatus={setStatus}
      />
    </div>
  );
};

export default ProjectManagerUserReview;
