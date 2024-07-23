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
} from "antd";
import axios from "axios";
import { CheckCircleOutlined } from "@ant-design/icons";

const { Panel } = Collapse;

const Stage4 = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successPanel, setSuccessPanel] = useState({});

  const handleSubmit = async (values, endpoint, index) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${endpoint}${values.topicNumber}`);
      if (response.status === 200) {
        setSuccessPanel({ ...successPanel, [index]: true });
      }
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  const apiEndpoints = [
    {
      key: "1",
      name: "Trưởng nhóm nộp file tính ngày công",
      endpoint:
        "http://localhost:5132/api/mock/submit-remuneration?numberOfTopic=",
      fields: [{ name: "Số lượng đề tài", key: "topicNumber" }],
    },
    {
      key: "2",
      name: "Tải lên quyết định",
      endpoint:
        "http://localhost:5132/api/mock/censorship-remuneration?numberOfTopic=",
      fields: [{ name: "Số lượng đề tài", key: "topicNumber" }],
    },
    {
      key: "3",
      name: "Tải lên biên bản kết thúc hợp đồng",
      endpoint:
        "http://localhost:5132/api/mock/final-upload-contract?numberOfTopic=",
      fields: [{ name: "Số lượng đề tài", key: "topicNumber" }],
    },
  ];
  return (
    <div>
      <Space direction="vertical" style={{ width: "100%" }} size="large">
        {apiEndpoints.map((api, index) => (
          <Collapse key={index}>
            <Panel header={api.name} key={api.key}>
              <Form
                onFinish={(values) => handleSubmit(values, api.endpoint, index)}
                layout="vertical"
              >
                {api.fields.map((field) => (
                  <Form.Item
                    key={field.name}
                    name={field.key}
                    rules={[
                      {
                        required: true,
                        message: "Xin hãy nhập số!",
                      },
                    ]}
                    label={field.name}
                  >
                    <InputNumber style={{ width: "20%" }} />
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
              {successPanel[index] && (
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

export default Stage4;
