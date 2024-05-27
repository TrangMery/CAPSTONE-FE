import React, { useEffect, useState } from "react";
import { Drawer } from "antd";
import { getContractDone, getUserTopic } from "../../../services/api";
const ViewDetailTopic = (props) => {
  const [listUser, setListUser] = useState([]);
  const [file, setFile] = useState([]);
  const onClose = () => {
    props.setOpen(false);
  };
  const getTopicDetail = async () => {
    const data = {
      topicId: props.topicId,
    };
    try {
      const res = await getUserTopic({
        TopicId: props.topicId,
      });
      const getFile = await getContractDone(data);
      if (res && res.statusCode === 200 && getFile.status === 200) {
        setListUser(res.data);
        setFile(getFile.data);
      }
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
