import React, { useState } from "react";
import { DatePicker, Button, message, Row, Col, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import * as XLSX from "xlsx";
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
      console.log(data);
      if (res && res.statusCode === 200) {
        message.success("Thêm mới ngày nghỉ lễ thành công");
        setListDate([]);
      } else {
        message.error("Vui lòng thử lại sau");
      }
    } catch (error) {
      console.log("có lỗi tại thêm mới ngày nghỉ lễ");
    }
  };
  const handleFileUpload = ({ file }) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const parsedData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      // Giả sử ngày nghỉ lễ nằm ở cột A
      const holidayDates = parsedData
        .map((row) => row[0])
        .filter(Boolean)
        .map((date) => {
          if (typeof date === "number") {
            return dayjs(XLSX.SSF.format("dd/mm/yyyy", date)).format(
              "YYYY-MM-DD"
            );
          }
          return date;
        });
      setListDate(holidayDates);
      message.success("Tải lên thành công!");
    };
    reader.onerror = () => {
      message.error("Có lỗi xảy ra khi đọc tệp!");
    };
    reader.readAsArrayBuffer(file);
  };
  return (
    <>
      <Row gutter={15}>
        <Col span={17}>
          <label>Quản lí ngày nghỉ lễ</label>
          <DatePicker
            multiple
            minDate={today}
            onChange={onChange}
            value={
              listDate.length ? listDate.map((item, index) => dayjs(item)) : []
            }
            disabled={listDate.length === 0}
          />
        </Col>
        <Col span={4}>
          <Upload
            beforeUpload={(file) => {
              handleFileUpload({ file });
              return false; // Ngăn không cho tự động tải lên
            }}
            showUploadList={false}
          >
            <Button
              type="primary"
              icon={<UploadOutlined />}
              style={{ marginTop: "20px" }}
            >
              Thêm ngày nghỉ lễ excel
            </Button>
          </Upload>
        </Col>
      </Row>
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
