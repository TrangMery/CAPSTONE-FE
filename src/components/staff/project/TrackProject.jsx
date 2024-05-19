import {
  CalendarOutlined,
  CheckOutlined,
  CloudUploadOutlined,
  ContactsOutlined,
  FileDoneOutlined,
  FileProtectOutlined,
  FileTextOutlined,
  ScheduleOutlined,
  SolutionOutlined,
  UploadOutlined,
  UserAddOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { Collapse, Spin, Space, Steps, Button } from "antd";
import "./track.scss";
import { useLocation, useNavigate } from "react-router-dom";
import { trackReseach } from "../../../services/api";

const TrackProjectStaff = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [dataProcess, setDataProcess] = useState({});
  const renderExtra = (step) => {
    if (step === currentStep) {
      return <Spin />;
    } else if (step < currentStep) {
      return <CheckOutlined style={{ color: "green" }} />;
    }
    return null;
  };
  const isCollapseDisabled = (step) => {
    if (step > currentStep) {
      return "disabled";
    } else return "header";
  };
  const location = useLocation();
  let topicId = location.pathname.split("/");
  topicId = topicId[4];
  const getProjectProcess = async () => {
    try {
      const res = await trackReseach({
        topicId: topicId,
      });
      if (res && res.isSuccess) {
        setDataProcess(res.data);
        if(res.data?.state === "MidtermReport") {
          setCurrentStep(2)
        } else if (res.data?.state === "FinaltermReport") {
          setCurrentStep(3)
        }
      }
    } catch (error) {
      console.log("====================================");
      console.log("Có lỗi tại theo dõi đề tài: " + error.message);
      console.log("====================================");
    }
  };
  useEffect(() => {
    getProjectProcess();
  }, []);
  return (
    <div>
      <h2
        style={{
          fontWeight: "bold",
          fontSize: "30px",
          color: "#303972",
          margin: "20px",
        }}
      >
        Theo dõi tiến độ của đề tài
      </h2>
      <Space direction="vertical">
        <Collapse
          collapsible={isCollapseDisabled(1)}
          items={[
            {
              key: "1",
              label: "Đăng kí đề tài",
              children: (
                <>
                  <p>Trạng thái: </p>
                  <Steps
                    size="small"
                    labelPlacement="vertical"
                    items={[
                      {
                        title: "Nộp đề tài",
                        status: "finished",
                        icon: <FileProtectOutlined />,
                      },
                      {
                        title:
                          dataProcess?.preliminaryReviewProcess
                            ?.waitingForDean === "Accept"
                            ? "Trưởng khoa đã duyệt"
                            : dataProcess?.preliminaryReviewProcess
                                ?.waitingForDean === "Reject"
                            ? "Trưởng khoa đã từ chối"
                            : "Trưởng khoa duyệt",
                        status:
                          dataProcess?.preliminaryReviewProcess
                            ?.waitingForDean === "Accept"
                            ? "finished"
                            : dataProcess?.preliminaryReviewProcess
                                ?.waitingForDean === "Reject"
                            ? "error"
                            : "wait",
                        icon: <SolutionOutlined />,
                      },
                      {
                        title:
                          dataProcess?.preliminaryReviewProcess
                            ?.waitingForCouncilFormation === "Done"
                            ? "Staff đã thêm thành viên sơ duyệt"
                            : "Staff thêm thành viên sơ duyệt",
                        status:
                          dataProcess?.preliminaryReviewProcess
                            ?.waitingForCouncilFormation === "Done"
                            ? "finished"
                            : "wait",
                        icon: <UserAddOutlined />,
                      },
                      {
                        title:
                          dataProcess?.preliminaryReviewProcess
                            ?.waitingForCouncilDecision === "Accept"
                            ? "Thông qua"
                            : "Thành viên sơ duyệt đánh giá",
                        status:
                          dataProcess?.preliminaryReviewProcess
                            ?.waitingForCouncilDecision === "Accept"
                            ? "finished"
                            : "wait",
                        icon: <FileDoneOutlined />,
                      },
                      {
                        title:
                          dataProcess?.earlyTermReportProcess
                            ?.waitingForCouncilFormation === "Done"
                            ? "Staff đã tạo hội đồng đánh giá"
                            : "Staff tạo hội đồng đánh giá",
                        status:
                          dataProcess?.earlyTermReportProcess
                            ?.waitingForCouncilFormation === "Done"
                            ? "finished"
                            : "wait",
                        icon: <UsergroupAddOutlined />,
                      },
                      {
                        title: "Staff tải lên quyết định",
                        status:
                          dataProcess?.earlyTermReportProcess
                            ?.waitingForCouncilMeeting === "Accept"
                            ? "finished"
                            : "wait",
                        icon: <CloudUploadOutlined />,
                      },
                      // nếu resubmit thì mới hiện
                      // {
                      //   title: "Staff tải hợp đồng lên",
                      //   status:
                      //     dataProcess?.earlyTermReportProcess
                      //       ?.waitingForContractSigning === "Accept"
                      //       ? "finished"
                      //       : "wait",
                      //   icon: <ContactsOutlined />,
                      // },
                      {
                        title: "Staff tải hợp đồng lên",
                        status:
                          dataProcess?.earlyTermReportProcess
                            ?.waitingForContractSigning === "Accept"
                            ? "finished"
                            : "wait",
                        icon: <ContactsOutlined />,
                      },
                    ]}
                  />
                </>
              ),
              extra: renderExtra(1),
            },
          ]}
        />
        <Collapse
          collapsible={isCollapseDisabled(2)}
          items={[
            {
              key: "1",
              label: "Báo cáo giữa kỳ",
              children: (
                <>
                  <p>Trạng thái: </p>
                  <Steps
                    size="small"
                    labelPlacement="vertical"
                    items={[
                      {
                        title: "Nộp đề tài",
                        status: "finished",
                        icon: <ScheduleOutlined />,
                      },
                      {
                        title:
                          dataProcess?.preliminaryReviewProcess
                            ?.waitingForDean === "Accept"
                            ? "Trưởng khoa đã duyệt"
                            : dataProcess?.preliminaryReviewProcess
                                ?.waitingForDean === "Reject"
                            ? "Trưởng khoa đã từ chối"
                            : "Trưởng khoa duyệt",
                        status:
                          dataProcess?.preliminaryReviewProcess
                            ?.waitingForDean === "Accept"
                            ? "finished"
                            : dataProcess?.preliminaryReviewProcess
                                ?.waitingForDean === "Reject"
                            ? "error"
                            : "wait",
                        icon: <FileTextOutlined />,
                      },
                      {
                        title:
                          dataProcess?.preliminaryReviewProcess
                            ?.waitingForCouncilFormation === "Done"
                            ? "Staff đã thêm thành viên sơ duyệt"
                            : "Staff thêm thành viên sơ duyệt",
                        status:
                          dataProcess?.preliminaryReviewProcess
                            ?.waitingForCouncilFormation === "Done"
                            ? "finished"
                            : "wait",
                        icon: <CalendarOutlined />,
                      },
                      {
                        title:
                          dataProcess?.preliminaryReviewProcess
                            ?.waitingForCouncilDecision === "Accept"
                            ? "Thông qua"
                            : "Thành viên sơ duyệt đánh giá",
                        status:
                          dataProcess?.preliminaryReviewProcess
                            ?.waitingForCouncilDecision === "Accept"
                            ? "finished"
                            : "wait",
                        icon: <UploadOutlined />,
                      }
                    ]}
                  />
                </>
              ),
              extra: renderExtra(2),
            },
          ]}
        />
        <Collapse
          collapsible={isCollapseDisabled(3)}
          items={[
            {
              key: "3",
              label: "Báo cáo cuối kỳ",
              extra: renderExtra(3),
            },
          ]}
        />
        <Collapse
          collapsible={isCollapseDisabled(4)}
          items={[
            {
              key: "4",
              label: "Tổng kết",

              extra: renderExtra(4),
            },
          ]}
        />
      </Space>
      <Button
        shape="round"
        type="primary"
        danger
        onClick={() => navigate(-1)}
        style={{ margin: "10px 0" }}
      >
        Quay về
      </Button>
    </div>
  );
};
export default TrackProjectStaff;
