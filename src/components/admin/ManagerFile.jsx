import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Table,
  Typography,
  Tooltip,
  Button,
  message,
  Tabs,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  FileAddOutlined,
} from "@ant-design/icons";
import {
  deleteFileType,
  getFileType,
  updateFileType,
} from "../../services/api";
import "./department.scss";
import FileModal from "./fileModal";
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
const ManagerFileType = () => {
  const [form] = Form.useForm();
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [loading, setLoading] = useState(false);
  const [listFile, setListFile] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [editingKey, setEditingKey] = useState("");
  const [currentTab, setCurrentTab] = useState(0);
  const isEditing = (record) => record.fileTypeId === editingKey;
  const edit = (record) => {
    form.setFieldsValue({
      typeName: "",
      ...record,
    });
    setEditingKey(record.fileTypeId);
  };
  const cancel = () => {
    setEditingKey("");
  };
  const getFile = async () => {
    try {
      setLoading(true);
      const res = await getFileType({
        stateNumber: currentTab,
      });
      if (res && res.statusCode === 200) {
        setListFile(res.data);
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
        fileTypeId: dataIndex,
        typeName: row.typeName,
        state: currentTab,
      };
      const res = await updateFileType(data);
      if (res && res.statusCode === 200) {
        message.success("Cập nhật thành công");
        getFile();
        cancel();
      }
    } catch (error) {
      console.log("====================================");
      console.log("Có lỗi tại update admin department", error);
      console.log("====================================");
    }
  };
  //delete files type
  const handleDelete = async (id) => {
    try {
      const data = {
        fileTypeId: id,
      };
      const res = await deleteFileType(data);
      if (res && res.isSuccess) {
        message.success("Xóa thành công");
        getFile();
        cancel();
      }
    } catch (e) {
      console.log("====================================");
      console.log("Có lỗi tại delete admin files type", e);
      console.log("====================================");
    }
  };
  const columns = [
    {
      title: "STT",
      render: (text, record, index) => {
        return <>{index + 1}</>;
      },
    },
    {
      title: "Tên file",
      dataIndex: "typeName",
      editable: true,
    },

    {
      title: "Hành động",
      render: (_, record) => {
        const editable = isEditing(record);
        const style1 = {
          color: "blue",
          fontSize: "18px",
          cursor: "pointer",
          paddingTop: "2px",
        };
        const style2 = {
          color: "red",
          fontSize: "18px",
          margin: "0 10px",
          cursor: "pointer",
        };
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => handleEdit(record.fileTypeId)}
              style={{
                marginRight: 8,
              }}
            >
              Cập nhật
            </Typography.Link>
            <a onClick={cancel}>Hủy</a>
          </span>
        ) : (
          <>
            <Typography.Link
              disabled={editingKey !== ""}
              onClick={() => edit(record)}
            >
              <Tooltip placement="top" title="Chỉnh sửa file">
                <EditOutlined style={style1} />
              </Tooltip>
            </Typography.Link>
            <Tooltip placement="top" title="Xóa file">
              <DeleteOutlined
                onClick={() => handleDelete(record.fileTypeId)}
                style={style2}
              />
            </Tooltip>
          </>
        );
      },
      align: "center",
    },
  ];
  const items = [
    {
      key: "0",
      label: `Sơ duyệt`,
      children: <></>,
    },
    {
      key: "1",
      label: `Đầu kỳ`,
      children: <></>,
    },
    {
      key: "2",
      label: `Giữa kỳ`,
      children: <></>,
    },
    {
      key: "3",
      label: `Cuối kỳ`,
      children: <></>,
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
        <h2 style={{ fontWeight: "bold", fontSize: "30px", color: "#303972" }}>
          Danh sách các loại file
        </h2>

        <Button
          type="primary"
          icon={<FileAddOutlined />}
          onClick={() => {
            setOpenModal(true);
          }}
          style={{ lineHeight: "10px" }}
        >
          Thêm loại file
        </Button>
      </div>
      <Tabs
        defaultActiveKey="0"
        items={items}
        onChange={(value) => {
          setCurrentTab(value);
          if (value === "0") {
            setCurrentTab(0);
          } else if (value === "1") {
            setCurrentTab(1);
          } else if (value === "2") {
            setCurrentTab(2);
          } else {
            setCurrentTab(3);
          }
        }}
      />
    </div>
  );
  useEffect(() => {
    getFile();
  }, [currentTab]);

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
          dataSource={listFile}
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
                  {range[0]} - {range[1]} on {total} rows
                </div>
              );
            },
          }}
        />
      </Form>
      <FileModal
        openModal={openModal}
        setOpenModal={setOpenModal}
        getFile={getFile}
      />
    </div>
  );
};
export default ManagerFileType;
