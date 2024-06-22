import React, { useState } from "react";
import { Divider, Modal, Timeline } from "antd";
import dayjs from "dayjs-ext";
const TrackResubmitModal = (props) => {
  const isModalOpen = props.isModalOpen;
  const handleCancel = () => {
    props.setIsModalOpen(false);
  };
  const data = props.data.map((events, idx) => ({
    key: idx,
    color: events.waitingForCouncilDecision === "Accept" ? "green" : "red",
    label:
      events.waitingForCouncilDecision === "Accept"
        ? "Thông qua"
        : "Tiếp tục chỉnh sửa",
    pending:
      events.waitingForCouncilDecision === "Ongoing" ? "Chờ phê duyệt" : "",
    children: (
      <div>
        <p>Nộp lại tài liệu chỉnh sửa lần thứ {events.numberOfResubmmit}</p>
        {dayjs(events.date).format("DD.MM.YYYY")}
      </div>
    ),
  }));
  return (
    <>
      <Modal
        title="Lịch sử nộp tài liệu"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <Divider />

        <Timeline mode="left" items={data} />
      </Modal>
    </>
  );
};
export default TrackResubmitModal;
