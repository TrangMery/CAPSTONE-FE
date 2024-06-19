import React, { useState } from "react";
import {
  Button,
  Col,
  ConfigProvider,
  DatePicker,
  Divider,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Upload,
  notification,
} from "antd";
import dayjs from "dayjs";
import { createArticle, uploadFile } from "../../../services/api";
import { UploadOutlined } from "@ant-design/icons";
const { Search } = Input;
const ArticalModal = (props) => {
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState();
  const [newTopicFiles, setFileList] = useState({});
  const [resultId, setResultId] = useState();
  const [form] = Form.useForm();

  const getResultId = async (query) => {
    try {
      setResultId(response.data.organic_results);
    } catch (error) {
      console.error("Error fetching the data", error);
    }
  };
  const handleOk = () => {
    form.submit();
  };
  const handleCancel = () => {
    props.setOpenModal(false);
  };
  const onSubmit = async (values) => {
    try {
      const data = {
        ...values,
        publishYear: dayjs(values.publishYear).format("YYYY"),
        numberOfPages: parseInt(values.numberOfPages),
        userId: props.userId,
      };
      const res = await createArticle(data);
      setLoading(true);
      if (res && res.statusCode === 200) {
        setLoading(false);
        notification.success({
          message: "Thông báo",
          description: "Thêm mới bài báo khoa học thành công",
        });
        props.getArtical();
        form.resetFields();
        handleCancel();
      }
    } catch (error) {
      console.log("Error at submit article: ", error);
    }
  };
  const { YearPicker } = DatePicker;
  const onChangeSelect = (value) => {
    setType(value);
  };
  const onChangeLink = (value) => {
    getResultId(value);
  };
  const propsUpload = {
    name: "file",
    multiple: false,
    maxCount: 1,
    customRequest: async ({ file, onSuccess, onError }) => {
      try {
        const isCompressedFile =
          file.type ===
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
          file.type === "application/pdf";
        if (!isCompressedFile) {
          message.error("Chỉ được phép tải lên các file docx hoặc pdf!");
          setError("Chỉ được phép tải lên các file docx hoặc pdf!");
          onError(file);
          return;
        }
        const response = await uploadFile(file);
        if (response.data.fileLink === null) {
          onError(response, file);
          message.error(`${file.name} file tải lên không thành công!.`);
        } else {
          setFileList(response.data.fileLink);
          // Gọi onSuccess để xác nhận rằng tải lên đã thành công
          onSuccess(response, file);
          // Hiển thị thông báo thành công
          message.success(`${file.name} tải lên thành công.`);
        }
      } catch (error) {
        // Gọi onError để thông báo lỗi nếu có vấn đề khi tải lên
        onError(error);
        // Hiển thị thông báo lỗi
        message.error(`${file.name} file tải lên thất bại.`);
      }
    },
    onRemove: (file) => {
      setFileList({});
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };
  return (
    <>
      <Modal
        maskClosable={false}
        open={props.openModal}
        title="Thêm mới các bài báo hoặc báo cáo chuyên đề"
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Quay về
          </Button>,
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: "#41C221",
              },
            }}
          >
            <Button
              key="submit"
              type="primary"
              loading={loading}
              onClick={handleOk}
            >
              Xác nhận
            </Button>
            ,
          </ConfigProvider>,
        ]}
      >
        <Divider />
        <Form
          form={form}
          name="basic"
          style={{ maxWidth: 600 }}
          onFinish={onSubmit}
        >
          <Row gutter={20}>
            <Col span={24}>
              <Form.Item
                name="articleType"
                label="Lựa chọn loại bài"
                labelCol={{ span: 24 }}
                rules={[
                  {
                    required: true,
                    message: "Xin hãy nhập vào tên sản phẩm!",
                  },
                ]}
              >
                <Select
                  onChange={onChangeSelect}
                  options={[
                    {
                      value: 0,
                      label: "Bài báo khoa học",
                    },
                    {
                      value: 1,
                      label: "Báo cáo chuyên đề",
                    },
                  ]}
                />
              </Form.Item>
            </Col>
            {type === 0 ? (
              <>
                {" "}
                <Col span={12}>
                  <Form.Item
                    name="authorName"
                    label="Tên sản phẩm"
                    labelCol={{ span: 24 }}
                    rules={[
                      {
                        required: true,
                        message: "Xin hãy điền tên tác giả!",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="publishYear"
                    label="Năm báo cáo"
                    labelCol={{ span: 24 }}
                    rules={[
                      {
                        required: true,
                        message: "Xin hãy chọn năm báo cáo",
                      },
                    ]}
                  >
                    <YearPicker
                      style={{ width: "100%" }}
                      placeholder="Chọn năm xuất bản"
                      picker="year"
                      format="YYYY"
                    />
                  </Form.Item>
                </Col>
              </>
            ) : type === 1 ? (
              <>
                <Col span={24}>
                  <Form.Item
                    name="fileLink"
                    label="Đường dẫn bài báo"
                    labelCol={{ span: 24 }}
                    rules={[
                      {
                        required: true,
                        message: "Xin hãy thêm đường dẫn bài báo",
                      },
                    ]}
                  >
                    <Search
                      onSearch={onChangeLink}
                      enterButton="Tìm kiếm"
                      size="large"
                    />
                  </Form.Item>
                </Col>
              </>
            ) : null}
            <Col span={12}>
              <Form.Item
                name="file"
                label="File minh chứng"
                labelCol={{ span: 24 }}
                rules={[
                  {
                    required: type === 0 ? true : false,
                    message: "Xin hãy tải file minh chứng",
                  },
                ]}
              >
                <Upload {...propsUpload}>
                  <Button icon={<UploadOutlined />}>
                    Tải lên file minh chứng
                  </Button>
                </Upload>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};
export default ArticalModal;
