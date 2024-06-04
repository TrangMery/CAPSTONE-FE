import { Button, Col, Divider, Modal, Row, Select, TimePicker } from "antd";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(utc);
dayjs.extend(timezone);
import React, { useState } from "react";
import { useLocation } from "react-router-dom";

const format = "HH:mm";
const styles = {
  meetingInfo: {
    marginBottom: "10px",
  },
  label: {
    fontWeight: "bold",
    marginRight: "10px",
  },
  value: {
    color: "#555",
  },
};
const ModalTime = (props) => {
  const isModalOpen = props.isModalOpen;
  const [meetingDuration, setMeetingDuration] = useState(null);
  const [meetingStartTime, setMeetingStartTime] = useState(null);
  const [meetingEndTime, setMeetingEndTime] = useState(null);
  const [availableStartTimes, setAvailableStartTimes] = useState([]);
  const [meetings, setMeetings] = useState([
    // Danh sách cuộc họp đã được đặt, ví dụ:
    // { start: dayjs().set('hour', 10).set('minute', 0), end: dayjs().set('hour', 11).set('minute', 30) }
  ]);
  console.log("check time meeting:", props.timeMeeting);
  const location = useLocation();
  const meetingDate = dayjs(location.state.meetingDate).format("DD/MM/YYYY");
  const handleDurationChange = (data) => {
    setMeetingDuration(data.value);
    const times = getAvailableTimes(data.value);
    setAvailableStartTimes(times);
    setMeetingStartTime(null);
    setMeetingEndTime(null);
  };
  const handleStartTimeChange = (time) => {
    setMeetingStartTime(time);
    const endTime = dayjs(time).add(meetingDuration, "minute");
    setMeetingEndTime(endTime.format(format));
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
    props.setMeetingDateDuration(meetingDuration);
    const newMeeting = {
      start: meetingStartTime,
      end: dayjs(meetingStartTime)
        .add(meetingDuration, "minute")
        .add(15, "minute"),
    };

    setMeetings([...meetings, newMeeting]);
    const data = {
      meetingStartTime: startDate + "Z",
      meetingEndTime: endDate + "Z",
    };
    props.setTime(data);
    props.next();
  };

  const isOverlapping = (newMeeting) => {
    return meetings.some(
      (meeting) =>
        newMeeting.start.isBetween(meeting.start, meeting.end, null, "[)") ||
        newMeeting.end.isBetween(meeting.start, meeting.end, null, "(]") ||
        meeting.start.isBetween(newMeeting.start, newMeeting.end, null, "[)") ||
        meeting.end.isBetween(newMeeting.start, newMeeting.end, null, "(]")
    );
  };

  const getAvailableTimes = (duration) => {
    const excludeHour = duration === 90 ? 16 : null;
    const availableTimes = [];
    for (let i = 0; i < 24 * 60; i += 15) {
      const time = dayjs().startOf("day").add(i, "minute");
      const proposedMeeting = {
        start: time,
        end: time.clone().add(duration, "minute").add(15, "minute"),
      };
      if (
        !isOverlapping(proposedMeeting) &&
        !isOutsideWorkingHours(time) &&
        time.hour() !== excludeHour
      ) {
        availableTimes.push(time);
      }
    }
    return availableTimes;
  };

  const isOutsideWorkingHours = (time) => {
    const hour = time.hour();
    return hour < 8 || (hour >= 11 && hour < 13) || hour >= 17;
  };

  const options = [
    { value: 15, label: "15 phút" },
    { value: 30, label: "30 phút" },
    { value: 60, label: "60 phút" },
    { value: 90, label: "90 phút" },
  ];

  return (
    <Modal
      title="Thời gian họp"
      open={isModalOpen}
      onCancel={handleCancel}
      maskClosable={false}
      footer={[
        <div>
          <Button style={{ margin: "0 8px" }} onClick={() => handleCancel()}>
            Hủy
          </Button>
          <Button
            type="primary"
            onClick={() => handleSubmit()}
            disabled={!meetingStartTime}
          >
            Tiếp tục
          </Button>
        </div>,
      ]}
    >
      <Divider />
      <Row gutter={20}>
        <Col span={12}>
          <p>Thời gian họp dự kiến</p>
          <Select
            labelInValue
            style={{ width: 120 }}
            onChange={handleDurationChange}
            options={options}
          />
        </Col>
        <Col span={12}>
          <p>Thời gian bắt đầu</p>
          <TimePicker
            format={format}
            minuteStep={15}
            hideDisabledOptions
            disabled={!meetingDuration}
            onChange={handleStartTimeChange}
            disabledHours={() => {
              const hours = new Set();
              availableStartTimes.forEach((time) => hours.add(time.hour()));
              return Array.from({ length: 24 }, (_, i) => i).filter(
                (hour) =>
                  !hours.has(hour) || isOutsideWorkingHours(dayjs().hour(hour))
              );
            }}
            disabledMinutes={(selectedHour) => {
              if (selectedHour === null) return [];
              const minutes = new Set();
              availableStartTimes
                .filter((time) => time.hour() === selectedHour)
                .forEach((time) => minutes.add(time.minute()));
              if (meetingDuration === 30 && selectedHour === 16) {
                return [30, 45];
              }
              if (meetingDuration === 15 && selectedHour === 16) {
                return [45];
              }
              return Array.from({ length: 60 }, (_, i) => i).filter(
                (minute) => !minutes.has(minute)
              );
            }}
            clearText={null}
          />
        </Col>
      </Row>
      {meetingEndTime !== null && (
        <Row gutter={[20, 20]} align={"middle"} style={{ padding: "20px" }}>
          <Col span={8}>
            <div className="meeting-info" style={styles.meetingInfo}>
              <p className="label" style={styles.label}>
                Ngày họp:
              </p>
              <p className="value" style={styles.value}>
                {meetingDate}
              </p>
            </div>
          </Col>
          <Col span={8}>
            <div className="meeting-info" style={styles.meetingInfo}>
              <p className="label" style={styles.label}>
                Giờ họp:
              </p>
              <p className="value" style={styles.value}>
                {dayjs(meetingStartTime).format(format)}
              </p>
            </div>
          </Col>
          <Col span={8}>
            <div className="meeting-info" style={styles.meetingInfo}>
              <p className="label" style={styles.label}>
                Giờ kết thúc:
              </p>
              <p className="value" style={styles.value}>
                {meetingEndTime}
              </p>
            </div>
          </Col>
        </Row>
      )}
      <Divider />
    </Modal>
  );
};

export default React.memo(ModalTime);
