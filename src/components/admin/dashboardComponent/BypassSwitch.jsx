import React, { useEffect, useState } from "react";
import { Switch, Space, message } from "antd";
import { configStateAdmin, getStateApi } from "../../../services/api";

const BypassSwitch = () => {
  const [bypass, setBypass] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleBypassChange = (checked) => {
    changeFlow(checked);
  };
  const getState = async () => {
    try {
      const res = await getStateApi();
      if (res && res.statusCode === 200) {
        setBypass(res.data.isBypassCensorship);
      }
    } catch (error) {
      console.log("====================================");
      console.log("có lỗi tại getState: ", error);
      console.log("====================================");
    }
  };
  const changeFlow = async (checked) => {
    try {
      setLoading(true);
      const res = await configStateAdmin({
        isBypass: checked,
      });
      if (res && res.statusCode === 200) {
        setLoading(false);
        message.success("Đổi thành công");
      }
    } catch (error) {
      console.log("====================================");
      console.log("Có lỗi tại đổi flow: ", error);
      console.log("====================================");
    }
  };
  useEffect(() => {
    getState();
  }, [loading]);
  return (
    <Space>
      <label>Trưởng phòng duyệt</label>
      <Switch
        checkedChildren="Bỏ qua"
        unCheckedChildren="Có duyệt"
        checked={bypass}
        onChange={handleBypassChange}
        loading={loading}
      />
    </Space>
  );
};

export default BypassSwitch;
