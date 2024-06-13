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
  makeDeadlineSubmit,
  moveToFinalTerm,
  uploadFile,
  uploadReportMidTerm,
  uploadResult,
  uploadResultFinal,
} from "../../../services/api";
import { useNavigate } from "react-router-dom";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(utc);
dayjs.extend(customParseFormat);
const dateFormat = "DD/MM/YYYY";

const ModalUpload = (props) => {
  const data = props.data;
  const isModalOpen = props.isModalOpen;
  const today = dayjs(data.meetingTime).add(1, "day");
  const maxDate = dayjs().add(14, "day");
  const [form] = Form.useForm();
  const [isSubmit, setIsSubmit] = useState(false);
  const [newTopicFiles, setFileList] = useState({});
  const [review, setReview] = useState(null);
  const [reviewMidtearm, setReviewMidtearm] = useState(null);
  const [meetingDate, setMeetingDate] = useState(today);
  const [errorMessage, setError] = useState("");
  const state = data.state === "MidtermReport" ? true : false;
  const navigate = useNavigate();
  const handleOk = () => {
    form.submit();
  };
  const handleCancel = () => {
    props.setDataUser({});
    props.setIsModalOpen(false);
    setFileList({});
    form.resetFields();
  };
  const onSubmit = async (values) => {
    if (Object.values(newTopicFiles).length === 0) {
      message.error("Xin hãy tải biên bản cuộc họp lên");
      return;
    }

    if (data.state === "MidtermReport") {
      const param = {
        topicId: data.topicId,
        newFile: newTopicFiles,
      };
      try {
        const res = await uploadReportMidTerm(param);
        setIsSubmit(true);
        if (res && res.isSuccess) {
          setIsSubmit(false);
          message.success("Tải biên bản lên thành công");
          if (reviewMidtearm === "1") {
            const timeMidterm = {
              topicId: data.topicId,
              documentSupplementationDeadline: dayjs(meetingDate)
                .local()
                .format(),
            };
            const res = await makeDeadlineSubmit(timeMidterm);
            if (res && res.isSuccess) {
              navigate("/staff/midterm");
            }
          } else if (reviewMidtearm === "0") {
            const res = await moveToFinalTerm({
              topicId: data.topicId,
            });

            if (res && res.statusCode === 200) {
              navigate("/staff/finalterm");
            }
          }
        }
      } catch (error) {
        console.log("====================================");
        console.log("có lỗi tại upload result", error);
        console.log("====================================");
      }
    } else {
      const param = {
        topicId: data.topicId,
        decisionOfCouncil: Number(values.decisionOfCouncil),
        resultFileLink: newTopicFiles.fileLink,
        resubmitDeadline:
          values.decisionOfCouncil === "1"
            ? null
            : dayjs(meetingDate).local().format(),
      };

      try {
        let res;
        if (data.state === "FinaltermReport") {
          res = await uploadResultFinal(param);
        } else {
          res = await uploadResult(param);
        }
        setIsSubmit(true);
        if (res && res.isSuccess) {
          setIsSubmit(false);
          message.success("Tải biên bản lên thành công");
          navigate("/staff");
        }
      } catch (error) {
        console.log("====================================");
        console.log("có lỗi tại upload result", error);
        console.log("====================================");
      }
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
  const handleRadioChange = (e) => {
    setReviewMidtearm(e.target.value);
  };
  // set up initial value for the form
  useEffect(() => {
    form.setFieldsValue(data);
  }, [data]);
  const handleDateChange = (date) => {
    setMeetingDate(date);
  };
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
              <Form.Item name="code" label="ID đề tài" labelCol={{ span: 24 }}>
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
            <Col span={24} hidden={state}>
              <Form.Item
                name="decisionOfCouncil"
                label="Quyết định của hội đồng"
                labelCol={{ span: 24 }}
                rules={[
                  {
                    required: data.state === "MidtermReport" ? false : true,
                    message: "Xin hãy chọn quyết định của hội đồng!",
                  },
                ]}
              >
                <Select
                  showSearch
                  allowClear
                  onChange={(value) => setReview(value)}
                  options={[
                    {
                      value: "1",
                      label: "Đồng ý",
                    },
                    {
                      value: "0",
                      label: "Không đồng ý",
                    },
                    {
                      value: "2",
                      label: "Đồng ý có chỉnh sửa",
                    },
                  ]}
                />
              </Form.Item>
            </Col>
            {review === "2" && (
              <Col span={24}>
                <Form.Item
                  name="date"
                  label="Ngày phải nộp lại"
                  labelCol={{ span: 24 }}
                >
                  <DatePicker
                    format={dateFormat}
                    defaultValue={today}
                    minDate={today}
                    maxDate={maxDate}
                    onChange={handleDateChange}
                  />
                </Form.Item>
              </Col>
            )}

            <Col span={24}>
              <Form.Item
                name="comment"
                label="Biên bản góp ý"
                labelCol={{ span: 24 }}
              >
                <p>Chỉ hỗ trợ cái file như docx hoặc pdf</p>
                <Upload {...propsUpload}>
                  <Button icon={<UploadOutlined />}>Tải tài liệu lên</Button>
                </Upload>
                {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
              </Form.Item>
            </Col>
            <Col
              span={24}
              hidden={data.state === "MidtermReport" ? false : true}
            >
              <Form.Item
                name="decisionOfCouncil"
                label="Quyết định của hội đồng"
                labelCol={{ span: 24 }}
                rules={[
                  {
                    required: data.state === "MidtermReport" ? true : false,
                    message: "Xin hãy chọn quyết định của hội đồng!",
                  },
                ]}
              >
                <Radio.Group
                  onChange={handleRadioChange}
                  value={reviewMidtearm}
                  disabled={
                    Object.values(newTopicFiles).length === 0 ? true : false
                  }
                >
                  <Space direction="vertical">
                    <Radio value="1">Tiếp tục báo cáo</Radio>
                    <Radio value="0">Kết thúc báo cáo</Radio>
                  </Space>
                </Radio.Group>
              </Form.Item>
            </Col>

            {reviewMidtearm === "1" && (
              <Col span={24}>
                <Form.Item
                  name="date"
                  label="Ngày phải nộp lại tài liệu"
                  labelCol={{ span: 24 }}
                >
                  <DatePicker
                    format={dateFormat}
                    defaultValue={today}
                    minDate={today}
                    maxDate={maxDate}
                    onChange={handleDateChange}
                  />
                </Form.Item>
              </Col>
            )}
          </Row>
        </Form>
      </Modal>
    </>
  );
};
export default ModalUpload;
