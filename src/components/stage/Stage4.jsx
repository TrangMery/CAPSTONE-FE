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
} from "antd";
import axios from "axios";
import { CheckCircleOutlined } from "@ant-design/icons";

const { Panel } = Collapse;

const Stage4 = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [responseData, setResponseData] = useState("");
  const [inputNumber, setInputNumber] = useState("");
  const [successPanel, setSuccessPanel] = useState({});
  const handleInputChange = (e) => {
    setInputNumber(e.target.value);
  };

  const callApi = async (endpoint, index) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${endpoint}${inputNumber}`);
      if (response.status === 200) {
        setInputNumber(0);
        setSuccessPanel({ ...successPanel, [index]: true });
      }
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  const apiEndpoints = [
    {
      name: "Trưởng nhóm nộp file tính ngày công",
      endpoint: "http://localhost:5132/api/mock/submit-remuneration?numberOfTopic=",
    },
    {
      name: "Tải lên quyết định",
      endpoint: "http://localhost:5132/api/mock/censorship-remuneration?numberOfTopic=",
    },
    {
      name: "Tải lên biên bản kết thúc hợp đồng",
      endpoint: "http://localhost:5132/api/mock/final-upload-contract?numberOfTopic=",
    },
  ];
  return (
    <div>
      <Space direction="vertical" style={{ width: "100%" }} size="large">
        {apiEndpoints.map((api, index) => (
          <Collapse key={index}>
            <Panel header={api.name} key={index}>
              <Row gutter={[16, 16]} align="middle">
                <Col span={12}>
                  <Input
                    type="number"
                    value={inputNumber}
                    onChange={handleInputChange}
                    placeholder="Nhập số lượng"
                  />
                </Col>
                <Col span={6}>
                  <Button onClick={() => callApi(api.endpoint, index)}>
                    Thực thi
                  </Button>
                </Col>
              </Row>
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
