import React, { useEffect, useState } from "react";
import { Drawer, List, Collapse, theme, Tooltip, message } from "antd";
import {
  exportFileAmdin,
  getHistoryProject,
  getUserTopic,
} from "../../../services/api";
import TimelineComponent from "./Timeline";
import {
  CaretRightOutlined,
  CloudDownloadOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
const ViewDetailTopic = (props) => {
  const [listUser, setListUser] = useState([]);
  const [process, setProcess] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token } = theme.useToken();
  const panelStyle = {
    marginBottom: 24,
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    border: "none",
  };
  const onClose = () => {
    props.setOpen(false);
  };
  const getHistoryTopic = async () => {
    try {
      const res = await getHistoryProject({
        TopicId: props.topicId,
      });
      if (res && res.statusCode === 200) {
        setProcess(res.data.reportHistories);
      }
    } catch (error) {
      console.log("====================================");
      console.log("Có lỗi tại getHistoryTopic: ", error);
      console.log("====================================");
    }
  };
  const getTopicDetail = async () => {
    try {
      const res = await getUserTopic({
        TopicId: props.topicId,
      });
      if (res.statusCode === 200) {
        setListUser(res.data);
      }
    } catch (error) {
      console.log("====================================");
      console.log("Có lỗi tại get topic detail", error);
      console.log("====================================");
    }
  };
  const handleExport = async () => {
    setLoading(true);
    try {
      const res = await exportFileAmdin({
        topicId: props.topicId,
      });
      if (res && res.statusCode === 200) {
        setLoading(false);
        const link = document.createElement("a");
        link.href = res.data;
        link.setAttribute("download", "");
        document.body.appendChild(link);
        link.click();
        link.remove();
      } else {
        setLoading(false);
        message.error("Vui lòng thử lại sau");
      }
    } catch (error) {
      console.log("Error tại xuất file admin: ", error);
    }
  };
  useEffect(() => {
    getHistoryTopic();
    getTopicDetail();
  }, [props.open === true]);
  const genExtra = () => (
    <Tooltip placement="top" title="Xuất file tổng kết">
      {loading ? (
        <>
          <LoadingOutlined
            style={{
              color: "blue",
              fontSize: "18px",
              cursor: "pointer",
              paddingTop: "2px",
            }}
          />
        </>
      ) : (
        <>
          <CloudDownloadOutlined
            onClick={(event) => {
              handleExport(), event.stopPropagation();
            }}
            style={{
              color: "blue",
              fontSize: "18px",
              cursor: "pointer",
              paddingTop: "2px",
            }}
          />
        </>
      )}
    </Tooltip>
  );
  const getItems = (panelStyle) => [
    {
      key: 1,
      label: "Xem thành viên",
      children: (
        <>
          <List
            header={<div>Danh sách thành viên</div>}
            bordered
            dataSource={listUser}
            renderItem={(item) => (
              <List.Item key={item.email}>
                <List.Item.Meta
                  title={item.fullName}
                  description={item.email}
                />
                <div>
                  {item.taskDescription === null
                    ? "Chủ nhiệm đề tài"
                    : item.taskDescription}
                </div>
              </List.Item>
            )}
          />
        </>
      ),
      style: panelStyle,
    },
    {
      key: 2,
      label: "Xem lịch sử đề tài",
      children: (
        <>
          <TimelineComponent process={process} />
        </>
      ),
      style: panelStyle,
      extra: genExtra(),
    },
  ];

  return (
    <>
      <Drawer
        title="Xem chi tiết đề tài"
        placement="right"
        width={600}
        onClose={onClose}
        open={props.open}
      >
        <Collapse
          bordered={false}
          defaultActiveKey={1}
          expandIcon={({ isActive }) => (
            <CaretRightOutlined rotate={isActive ? 90 : 0} />
          )}
          style={{
            background: token.colorBgContainer,
          }}
          items={getItems(panelStyle)}
        />
      </Drawer>
    </>
  );
};
export default ViewDetailTopic;
