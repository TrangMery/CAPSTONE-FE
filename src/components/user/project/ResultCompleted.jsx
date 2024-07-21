import React from "react";
import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";
const ResultComplete = () => {
  const navigate = useNavigate();
  return (
    <Result
      status="success"
      title="Đề tài đã hoàn thành"
      extra={[
        <Button
          type="primary"
          danger
          onClick={() => navigate(-1)}
          style={{ margin: "10px 0" }}
        >
          Quay về
        </Button>,
      ]}
    />
  );
};
export default ResultComplete;
