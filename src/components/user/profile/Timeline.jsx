import React from "react";
import { Timeline, Button, Card, Tag } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import dayjs from "dayjs-ext";

const TimelineComponent = ({ process }) => {
  const translations = {
    state: {
      "Early term": "Giai đoạn đề cương",
      "Middle term": "Giai đoạn giữa kỳ",
      "Ending phase": "Giai đoạn cuối kỳ",
    },
    events: {
      "Submit topic": "Nộp đề tài",
      "Dean make decision": "Trường phòng duyệt",
      "Member review formation": "Tạo hội đồng sơ duyệt",
      "Member review make decision": "Hội đồng sơ duyệt ra quyết định",
      "Council formation": "Tạo hội đồng phê duyệt",
      Meeting: "Tiến hành họp",
      "Council make decision": "Hội đồng phê duyệt ra quyết định",
      "Upload contract": "Tải lên hợp đồng",
      "Make review schedule": "Bổ sung tài liệu giữa kì",
      "Document supplementation": "Trường nhóm nộp tài liệu giữa kì",
      "Council evaluate": "Hội đồng đánh giá",
      "Upload remuneration 1": "Tải file tính ngày công",
      "Review remuneration 1": "Kiểm duyệt file",
    },
  };
  const translate = (key, type) => {
    return translations[type][key] || key;
  };
  const handleDownload = (fileUrl) => {
    // Logic để tải file
    const link = document.createElement("a");
    link.href = fileUrl;
    link.setAttribute("download", "");
    document.body.appendChild(link);
    link.click();
    link.remove();
  };
  return (
    <div>
      {process?.map((phase, index) => (
        <Card
          key={index}
          title={translate(phase.state, "state")}
          style={{ marginBottom: 24 }}
        >
          <Timeline mode="left">
            {phase.progressHistories.map((events, idx) => (
              <Timeline.Item
                key={idx}
                color={events.status === true ? "green" : "red"}
                label={dayjs(events.date).format("DD.MM.YYYY")}
              >
                <div>
                  <span>{translate(events.description, "events")}</span>
                </div>
                {events.fileLink && (
                  <Button
                    type="primary"
                    icon={<DownloadOutlined />}
                    onClick={() => handleDownload(events.fileLink)}
                    style={{ marginTop: 8 }}
                  >
                    Tải tài liệu
                  </Button>
                )}
                {/* {events.resubmit.length > 0 && (
                  <Timeline style={{ marginTop: 16 }}>
                    {events.resubmit.map((subEvent, subIdx) => (
                      <Timeline.Item
                        key={subIdx}
                        color={subEvent.status === "success" ? "green" : "gray"}
                        label={dayjs(events.date).format("DD.MM.YYYY")}
                      >
                        <div>
                          <span>
                            {translate(subEvent.description, "events")}
                          </span>
                        </div>
                        {subEvent.file && (
                          <Button
                            type="primary"
                            icon={<DownloadOutlined />}
                            onClick={() => handleDownload(subEvent.file)}
                            style={{ marginTop: 8 }}
                          >
                            Tải tài liệu
                          </Button>
                        )}
                      </Timeline.Item>
                    ))}
                  </Timeline>
                )} */}
              </Timeline.Item>
            ))}
          </Timeline>
        </Card>
      ))}
    </div>
  );
};

export default TimelineComponent;
