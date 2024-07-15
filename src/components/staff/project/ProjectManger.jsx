import {
  InfoCircleOutlined,
  MinusCircleOutlined,
  SearchOutlined,
  UserAddOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import {
  Badge,
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
import React, { useContext, useEffect, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import "./project.scss";
import { useNavigate } from "react-router-dom";
import ModalInfor from "../../user/project/ModalInfor";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);
const dateFormat = "DD/MM/YYYY";
import {
  getTopicForCouncil,
  getTopicForMemberApproval,
  getTopicWaitingMember,
  staffCancelCouncil,
  topicWaitingMeeting,
  preAndEarlyAmount,
} from "../../../services/api";
import ModalTimeCouncil from "./modalTimeCouncil";
import { ConfigAppContext } from "../ConfigAppContext";
const ProjectManager = () => {
  const config = useContext(ConfigAppContext);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const [checkTab, setCheckTab] = useState("notyet");
  const [dataSource, setData] = useState([]);
  const [dataPro, setDataPro] = useState({});
  const [isModalInforOpen, setIsModalInforOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [amoutNotYet, setAmoutNotYet] = useState(0);
  const [amoutWait, setAmoutWait] = useState(0);
  const navigate = useNavigate();
  const items = [
    {
      key: "notyet",
      label: (
        <Badge offset={[15, -2]} count={amoutNotYet}>
          Chưa duyệt
        </Badge>
      ),
      children: <></>,
    },
    {
      key: "wait",
      label: `Chờ sơ duyệt`,
      children: <></>,
    },
    {
      key: "chohoidong",
      label: (
        <Badge offset={[15, 2]} count={amoutWait}>
          {" "}
          Tạo hội đồng xem xét
        </Badge>
      ),
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
          placeholder={`Tìm `}
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
            Tìm
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
          ? "Ngày nộp"
          : checkTab === "dataohoidong"
          ? "Ngày họp"
          : "Ngày Kết Thúc Sơ Duyệt ",
      render: (text, record, index) => {
        if (checkTab === "notyet") {
          return <div>{dayjs(record.createdAt).format(dateFormat)}</div>;
        } else if (checkTab === "dataohoidong") {
          return (
            <div>{dayjs(record.meetingTime).format("DD/MM/YYYY HH:mm")}</div>
          );
        }
        return <div>{dayjs(record.reviewEndDate).format(dateFormat)}</div>;
      },
      key: "createdAt",
      align: "center",
    },
    {
      title: "Loại đề tài",
      sorter: (a, b) => {
        if (a.topicType < b.topicType) return -1;
        if (a.topicType > b.topicType) return 1;
        return 0;
      },
      render: (text, record, index) => {
        const content =
          record.topicType === "Internal" ? "Nội Khoa" : "Ngoại Khoa";
        const color =
          record.topicType === "Internal" ? "success" : "processing";
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
        const differenceInMinutes = dayjs(record.meetingTime).diff(
          dayjs(),
          "minute"
        );
        const checkOverTime =
          differenceInMinutes >= config.cancelMeetingMinTimeInMinutes;
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
                <Tooltip placement="top" title={"Gửi sơ duyệt"}>
                  <UserAddOutlined
                    style={{
                      fontSize: "20px",
                      color: "blue",
                      margin: "0 10px",
                    }}
                    type="primary"
                    onClick={() => {
                      navigate(`/staff/earlyterm/add-member/${record.topicId}`);
                    }}
                  />
                </Tooltip>
              )}
              {checkTab === "chohoidong" && (
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
                      setIsModalOpen(true);
                    }}
                  >
                    Tạo hội đồng
                  </UsergroupAddOutlined>
                </Tooltip>
              )}
            </ConfigProvider>
            {checkTab === "dataohoidong" && (
              <>
                {checkOverTime !== true ? (
                  <Tooltip placement="bottom" title={"Đã qua thời gian hủy"}>
                    <MinusCircleOutlined
                      style={{
                        fontSize: "20px",
                        color: "gray",
                        margin: "0 10px",
                      }}
                      disabled
                      type="primary"
                    />
                  </Tooltip>
                ) : (
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
              </>
            )}
          </div>
        );
      },
      align: "center",
    },
  ];

  const getTopicMemberApproval = async () => {
    try {
      const res = await getTopicForMemberApproval();
      setIsLoading(true);
      if (res && res?.data) {
        setData(res.data);
        setIsLoading(false);
      }
    } catch (error) {
      console.log("có lỗi tại getTopicForMemberApproval: " + error);
    }
  };
  const getTopicCoucil = async () => {
    try {
      const res = await getTopicForCouncil();
      if (res && res?.data) {
        setData(res.data);
      }
    } catch (error) {
      console.log("có lỗi tại getTopicForCouncil: " + error);
    }
  };

  const getMemberApprovalTopic = async () => {
    try {
      const res = await getTopicWaitingMember();
      if (res && res?.data) {
        setData(res.data);
      }
    } catch (error) {
      console.log("có lỗi tại getTopicForCouncil: " + error);
    }
  };
  const getTopicHadCreateCouncil = async () => {
    try {
      const res = await topicWaitingMeeting({
        state: 1,
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
      if (res && res.statusCode === 200) {
        setCheckTab("chohoidong");
      }
    } catch (error) {
      console.log("có lỗi tại getTopicForCouncil: " + error);
    }
  };
  const preAndEarlyAmountApi = async () => {
    try {
      const res = await preAndEarlyAmount();
      if (res && res.statusCode === 200) {
        setAmoutNotYet(res.data.preTopicWaitingCouncilFormation);
        setAmoutWait(res.data.earlyTopicWaitingCouncilFormation);
      }
    } catch (error) {
      console.log("có lỗi tại getTopicForCouncil: " + error);
    }
  };
  useEffect(() => {
    getTopicMemberApproval();
    preAndEarlyAmountApi();
  }, []);
  const renderHeader = () => (
    <div>
      <Tabs
        defaultActiveKey="notyet"
        activeKey={checkTab}
        items={items}
        onChange={(value) => {
          setCheckTab(value);
          if (value === "notyet") {
            getTopicMemberApproval();
          } else if (value === "chohoidong") {
            getTopicCoucil();
          } else if (value === "wait") {
            getMemberApprovalTopic();
          } else if (value === "dataohoidong") {
            getTopicHadCreateCouncil();
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
  const locale = {
    // Tùy chỉnh thông báo sắp xếp
    sortTitle: "Sắp xếp theo loại đề tài",
    triggerDesc: "Đề tài Nội Khoa",
    triggerAsc: "Đề tài Ngoại Khoa",
    cancelSort: "Hủy sắp xếp",
  };
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
                {range[0]} - {range[1]} tên {total} hàng
              </div>
            );
          },
        }}
        title={renderHeader}
        loading={isLoading}
        locale={locale}
      />

      <ModalInfor
        data={dataPro}
        isModalOpen={isModalInforOpen}
        setIsModalOpen={setIsModalInforOpen}
      />
      <ModalTimeCouncil
        data={dataPro}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
    </div>
  );
};

export default ProjectManager;
