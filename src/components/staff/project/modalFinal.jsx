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
  Radio,
  Space,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import {
  staffSubmitDecisionFile,
  uploadFile,
  uploadFinalContract,
} from "../../../services/api";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(utc);
dayjs.extend(customParseFormat);

const ModalFinal = (props) => {
  const isModalOpen = props.isModalOpen;
  const [form] = Form.useForm();
  const [isSubmit, setIsSubmit] = useState(false);
  const [newTopicFiles, setFileList] = useState({});
  const [review, setReviewTerm] = useState();
  const [errorMessage, setError] = useState("");
  const data = props.data;
  if (data !== null) {
    form.setFieldsValue(data);
  }
  const handleOk = () => {
    form.submit();
  };
  const handleCancel = () => {
    props.setIsModalOpen(false);
    setFileList({});
    form.resetFields();
  };
  const handleRadioChange = (e) => {
    setReviewTerm(e.target.value);
  };
  const onSubmit = async () => {
    if (Object.values(newTopicFiles).length === 0) {
      message.error("Xin hãy tải biên bản cuộc họp lên");
      return;
    }

    try {
      const dataSubmit = {
        topicId: data.topicId,
        isAccept: review === "1" ? true : false,
      };
      const res = await staffSubmitDecisionFile(dataSubmit);
      setIsSubmit(true);
      if (res && res.isSuccess) {
        setIsSubmit(false);
        if (res && res.statusCode === 200) {
          const dataSrc = {
            topicId: data.topicId,
            contractName: newTopicFiles.fileName,
            contractLink: newTopicFiles.fileLink,
          };

          const endPhase = await uploadFinalContract(dataSrc);
          if (endPhase && endPhase.statusCode === 200) {
            message.success("Tải biên bản lên thành công");
            props.getTopicSumarizeTerm();
          }
        }
        handleCancel();
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
          setFileList({
            fileName: response.data.fileName,
            fileLink: response.data.fileLink,
          });
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
      setError("");
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  // set up initial value for the form
  useEffect(() => {
    form.setFieldsValue(data);
  }, [data]);
  return (
    <>
      <Modal
        title="Góp ý của hội đồng"
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
              Gửi
            </Button>
          </ConfigProvider>,
        ]}
      >
        <Divider />
        <Form form={form} name="basic" onFinish={onSubmit}>
          <Row gutter={20}>
            <Col span={12}>
              <Form.Item name="code" label="Mã đề tài" labelCol={{ span: 24 }}>
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="topicName"
                label="Tên đề tài"
                labelCol={{ span: 24 }}
              >
                <Input disabled />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                name="comment"
                label="Hợp đồng kết thúc đề tài"
                labelCol={{ span: 24 }}
              >
                <p>Chỉ hỗ trợ cái file như docx hoặc pdf</p>
                <Upload {...propsUpload}>
                  <Button icon={<UploadOutlined />}>Tải tài liệu lên</Button>
                </Upload>
                {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="decisionOfCouncil"
                label="Quyết định của giám đốc"
                labelCol={{ span: 24 }}
                rules={[
                  {
                    required: true,
                    message: "Xin hãy chọn quyết định của giám đốc",
                  },
                ]}
              >
                <Radio.Group
                  onChange={handleRadioChange}
                  value={review}
                  disabled={
                    Object.values(newTopicFiles).length === 0 ? true : false
                  }
                >
                  <Space direction="vertical">
                    <Radio value="1">Chấp thuận</Radio>
                    <Radio value="0">Nộp Lại</Radio>
                  </Space>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};
export default ModalFinal;
