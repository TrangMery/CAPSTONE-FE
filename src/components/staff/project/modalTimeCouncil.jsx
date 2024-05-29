import React, { useEffect, useState } from "react";
import { Modal, Calendar, theme, ConfigProvider, message } from "antd";
import dayjs from "dayjs";
import { getAllHoliday } from "../../../services/api";
import { useLocation, useNavigate } from "react-router-dom";
import locale from "antd/locale/vi_VN";

const ModalTimeCouncil = (props) => {
  const today = dayjs();
  const { token } = theme.useToken();
  const [selectedTime, setSelectedTime] = useState(null);
  const [holidays, setholiday] = useState([]);
  const location = useLocation();
  const path = location.pathname.split("/");
  const check = path[2];

  const navigate = useNavigate();
  const reviewEndDate = props.data.reviewEndDate;
  const closeModal = () => {
    props.setIsModalOpen(false);
  };
  const wrapperStyle = {
    width: 300,
    border: `1px solid ${token.colorBorderSecondary}`,
    borderRadius: token.borderRadiusLG,
  };
  const onChange = (value) => {
    setSelectedTime(value);
  };
  const submit = async () => {
    if (selectedTime === null) {
      message.error("Vui lòng chọn ngày họp");
    } else {
      const topicId = props.data.topicId;
      if (check === "earlyterm") {
        navigate(`/staff/earlyterm/add-council/${topicId}`, {
          state: { meetingDate: dayjs(selectedTime).local().format() },
        });
      } else if (check === "midterm") {
        navigate(`/staff/midterm/add-council/${topicId}`, {
          state: { meetingDate: dayjs(selectedTime).local().format() },
        });
      } else if (check === "finalterm") {
        navigate(`/staff/finalterm/add-council/${topicId}`, {
          state: { meetingDate: dayjs(selectedTime).local().format() },
        });
      }
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
  const disabledDate = (current) => {
    // Get current day of the week (0 is Sunday, 6 is Saturday)
    const dayOfWeek = current.day();
    // Disable Saturday (6) and Sunday (0)
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return true;
    }
    // Get today's date
    const mindate = dayjs(reviewEndDate).add(1, "day");

    // Disable dates before today
    if (current.isBefore(mindate, "day")) {
      return true;
    }
    // Disable holidays
    return holidays.some((holiday) => current.isSame(holiday, "day"));
  };
  useEffect(() => {
    getHoliday();
  }, []);
  return (
    <div style={wrapperStyle}>
      <Modal
        title="Chọn Ngày Họp"
        open={props.isModalOpen}
        onCancel={closeModal}
        okText={"Xác nhận ngày họp"}
        cancelText={"Hủy"}
        onOk={submit}
        maskClosable={false}
      >
        <div style={{ height: 350 }}>
          <ConfigProvider locale={locale}>
            <Calendar
              locale={locale}
              mode="month"
              fullscreen={false}
              onChange={onChange}
              disabledDate={disabledDate}
            />
          </ConfigProvider>
          <p>
            Ngày họp: <span>{selectedTime?.format("DD-MM-YYYY")}</span>
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default ModalTimeCouncil;
