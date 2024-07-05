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
import { getStateApi, trackReseach } from "../../../services/api";
import { useLocation, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import UploadMidTerm from "./UploadMidTerm";
import UploadFileFinal from "./modalUploadFinal";
import ModalUploadResubmit from "./ModalResubmit";
import TrackResubmitModal from "./TrackResubmitModal";
dayjs.extend(customParseFormat);
const dateFormat = "DD-MM-YYYY";
const TrackProject = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState("");
  const [dataProcess, setDataProcess] = useState({});
  const [status, setStatus] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalFinalOpen, setIsModalFinalOpen] = useState(false);
  const [isModalResubmitOpen, setIsModalResubmitOpen] = useState(false);
  const [modalResubmit, setModalResubmit] = useState(false);
  const [resubmitEarly, setResubmitEarly] = useState([]);
  const [isLeader, setIsLeader] = useState(false);
  const [leaderId, setLeaderId] = useState();
  const [state, setState] = useState(false);
  const userId = sessionStorage.getItem("userId");
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
      console.log("check res: " , res);
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
        if (res.data?.earlyTermReportProcess?.resubmitProcesses.length > 0) {
          setResubmitEarly(res.data?.earlyTermReportProcess.resubmitProcesses);
        }
      }
    } catch (error) {
      console.log("====================================");
      console.log("Có lỗi tại theo dõi đề tài: " + error.message);
      console.log("====================================");
    }
  };
  const getState = async () => {
    try {
      const res = await getStateApi();
      if (res && res.statusCode === 200) {
        setState(res.data.isBypassCensorship);
      }
    } catch (error) {
      console.log("====================================");
      console.log("có lỗi tại getState: ", error);
      console.log("====================================");
    }
  };
  useEffect(() => {
    getProjectProcess();
    getState();
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
                  label: "Đăng ký đề tài",
                  children: (
                    <>
                      {dataProcess.currentDeadline ? (
                        <>
                          {" "}
                          <p>
                            Trạng thái: Chủ nhiệm đề tài cần nộp lại tài liệu{" "}
                            {dayjs(dataProcess.currentDeadline).format(
                              dateFormat
                            )}
                          </p>{" "}
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
                                onClick={() => setModalResubmit(true)}
                              >
                                Nộp tài liệu chỉnh sửa
                              </Button>
                            </ConfigProvider>
                          ) : (
                            ""
                          )}
                        </>
                      ) : resubmitEarly.length > 0 ? (
                        <ConfigProvider
                          theme={{
                            token: {
                              colorPrimary: "#55E6A0",
                            },
                          }}
                        >
                          <Button
                            type="primary"
                            style={{ marginBottom: "20px" }}
                            onClick={() => setIsModalResubmitOpen(true)}
                          >
                            Xem lịch sử nộp lại
                          </Button>
                        </ConfigProvider>
                      ) : (
                        ""
                      )}

                      <Steps
                        size="small"
                        labelPlacement="vertical"
                        items={[
                          {
                            title: "Nộp đề tài",
                            status: "finish",
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
                                ? "finish"
                                : dataProcess?.preliminaryReviewProcess
                                    ?.waitingForDean === "Reject"
                                ? "error"
                                : "wait",
                            icon: <SolutionOutlined />,
                            hidden: state === true ? false : true,
                          },
                          {
                            title:
                              dataProcess?.preliminaryReviewProcess
                                ?.waitingForCouncilFormation === "Done"
                                ? "Thành lập hội đồng sơ duyệt"
                                : "Thành lập hội đồng sơ duyệt",
                            status:
                              dataProcess?.preliminaryReviewProcess
                                ?.waitingForCouncilFormation === "Done"
                                ? "finish"
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
                                ? "finish"
                                : "wait",
                            icon: <FileDoneOutlined />,
                          },
                          {
                            title:
                              dataProcess?.earlyTermReportProcess
                                ?.waitingForCouncilFormation === "Done"
                                ? "Đã lập hội đồng đánh giá"
                                : "Lập hội đồng đánh giá",
                            status:
                              dataProcess?.earlyTermReportProcess
                                ?.waitingForCouncilFormation === "Done"
                                ? "finish"
                                : "wait",
                            icon: <UsergroupAddOutlined />,
                          },
                          {
                            title:
                              dataProcess?.earlyTermReportProcess
                                ?.waitingForUploadMeetingMinutes === "Accept"
                                ? "Staff tải lên quyết định"
                                : (dataProcess?.earlyTermReportProcess
                                    ?.waitingForUploadMeetingMinutes ===
                                    "Edit" &&
                                    dataProcess?.earlyTermReportProcess
                                      .resubmitProcesses.length === 0) ||
                                  dataProcess?.progress ===
                                    "WaitingForDocumentEditing"
                                ? "Nộp lại tài liệu đã chỉnh sửa"
                                : dataProcess?.progress ===
                                  "WaitingForCouncilDecision"
                                ? "Chờ quyết định của hội đồng"
                                : "Tải lên quyết định ",
                            status:
                              dataProcess?.earlyTermReportProcess
                                ?.waitingForUploadMeetingMinutes === "Accept"
                                ? "finish"
                                : (dataProcess?.earlyTermReportProcess
                                    ?.waitingForUploadMeetingMinutes ===
                                    "Edit" &&
                                    dataProcess?.earlyTermReportProcess
                                      .resubmitProcesses.length === 0) ||
                                  dataProcess?.progress ===
                                    "WaitingForDocumentEditing"
                                ? "error"
                                : dataProcess?.progress ===
                                  "WaitingForCouncilDecision"
                                ? "process"
                                : dataProcess?.progress ===
                                  "WaitingForUploadContract"
                                ? "finish"
                                : "wait",
                            icon: <CloudUploadOutlined />,
                          },
                          {
                            title: "Staff tải hợp đồng lên",
                            status:
                              dataProcess?.state === "MidtermReport" ||
                              dataProcess?.state === "FinaltermReport"
                                ? "finish"
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
                                      Trạng thái: Chủ nhiệm đề tài cần nộp form
                                      trước ngày:{" "}
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
                                  <p></p>
                                )}

                                <Steps
                                  size="small"
                                  labelPlacement="vertical"
                                  items={[
                                    {
                                      title: "Staff tạo ngày nộp đơn",
                                      status: "finish",
                                      icon: <ScheduleOutlined />,
                                    },
                                    {
                                      title: "Chủ nhiệm đề tài nộp tài liệu",
                                      status:
                                        item?.waitingForDocumentSupplementation ===
                                        "OnGoing"
                                          ? "wait"
                                          : "finish",
                                      icon: <FileTextOutlined />,
                                    },
                                    {
                                      title:
                                        item?.waitingForConfigureConference ===
                                        "Done"
                                          ? "Đã lập hội đồng đánh giá"
                                          : "Lập hội đồng đánh giá",
                                      status:
                                        item?.waitingForConfigureConference ===
                                        "Done"
                                          ? "finish"
                                          : "wait",
                                      icon: <UsergroupAddOutlined />,
                                    },
                                    {
                                      title:
                                        item?.waitingForUploadEvaluate ===
                                        "Done"
                                          ? "Đã tải lên quyết định"
                                          : "Tải lên quyết định",
                                      status:
                                        item?.waitingForUploadEvaluate ===
                                        "Done"
                                          ? "finish"
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
                              Trạng thái: Chủ nhiệm đề tài cần nộp các file liên
                              quan trước ngày{" "}
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
                                  ? "finish"
                                  : "wait",
                              icon: <FileProtectOutlined />,
                            },
                            {
                              title:
                                dataProcess.finalTermReportProcess
                                  .waitingForConfigureConference === "Done"
                                  ? "Đã lập hội đồng đánh giá"
                                  : "Lập hội đồng đánh giá",
                              status:
                                dataProcess.finalTermReportProcess
                                  .waitingForConfigureConference === "Done"
                                  ? "finish"
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
                                  ? "finish"
                                  : "wait",
                              icon: <CloudUploadOutlined />,
                            },
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
                                ? "finish"
                                : dataProcess.progress === "Completed"
                                ? "finish"
                                : "wait",
                            icon: <FileProtectOutlined />,
                          },
                          {
                            title: "Staff tải lên quyết định",
                            status:
                              dataProcess.progress === "Completed"
                                ? "finish"
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
      <TrackResubmitModal
        isModalOpen={isModalResubmitOpen}
        setIsModalOpen={setIsModalResubmitOpen}
        data={resubmitEarly}
      />
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
      <ModalUploadResubmit
        userId={userId}
        topicId={topicId}
        isModalOpen={modalResubmit}
        setIsModalOpen={setModalResubmit}
        status={status}
        setStatus={setStatus}
      />
    </div>
  );
};
export default TrackProject;
