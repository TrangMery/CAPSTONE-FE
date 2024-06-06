import {
  CheckOutlined,
  CloudUploadOutlined,
  ContactsOutlined,
  FileDoneOutlined,
  FileProtectOutlined,
  FileTextOutlined,
  ScheduleOutlined,
  SolutionOutlined,
  SyncOutlined,
  UploadOutlined,
  UserAddOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { Collapse, Space, Steps, Button, ConfigProvider } from "antd";
import "./track.scss";
import { trackReseach } from "../../../services/api";
import { useLocation, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import UploadMidTerm from "./UploadMidTerm";
import UploadFileFinal from "./modalUploadFinal";
dayjs.extend(customParseFormat);
const dateFormat = "DD-MM-YYYY";
const TrackProject = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState("");
  const [dataProcess, setDataProcess] = useState({});
  const [status, setStatus] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalFinalOpen, setIsModalFinalOpen] = useState(false);
  const [isLeader, setIsLeader] = useState(false);
  const [leaderId, setLeaderId] = useState();
  const userId = localStorage.getItem("userId");
  const renderExtra = (step) => {
    if (step === currentStep) {
      return <SyncOutlined spin style={{ color: "blue" }} />;
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
        if (userId === res.data.creatorId) {
          setIsLeader(true);
          setLeaderId(res.data.creatorId);
        }
        if (
          res.data?.state === "PreliminaryReview" ||
          res.data?.state === "EarlyTermReport"
        ) {
          setCurrentStep("1");
        } else if (res.data?.state === "MidtermReport") {
          setCurrentStep("2");
        } else if (res.data?.state === "FinaltermReport") {
          setCurrentStep("3");
        } else if (res.data?.state === "EndingPhase") {
          setCurrentStep("4");
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
  }, [status]);
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
        {currentStep !== "" ? (
          <>
            <Collapse
              defaultActiveKey={currentStep === "1" ? ["1"] : ""}
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
                                ? "Staff đã lập hội đồng đánh giá"
                                : "Staff lập hội đồng đánh giá",
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
                                ?.waitingForUploadMeetingMinutes === "Accept"
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
                              dataProcess?.state === "MidtermReport" ||
                              dataProcess?.state === "FinaltermReport"
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
              defaultActiveKey={currentStep === "2" ? ["2"] : ""}
              collapsible={isCollapseDisabled(2)}
              items={[
                {
                  key: "2",
                  label: "Báo cáo giữa kỳ",
                  children:
                    dataProcess.middleTermReportProcess?.length > 0 ? (
                      <>
                        {dataProcess.middleTermReportProcess
                          ?.slice(-1)
                          .map((item, index) => {
                            return (
                              <>
                                <h4>
                                  Báo cáo giữa kỳ lần {item.numberOfReport}
                                </h4>
                                {item.deadlineForDocumentSupplementation ? (
                                  <>
                                    <p>
                                      Trạng thái: Chủ nhiệm đề tài cần nộp form trước
                                      ngày {/* 25-04-2024 */}
                                      {dayjs(
                                        item.deadlineForDocumentSupplementation
                                      ).format(dateFormat)}
                                    </p>
                                    {isLeader ? (
                                      <ConfigProvider
                                        theme={{
                                          token: {
                                            colorPrimary: "#55E6A0",
                                          },
                                        }}
                                      >
                                        <Button
                                          type="primary"
                                          style={{
                                            marginBottom: "10px",
                                          }}
                                          onClick={() => setIsModalOpen(true)}
                                        >
                                          Nộp tài liệu
                                        </Button>
                                      </ConfigProvider>
                                    ) : (
                                      ""
                                    )}
                                  </>
                                ) : (
                                  <p>Trạng thái: </p>
                                )}

                                <Steps
                                  size="small"
                                  labelPlacement="vertical"
                                  items={[
                                    {
                                      title: "Staff tạo ngày nộp đơn",
                                      status: "finished",
                                      icon: <ScheduleOutlined />,
                                    },
                                    {
                                      title: "Chủ nhiệm đề tài nộp đơn",
                                      status:
                                        item?.waitingForDocumentSupplementation ===
                                        "OnGoing"
                                          ? "wait"
                                          : "finished",
                                      icon: <FileTextOutlined />,
                                    },
                                    {
                                      title:
                                        item?.waitingForConfigureConference ===
                                        "Done"
                                          ? "Staff đã lập hội đồng đánh giá"
                                          : "Staff lập hội đồng đánh giá",
                                      status:
                                        item?.waitingForConfigureConference ===
                                        "Done"
                                          ? "finished"
                                          : "wait",
                                      icon: <UsergroupAddOutlined />,
                                    },
                                    {
                                      title:
                                        item?.waitingForUploadEvaluate ===
                                        "Done"
                                          ? "Staff đã tải lên quyết định"
                                          : "Staff tải lên quyết định",
                                      status:
                                        item?.waitingForUploadEvaluate ===
                                        "Done"
                                          ? "finished"
                                          : "wait",
                                      icon: <UploadOutlined />,
                                    },
                                  ]}
                                />
                              </>
                            );
                          })}
                      </>
                    ) : (
                      <div>Staff chưa đăng kí thời hạn nộp hồ sơ</div>
                    ),
                  extra: renderExtra(2),
                },
              ]}
            />
            <Collapse
              defaultActiveKey={currentStep === "3" ? ["3"] : ""}
              collapsible={isCollapseDisabled(3)}
              items={[
                {
                  key: "3",
                  label: "Báo cáo cuối kỳ",
                  children:
                    dataProcess.finalTermReportProcess !== null ? (
                      <>
                        {dataProcess.finalTermReportProcess
                          .deadlineForDocumentSupplementation ? (
                          <>
                            <p>
                              {" "}
                              Trạng thái: Chủ nhiệm đề tài cần nộp các file liên quan
                              trước ngày{" "}
                              {dayjs(
                                dataProcess.finalTermReportProcess
                                  .deadlineForDocumentSupplementation
                              ).format(dateFormat)}{" "}
                            </p>
                            {isLeader ? (
                              <ConfigProvider
                                theme={{
                                  token: {
                                    colorPrimary: "#55E6A0",
                                  },
                                }}
                              >
                                <Button
                                  type="primary"
                                  style={{
                                    marginBottom: "10px",
                                  }}
                                  onClick={() => setIsModalOpen(true)}
                                >
                                  Nộp tài liệu
                                </Button>
                              </ConfigProvider>
                            ) : (
                              ""
                            )}
                          </>
                        ) : (
                          <p>Trạng thái: </p>
                        )}
                        <Steps
                          size="small"
                          labelPlacement="vertical"
                          items={[
                            {
                              title:
                                dataProcess.finalTermReportProcess
                                  .waitingForDocumentSupplementation === "Done"
                                  ? "Đã nộp tài liệu cuối kỳ"
                                  : "Nộp tài liệu cuối kỳ",
                              status:
                                dataProcess.finalTermReportProcess
                                  .waitingForDocumentSupplementation === "Done"
                                  ? "finished"
                                  : "wait",
                              icon: <FileProtectOutlined />,
                            },
                            {
                              title:
                                dataProcess.finalTermReportProcess
                                  .waitingForConfigureConference === "Done"
                                  ? "Staff đã lập hội đồng đánh giá"
                                  : "Staff lập hội đồng đánh giá",
                              status:
                                dataProcess.finalTermReportProcess
                                  .waitingForConfigureConference === "Done"
                                  ? "finished"
                                  : "wait",
                              icon: <UsergroupAddOutlined />,
                            },
                            {
                              title:
                                dataProcess.finalTermReportProcess
                                  .waitingForUploadMeetingMinutes === "Done"
                                  ? "Bảo vệ thành công"
                                  : "Staff tải lên quyết định",
                              status:
                                dataProcess.finalTermReportProcess
                                  .waitingForUploadMeetingMinutes === "Done"
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
                          ]}
                        />
                      </>
                    ) : (
                      <div>
                        Staff chưa đăng kí thời hạn nộp các file liên quan
                      </div>
                    ),
                  extra: renderExtra(3),
                },
              ]}
            />
            <Collapse
              collapsible={isCollapseDisabled(4)}
              defaultActiveKey={currentStep === "4" ? ["4"] : ""}
              items={[
                {
                  key: "4",
                  label: "Tổng kết",
                  children: (
                    <>
                      {dataProcess.progress ===
                      "WaitingForSubmitRemuneration" ? (
                        <>
                          <p>
                            {" "}
                            Trạng thái: Chủ nhiệm đề tài nộp file tính ngày công
                          </p>
                          {isLeader ? (
                            <ConfigProvider
                              theme={{
                                token: {
                                  colorPrimary: "#55E6A0",
                                },
                              }}
                            >
                              <Button
                                type="primary"
                                style={{
                                  marginBottom: "10px",
                                }}
                                onClick={() => setIsModalFinalOpen(true)}
                              >
                                Nộp tài liệu
                              </Button>
                            </ConfigProvider>
                          ) : (
                            ""
                          )}
                        </>
                      ) : (
                        <p>Trạng thái: </p>
                      )}
                      <Steps
                        size="small"
                        labelPlacement="vertical"
                        items={[
                          {
                            title:
                              dataProcess.progress ===
                              "WaitingForCensorshipRemuneration"
                                ? "Đã nộp file tính ngày công"
                                : "Nộp file tính ngày công",
                            status:
                              dataProcess.progress ===
                              "WaitingForCensorshipRemuneration"
                                ? "finished"
                                : dataProcess.progress === "Completed"
                                ? "finished"
                                : "wait",
                            icon: <FileProtectOutlined />,
                          },
                          {
                            title: "Staff tải lên quyết định",
                            status:
                              dataProcess.progress === "Completed"
                                ? "finished"
                                : "wait",
                            icon: <CloudUploadOutlined />,
                          },
                        ]}
                      />
                    </>
                  ),
                  extra: renderExtra(4),
                },
              ]}
            />
          </>
        ) : (
          ""
        )}
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

      <UploadMidTerm
        state={currentStep}
        topicId={topicId}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        status={status}
        setStatus={setStatus}
      />
      <UploadFileFinal
        leaderId={leaderId}
        topicId={topicId}
        isModalOpen={isModalFinalOpen}
        setIsModalOpen={setIsModalFinalOpen}
        status={status}
        setStatus={setStatus}
      />
    </div>
  );
};
export default TrackProject;
