import React, { useState } from "react";
import { InputNumber, Button, Space } from "antd";

const CancelTimeInput = () => {
  const [cancelTime, setCancelTime] = useState(0);

  const handleCancelTimeChange = (value) => {
    setCancelTime(value);
  };

  const handleSubmit = () => {
    console.log("Cancel Time (hours):", cancelTime);
  };

  return (
    <Space>
      <label>Số giờ</label>
      <InputNumber
        min={0}
        value={cancelTime}
        onChange={handleCancelTimeChange}
      />
      <Button type="primary" onClick={handleSubmit}>
        Xác nhận
      </Button>
    </Space>
  );
};

export default CancelTimeInput;
