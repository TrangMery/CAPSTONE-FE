import { DatePicker, Divider, List, Modal, Select, message } from "antd";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getAllHoliday, memberReviewAPI } from "../../../services/api";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);
const dateFormat = "DD/MM/YYYY";
const ModalPickTime = ({ visible, onCancel, dataUser }) => {
  const [selectedTime, setSelectedTime] = useState(null);
  const [endDate, startEndDate] = useState();
  const [holiday, setholiday] = useState([]);
  const today = dayjs();
  const location = useLocation();
  const navigate = useNavigate();
  let topicId = location.pathname.split("/");
  const [startDate, setStartDate] = useState(null);
  topicId = topicId[4];
  const addBusinessDays = (start, days) => {
    let current = start;
    let addedDays = 0;

    while (addedDays < days) {
      current = current.add(1, 'day');
      // Nếu không phải là thứ 7 (6) hoặc Chủ Nhật (0), tăng addedDays
      if (current.day() !== 6 && current.day() !== 0) {
        addedDays += 1;
      }
    }

    return current;
  };
  const handleTimeChange = (value) => {
    const endDate = addBusinessDays(startDate, value)
    startEndDate(endDate);
    setSelectedTime(value);
  };
  const createMemberApproval = async (data) => {
    try {
      const res = await memberReviewAPI(data);
      if (res && res?.isSuccess) {
        return res.isSuccess;
      }
    } catch (error) {
      console.log("failed to create member approval", error);
    }
  };
  const submit = () => {
    const userIDArray = dataUser.map((user) => user.id);
    // tính toán ngày kết thúc bao gồm ngày lễ
    const data = {
      topicId: topicId,
      memberReviewIds: userIDArray,
      startDate: dayjs().local().format(),
      endDate: dayjs(endDate).local().format(),
    };
    const result = createMemberApproval(data);
    if (result) {
      message.success("Tạo thành viên phê duyệt thành công");
      navigate("/staff");
    } else {
      message.error("Lỗi tạo thành viên phê duyệt");
    }
  };
  const getHoliday = async () => {
    try {
      const res = await getAllHoliday(today);
      if (res && res.statusCode === 200) {
        setholiday(res.data);
      }
    } catch (error) {
      console.log("====================================");
      console.log("Error: ", error);
      console.log("====================================");
    }
  };
  const handleDateChange = (date) => {
    setStartDate(date);
  };
  let maxDate = dayjs().add(1, "day");
  if (maxDate.day() === 6) {
    maxDate = maxDate.add(1, "day");
    if (maxDate.day() === 0) {
      maxDate = maxDate.add(1, "day");
    }
  } else if (maxDate.day() === 0) {
    maxDate = maxDate.add(2, "day");
  }
  maxDate = maxDate.add(7, "day").add(holiday.length, "day");
  const disabledDate = (current) => {
    if (current && (current.day() === 6 || current.day() === 0)) {
      return true;
    }
    const formattedCurrent = current.format("YYYY-MM-DD");
    return holiday.some(
      (holiday) => formattedCurrent === dayjs(holiday.date).format("YYYY-MM-DD")
    );
  };
  useEffect(() => {
    getHoliday();
  }, []);
  // cho chọn ngay bắt đầu
  return (
    <Modal
      title="Xác nhận thành viên và thời hạn phê duyệt"
      open={visible}
      onCancel={onCancel}
      okText={"Xác nhận thông tin"}
      cancelText={"Chỉnh sửa thông tin"}
      onOk={submit}
      forceRender={false}
      maskClosable={false}
      style={{
        top: 30,
      }}
    >
      <List
        header={<div>Danh sách thành viên phê duyệt</div>}
        bordered
        dataSource={dataUser}
        renderItem={(dataUser) => (
          <List.Item>
            {dataUser.fullName} - {dataUser.accountEmail} -{" "}
            {dataUser.phoneNumber}
          </List.Item>
        )}
      />
      <p style={{ width: "100%", marginTop: 20, fontWeight: "bold" }}>
        Thời hạn phê duyệt:
      </p>
      <div
        style={{
          marginBottom: "20px",
        }}
      >
        <p>Ngày bắt đầu:</p>
        <DatePicker
          format={dateFormat}
          minDate={today}
          maxDate={maxDate}
          onChange={handleDateChange}
          disabledDate={disabledDate}
        />
      </div>
      <div
        style={{
          marginBottom: "20px",
        }}
      >
        <p>Thời hạn kết thúc</p>
        <Select
          placeholder="Thời hạn phê duyệt"
          style={{ width: "100%" }}
          onChange={handleTimeChange}
          value={selectedTime}
          disabled={startDate !== null ? false : true}
        >
          {[1, 2, 3, 4, 5, 6, 7].map((time) => (
            <Option key={time} value={time}>
              {time} ngày
            </Option>
          ))}
        </Select>
      </div>
      {selectedTime !== null && startDate !== null && (
        <>
          <p>
            Từ ngày: {dayjs(startDate).format(dateFormat)} - Đến ngày:{" "}
            {dayjs(endDate).format(dateFormat)}
          </p>
        </>
      )}

      <Divider />
    </Modal>
  );
};

export default ModalPickTime;
