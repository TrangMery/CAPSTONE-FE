import React, { useEffect, useState } from "react";
import {
  Button,
  Checkbox,
  Col,
  ConfigProvider,
  Divider,
  Form,
  Modal,
  Row,
  Upload,
  message,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import {
  getContractType,
  uploadContract,
  uploadFile,
} from "../../../services/api";
import { useNavigate } from "react-router-dom";
const ModalUploadContract = (props) => {
  const isModalOpen = props.isModalContractOpen;
  const data = props.data;
  const [form] = Form.useForm();
  const [isSubmit, setIsSubmit] = useState(false);
  const [newTopicFiles, setFileList] = useState({});
  const [checkedList, setCheckedList] = useState([]);
  const [plainOptions, setPlainOptions] = useState([]);
  const navigate = useNavigate();
  const onChange = (list) => {
    setCheckedList(list);
  };

  const handleOk = () => {
    form.submit();
  };
  const handleCancel = () => {
    props.setDataUser({});
    props.setIsModalContractOpen(false);
    setFileList([]);
    form.resetFields();
  };
  const getTopicType = async () => {
    try {
      const res = await getContractType({
        contractTypeSateNumber: 0,
      });
      if (res && res.isSuccess) {
        const newOptions = res.data.map((item) => ({
          value: item.typeName,
        }));
        setPlainOptions(newOptions);
      }
    } catch (error) {
      console.log("====================================");
      console.log(error);
      console.log("====================================");
    }
  };

  const onSubmit = async () => {
    if (Object.values(newTopicFiles).length === 0) {
      message.error("Xin hãy tải biên bản cuộc họp lên");
      return;
    }
    const param = {
      topicId: data.topicId,
      contractName: newTopicFiles.fileName,
      contractLink: newTopicFiles.fileLink,
    };
    try {
      const res = await uploadContract(param);
      setIsSubmit(true);
      if (res && res.message) {
        setIsSubmit(false);
        props.confirm(data.topicId);
      }
    } catch (error) {
      console.log("====================================");
      console.log("có lỗi tại upload result", error.message);
      console.log("====================================");
    }
  };
  const propsUpload = {
    name: "file",
    multiple: true,
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
        // Thực hiện tải lên file thông qua API của bạn
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
        message.error(
          `${file.name} file tải lên thất bại vui lòng thử lại sau.`
        );
      }
    },
    onRemove: (file) => {
      setFileList([]);
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  // set up initial value for the form
  useEffect(() => {
    getTopicType();
  }, [data]);
  return (
    <>
      <Modal
        title="Hợp đồng"
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
              key="send"
              type="primary"
              onClick={handleOk}
              disabled={
                plainOptions.length === checkedList.length ? false : true
              }
            >
              Gửi
            </Button>
          </ConfigProvider>,
        ]}
      >
        <Divider />
        <Form form={form} name="basic12" onFinish={onSubmit} className="fomr">
          <Row gutter={20}>
            <Col span={24}>
              <p>Chỉ hỗ trợ cái file như zip hoặc rar</p>
              <Upload {...propsUpload}>
                <Button icon={<UploadOutlined />}>Tải hợp đồng lên</Button>
              </Upload>
            </Col>
            <Divider />

            <Col>
              <h4>Hợp đồng đính kèm:</h4>
              <Checkbox.Group
                style={{ display: "flex", flexDirection: "column" }}
                value={checkedList}
                onChange={onChange}
                disabled={
                  Object.values(newTopicFiles).length === 0 ? true : false
                }
              >
                {plainOptions.map((option) => (
                  <Checkbox key={option.value} value={option.value}>
                    {option.value}
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
export default ModalUploadContract;
