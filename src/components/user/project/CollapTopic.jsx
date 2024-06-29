import {
  CheckOutlined,
  CloseOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { Button, Collapse, ConfigProvider, Divider, Space, theme } from "antd";
import { useEffect, useState } from "react";
import { chairmanApprove } from "../../../services/api";

const CollapseTopic = ({
  data = [],
  setIsModalOpen,
  topicId,
  setStatus,
  status,
  role
}) => {
  const [itemsCollapse, setItemsCollapse] = useState([]);
  const { token } = theme.useToken();
  const panelStyle = {
    marginBottom: 24,
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    border: "none",
  };
  const renderExtra = (state) => {
    if (state === true) {
      return <CheckOutlined style={{ color: "green" }} />;
    } else if (state === false) {
      return <CloseOutlined style={{ color: "red" }} />;
    } else {
      return <LoadingOutlined style={{ color: "blue" }} />;
    }
  };
  const chairmanApproved = async () => {
    try {
      const res = await chairmanApprove({
        topicId: topicId,
      });
      if (res && res.statusCode === 200) {
        if (status === true) {
          setStatus(false);
        } else {
          setStatus(true);
        }
      }
    } catch (error) {
      console.log("====================================");
      console.log("có lỗi tại chairman approve", error);
      console.log("====================================");
    }
  };
  useEffect(() => {
    if (!data && !data?.length) return;

    const newData = data.map((items, index) => ({
      key: index + 1,
      label: "Nộp lại lần " + [index + 1],

      children: [
        <>
          <div>
            <p style={{ margin: 0 }} key={index}>
              File nộp lại:
            </p>
            <a target="_blank" href={items.documentFileLink}>
              {items.documentFileLink}
            </a>
            <Divider />
          </div>
          <p>
            Quyết định của chủ tịch hội đồng:{" "}
            {items.isAccepted
              ? "Thông qua"
              : items.isAccepted === null
              ? "Chưa đánh giá"
              : "Không đồng ý"}
            <br />
            <a target="_blank" href={items.feedbackFileLink}>
              File góp ý
            </a>
          </p>
          {items.isAccepted === null && role === "Chairman" ? (
            <>
              <Divider />
              <p>Quyết định:</p>
              <Space>
                <ConfigProvider
                  theme={{
                    token: {
                      colorPrimary: "#55E6A0",
                    },
                  }}
                >
                  <Button type="primary" onClick={() => chairmanApproved()}>
                    Thông qua
                  </Button>
                </ConfigProvider>
                <Button
                  type="primary"
                  danger
                  onClick={() => {
                    setIsModalOpen(true);
                  }}
                >
                  Từ chối
                </Button>
              </Space>
            </>
          ) : (
            ""
          )}
        </>,
      ],
      extra: renderExtra(items.isAccepted),
      style: panelStyle,
    }));
    setItemsCollapse(newData);
  }, []);
  return (
    <Collapse
      style={{
        background: token.colorBgContainer,
      }}
      bordered={false}
      defaultActiveKey={[data.length]}
      items={itemsCollapse}
    />
  );
};
export default CollapseTopic;
