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
  Form,
  InputNumber,
} from "antd";
import axios from "axios";
import { CheckCircleOutlined, CheckOutlined } from "@ant-design/icons";

const { Panel } = Collapse;

const Stage3 = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successPanel, setSuccessPanel] = useState({});
  const [completed, setCompleted] = useState({});
  const handleSubmit = async (values, url, index) => {
    setLoading(true);
    setError(null);
    try {
      let response;
      if (index === 4) {
        response = await axios.post(
          `${url}${
            "numberOfApprove=" +
            values.numberOfApprove +
            "&numberOfReject=" +
            values.numberOfReject +
            "&numberOfEdit=" +
            values.numberOfEdit
          }`
        );
      } else if (index === 3) {
        response = await axios.post(`${url}`);
      } else {
        response = await axios.post(`${url}${values.topicNumber}`);
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
      endpoint: "http://localhost:5132/api/mock/final-schedule?numberOfTopic=",
      fields: [{ name: "Số lượng đề tài", key: "topicNumber" }],
    },
    {
      key: 2,
      name: "Trưởng nhóm nộp tài liệu",
      endpoint:
        "http://localhost:5132/api/mock/final-supplementation?numberOfTopic=",
      fields: [{ name: "Số lượng đề tài", key: "topicNumber" }],
    },
    {
      key: 3,
      name: "Tạo hội đồng phê duyệt",
      endpoint: "http://localhost:5132/api/mock/final-config",
      fields: [{ name: "Số lượng đề tài", key: "topicNumber" }],
    },
    {
      key: 4,
      name: "Hội đồng phê duyệt đánh giá",
      endpoint: "http://localhost:5132/api/mock/final-upload-meeting-result?",
      fields: [
        { name: "Số lượng đề tài thông qua", key: "numberOfApprove" },
        { name: "Số lượng đề tài nộp lại", key: "numberOfReject" },
        { name: "Số lượng đề tài bị loại", key: "numberOfEdit" },
      ],
    },
    {
      key: "5",
      name: "Trưởng nhóm nộp lại tài liệu",
      endpoint: "http://localhost:5132/api/mock/final-resubmit?numberOfTopic=",
      fields: [{ name: "Số lượng đề tài", key: "topicNumber" }],
    },
    {
      key: "6",
      name: "Chủ tịch hội đồng đánh giá",
      endpoint:
        "http://localhost:5132/api/mock/final-chairman-make-decision?numberOfTopic=",
      fields: [{ name: "Số lượng đề tài", key: "topicNumber" }],
    },
  ];
  return (
    <div>
      <Space direction="vertical" style={{ width: "100%" }} size="large">
        {apiEndpoints.map((api, index) => (
          <Collapse key={index}>
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
                {api.key === 3 ? (
                  <></>
                ) : (
                  <>
                    {api.fields.map((field) => (
                      <Form.Item
                        key={field.name}
                        name={field.key}
                        rules={[
                          {
                            required: api.key !== 4 ? true : false,
                            message: "Xin hãy nhập số!",
                          },
                        ]}
                        label={field.name}
                      >
                        <InputNumber
                          disabled={api.key === 4}
                          style={{ width: "20%" }}
                        />
                      </Form.Item>
                    ))}
                  </>
                )}
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

export default Stage3;
