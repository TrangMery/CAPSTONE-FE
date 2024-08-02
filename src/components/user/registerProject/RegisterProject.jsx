import React, { useEffect, useState } from "react";
import TextEditor from "./TextEditor";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Space,
  message,
  Upload,
  ConfigProvider,
  Popover,
  Badge,
  List,
} from "antd";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);
import customParseFormat from "dayjs/plugin/customParseFormat";
import {
  InboxOutlined,
  MinusCircleOutlined,
  PlusOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import ModalAddMember from "./ModalAddMember";
import { getAllCategory, getAllUser, uploadFile } from "../../../services/api";
import "./register.scss";

import ModalConfirm from "./ModalConfirm";
dayjs.extend(customParseFormat);
const dateFormat = "DD/MM/YYYY";
const today = dayjs().add(1, "day");
const RegisterProject = () => {
  const [open, setOpen] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [category, setCategory] = useState([]);
  const [listUser, setListUser] = useState([]);
  const [newTopicFiles, setFileList] = useState({});
  const [addMember, setAddMember] = useState([]);
  const [data, setData] = useState({});
  const [cvLink, setCvLink] = useState([]);
  const [error, setError] = useState(null);
  const [uploadType, setUploadType] = useState("");
  const userId = sessionStorage.getItem("userId");
  const showUserModal = () => {
    setOpen(true);
  };
  const hideUserModal = () => {
    setOpen(false);
  };
  const sampleFile = import.meta.env.VITE_FILE_EARLY_TERM; 
  const listUserReview = (
    <div>
      <List
        bordered
        dataSource={addMember}
        renderItem={(addMember) => (
          <List.Item>
            {addMember.email} -{" "}
            {addMember.role === "1" ? "Thành viên" : "Thư kí"}
          </List.Item>
        )}
      />
    </div>
  );
  const selectAfter = (
    <Select
      defaultValue={"VND"}
      style={{
        width: 104,
      }}
    >
      <Option value="VND">VND</Option>
    </Select>
  );
  const selectMonth = (
    <Select
      defaultValue={"Tháng"}
      style={{
        width: 104,
      }}
    >
      <Option value="Tháng">Tháng</Option>
    </Select>
  );
  const [form] = Form.useForm();
  //props của upload
  const props = {
    name: "file",
    multiple: false,
    maxCount: 1,
    customRequest: async ({ file, onSuccess, onError }) => {
      try {
        // Thực hiện tải lên file thông qua API của bạn
        const isCompressedFile =
          uploadType === "document"
            ? file.type === "application/x-rar-compressed" ||
              file.type === "application/x-zip-compressed" ||
              file.type === "application/x-compressed"
            : file.type ===
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document"; // sửa thành file word
        if (!isCompressedFile) {
          message.error(
            uploadType === "document"
              ? "Chỉ được phép tải lên các file đã nén (zip hoặc rar)!"
              : "Vui lòng upload cv bằng file word!"
          );
          setError(
            uploadType === "document"
              ? "Chỉ được phép tải lên các file đã nén (zip hoặc rar)!"
              : "Vui lòng upload cv bằng file word!"
          );
          onError(file);
          return;
        }
        const response = await uploadFile(file);
        if (response.data.fileLink === null) {
          onError(response, file);
          message.error(`${file.name} không tải lên thành công.`);
        } else {
          if (uploadType === "document") {
            setFileList({
              fileName: response.data.fileName,
              fileLink: response.data.fileLink,
            });
          } else if (uploadType === "cv") {
            setCvLink(response.data.fileLink);
          }
          // Gọi onSuccess để xác nhận rằng tải lên đã thành công
          onSuccess(response, file);
          // Hiển thị thông báo thành công
          message.success(`${file.name} tải lên thành công.`);
        }
      } catch (error) {
        // Gọi onError để thông báo lỗi nếu có vấn đề khi tải lên
        onError(error);
        // Hiển thị thông báo lỗi
        message.error(`${file.name} không tải lên thành công.`);
      }
    },
    onRemove: (file) => {
      if (uploadType === "document") {
        setFileList([]);
      } else {
        setCvLink("");
      }
      setError(null);
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
    progress: {
      strokeColor: {
        "0%": "#108ee9",
        "100%": "#87d068",
      },
      strokeWidth: 3,
      format: (percent) => percent && `${parseFloat(percent.toFixed(2))}%`,
    },
  };
  const getCategory = async () => {
    const res = await getAllCategory();
    if (res && res?.data) {
      setCategory(res.data);
    }
  };
  const getUser = async () => {
    const res = await getAllUser({
      userId: userId,
    });
    if (res && res?.data) {
      setListUser(res?.data);
    }
  };
  useEffect(() => {
    getUser();
    getCategory();
  }, []);
  const onFinish = async (values) => {
    // chuyển trường email thành trường id
    const user = addMember;
    const emailToIdMap = {};
    listUser.forEach((item) => {
      emailToIdMap[item.accountEmail] = item.id;
    });
    const newData = user.map((item) => {
      const userId = emailToIdMap[item.email];
      const newItem = { userId, ...item };
      delete newItem.email;
      newItem.role = Number(newItem.role);
      return newItem;
    });
    const creatorId = userId;
    if (Object.values(newTopicFiles).length === 0 || cvLink === "") {
      message.error("Xin hãy tải các tài liệu liên quan lên");
      return;
    } else if (newData.length === 0) {
      message.error("Xin hãy chọn thành viên thực hiện đề tài");
      return;
    }

    const { categoryId, topicName, description, budget, startTime, topicType, expectedNumberOfMonthToComplete } = values;
    const data = {
      categoryId: categoryId,
      creatorId: creatorId,
      topicName: topicName,
      description: description,
      budget: budget.toString(),
      memberList: newData,
      topicFileName: newTopicFiles.fileName,
      topicFileLink: newTopicFiles.fileLink,
      startTime: dayjs(startTime).local().format(),
      cvLink: cvLink,
      topicType: parseInt(topicType),
      expectedNumberOfMonthToComplete: expectedNumberOfMonthToComplete,
    };
    if (data !== null) {
      setOpenConfirm(true);
      setData(data);
    }
  };
  const checkUser = addMember.length > 0;
  return (
    <>
      <h2
        style={{
          fontWeight: "bold",
          fontSize: "30px",
          color: "#303972",
          marginBottom: "40px",
        }}
      >
        Đăng ký đề tài
      </h2>
      <Form form={form} name="basicForm" onFinish={onFinish}>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="topicName"
              label="Tên đề tài"
              rules={[
                {
                  required: true,
                  message:
                    "Xin hãy nhập tên đề tài ( tối thiểu 10 kí tự, tối đa 100 kí tự )",
                },
              ]}
              labelCol={{ span: 24 }}
            >
              <Input minLength={"10"} maxLength={"100"} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="description"
              label="Chi tiết"
              rules={[
                {
                  required: true,
                  message:
                    "Xin hãy nhập tóm tắt nội dung đề tài ( tối thiểu 10 kí tự, tối đa 1000 kí tự )",
                },
              ]}
              labelCol={{ span: 24 }}
            >
              <TextEditor />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="startTime"
              label="Thời gian bắt đầu dự kiến: "
              rules={[
                {
                  required: true,
                  message: "Xin hãy chọn thời gian bắt đầu dự kiến",
                },
              ]}
            >
              <DatePicker
                format={dateFormat}
                minDate={today}
                placeholder="Chọn ngày"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="expectedNumberOfMonthToComplete"
              label="Thời gian dự kiến làm: "
              rules={[
                {
                  required: true,
                  message: "Xin hãy chọn thời gian bắt đầu dự kiến",
                },
              ]}
            >
              <InputNumber
                style={{ width: 230 }}
                min={0}
                addonAfter={selectMonth}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="budget"
              label="Kinh Phí Dự Kiến"
              rules={[
                {
                  required: true,
                  message: "Xin hãy nhập kinh phí dự kiến",
                },
              ]}
            >
              <InputNumber
                className="text-align-input"
                style={{ width: 230 }}
                min={0}
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                addonAfter={selectAfter}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="topicType"
              label="Loại đề tài nghiên cứu"
              rules={[
                {
                  required: true,
                  message: "Xin hãy chọn lĩnh vực nghiên cứu",
                },
              ]}
            >
              <Select
                style={{ width: 200 }}
                options={[
                  {
                    value: '0',
                    label: 'Lĩnh vực nội khoa',
                  },
                  {
                    value: '1',
                    label: 'Lĩnh vực ngoại khoa',
                  },
                ]}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              required={true}
              name="group"
              label="Thành viên thực hiện"
            >
              <Button htmlType="button" onClick={showUserModal}>
                Thêm thành viên
              </Button>
            </Form.Item>
            {checkUser ? (
              <div>
                <Space direction="" size={"middle"}>
                  <Popover content={listUserReview} title="Thành viên đã chọn">
                    <Badge count={addMember.length}>
                      <UsergroupAddOutlined
                        style={{ fontSize: "20px", color: "#08c" }}
                      />
                    </Badge>
                  </Popover>
                  <p>Đã chọn {addMember.length} thành viên</p>
                </Space>
              </div>
            ) : (
              ""
            )}
          </Col>
          <Col span={12}>
            <Form.Item
              name="categoryId"
              label="Lĩnh vực nghiên cứu:"
              rules={[
                {
                  required: true,
                  message: "Xin hãy chọn lĩnh vực nghiên cứu",
                },
              ]}
            >
              <Select
                style={{ width: 200 }}
                options={category.map((item) => ({
                  value: item.categoryId,
                  label: item.categoryName,
                }))}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Đính kèm tài cv cá nhân: " required={true}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <Upload {...props} listType="picture">
                  <Button
                    onClick={() => setUploadType("cv")}
                    icon={<InboxOutlined />}
                  >
                    Tải CV lên
                  </Button>
                </Upload>
              </div>
              {error && (
                <p style={{ color: "red", marginLeft: "10px" }}>{error}</p>
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.List name="user">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Space
                      key={key}
                      style={{
                        display: "flex",
                        marginBottom: 8,
                      }}
                      align="baseline"
                    >
                      <Form.Item
                        {...restField}
                        name={[name, "fullName"]}
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng nhập tên thành viên đào tạo",
                          },
                        ]}
                      >
                        <Input placeholder="Tên thành viên đào tạo" />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, "role1"]}
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng chon vai trò",
                          },
                        ]}
                      >
                        <Select
                          style={{
                            width: 150,
                          }}
                          options={[
                            {
                              value: "thacsi",
                              label: "Thạc sĩ",
                            },
                            {
                              value: "tiensi",
                              label: "Tiến sĩ",
                            },
                            {
                              value: "CK1",
                              label: "CK1",
                            },
                          ]}
                        />
                      </Form.Item>
                      <MinusCircleOutlined onClick={() => remove(name)} />
                    </Space>
                  ))}
                  <Form.Item name="group1" label="Thành viên đào tạo (nếu có):">
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      block
                      icon={<PlusOutlined />}
                      style={{ maxWidth: "200px" }}
                    >
                      Thêm
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Col>

          <Col span={24}>
            <h3>Đính kèm tài liệu liên quan</h3>
            <p>
              Chỉ hỗ trợ cái file như zip hoặc rar :{" "}
              <a
                onClick={(e) => e.stopPropagation()}
                href={sampleFile}
                download
              >
                Tải tập tin mẫu
              </a>
            </p>

            <Form.Item
              labelCol={{
                span: 12,
              }}
            >
              <Upload
                {...props}
                listType="picture"
                className="upload-list-inline"
              >
                <Button
                  onClick={() => setUploadType("document")}
                  icon={<InboxOutlined />}
                >
                  Tải tài liệu lên
                </Button>
              </Upload>
              {error && <p style={{ color: "red" }}>{error}</p>}
            </Form.Item>
            <Form.Item>
              <ConfigProvider
                theme={{
                  token: {
                    colorPrimary: "#41C221",
                  },
                }}
              >
                <Button
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    transform: "translate(-50%,-50%)",
                  }}
                  type="primary"
                  htmlType="submit"
                >
                  Xác nhận
                </Button>
              </ConfigProvider>
            </Form.Item>
          </Col>
        </Row>
      </Form>

      {/* modal thêm người dùng */}
      <ModalAddMember
        open={open}
        onCancel={hideUserModal}
        data={listUser}
        setAddMember={setAddMember}
      />
      {/*Modal xác nhận cuối cùng*/}
      <ModalConfirm
        data={data}
        setData={setData}
        openConfirm={openConfirm}
        setOpen={setOpenConfirm}
        form={form}
        setFileList={setFileList}
        setAddMember={setAddMember}
      />
    </>
  );
};
export default RegisterProject;
