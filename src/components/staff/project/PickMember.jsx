import React, { useContext, useEffect, useRef, useState } from "react";
import { Button, ConfigProvider, Input, List, Space, Table } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import Highlighter from "react-highlight-words";
import "../../user/project/table.scss";
import {
  EyeInvisibleOutlined,
  EyeOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { getMemberReview } from "../../../services/api";
import ModalTime from "./ModalChooseTime.jsx";
import dayjs from "dayjs";
import { ConfigAppContext } from "../ConfigAppContext.jsx";
const PickMember = (props) => {
  const config = useContext(ConfigAppContext);
  const searchInput = useRef(null);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [selectedUser, setSelectedUser] = useState([]);
  const [user, setUser] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showFullData, setShowFullData] = useState({});
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [maxSelectedMembers, setMaxSelectedMembers] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [timeMeeting, setTimeMeeting] = useState([]);
  const location = useLocation();
  let checkPath = location.pathname.split("/");
  let topicID = checkPath[4];
  const navigate = useNavigate();
  const isRowDisabled = (record) => {
    // Check if the row should be disabled based on the number of selected members
    return (
      selectedKeys.length >= maxSelectedMembers &&
      !selectedKeys.includes(record.key)
    );
  };
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
  // search in table
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
      title: "Tên",
      dataIndex: "fullName",
      ...getColumnSearchProps("fullName"),
      sorter: (a, b) => a.fullName.length - b.fullName.length,
    },
    {
      title: "Chức vụ",
      dataIndex: "position",
    },
    {
      title: "Bằng cấp",
      dataIndex: "degree",
    },
    {
      title: "Email",
      dataIndex: "accountEmail",
      key: "email",
      render: (text, record) => (
        <Space>
          {showFullData[record.key] ? (
            <p>{record.accountEmail}</p>
          ) : (
            <p>{maskEmail(record.accountEmail, false)}</p>
          )}
        </Space>
      ),
      width: "21%",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phoneNumber",
      key: "phoneNumber",

      render: (text, record) => (
        <Space>
          {showFullData[record.key] ? (
            <p>{record.phoneNumber}</p>
          ) : (
            <p>{maskPhoneNumber(record.phoneNumber)}</p>
          )}
        </Space>
      ),
    },
    {
      title: "Giờ họp ",
      dataIndex: "meetingShedules",
      render: (text, record) => {
        if (record.meetingShedules.length === 0) {
          return <div>Trống lịch</div>;
        } else {
          return (
            <div>
              {record.meetingShedules.map((element, index) => {
                const fromTime = dayjs(element.from).format("HH:mm");
                const toTime = dayjs(element.to).format("HH:mm");
                return (
                  <div key={index}>
                    {fromTime} - {toTime} <br />
                  </div>
                );
              })}
            </div>
          );
        }
      },
    },
    {
      title: "Xem thông tin",
      key: "action",
      render: (text, record) => (
        <Button
          icon={
            showFullData[record.key] ? (
              <EyeInvisibleOutlined />
            ) : (
              <EyeOutlined />
            )
          }
          onClick={() => handleToggleShowFullData(record.key)}
        />
      ),
    },
  ];

  const getUserAPI = async () => {
    try {
      const res = await getMemberReview({
        TopicId: topicID,
        MeetingDate: location.state.meetingDate,
      });
      setIsLoading(true);
      if (res && res?.data) {
        let dataKey = res.data.map((item) => ({
          ...item,
          key: item.id,
        }));
        setUser(dataKey);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error fetching get user:", error);
    }
  };
  useEffect(() => {
    getUserAPI();
  }, []);

  const maskEmail = (accountEmail) => {
    const [username, domain] = accountEmail.split("@");
    const maskedUsername = `${username.substring(0, 3)}****`;

    return `${maskedUsername}@${domain}`;
  };

  const maskPhoneNumber = (phoneNumber) => {
    return `${phoneNumber.substring(0, 3)}****${phoneNumber.substring(
      phoneNumber.length - 3
    )}`;
  };

  const maskData = (user, showFull) => {
    return user.map((item) => ({
      ...item,
      accountEmail: maskEmail(item.accountEmail, showFull),
      phoneNumber: maskPhoneNumber(item.phoneNumber, showFull),
    }));
  };

  const maskedData = maskData(user, false);

  const handleToggleShowFullData = (key) => {
    setShowFullData((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedKeys(selectedRowKeys); // id của thành viên hội đồng
      setSelectedUser(selectedRows);
      setTimeMeeting(selectedRows[0].meetingShedules);
      props.setFirstMenber(selectedRows);
    },
    hideSelectAll: true,
    selectedKeys,
    getCheckboxProps: (record) => ({
      disabled: isRowDisabled(record),
    }),
  };

  const renderFooter = () => (
    <div style={{ display: "flex", justifyContent: "flex-end" }}>
      <Button
        shape="round"
        type="primary"
        danger
        onClick={() => navigate(-1)}
        style={{ margin: "0 10px" }}
      >
        Quay về
      </Button>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#55E6A0",
          },
        }}
      >
        {
          (setMaxSelectedMembers(1),
          (
            <Button
              disabled={selectedUser.length < 1}
              shape="round"
              type="primary"
              onClick={() => {
                setIsModalOpen(true);
              }}
            >
              Chọn thời gian họp
            </Button>
          ))
        }
      </ConfigProvider>
    </div>
  );

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ marginRight: "20px" }}>
          <h2
            style={{ fontWeight: "bold", fontSize: "30px", color: "#303972" }}
          >
            Danh sách nhà khoa học đã tham gia sơ duyệt
          </h2>
          <p style={{ color: "red" }}>
            Lưu ý khi chọn 1 thành viên đã tham gia
          </p>
        </div>
      </div>

      <div>
        <Table
          rowClassName={(record, index) =>
            index % 2 === 0 ? "table-row-light" : "table-row-dark"
          }
          bordered={true}
          rowSelection={{
            ...rowSelection,
          }}
          dataSource={showFullData ? user : maskedData}
          columns={columns}
          loading={isLoading}
          footer={renderFooter}
        />
      </div>
      <ModalTime
        breakTime = {config.breakTimeInMinutes}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        setData={props.setData}
        setTime={props.setTime}
        next={props.next}
        timeMeeting={timeMeeting}
        setMeetingDateDuration={props.setMeetingDateDuration}
      />
    </div>
  );
};

export default PickMember;
