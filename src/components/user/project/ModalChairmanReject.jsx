import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  ConfigProvider,
  Divider,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Upload,
  message,
  notification,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
// import { uploadFileSingle, uploadResult } from "../../../services/api";
import { useNavigate } from "react-router-dom";
import { uploadFile, chairmanReject } from "../../../services/api";

const ModalChairmanReject = (props) => {
  const isModalOpen = props.isModalOpen;
  const state = props.state;
  const [form] = Form.useForm();
  const [isSubmit, setIsSubmit] = useState(false);
  const [newTopicFiles, setFileList] = useState({});
  const [errorMessage, setError] = useState("");
  const navigate = useNavigate();
  const handleOk = () => {
    form.submit();
  };
  const handleCancel = () => {
    props.setIsModalOpen(false);
    setFileList([]);
    form.resetFields();
  };
  const onSubmit = async () => {
    if (Object.values(newTopicFiles).length === 0) {
      message.error("Xin hãy tải file lên");
      return;
    }
    const param = {
      topicId: props.topicId,
      feedbackFileLink: newTopicFiles.topicFileLink,
    };
    try {
      setIsSubmit(true);
      if (state === 1) {
        const res = await chairmanReject(param);
        if (res.isSuccess) {
          setIsSubmit(false);
          message.success("Tải biên bản lên thành công");
          navigate("/user/review");
        }
      } else if (state === 3) {
        const res = props.chairmanFinalDecision(
          false,
          newTopicFiles.topicFileLink
        );
        if (res === true) {
          setIsSubmit(false);
          message.success("Tải biên bản lên thành công");
          navigate("/user/review");
        }
      }
    } catch (error) {
      console.log("====================================");
      console.log("có lỗi tại upload result", error);
      console.log("====================================");
    }
  };
  const propsUpload = {
    name: "file",
    multiple: false,
    maxCount: 1,
    customRequest: async ({ file, onSuccess, onError }) => {
      try {
        const isCompressedFile =
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        if (!isCompressedFile) {
          message.error("Chỉ được phép tải lên các file word!");
          setError("Chỉ được phép tải lên các file word!");
          onError(file);
          return;
        }
        const response = await uploadFile(file);
        if (response.data.fileLink === null) {
          onError(response, file);
          message.error(`${file.name} file uploaded unsuccessfully.`);
        } else {
          setFileList({
            topicFileName: response.data.fileName,
            topicFileLink: response.data.fileLink,
          });
          // Gọi onSuccess để xác nhận rằng tải lên đã thành công
          onSuccess(response, file);
          // Hiển thị thông báo thành công
          message.success(`${file.name} file tải lên thành công.`);
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
        title="File góp ý"
        centered
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={isSubmit}
        maskClosable={false}
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
            <Button type="primary" onClick={handleOk}>
              Xác nhận
            </Button>
          </ConfigProvider>,
        ]}
      >
        <Divider />
        <Form form={form} name="basic" onFinish={onSubmit}>
          <Row gutter={20}>
            <Col span={24}>
              <Form.Item
                name="comment"
                label="Biên bản góp ý"
                labelCol={{ span: 24 }}
              >
                <Upload {...propsUpload}>
                  <Button icon={<UploadOutlined />}>Tải lên biên bản</Button>
                </Upload>
                {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};
export default ModalChairmanReject;
