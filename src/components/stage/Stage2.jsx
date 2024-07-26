import React, { useState } from "react";
import {
  Collapse,
  Spin,
  Alert,
  Input,
  Button,
  Row,
  Col,
  Space,
  Divider,
  InputNumber,
  Form,
  Select,
} from "antd";
import axios from "axios";
import { CheckCircleOutlined, CheckOutlined } from "@ant-design/icons";

const { Panel } = Collapse;

const Stage2 = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successPanel, setSuccessPanel] = useState({});
  const [completed, setCompleted] = useState({});
  const handleSubmit = async (values, url, index) => {
    setLoading(true);
    setError(null);
    try {
      let response;
      if (index === 5) {
        response = await axios.post(
          `${url}${
            "numberOfMoveOn=" +
            values.numberOfMoveOn +
            "&numberOfReportAgain=" +
            values.numberOfReportAgain +
            "&numberOfReport=" +
            values.numberOfReport
          }`
        );
      } else if (index === 3) {
        response = await axios.post(
          `${url}${"numberOfReport=" + values.numberOfReport}`
        );
      } else {
        response = await axios.post(
          `${url}${
            "numberOfTopic=" +
            values.numberOfTopic +
            "&numberOfReport=" +
            values.numberOfReport
          }`
        );
      }

      if (response.status === 200) {
        setCompleted({ ...completed, [index]: true });
        setSuccessPanel({ ...successPanel, [index]: true });
      }
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  const apiEndpoints = [
    {
      key: 1,
      name: "Tạo lịch nộp tài liệu",
      endpoint: "http://localhost:5132/api/mock/middle-schedule?",
      fields: [
        { name: "Số lượng đề tài", key: "numberOfTopic" },
        { name: "Trạng thái", key: "numberOfReport" },
      ],
    },
    {
      key: 2,
      name: "Trưởng nhóm nộp tài liệu",
      endpoint: "http://localhost:5132/api/mock/middle-supplementation?",
      fields: [
        { name: "Số lượng đề tài", key: "numberOfTopic" },
        { name: "Trạng thái", key: "numberOfReport" },
      ],
    },
    {
      key: 3,
      name: "Tạo hội đồng phê duyệt",
      endpoint: "http://localhost:5132/api/mock/middle-config?",
      fields: [{ name: "Trạng thái", key: "numberOfReport" }],
    },
    {
      key: 4,
      name: "Hội đồng phê duyệt đánh giá",
      endpoint: "http://localhost:5132/api/mock/middle-evaluate?",
      fields: [
        { name: "Số lượng đề tài", key: "numberOfTopic" },
        { name: "Trạng thái", key: "numberOfReport" },
      ],
    },
    {
      key: 5,
      name: "Chuyển trạng thái đề tài",
      endpoint: "http://localhost:5132/api/mock/move-to-final?",
      fields: [
        { name: "Số lượng đề tài thông qua", key: "numberOfMoveOn" },
        { name: "Số lượng đề tài báo cáo lại", key: "numberOfReportAgain" },
        { name: "Trạng thái", key: "numberOfReport" },
      ],
    },
  ];
  return (
    <div>
      <Space direction="vertical" style={{ width: "100%" }} size="large">
        {apiEndpoints.map((api) => (
          <Collapse key={api.key}>
            <Panel
              header={
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span>{api.name}</span>
                  {completed[api.key] && (
                    <CheckOutlined style={{ color: "green" }} />
                  )}
                </div>
              }
              key={api.key}
              style={{
                backgroundColor: completed[api.key] ? "#d4edda" : "white",
              }}
            >
              <Form
                onFinish={(values) =>
                  handleSubmit(values, api.endpoint, api.key)
                }
                layout="vertical"
              >
                {api.fields.map((field) => (
                  <Form.Item
                    key={field.key}
                    name={field.key}
                    rules={[
                      {
                        required: true,
                        message: `Xin hãy nhập ${
                          field.name === "Trạng thái" ? "trạng thái" : "số"
                        }!`,
                      },
                    ]}
                    label={field.name}
                  >
                    {field.name === "Trạng thái" ? (
                      <Select placeholder="Chọn trạng thái" style={{ width: "20%" }}>
                        <Option value="1">Báo cáo lần 1</Option>
                        <Option value="2">Báo cáo lần 2</Option>
                        <Option value="3">Báo cáo nhiều hơn 2 lần</Option>
                      </Select>
                    ) : (
                      <InputNumber style={{ width: "20%" }} />
                    )}
                  </Form.Item>
                ))}
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Thực thi
                  </Button>
                </Form.Item>
              </Form>
              {loading && <Spin />}
              {error && <Alert message={`Lỗi: ${error}`} type="error" />}
              <Divider />
              {successPanel[api.key] && (
                <span
                  style={{
                    color: "green",
                    marginLeft: "10px",
                    fontSize: "14px",
                    fontWeight: "bold",
                  }}
                >
                  Tạo thành công
                </span>
              )}
            </Panel>
          </Collapse>
        ))}
      </Space>
    </div>
  );
};

export default Stage2;
