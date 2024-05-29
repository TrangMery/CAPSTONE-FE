import React from "react";
import { Timeline, Button, Card, Tag } from "antd";
import { DownloadOutlined } from "@ant-design/icons";

const TimelineComponent = () => {
  const phases = [
    {
      state: 'Giai đoạn đầu kỳ',
      process: [
        { date: '2024-05-05', description: 'Bắt đầu đề tài', status: 'success', file: null },
        { date: '2024-05-15', description: 'Trường phòng duyệt', status: 'success', file: 'path/to/plan.pdf' },
      ],
    },
    {
      state: 'Giai đoạn giữa kỳ',
      process: [
        { date: '2024-03-05', description: 'Nộp báo cáo tiến độ', status: 'success', file: 'path/to/progress-report.pdf' },
        { date: '2024-03-15', description: 'Staff tạo hội đồng', status: 'pending', file: null },
      ],
    },
    {
      state: 'Giai đoạn cuối kỳ',
      process: [
        { date: '2024-05-05', description: 'Nộp báo cáo cuối kì', status: 'success', file: 'path/to/final-report.pdf' },
        { date: '2024-06-05', description: 'Staff lên lịch họp', status: 'pending', file: null },
      ],
    },
  ];
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
      {phases.map((phase, index) => (
        <Card key={index} title={phase.state} style={{ marginBottom: 24 }}>
          <Timeline mode="left">
            {phase.process.map((event, idx) => (
              <Timeline.Item 
                key={idx} 
                color={event.status === 'success' ? 'green' : 'gray'}
                label={event.date}
              >
                <div>
                  <span>{event.description}</span>
                </div>
                {event.file && (
                  <Button 
                    type="primary" 
                    icon={<DownloadOutlined />} 
                    onClick={() => handleDownload(event.file)}
                    style={{ marginTop: 8 }}
                  >
                    Download
                  </Button>
                )}
              </Timeline.Item>
            ))}
          </Timeline>
        </Card>
      ))}
    </div>
  );
};

export default TimelineComponent;
