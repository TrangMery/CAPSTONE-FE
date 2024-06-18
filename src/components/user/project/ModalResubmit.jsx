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
import {
  getReviewDocuments,
  uploadFile,
  uploadResubmit,
} from "../../../services/api";

const ModalUploadResubmit = (props) => {
  const isModalOpen = props.isModalOpen;
  const [form] = Form.useForm();
  const [isSubmit, setIsSubmit] = useState(false);
  const [newTopicFiles, setFileList] = useState({});
  const [checked, setChecked] = useState(true);
  const [dataResubmit, setDataResubmit] = useState({});
  const handleOk = () => {
    form.submit();
  };
  let checkEnd;
  const handleCancel = () => {
    props.setIsModalOpen(false);
    setFileList([]);
    form.resetFields();
  };
  const getReviewDoc = async () => {
    const res = await getReviewDocuments({
      userId: props.userId,
      topicId: props.topicId,
    });
    if (res && res?.data) {
      setDataResubmit(res.data.reviewEarlyDocument);
    }
  };
  const onSubmit = async () => {
    if (Object.values(newTopicFiles).length === 0) {
      message.error("Xin hãy tải file lên");
      return;
    }
    const param = {
      topicId: props.topicId,
      newFile: {
        fileName: newTopicFiles.fileName,
        fileLink: newTopicFiles.fileLink,
      },
    };
    try {
      const res = await uploadResubmit(param);
      setIsSubmit(true);
      if (res && res.isSuccess) {
        setIsSubmit(false);
        message.success("Tải file chỉnh sửa thành công");
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
    newTopicFiles,
    customRequest: async ({ file, onSuccess, onError }) => {
      try {
        const isCompressedFile =
          file.type === "application/x-rar-compressed" ||
          file.type === "application/x-zip-compressed" ||
          file.type === "application/x-compressed";
        if (!isCompressedFile) {
          message.error(
            "Chỉ được phép tải lên các file đã nén (zip hoặc rar)!"
          );
          onError(file);
          return;
        }
        const response = await uploadFile(file);
        if (response.data.fileLink === null) {
          onError(response, file);
          message.error(`${file.name} file tải lên không thành công.`);
        } else {
          setFileList({
            fileName: response.data.fileName,
            fileLink: response.data.fileLink,
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
  if ( Object.values(dataResubmit).length !== 0) {
    checkEnd = dataResubmit?.resultFileLink.endsWith(".docx");
  }

  useEffect(() => {
    getReviewDoc();
  }, [isModalOpen === true]);
  return (
    <>
      <Modal
        title="File sửa lỗi theo góp ý"
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
            <Col span={24}>
              <Form.Item
                name="document"
                label="File đánh giá của hội đồng"
                labelCol={{ span: 24 }}
              >
                <span>
                  <a
                    href={
                      checkEnd
                        ? `https://view.officeapps.live.com/op/view.aspx?src=` +
                          dataResubmit?.resultFileLink
                        : dataResubmit?.resultFileLink
                    }
                    target="_blank"
                    rel={dataResubmit?.resultFileLink}
                    onClick={() => setChecked(false)}
                  >
                    {dataResubmit?.resultFileLink}
                  </a>
                </span>
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="upload"
                label="Tải lên tài liệu đã chỉnh sửa"
                labelCol={{ span: 24 }}
              >
                <p>
                  {checkEnd === true
                    ? "Vui lòng đọc file góp ý trước khi tải lên"
                    : ""}
                </p>
                <Upload {...propsUpload}>
                  <Button disabled={checked} icon={<UploadOutlined />}>
                    Tải lên tài liệu
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
export default ModalUploadResubmit;
