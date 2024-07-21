import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Popconfirm,
  Table,
  Typography,
  Tooltip,
  Button,
  message,
  Space,
} from "antd";
import {
  CloudUploadOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { updateDepartmentByAdmin, getAllDepartment, getMeetingRoom } from "../../services/api";
import DepartmentModal from "./departmentModal";
import "./department.scss";
import * as ExcelJS from "exceljs";
import MeetingRoomModal from "./MeetingRoomModal";
const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = <Input />;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `Xin hãy điền ${title} muốn cập nhật!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};
const ManagerMeetingRoom = () => {
  const [form] = Form.useForm();
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [loading, setLoading] = useState(false);
  const [listMeethingRoom, setListMeetingRoom] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [editingKey, setEditingKey] = useState("");
  const isEditing = (record) => record.departmentId === editingKey;
  const edit = (record) => {
    form.setFieldsValue({
      roomName: "",
      ...record,
    });
    setEditingKey(record.departmentId);
  };
  const cancel = () => {
    setEditingKey("");
  };
  const getMeetingRoomApi = async () => {
    try {
      setLoading(true);
      const res = await getMeetingRoom();
      if (res && res.statusCode === 200) {
        setListMeetingRoom(res.data);
        setLoading(false);
      }
    } catch (error) {
      console.log("====================================");
      console.log("có lỗi tại admin account", error);
      console.log("====================================");
    }
  };
  // edit working process
  const handleEdit = async (dataIndex) => {
    try {
      const row = await form.validateFields();
      const data = {
        departmentId: dataIndex,
        roomName: row.roomName,
      };
      const res = await updateDepartmentByAdmin(data);
      if (res && res.statusCode === 200) {
        message.success("Cập nhật thành công");
        getMeetingRoomApi();
        cancel();
      }
    } catch (error) {
      console.log("====================================");
      console.log("Có lỗi tại update admin department", error);
      console.log("====================================");
    }
  };

  const handleDelete = () => {};
  const columns = [
    {
      title: "Mã Phòng Họp",
      dataIndex: "roomId",
    },
    {
      title: "Phòng họp",
      dataIndex: "roomName",
      editable: true,
    },
    // {
    //   title: "Hành động",
    //   render: (_, record) => {
    //     const editable = isEditing(record);
    //     const style1 = {
    //       color: "blue",
    //       fontSize: "18px",
    //       cursor: "pointer",
    //       paddingTop: "2px",
    //     };
    //     const style2 = {
    //       color: "red",
    //       fontSize: "18px",
    //       margin: "0 10px",
    //       cursor: "pointer",
    //     };
    //     return editable ? (
    //       <span>
    //         <Typography.Link
    //           onClick={() => handleEdit(record.departmentId)}
    //           style={{
    //             marginRight: 8,
    //           }}
    //         >
    //           Cập nhật
    //         </Typography.Link>
    //         <a onClick={cancel}>Hủy</a>
    //       </span>
    //     ) : (
    //       <>
    //         <Typography.Link
    //           disabled={editingKey !== ""}
    //           onClick={() => edit(record)}
    //         >
    //           <Tooltip placement="top" title="Chỉnh sửa phòng họp">
    //             <EditOutlined style={style1} />
    //           </Tooltip>
    //         </Typography.Link>
    //         <Tooltip placement="top" title="Xóa phòng họp">
    //           <DeleteOutlined onClick={() => handleDelete()} style={style2} />
    //         </Tooltip>
    //       </>
    //     );
    //   },
    //   align: "center",
    // },
  ];
  useEffect(() => {
    getMeetingRoomApi();
  }, []);
  const renderHeader = () => (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <h2 style={{ fontWeight: "bold", fontSize: "30px", color: "#303972" }}>
        Danh sách các phòng họp
      </h2>
      <div>
        <Space>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setOpenModal(true)}
          >
            Thêm mới
          </Button>
        </Space>
      </div>
    </div>
  );
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
  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });
  return (
    <div>
      <Form form={form} component={false}>
        <Table
          title={renderHeader}
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          rowClassName="editable-row"
          columns={mergedColumns}
          dataSource={listMeethingRoom}
          loading={loading}
          bordered={true}
          rowKey={"key"}
          onChange={onChange}
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
        />
      </Form>
      <MeetingRoomModal
        openModal={openModal}
        setOpenModal={setOpenModal}
        getMeetingRoomApi={getMeetingRoomApi}
      />
    </div>
  );
};
export default ManagerMeetingRoom;
