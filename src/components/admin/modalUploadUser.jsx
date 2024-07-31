import React, { useState } from "react";
import { EditOutlined, InboxOutlined } from "@ant-design/icons";
import {
  Modal,
  message,
  Upload,
  Table,
  notification,
  Form,
  Input,
  Typography,
  Popconfirm,
} from "antd";
import { createAccountAdmin, uploadFileAdmin } from "../../services/api";
const { Dragger } = Upload;
import "./department.scss";
import book from "./Book1.xlsx?url";
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
  const inputNode = inputType === "number" ? <InputNumber /> : <Input />;
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
              message: `Please Input ${title}!`,
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
const UploadByFile = (props) => {
  const isModalOpen = props.isOpen;
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState("");
  const isEditing = (record) => record.identityNumber === editingKey;
  const [fileList, setFileList] = useState([]);
  const [listAccounts, setAccountList] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      const data = {
        users: listAccounts,
      };
      const res = await createAccountAdmin(data);
      setLoading(true);
      if (res && res.statusCode === 200) {
        setLoading(false);
        notification.success({
          description: `Thêm mới ${listAccounts.length} tài khoản thành công`,
          message: "Tạo tài khoản",
        });
        props.getUser();
        handleCancel();
      }
    } catch (error) {
      console.log("có lỗi tại thêm account ", error);
    }
  };

  const handleCancel = () => {
    props.setIsOpen(false);
    setFileList([]);
    setAccountList([]);
  };
  const edit = (record) => {
    form.setFieldsValue({
      accountEmail: "",
      ...record,
    });
    setEditingKey(record.identityNumber);
  };
  const cancel = () => {
    setEditingKey("");
  };
  const save = async (identityNumber) => {
    try {
      const row = await form.validateFields();
      const newData = [...listAccounts];
      const index = newData.findIndex(
        (item) => identityNumber === item.identityNumber
      );
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setAccountList(newData);
        setEditingKey("");
      } else {
        newData.push(row);
        setAccountList(newData);
        setEditingKey("");
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };
  const columns = [
    {
      title: "Họ và tên",
      dataIndex: "fullName",
    },
    {
      title: "Email",
      dataIndex: "accountEmail",
      editable: true,
    },
    {
      title: "Số điện thoại",
      dataIndex: "phoneNumber",
    },
    {
      title: "Chỉnh sửa",
      dataIndex: "operation",
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              style={{
                marginRight: 8,
              }}
            >
              <Popconfirm
                title="Bạn có chắc muốn sửa ?"
                onConfirm={() => save(record.identityNumber)}
              >
                Xác nhận
              </Popconfirm>
            </Typography.Link>
            <a onClick={cancel}>Hủy</a>
          </span>
        ) : (
          <Typography.Link
            disabled={editingKey !== ""}
            onClick={() => edit(record)}
          >
            <EditOutlined />
          </Typography.Link>
        );
      },
    },
  ];
  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === "age" ? "number" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });
  const propsUpload = {
    fileList,
    name: "file",
    multiple: false,
    maxCount: 1,
    accept:
      ".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    customRequest: async ({ file, onSuccess, onError }) => {
      setLoading(true);
      try {
        const isCompressedFile =
          file.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
        if (!isCompressedFile) {
          message.error("Chỉ được phép tải lên file có định dạng xlsx");
          onError(file);
          return;
        }
        const response = await uploadFileAdmin(file);

        if (response.status === 500) {
          onError(response, file);
          message.error(`${file.name} file tải lên không thành công.`);
        } else {
          setLoading(false);
          setAccountList(response.data);
          onSuccess(response, file);
          message.success(`${file.name} file tải lên thành công.`);
        }
      } catch (error) {
        // Gọi onError để thông báo lỗi nếu có vấn đề khi tải lên
        onError(error);
        // Hiển thị thông báo lỗi
        message.error(`${file.name} file tải lên thất bại.`);
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };
  return (
    <>
      <Modal
        title="Nhập dữ liệu người dùng"
        width={"55vw"}
        open={isModalOpen}
        onOk={handleSubmit}
        onCancel={handleCancel}
        maskClosable={false}
        okText="Thêm mới"
        centered
        loading={loading}
      >
        <Dragger {...propsUpload}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">
            Nhấn hoặc kéo tệp vào khu vực này để tải lên
          </p>
          <p className="ant-upload-hint">
            Hỗ trợ cho một tập tin duy nhất và không được trùng dữ liệu cũ. Chỉ
            chấp nhận .csv, .xls, .xlsx hoặc &nbsp;
            <a onClick={(e) => e.stopPropagation()} href={book} download>
              Tải tập tin mẫu
            </a>
          </p>
        </Dragger>
        <div style={{ paddingTop: 20 }}>
          <Form form={form} component={false}>
            <Table
              components={{
                body: {
                  cell: EditableCell,
                },
              }}
              dataSource={listAccounts}
              title={() => <span>Dữ liệu tải lên</span>}
              columns={mergedColumns}
              rowKey={"email"}
              pagination={{
                pageSize: 3,
                onChange: cancel,
              }}
              loading={loading}
            ></Table>
          </Form>
        </div>
      </Modal>
    </>
  );
};
export default UploadByFile;
