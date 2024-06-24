import React, { useState } from 'react';
import { InputNumber, Button, Space } from 'antd';

const BreakTimeInput = () => {
  const [breakTime, setBreakTime] = useState(0);

  const handleBreakTimeChange = (value) => {
    setBreakTime(value);
  };

  const handleSubmit = () => {
    console.log('Break Time (minutes):', breakTime);
  };

  return (
    <Space>
      <label>Nhập thời gian</label>
      <InputNumber min={0} value={breakTime} onChange={handleBreakTimeChange} />
      <Button type="primary" onClick={handleSubmit} style={{ marginLeft: 8 }}>Submit</Button>
    </Space>
  );
};

export default BreakTimeInput;
