import React, { useEffect, useState } from "react";
import { Drawer } from "antd";
const ViewDetailTopic = (props) => {
  const onClose = () => {
    props.setOpen(false);
  };
  const getTopicDetail = async () => {
    try {
    } catch (error) {
      console.log("====================================");
      console.log("Có lỗi tại get topic detail", error);
      console.log("====================================");
    }
  };
  useEffect(() => {
    getTopicDetail();
  }, []);
  return (
    <>
      <Drawer
        title="Xem thông tin chi tiết đề tài"
        placement="right"
        width={500}
        onClose={onClose}
        open={props.open}
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Drawer>
    </>
  );
};
export default ViewDetailTopic;
