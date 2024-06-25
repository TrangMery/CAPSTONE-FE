import React, { useState } from "react";
import { DatePicker, Button, message } from "antd";
import { assignHoliday } from "../../../services/api";
import dayjs from "dayjs";
const HolidaysPicker = () => {
  const [listDate, setListDate] = useState([]);
  const onChange = (date, dateString) => {
    setListDate(dateString);
  };
  const today = dayjs().add(1, "day");
  const handleSubmit = async () => {
    try {
      const data = {
        holidays: listDate,
      };
      const res = await assignHoliday(data);
      if (res && res.statusCode === 200) {
        message.success("Thêm mới ngày nghỉ lễ thành công");
        setListDate([]);
      }
    } catch (error) {
      console.log("có lỗi tại thêm mới ngày nghỉ lễ");
    }
  };
  return (
    <>
      <label>Quản lí ngày nghỉ lễ</label>
      <DatePicker
        multiple
        minDate={today}
        onChange={onChange}
        value={listDate.length ? listDate.map((item, index) => dayjs(item)) : []}
      />
      <Button
        onClick={() => handleSubmit()}
        type="primary"
        style={{ marginTop: "20px" }}
        disabled={listDate.length === 0}
      >
        Thêm ngày nghỉ lễ
      </Button>
    </>
  );
};

export default HolidaysPicker;
