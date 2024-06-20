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
    label: events.waitingForCouncilDecision === "Accept" ? "Thông Qua" : "Tiếp tục chỉnh sửa",
    children: (
      <div>
        <p>Nộp lại tài liệu chỉnh sửa lần thứ {idx + 1}</p>
          {dayjs(events.date).format("DD.MM.YYYY")}
      </div>
    ),
  }));
  console.log("check data: ", props.data);
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
