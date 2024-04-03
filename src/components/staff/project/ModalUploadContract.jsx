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
  getContractType,
  getDocumentMidTerm,
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
  const [contracHistory, setContracHistory] = useState();
  const navigate = useNavigate();
  const checkAll = plainOptions.length === checkedList.length;
  const indeterminate =
    checkedList.length > 0 && checkedList.length < plainOptions.length;
  const onChange = (list) => {
    setCheckedList(list);
  };
  const onCheckAllChange = (e) => {
    setCheckedList(
      e.target.checked ? plainOptions.map((option) => option.key) : []
    );
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
          key: item.contractTypeId,
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

  const getTopicUploadHistory = async () => {
    try {
      const res = await getDocumentMidTerm({
        topicId: data.topicId,
      });
      if (res && res.isSuccess) {
        setContracHistory(res.data);
        console.log("====================================");
        console.log(res.data);
        console.log("====================================");
      }
    } catch (error) {
      console.log("====================================");
      console.log(error);
      console.log("====================================");
    }
  };
  const onSubmit = async () => {
    if (newTopicFiles.length <= 0) {
      message.error("Xin hãy tải biên bản cuộc họp lên");
      return;
    }
    const contractArray = checkedList.map((item) => ({
      contractTypeId: item,
      isSubmited: true,
    }));
    console.log("====================================");
    console.log(newTopicFiles);
    console.log("====================================");
    const param = {
      topicId: data.topicId,
      contractName: newTopicFiles.fileName,
      contractLink: newTopicFiles.fileLink,
      contractAttachments: contractArray,
    };
    try {
      const res = await uploadContract(param);
      setIsSubmit(true);
      if (res && res.message) {
        setIsSubmit(false);
        message.success("Tải hợp đồng lên thành công");
        navigate("/staff");
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
          file.type === "application/x-zip-compressed";
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
          message.error(`${file.name} file uploaded unsuccessfully.`);
        } else {
          setFileList({
            fileName: response.data.fileName,
            fileLink: response.data.fileLink,
          });
          // Gọi onSuccess để xác nhận rằng tải lên đã thành công
          onSuccess(response, file);
          // Hiển thị thông báo thành công
          message.success(`${file.name} file uploaded successfully.`);
        }
      } catch (error) {
        // Gọi onError để thông báo lỗi nếu có vấn đề khi tải lên
        onError(error);
        // Hiển thị thông báo lỗi
        message.error(`${file.name} file upload failed.`);
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
    getTopicUploadHistory();
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
              disabled={checkedList.length <= 0}
            >
              Gửi
            </Button>
          </ConfigProvider>,
        ]}
      >
        <Divider />
        <Form form={form} name="basic1" onFinish={onSubmit}>
          <Row gutter={20}>
            <Col span={24}>
              <h3>Lịch sử tải lên hợp đồng:</h3>
              {contracHistory === null ? (
                <div>Chưa tải lên tài liệu</div>
              ) : (
                <>
                  <div>
                    <p>Loại hợp đồng:</p>
                    <ul>
                      {contracHistory?.contractAttachments.map((item) => (
                        <li key={item.contractTypeId}>{item.typeName}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p>Link đính kèm:</p>
                    <a href={contracHistory?.contractLink}>
                      {contracHistory?.contractName}
                    </a>
                  </div>
                </>
              )}
            </Col>
            <Divider />
            <Col span={24}>
              <h3>Hợp đồng đính kèm:</h3>
              {/* <Checkbox
                indeterminate={indeterminate}
                onChange={onCheckAllChange}
                checked={checkAll}
              >
                Check all
              </Checkbox>
              <Divider /> */}
              <Checkbox.Group
                style={{ display: "flex", flexDirection: "column" }}
                value={checkedList}
                onChange={onChange}
              >
                {plainOptions.map((option) => (
                  <Checkbox key={option.key} value={option.key}>
                    {option.value}
                  </Checkbox>
                ))}
              </Checkbox.Group>
              <Divider />
              <Upload {...propsUpload}>
                <Button
                  disabled={checkedList.length <= 0}
                  icon={<UploadOutlined />}
                >
                  Tải hợp đồng lên
                </Button>
              </Upload>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};
export default ModalUploadContract;
