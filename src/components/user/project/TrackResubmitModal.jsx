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
    color:
      events.waitingForCouncilDecision === "Accept"
        ? "green"
        : events.waitingForCouncilDecision === "OnGoing"
        ? "gray"
        : "red",
    label:
      events.waitingForCouncilDecision === "Accept"
        ? "Thông qua"
        : events.waitingForCouncilDecision === "OnGoing"
        ? "Chờ phê duyệt"
        : "Tiếp tục chỉnh sửa",
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
