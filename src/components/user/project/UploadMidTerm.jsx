import React, { useEffect, useState } from "react";
import {
  Button,
  Checkbox,
  Col,
  ConfigProvider,
  Divider,
  Form,
  Input,
  Modal,
  Row,
  Upload,
  message,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import {
  getFileType,
  submitDocumentsFinalterm,
  submitDocumentsMidterm,
  uploadFile,
} from "../../../services/api";

const UploadMidTerm = (props) => {
  const isModalOpen = props.isModalOpen;
  const [form] = Form.useForm();
  const [isSubmit, setIsSubmit] = useState(false);
  const [newTopicFiles, setFileList] = useState({});
  const [fileType, setFileType] = useState([]);
  const [checkedList, setCheckedList] = useState([]);
  const onChange = (list) => {
    setCheckedList(list);
  };
  const handleOk = () => {
    form.submit();
  };
  const handleCancel = () => {
    props.setIsModalOpen(false);
    setFileList({});
  };
  const listFileType = async () => {
    try {
      const res = await getFileType({
        stateNumber: props.state,
      });
      if (res && res.isSuccess) {
        setFileType(res.data);
      }
    } catch (error) {
      console.log("====================================");
      console.log("error: ", error);
      console.log("====================================");
    }
  };
  const onSubmit = async () => {
    if (Object.values(newTopicFiles).length === 0) {
      message.error("Xin hãy tải file lên");
      return;
    }
    const data = {
      topicId: props.topicId,
      newFile: newTopicFiles,
    };

    try {
      let res;
      if (props.state === "2") {
        res = await submitDocumentsMidterm(data);
      } else {
        res = await submitDocumentsFinalterm(data);
      }
      setIsSubmit(true);
      if (res && res.statusCode === 200) {
        setIsSubmit(false);
        message.success("Tải file lên thành công");
        handleCancel();
        if (props.status) {
          props.setStatus(false);
        } else {
          props.setStatus(true);
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
  useEffect(() => {
    if (props.state === true) {
      listFileType();
    }
  }, [props.state]);
  return (
    <>
      <Modal
        title={
          props.state === "2"
            ? "Đăng ký báo cáo giữa kỳ"
            : "Nộp tài liệu cuối kỳ"
        }
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
            <Button
              disabled={fileType.length === checkedList.length ? false : true}
              type="primary"
              onClick={handleOk}
            >
              Gửi
            </Button>
          </ConfigProvider>,
        ]}
      >
        <Divider />
        <Form form={form} name="basic" onFinish={onSubmit}>
          <Row gutter={20}>
            {props.state === 2 ? (
              <>
                <Col span={24}>
                  <p>File mẫu tham khảo: </p>
                  <a href="https://srms2.sgp1.cdn.digitaloceanspaces.com/3.Baocaogiuky-20240614002445317.rar">
                    Ấn để tải
                  </a>
                </Col>
                <Divider />
              </>
            ) : (
              <></>
            )}

            <Col span={24}>
              <Form.Item
                name="file"
                label="Chỉ hỗ trợ các file như zip hoặc rar"
                labelCol={{ span: 24 }}
              >
                <Upload {...propsUpload}>
                  <Button icon={<UploadOutlined />}>Tải lên</Button>
                </Upload>
              </Form.Item>
            </Col>
            <Divider />
            <Col>
              <p>
                Xác nhận các file đã nộp: <br />
              </p>

              <Checkbox.Group
                style={{ display: "flex", flexDirection: "column" }}
                value={checkedList}
                onChange={onChange}
                disabled={
                  Object.values(newTopicFiles).length === 0 ? true : false
                }
              >
                {fileType.map((option) => (
                  <Checkbox key={option.typeName} value={option.typeName}>
                    {option.typeName}
                  </Checkbox>
                ))}
              </Checkbox.Group>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};
export default UploadMidTerm;
