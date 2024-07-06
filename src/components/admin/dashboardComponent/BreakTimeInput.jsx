import React, { useEffect, useState } from "react";
import { InputNumber, Button, Space, message } from "antd";
import { configBreakTimeAdmin } from "../../../services/api";

const BreakTimeInput = ({ timeDefault }) => {
  const [breakTime, setBreakTime] = useState("");

  const handleBreakTimeChange = (value) => {
    setBreakTime(value);
  };
  useEffect(()=> {
    setBreakTime(timeDefault);
  })
  const handleSubmit = async () => {
    try {
      const res = await configBreakTimeAdmin({
        minutes: breakTime,
      });
      if (res && res.statusCode === 200) {
        message.success("Tạo thành công");
      }
    } catch (error) {
      console.log("Có lỗi tại cancel time ", error);
    }
  };

  return (
    <Space>
      <label>Số phút</label>
      <InputNumber min={0} value={breakTime} onChange={handleBreakTimeChange} />
      <Button type="primary" onClick={handleSubmit}>
        Xác nhận
      </Button>
    </Space>
  );
};

export default BreakTimeInput;
