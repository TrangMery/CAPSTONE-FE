import { Button, Col, Divider, Modal, Row, Select } from "antd";
import { TimePicker } from "antd";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(utc);
dayjs.extend(timezone);
import { useState } from "react";
import { useLocation } from "react-router-dom";

const format = "HH:mm";

const ModalTime = (props) => {
  const isModalOpen = props.isModalOpen;
  const [meetingStartTime, setMeetingStartTime] = useState(null);
  const [meetingEndTime, setMeetingEndTime] = useState(null);
  const location = useLocation();
  const meetingDate = dayjs(location.state.meetingDate).format("DD/MM/YYYY");
  const handleDateChange = (time) => {
    setMeetingStartTime(time);
  };
  const handleChange = (data) => {
    setMeetingEndTime(
      dayjs(meetingStartTime).add(data.value, "minute").format(format)
    );
    props.setMeetingDateDuration(data.value);
  };
  const handleCancel = () => {
    props.setIsModalOpen(false);
  };
  const handleSubmit = () => {
    const dateStartString = `${meetingDate} ${dayjs(meetingStartTime).format(
      format
    )}`;
    const dateEndString = `${meetingDate} ${meetingEndTime}`;
    const startDate = dayjs(dateStartString, "DD/MM/YYYY HH:mm").format(
      "YYYY-MM-DDTHH:mm:ss.SSS"
    );
    const endDate = dayjs(dateEndString, "DD/MM/YYYY HH:mm").format(
      "YYYY-MM-DDTHH:mm:ss.SSS"
    );
    const data = {
      meetingStartTime: startDate + "Z",
      meetingEndTime: endDate + "Z",
    };
    props.setTime(data);
    props.next();
  };
  const disabledHours = () => {
    const hours = [];
    for (let i = 0; i < 24; i++) {
      if ((i < 8 || i > 10) && (i < 13 || i > 16)) {
        hours.push(i);
      }
    }
    return hours;
  };
  const options = [
    {
      value: 15,
      label: "15 phút",
    },
    {
      value: 30,
      label: "30 phút",
    },
    {
      value: 60,
      label: "60 phút",
    },
    {
      value: 90,
      label: "90 phút",
    },
  ];
  return (
    <>
      <Modal
        title="Thời gian họp"
        open={isModalOpen}
        onCancel={handleCancel}
        maskClosable={false}
        footer={[
          <div>
            <Button
              style={{
                margin: "0 8px",
              }}
              onClick={() => handleCancel()}
            >
              Hủy
            </Button>

            <Button type="primary" onClick={() => handleSubmit()}>
              Tiếp tục
            </Button>
          </div>,
        ]}
      >
        <Divider />
        <Row gutter={20}>
          <Col span={12}>
            <p>Thời gian bắt đầu</p>
            <TimePicker
              format={format}
              minuteStep={15}
              disabledHours={disabledHours}
              hideDisabledOptions
              onChange={handleDateChange}
            />
          </Col>
          <Col span={12}>
            <p>Thời gian họp dự kiến</p>
            <Select
              labelInValue
              style={{
                width: 120,
              }}
              onChange={handleChange}
              options={options}
              disabled={meetingStartTime === null}
            />
          </Col>
        </Row>
        {meetingEndTime !== null ? (
          <>
            <p>Ngày họp: {meetingDate}</p>
            <p>Giờ họp</p>
            Từ {dayjs(meetingStartTime).format(format)} h - Đến:{" "}
            {meetingEndTime} h
          </>
        ) : null}
        <Divider />
      </Modal>
    </>
  );
};
export default ModalTime;
