import React, { useState } from "react";
import { InputNumber, Button, Space, message } from "antd";
import { configCancelHour } from "../../../services/api";

const CancelTimeInput = ({timeDefault}) => {
  const [cancelTime, setCancelTime] = useState(0);

  const handleCancelTimeChange = (value) => {
    setCancelTime(value);
  };

  const handleSubmit = async () => {
    try {
      const res = await configCancelHour({
        minutes: cancelTime * 60,
      });
      if (res && res.statusCode === 200) {
        message.success("Tạo thành công")
      }
    } catch (error) {
      console.log("Có lỗi tại cancel time ", error);
    }
  };

  return (
    <Space>
      <label>Số giờ</label>
      <InputNumber
        min={2}
        max={24}
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
