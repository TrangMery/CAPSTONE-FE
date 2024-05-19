import {
  CheckOutlined,
  ClockCircleOutlined,
  InfoCircleOutlined,
  SearchOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { Button, Input, Space, Table, Tabs, Tooltip, message } from "antd";
import React, { useEffect, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import "./project.scss";
import ModalUpload from "./ModalUpload";
import ModalInfor from "../../user/project/ModalInfor";
import {
  getTopicUploadContract,
  getTopicUploadDoc,
  getTopicWaitingResubmit,
  moveToMiddleReport,
} from "../../../services/api";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import ModalUploadContract from "./ModalUploadContract";
import { useNavigate } from "react-router-dom";
dayjs.extend(customParseFormat);
const dateFormat = "DD/MM/YYYY";
const UploadDocument = () => {
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [data, setDataUser] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dataPro, setDataPro] = useState({});
  const [isModalInforOpen, setIsModalInforOpen] = useState(false);
  const [isModalContractOpen, setIsModalContractOpen] = useState(false);
  const [dataTopic, setDataTopic] = useState([]);
  const [checkTab, setCheckTab] = useState("confirm");
  const navigate = useNavigate();
  const getTopicUpload = async () => {
    try {
      const res = await getTopicUploadDoc();
      if (res && res.isSuccess) {
        setDataTopic(res.data);
      }
    } catch (error) {
      console.log("có lỗi tại getTopicUpload: ", error.message);
    }
  };
  const getTopicUploadCont = async () => {
    try {
      const res = await getTopicUploadContract();
      if (res && res.isSuccess) {
        setDataTopic(res.data);
      }
    } catch (error) {
      console.log("có lỗi tại getTopicUpload: ", error.message);
    }
  };
  const getTopicUploadResubmit = async () => {
    try {
      const res = await getTopicWaitingResubmit();

      if (res && res.isSuccess) {
        setDataTopic(res.data);
      }
    } catch (error) {
      console.log("có lỗi tại getTopicUpload: ", error.message);
    }
  };
  const items = [
    {
      key: "confirm",
      label: `Chờ biên bản`,
      children: <></>,
    },
    {
      key: "resubmit",
      label: `Nộp lại`,
      children: <></>,
    },
    {
      key: "submitted",
      label: `Chờ hợp đồng`,
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
  const confirm = async (topicId) => {
    try {
      const result = await moveToMiddleReport({
        topicId: topicId,
      });
      if (result && result.statusCode === 200) {
        message.success("Chuyển sang giai đoạn báo cáo giữa kỳ thành công");
        navigate("/staff/midterm");
      }
    } catch (error) {
      console.log("có lỗi tại ", error);
    }
  };
  const cancel = () => {};
  const columns = [
    {
      title: "Mã đề tài",
      key: "index",
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
      title: "Giai đoạn",
      dataIndex: "state",
      key: "state",
      render: (text, record, index) => {
        return (
          <>
            {record.state === "EarlytermReport"
              ? "Đăng kí đề tài"
              : record.state === "MidtermReport"
              ? "Báo cáo giữa kỳ"
              : "Báo cáo cuối kỳ"}
          </>
        );
      },
    },
    {
      title: "Ngày họp",
      render: (text, record, index) => {
        return <div>{dayjs(record.meetingTime).format(dateFormat)}</div>;
      },
      key: "createdAt",
    },
    {
      title: "Hành động",
      render: (text, record, index) => {
        return (
          <div style={{ textAlign: "center" }}>
            <InfoCircleOutlined
              style={{ fontSize: "20px", color: "blue" }}
              onClick={() => {
                setIsModalInforOpen(true);
                setDataPro(record);
              }}
            />
            {checkTab === "confirm" && (
              <UploadOutlined
                style={{ fontSize: "20px", color: "green", margin: "0 10px" }}
                onClick={() => {
                  setDataUser(record);
                  setIsModalOpen(true);
                }}
              />
            )}
            {checkTab === "resubmit" && (
              <Tooltip title=" Gia hạn thời hạn nộp ">
                <ClockCircleOutlined
                  style={{ fontSize: "20px", color: "red", margin: "0 10px" }}
                />
              </Tooltip>
            )}
            {checkTab === "submitted" && (
              <>
                <UploadOutlined
                  style={{ fontSize: "20px", color: "green", margin: "0 20px" }}
                  onClick={() => {
                    setDataUser(record);
                    setIsModalContractOpen(true);
                  }}
                />
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
        defaultActiveKey="confirm"
        items={items}
        onChange={(value) => {
          setCheckTab(value);
          if (value === "confirm") {
            getTopicUpload();
          } else if (value === "submitted") {
            getTopicUploadCont();
          } else if (value === "resubmit") {
            getTopicUploadResubmit();
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
  useEffect(() => {
    getTopicUpload();
  }, []);
  return (
    <div>
      <h2 style={{ fontWeight: "bold", fontSize: "30px", color: "#303972" }}>
        Danh sách đề tài
      </h2>
      <Table
        rowClassName={(record, index) =>
          index % 2 === 0 ? "table-row-light" : "table-row-dark"
        }
        bordered={true}
        columns={columns}
        dataSource={dataTopic}
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

      <ModalUpload
        data={data}
        setDataUser={setDataUser}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
      <ModalInfor
        data={dataPro}
        isModalOpen={isModalInforOpen}
        setIsModalOpen={setIsModalInforOpen}
      />
      <ModalUploadContract
        data={data}
        setDataUser={setDataUser}
        isModalContractOpen={isModalContractOpen}
        setIsModalContractOpen={setIsModalContractOpen}
        confirm={confirm}
      />
    </div>
  );
};

export default UploadDocument;
