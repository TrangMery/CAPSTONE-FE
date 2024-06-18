import {
  CalendarOutlined,
  InfoCircleOutlined,
  MinusCircleOutlined,
  SearchOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import {
  Button,
  ConfigProvider,
  Input,
  Popconfirm,
  Space,
  Table,
  Tabs,
  Tag,
  Tooltip,
} from "antd";
import React, { useEffect, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import "./project.scss";
import ModalInfor from "../../user/project/ModalInfor";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);
const dateFormat = "DD/MM/YYYY";
import {
  topicWaitingMeeting,
  getMidTermReport,
  getMidTermReportWait,
  topicMidTearmCreatedDeadline,
  staffCancelCouncil,
} from "../../../services/api";
import ModalMidTerm from "./ModalMidterm";
import { useNavigate } from "react-router-dom";
import ModalTimeCouncil from "./modalTimeCouncil";
const ProjectManagerMidTerm = () => {
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const [checkTab, setCheckTab] = useState("notyet");
  const [dataSource, setData] = useState([]);
  const [dataPro, setDataPro] = useState({});
  const [isModalInforOpen, setIsModalInforOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalCouncilOpen, setIsModalCouncilOpen] = useState(false);
  const items = [
    {
      key: "notyet",
      label: `Chưa tạo lịch báo cáo`,
      children: <></>,
    },
    {
      key: "dabaocao",
      label: `Đã tạo lịch báo cáo`,
      children: <></>,
    },
    {
      key: "taohoidong",
      label: `Thêm thành viên hội đồng`,
      children: <></>,
    },
    {
      key: "dataohoidong",
      label: `Đã tạo hội đồng`,
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
      title: "Mã Đề Tài",
      key: "index",
      dataIndex: "topicId",
      width: "10%",
      hidden: true,
    },
    {
      title: "Tên Đề Tài",
      dataIndex: "topicName",
      key: "name",
      width: "30%",
      ...getColumnSearchProps("topicName"),
    },
    {
      title: "Lĩnh Vực",
      dataIndex: "categoryName",
      key: "categoryName",
    },
    {
      title:
        checkTab === "notyet"
          ? "Ngày tải hợp đồng"
          : checkTab === "dataohoidong"
          ? "Ngày họp"
          : "Hạn nộp file",
      render: (text, record, index) => {
        if (checkTab === "notyet") {
          return <div>{dayjs(record.uploadContractAt).format(dateFormat)}</div>;
        } else if (checkTab === "dataohoidong") {
          return (
            <div>
               {dayjs(record.meetingTime).format("DD/MM/YYYY HH:mm")}
            </div>
          );
        }
        return (
          <div>
            {dayjs(
              record.documentSupplementationDeadline ||
                record.supplementationDeadline
            ).format(dateFormat)}
          </div>
        );
      },
      key: "createdAt",
      align: "center",
    },
    {
      title: "Loại đề tài",
      render: (text, record, index) => {
        const content =
          record.topicType === "Internal" ? "Nội Khoa" : "Ngoại Khoa";
        const color = record.topicType === "Internal" ? "green" : "blue";
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
      },
      align: "center",
    },
    {
      title: "Hành động",
      render: (text, record, index) => {
        return (
          <div style={{ textAlign: "center" }}>
            <ConfigProvider
              theme={{
                token: {
                  colorPrimary: "#55E6A0",
                },
              }}
            >
              <InfoCircleOutlined
                style={{ fontSize: "20px", color: "blue" }}
                onClick={() => {
                  setIsModalInforOpen(true);
                  setDataPro(record);
                }}
              />{" "}
              {checkTab === "notyet" && (
                <Tooltip placement="top" title={"Tạo thời gian báo cáo"}>
                  <CalendarOutlined
                    style={{
                      fontSize: "20px",
                      color: "black",
                      margin: "0 10px",
                    }}
                    type="primary"
                    onClick={() => {
                      setIsModalOpen(true);
                      setDataPro(record);
                    }}
                  />
                </Tooltip>
              )}
              {checkTab === "taohoidong" && (
                <Tooltip placement="top" title={"Tạo hội đồng"}>
                  <UsergroupAddOutlined
                    style={{
                      fontSize: "20px",
                      color: "blue",
                      margin: "0 10px",
                    }}
                    type="primary"
                    onClick={() => {
                      setDataPro(record);
                      setIsModalCouncilOpen(true);
                    }}
                  >
                    Tạo hội đồng
                  </UsergroupAddOutlined>
                </Tooltip>
              )}
              {checkTab === "dataohoidong" && (
              <Popconfirm
                title="Hủy hội đồng"
                description="Bạn có chắc chắn hủy hội đồng"
                onConfirm={() => cancelCouncil(record.topicId)}
                okText="Hủy"
                cancelText="Quay lại"
              >
                <Tooltip placement="bottom" title={"Hủy hội đồng"}>
                  <MinusCircleOutlined
                    style={{
                      fontSize: "20px",
                      color: "red",
                      margin: "0 10px",
                    }}
                    type="primary"
                  />
                </Tooltip>
              </Popconfirm>
            )}
            </ConfigProvider>
          </div>
        );
      },
      align: "center",
    },
  ];

  const getTopicMidTerm = async () => {
    try {
      const res = await getMidTermReportWait();
      setIsLoading(true);
      if (res && res?.data) {
        setData(res.data);
        setIsLoading(false);
      }
    } catch (error) {
      console.log("có lỗi tại getTopicMidTerm: " + error);
    }
  };
  const getTopicHadDeadline = async () => {
    try {
      const res = await topicMidTearmCreatedDeadline();
      if (res && res?.data) {
        setData(res.data);
        setIsLoading(false);
      }
    } catch (error) {
      console.log("có lỗi tại getTopicWaitCouncil: " + error);
    }
  };
  const getTopicWaitCouncil = async () => {
    try {
      const res = await getMidTermReport();
      if (res && res?.data) {
        setData(res.data);
        setIsLoading(false);
      }
    } catch (error) {
      console.log("có lỗi tại getTopicWaitCouncil: " + error);
    }
  };
  const getTopicHadCreateCouncil = async () => {
    try {
      const res = await topicWaitingMeeting({
        state: 2,
      });
      if (res && res?.data) {
        setData(res.data);
      }
    } catch (error) {
      console.log("có lỗi tại getTopicForCouncil: " + error);
    }
  };
  const cancelCouncil = async (topicId) => {
    try {
      const data = {
        topicId: topicId,
      };
      const res = await staffCancelCouncil(data);
      if (res && res?.data) {
        setCheckTab("taohoidong");
      }
    } catch (error) {
      console.log("có lỗi tại getTopicForCouncil: " + error);
    }
  };
  useEffect(() => {
    getTopicMidTerm();
  }, [isModalOpen]);
  const renderHeader = () => (
    <div>
      <Tabs
        defaultActiveKey="notyet"
        items={items}
        onChange={(value) => {
          setCheckTab(value);
          if (value === "notyet") {
            getTopicMidTerm();
          } else if (value === "dabaocao") {
            getTopicHadDeadline();
          } else if (value === "dataohoidong") {
            getTopicHadCreateCouncil();
          } else {
            getTopicWaitCouncil();
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
        Danh sách đề tài giữa kỳ
      </h2>
      <Table
        rowClassName={(record, index) =>
          index % 2 === 0 ? "table-row-light" : "table-row-dark"
        }
        bordered={true}
        columns={columns}
        dataSource={dataSource}
        onChange={onChange}
        rowKey={"key"}
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
        loading={isLoading}
      />

      <ModalInfor
        data={dataPro}
        isModalOpen={isModalInforOpen}
        setIsModalOpen={setIsModalInforOpen}
      />

      <ModalMidTerm
        data={dataPro}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
      <ModalTimeCouncil
        data={dataPro}
        isModalOpen={isModalCouncilOpen}
        setIsModalOpen={setIsModalCouncilOpen}
      />
    </div>
  );
};

export default ProjectManagerMidTerm;
