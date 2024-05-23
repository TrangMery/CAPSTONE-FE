import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  ConfigProvider,
  Input,
  List,
  Space,
  Table,
  message,
} from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import Highlighter from "react-highlight-words";
import "../../user/project/table.scss";
import {
  EyeInvisibleOutlined,
  EyeOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import ModalPickTimeLeader from "./ModalPickTimeLeader";
import {
  getAllUserWithoutCreator,
  getMemberReviewAvailabe,
} from "../../../services/api";
const AddCouncilTable = (props) => {
  const searchInput = useRef(null);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [selectedUser, setSelectedUser] = useState([]);
  const [user, setUser] = useState([]);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(7);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showFullData, setShowFullData] = useState({});
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [maxSelectedMembers, setMaxSelectedMembers] = useState();
  const [newData, setNewData] = useState([]);
  const location = useLocation();
  let checkPath = location.pathname.split("/");
  let topicID = checkPath[4];
  const isRowDisabled = (record) => {
    // Check if the row should be disabled based on the number of selected members
    return (
      selectedKeys.length >= maxSelectedMembers &&
      !selectedKeys.includes(record.key)
    );
  };
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
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
      title: "Hành động",
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
      const res = await getMemberReviewAvailabe({
        TopicId: topicID,
        MeetingStartTime: props.time.meetingStartTime,
        MeetingEndTime: props.time.meetingEndTime,
      });
      setIsLoading(true);
      const id = props.firstMember[0].id;
      if (res && res?.data) {
        const newArray = res.data.filter((item) => item.id !== id);
        let dataKey = newArray.map((item) => ({
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

  useEffect(() => {
    if (current === 1 && newData.length > 1) setUser(newData);
  }, [current]);

  // hide email and phone munber
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
      const newData = [...user];
      // Move selected rows to the top
      newData.sort((a, b) => {
        if (selectedRowKeys.includes(a.key)) return -1;
        if (selectedRowKeys.includes(b.key)) return 1;
        return 0;
      });
      setNewData(newData);
      setSelectedKeys(selectedRowKeys); // id của thành viên hội đồng
      setSelectedUser(selectedRows);
    },
    hideSelectAll: true,
    selectedKeys,
    getCheckboxProps: (record) => ({
      disabled: isRowDisabled(record),
    }),
  };
  const hasSelected = selectedUser.length > 0;
  const onChange = (pagination, filters, sorter, extra) => {
    if (pagination.current !== current) {
      setCurrent(pagination.current);
    }
    if (pagination.pageSize !== pageSize) {
      setPageSize(pagination.pageSize);
      setCurrent(1);
    }
  };

  const renderFooter = () => (
    <div style={{ display: "flex", justifyContent: "flex-end" }}>
      <Button
        shape="round"
        type="primary"
        danger
        onClick={() => props.prev()}
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
          (setMaxSelectedMembers(6),
          (
            <Button
              disabled={
                selectedUser.length < 4 || selectedUser.length % 2 !== 0
              }
              shape="round"
              type="primary"
              onClick={() => {
                setIsModalOpen(true);
                selectedUser.push(props.firstMember[0]);
              }}
            >
              Thêm thành viên đánh giá
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
            Danh sách nhà khoa học
          </h2>
          <p style={{ color: "red" }}>
            Lưu ý khi chọn thành viên đánh giá là số lẻ vd 5, 7
          </p>
          {hasSelected ? (
            <div>
              <Space direction="" size={"middle"}>
                <p style={{ fontWeight: "bold" }}>
                  Đã chọn {selectedUser.length} thành viên
                </p>
              </Space>
            </div>
          ) : (
            ""
          )}
        </div>
        {hasSelected ? (
          <div style={{ maxWidth: "400px" }}>
            <List
              grid={{
                sm: 2,
                md: 2,
                column: 2,
              }}
              bordered
              dataSource={selectedUser}
              renderItem={(selectedUser) => (
                <List.Item style={{ minWidth: "300px" }}>
                  {selectedUser.fullName} - {selectedUser.position}
                </List.Item>
              )}
            />
          </div>
        ) : (
          ""
        )}
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
          scroll={{
            y: 340,
          }}
          dataSource={showFullData ? user : maskedData}
          columns={columns}
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
          loading={isLoading}
          footer={renderFooter}
        />
      </div>

      {/* modal pick time and leader */}
      <ModalPickTimeLeader
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        dataUser={selectedUser}
        meetingDuration={props.meetingDuration}
        meetingTime = {props.time}
      />
    </div>
  );
};

export default AddCouncilTable;
