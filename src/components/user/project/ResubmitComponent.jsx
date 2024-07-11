import { useEffect, useState } from "react";
import "./card.scss";
import {
  CheckOutlined,
  CloseOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import {
  Button,
  Collapse,
  ConfigProvider,
  Divider,
  Space,
  message,
  theme,
} from "antd";

import {
  chairmanApprove,
  chairmanMakeFinalDecision,
} from "../../../services/api";
import ModalChairmanReject from "./ModalChairmanReject";
const ResubmitComponent = ({ data, role, setStatus, topicId, active }) => {
  const [itemsCollapse, setItemsCollapse] = useState([]);
  const [isModalOpenR, setIsModalOpenR] = useState(false);
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
        if (active === true) {
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
  const chairmanFinalDecision = async (status, fileLink) => {
    try {
      const data = {
        topicId: topicId,
        feedbackFileLink: fileLink,
        isAccepted: status,
      };
      const res = await chairmanMakeFinalDecision(data);
      if (res && res.statusCode === 200) {
        if (status === true) {
          setStatus(false);
        } else {
          setStatus(true);
        }
      } else {
        message.error("Vui lòng thử lại sau");
      }
    } catch (error) {
      console.log("====================================");
      console.log("có lỗi tại chairman approve", error);
      console.log("====================================");
    }
  };

  const renderRole = () => {
    return (
      <>
        {data.length === 0 ? (
          <p style={{ fontWeight: "bold" }}>
            Chủ nhiệm đề tài chưa nộp lại tài liệu
          </p>
        ) : (
          ""
        )}
      </>
    );
  };

  useEffect(() => {
    if (Object.keys(data).length === 0) return;
    const newData = data?.documents.map((items, index) => ({
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
          {items.isAccepted === null || role === "Chairman" ? (
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
                  <Button
                    type="primary"
                    onClick={() => {
                      if (data.state === 1) {
                        chairmanApproved();
                      } else {
                        chairmanFinalDecision(true);
                      }
                    }}
                  >
                    Thông qua
                  </Button>
                </ConfigProvider>
                <Button
                  type="primary"
                  danger
                  onClick={() => {
                    setIsModalOpenR(true);
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
  }, [data]);
  return (
    <section>
      <div className="container1">
        <div className="cards">
          <div className="card">
            <h2
              style={{
                fontWeight: "bold",
                fontSize: "20px",
                color: "#303972",
                marginBottom: "10px",
              }}
            >
              {data.state === 1 ? "Giai đoạn đầu kỳ" : "Giai đoạn cuối kỳ"}
            </h2>
            {data.decisionOfCouncil === "Accept" ? (
              <p>Đề tài đã được thông qua</p>
            ) : (
              <p>Hạn nộp: {data.deadline}</p>
            )}

            <p>
              {" "}
              <a target="_blank" href={data.resultFileLink}>
                File kết quả của hội đồng
              </a>
            </p>
            <Collapse
              style={{
                background: token.colorBgContainer,
              }}
              bordered={false}
              defaultActiveKey={[data.length]}
              items={itemsCollapse}
            />
            {renderRole()}
          </div>
        </div>
      </div>
      <ModalChairmanReject
        state={data.state}
        topicId={topicId}
        isModalOpen={isModalOpenR}
        setIsModalOpen={setIsModalOpenR}
        chairmanFinalDecision={chairmanFinalDecision}
      />
    </section>
  );
};

export default ResubmitComponent;
