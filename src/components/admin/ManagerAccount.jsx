import React, { useEffect, useState } from "react";
import { Button, Space, Table, Tabs, Tag, Tooltip, message } from "antd";
import { CloudDownloadOutlined, EditOutlined } from "@ant-design/icons";
import {
  assignDeanByAdmin,
  getAllUserAdmin,
} from "../../services/api";
import UploadByFile from "./modalUploadUser";

const ManagerAccount = () => {
  const [loading, setLoading] = useState(false);
  const [listUser, setListUser] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const mergeArrays = (arr1, arr2) => {
    // Duyệt qua từng phần tử của mảng 2
    const resultArray = arr2.map((item2) => {
      // Kiểm tra xem phần tử có tồn tại trong mảng 1 không
      const isDuplicate = arr1.some((item1) => item1 === item2.accountEmail);
      // Trả về phần tử kèm thuộc tính isDuplicate
      return { ...item2, isDuplicate };
    });

    return resultArray;
  };
  const getUser = async () => {
    try {
      setLoading(true);
      const res = await getAllUserAdmin();
      // const res1 = await getAccountInactive();
      if (res && res.statusCode === 200) {
        // const mergeArray = mergeArrays(res1.data, res?.data);
        setListUser(res.data);
        setLoading(false);
      }
    } catch (error) {
      console.log("====================================");
      console.log("có lỗi tại admin account", error);
      console.log("====================================");
    }
  };

  // edit working process
  const handleEdit = async (email) => {
    try {
      const data = {
        email: email,
      };
      const res = await assignDeanByAdmin(data);
      if (res && res.statusCode === 200) {
        message.success("Chuyển vai trò thành công");
        getUser();
      }
    } catch (error) {
      console.log("====================================");
      console.log("Có lỗi tại đăng kí dean");
      console.log("====================================");
    }
  };
  const columns = [
    {
      title: "Email",
      dataIndex: "accountEmail",
    },
    {
      title: "Khoa",
      dataIndex: "departmentName",
    },
    {
      title: "Họ và tên",
      dataIndex: "fullName",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phoneNumber",
    },
    {
      title: "Vai trò",
      render: (text, record, index) => {
        return <>{record.isDean ? "Dean" : "User"}</>;
      },
    },
    // {
    //   title: "Trạng thái tài khoản",
    //   dataIndex: "isDuplicate",
    //   key: "isDuplicate",
    //   render: (text, record) => {
    //     if (record.isDuplicate) {
    //       return (
    //         <Button
    //           type="primary"
    //           onClick={() => {
    //             handleActiveAccount(record.accountEmail);
    //           }}
    //         >
    //           Kích hoạt
    //         </Button>
    //       );
    //     }
    //     const color = "green";
    //     const status = "Đã kích hoạt";
    //     return <Tag color={color}>{status}</Tag>;
    //   },
    //   align: "center",
    // },
    {
      title: "Hành động",
      render: (text, record, index) => {
        const style1 = {
          color: "blue",
          fontSize: "18px",
          cursor: "pointer",
          paddingTop: "2px",
        };
        return (
          <div>
            <Tooltip placement="top" title="Chỉnh sửa vai trò">
              <EditOutlined
                onClick={() => handleEdit(record.accountEmail)}
                style={style1}
              />
            </Tooltip>
          </div>
        );
      },
      align: "center",
    },
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
          Danh sách tài khoản
        </h2>
        <Button
          type="primary"
          icon={<CloudDownloadOutlined />}
          onClick={() => {
            setIsOpen(true);
          }}
        >
          Nhập người dùng
        </Button>
      </div>
    </div>
  );

  useEffect(() => {
    getUser();
  }, []);
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
        dataSource={listUser}
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
      <UploadByFile isOpen={isOpen} setIsOpen={setIsOpen} getUser={getUser} />
    </div>
  );
};
export default ManagerAccount;
