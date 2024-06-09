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
import {  UploadOutlined } from "@ant-design/icons";
// import { uploadFileSingle, uploadResult } from "../../../services/api";
import { useNavigate } from "react-router-dom";
import { uploadFile, uploadResubmit } from "../../../services/api";

const ModalUpload = (props) => {
  const isModalOpen = props.isModalOpen;
  const [form] = Form.useForm();
  const [isSubmit, setIsSubmit] = useState(false);
  const [newTopicFiles, setFileList] = useState([]);
  const data = props.data;
  const navigate = useNavigate();
  const handleOk = () => {
    form.submit();
  };
  const handleCancel = () => {
    props.setDataUser({});
    props.setIsModalOpen(false);
    setFileList([]);
    form.resetFields();
  };
  const onSubmit = async () => {
    // if (newTopicFiles[0]?.topicFileLink == null) {
    //   message.error("Xin hãy tải bản chỉnh sửa");
    //   return;
    // }
    const updatedFileFilter = newTopicFiles.map(({ uid, ...rest }) => rest);
    const param = {
      topicId: data[0].topicId,
      // fileLink: newTopicFiles[0],
      // fileName: newTopicFiles[0].fileName,
      newFiles: updatedFileFilter
    };
    try {
      const res = await uploadResubmit(param);
      setIsSubmit(true);
      if (res && res.isSuccess) {
        setIsSubmit(false);
        message.success("Tải file nộp lại thành công");
        navigate("/user");
      }
    } catch (error) {
      console.log("====================================");
      console.log("có lỗi tại upload result", error);
      console.log("====================================");
    }
  };
  const propsUpload = {
    name: "file",
    multiple: true,
    customRequest: async ({ file, onSuccess, onError }) => {
      try {
        // Thực hiện tải lên file thông qua API của bạn
        const response = await uploadFile(file);
        if (response.data[0].fileLink === null) {
          onError(response, file);
          message.error(`${file.name} file uploaded unsuccessfully.`);
        } else {
          setFileList((fileList) => [
            ...fileList,
            {
              uid: file.uid,
              fileName: response.data[0].fileName,
              fileLink: response.data[0].fileLink,
            },
          ]);
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
      const fileFilter = newTopicFiles.filter((x) => x.uid !== file.uid);
      setFileList(fileFilter);
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };
  // const propsUpload = {
  //   name: "file",
  //   multiple: false,
  //   maxCount: 1,
  //   customRequest: async ({ file, onSuccess, onError }) => {
  //     try {
  //       const response = await uploadFileSingle(file);
  //       if (response.data.fileLink === null) {
  //         onError(response, file);
  //         message.error(`${file.name} file uploaded unsuccessfully.`);
  //       } else {
  //         setFileList(() => [
  //           {
  //             topicFileName: response.data.fileName,
  //             topicFileLink: response.data.fileLink,
  //           },
  //         ]);
  //         // Gọi onSuccess để xác nhận rằng tải lên đã thành công
  //         onSuccess(response, file);
  //         // Hiển thị thông báo thành công
  //         message.success(`${file.name} file uploaded successfully.`);
  //       }
  //     } catch (error) {
  //       // Gọi onError để thông báo lỗi nếu có vấn đề khi tải lên
  //       onError(error);
  //       // Hiển thị thông báo lỗi
  //       message.error(`${file.name} file upload failed.`);
  //     }
  //   },
  //   onRemove: (file) => {
  //     setFileList([]);
  //   },
  //   onDrop(e) {
  //     console.log("Dropped files", e.dataTransfer.files);
  //   },
  // };

  // set up initial value for the form
  useEffect(() => {
    form.setFieldsValue(data[0]);
  }, [data]);
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
            <Col span={12}>
              <Form.Item name="deadline" label="Hạn nộp" labelCol={{ span: 24 }}>
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="state"
                label="Giai đoạn"
                labelCol={{ span: 24 }}
              >
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="comment"
                label="Biên bản góp ý"
                labelCol={{ span: 24 }}
              >
                <Upload {...propsUpload}>
                  <Button icon={<UploadOutlined />}>
                    Ấn vào để tải tài liệu lên
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
export default ModalUpload;
