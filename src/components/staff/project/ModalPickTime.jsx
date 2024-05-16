import { Divider, List, Modal, Select, message } from "antd";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getAllHoliday, memberReviewAPI } from "../../../services/api";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);
const dateFormat = "DD/MM/YYYY";
const ModalPickTime = ({ visible, onCancel, dataUser }) => {
  const [selectedTime, setSelectedTime] = useState(1);
  const [date, setDate] = useState(dayjs().add(1, "day"));
  const [holiday, setholiday] = useState([]);
  const today = dayjs().format(dateFormat);
  const location = useLocation();
  const navigate = useNavigate();
  let topicId = location.pathname.split("/");
  topicId = topicId[4];
  const isHoliday = (startDate, endDate) => {
    for (
      let date = startDate;
      date.isBefore(endDate);
      date = date.add(1, "day")
    ) {
      if (holiday.some((holiday) => dayjs(date).isSame(holiday.date, "day"))) {
        return true;
      }
    }
    return false;
  };

  const handleTimeChange = (value) => {
    let endDate = dayjs().add(value, "day");

    if (endDate.day() === 6) {
      endDate = endDate.add(1, "day");
      if(endDate.day() === 0) {
        endDate = endDate.add(1, "day");
      }
    } else if (endDate.day() === 0) {
      endDate = endDate.add(2, "day");
    }
    setDate(endDate);
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
      endDate: dayjs(date).local().format(),
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
  useEffect(() => {
    getHoliday();
  }, []);
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
      <p>
        Từ ngày: {today} - Đến ngày: {dayjs(date).format(dateFormat)}
      </p>
      <Select
        placeholder="Thời hạn phê duyệt"
        style={{ width: "100%" }}
        onChange={handleTimeChange}
        value={selectedTime}
      >
        {[1, 2, 3, 4, 5, 6, 7].map((time) => (
          <Option key={time} value={time}>
            {time} ngày
          </Option>
        ))}
      </Select>
      <Divider />
    </Modal>
  );
};

export default ModalPickTime;
