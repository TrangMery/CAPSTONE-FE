import React, { useState } from "react";
import {
  Collapse,
  Spin,
  Alert,
  Button,
  Space,
  Divider,
  Form,
  InputNumber,
} from "antd";
import axios from "axios";
import { CheckOutlined } from "@ant-design/icons";

const { Panel } = Collapse;

const Stage1 = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successPanel, setSuccessPanel] = useState({});
  const [completed, setCompleted] = useState({});
  const handleSubmit = async (values, url, index) => {
    setLoading(true);
    setError(null);
    try {
      let response;
      if (index === 6) {
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
      } else if (index === 5) {
        console.log("chạy vô đây nha");
        response = await axios.post(`${url}`);
      } else {
        response = await axios.post(`${url}${values.topicNumber}`);
      }

      if (response.status === 200) {
        console.log(response);
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
      name: "Tạo topic",
      endpoint: "http://localhost:5132/api/mock/create-topic?numberOfTopic=",
      fields: [{ name: "Số lượng đề tài", key: "topicNumber" }],
    },
    {
      key: 2,
      name: "Trường phòng duyệt",
      endpoint: "http://localhost:5132/api/mock/dean-accept?numberOfTopic=",
      fields: [{ name: "Số lượng đề tài", key: "topicNumber" }],
    },
    {
      key: 3,
      name: "Tạo hội đồng sơ duyệt",
      endpoint:
        "http://localhost:5132/api/mock/pre-council-formation?numberOfTopic=",
      fields: [{ name: "Số lượng đề tài", key: "topicNumber" }],
    },
    {
      key: 4,
      name: "Thành viên sơ duyệt đánh giá",
      endpoint:
        "http://localhost:5132/api/mock/member-review-accept?numberOfTopic=",
      fields: [{ name: "Số lượng đề tài", key: "topicNumber" }],
    },
    {
      key: 5,
      name: "Tạo hội đồng phê duyệt",
      endpoint: "http://localhost:5132/api/mock/early-config",
      fields: [{ name: "Số lượng đề tài", key: "topicNumber" }],
    },
    {
      key: 6,
      name: "Hội đồng phê duyệt đánh giá",
      endpoint: "http://localhost:5132/api/mock/early-upload-meeting-result?",
      fields: [
        { name: "Số lượng đề tài thông qua", key: "numberOfApprove" },
        { name: "Số lượng đề tài nộp lại", key: "numberOfReject" },
        { name: "Số lượng đề tài bị loại", key: "numberOfEdit" },
      ],
    },
    {
      key: 7,
      name: "Trưởng nhóm nộp lại tài liệu",
      endpoint: "http://localhost:5132/api/mock/early-resubmit?numberOfTopic=",
      fields: [{ name: "Số lượng đề tài", key: "topicNumber" }],
    },
    {
      key: 8,
      name: "Chủ tịch hội đồng đánh giá",
      endpoint:
        "http://localhost:5132/api/mock/early-chairman-make-decision?numberOfTopic=",
      fields: [{ name: "Số lượng đề tài", key: "topicNumber" }],
    },
    {
      key: 9,
      name: "Tải lên các hợp đồng liên quan",
      endpoint:
        "http://localhost:5132/api/mock/early-upload-contract?numberOfTopic=",
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
                {api.key === 5 || api.key === 3 ? (
                  <></>
                ) : (
                  <>
                    {api.fields.map((field) => (
                      <Form.Item
                        key={field.name}
                        name={field.key}
                        rules={[
                          {
                            required: index !== 4 ? true : false,
                            message: "Xin hãy nhập số!",
                          },
                        ]}
                        label={field.name}
                      >
                        <InputNumber
                          disabled={index === 4}
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

export default Stage1;
