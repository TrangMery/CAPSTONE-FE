import React, { useEffect, useState } from "react";
import { Drawer, List } from "antd";
import { getContractDone, getUserTopic } from "../../../services/api";
import TimelineComponent from "./Timeline";
const ViewDetailTopic = (props) => {
  const [listUser, setListUser] = useState([]);
  const [file, setFile] = useState([]);
  const onClose = () => {
    props.setOpen(false);
  };
  let checkEnd;
  const data = {
    topicId: props.topicId,
  };
  const getTopicDetail = async () => {
    try {
      const res = await getUserTopic({
        TopicId: props.topicId,
      });
      const getFile = await getContractDone(data);
      if (getFile.statusCode === 200 && res.statusCode === 200) {
        setListUser(res.data);
        setFile(getFile.data);
        checkEnd = getFile.data.contractLink.endsWith(".docx");
      }
    } catch (error) {
      console.log("====================================");
      console.log("Có lỗi tại get topic detail", error);
      console.log("====================================");
    }
  };
  useEffect(() => {
    getTopicDetail();
  }, [props.open === true]);

  return (
    <>
      <Drawer
        title="Xem thông tin chi tiết đề tài"
        placement="right"
        width={500}
        onClose={onClose}
        open={props.open}
      >
        {/* <List
          header={<div>Danh sách thành viên</div>}
          bordered
          dataSource={listUser}
          renderItem={(item) => (
            <List.Item key={item.email}>
              <List.Item.Meta title={item.fullName} description={item.email} />
              <div>
                {item.taskDescription === null
                  ? "Trưởng nhóm"
                  : item.taskDescription}
              </div>
            </List.Item>
          )}
        />
        <p style={{ marginTop: "20px", fontWeight: "bold" }}>
          Tài liệu liên quan
        </p>
        <span>
          <a
            href={
              checkEnd
                ? `https://view.officeapps.live.com/op/view.aspx?src=` +
                  file.contractLink
                : file.contractLink
            }
            target="_blank"
            rel={file.contractName}
          >
            {file.contractName}
          </a>
        </span> */}
        <TimelineComponent/>
      </Drawer>
    </>
  );
};
export default ViewDetailTopic;
