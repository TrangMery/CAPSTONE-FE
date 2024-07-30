import { useEffect, useState } from "react";
import Dashboard from "../../components/staff/project/Dashboard";
import {
  getAllTopics,
  getTopicCompleted,
  getTopicInComplete,
  getTopicPending,
  preAndEarlyStatistic,
  middleStatistic,
  finalStatistic,
  endingStatistic,
} from "../../services/api";
import { message } from "antd";
const StaffPage = () => {
  const [completedProjects, setCompletedProjects] = useState(0);
  const [runningProjects, setRunningProject] = useState(0);
  const [total, setTotal] = useState(0);
  const [incompletedProjects, setInompletedProjects] = useState(0);
  const [projectStages, setProjectStages] = useState({
    "Đăng kí đề tài": [],
    "Đề tài giữa kỳ": [],
    "Đề tài cuối kỳ": [],
    "Hoàn thành đề tài": [],
  });
  const stageMapping = {
    topicWaitingForDean: "Chờ Trưởng phòng Duyệt",
    topicWaitingForCouncilFormation: "Chờ tạo hội đồng sơ duyệt",
    topicWaitingForCouncilDecision: "Hội đồng sơ duyệt thông qua",
    topicWaitingForConfigureConference: "Chờ tạo lịch họp",
    topicWaitingForMeeting: "Chờ hội đồng phê duyệt",
    topicWaitingResubmitFirstTime: "Nộp lại lần 1",
    topicWaitingResubmitSecondTime: "Nộp lại lần 2",
    topicWaitingResubmitMoreThanSecondTime: "Nộp lại nhiều hơn 2 lần",
    topicWaitingForChairmanApproval: "Chờ chủ tịch hội đồng duyệt",
    topicWaitingForUploadContract: "Chờ tải hợp đồng",
    topicWaitingForUploadMeetingMinutes: "Chờ biên bản cuộc họp",

    // mid term
    topicWaitingForDocumentSupplementation: "Chờ tải lên báo cáo",
    topicWaitingForMakeReviewSchedule: "Chờ tạo lịch nộp tài liệu",
    topicWaitingForUploadEvaluate: "Chờ biên bản cuộc họp",
    firstReport: "Báo cáo lần 1",
    secondReport: "Báo cáo lần 2",
    moreThanTwoTimes: "Báo cáo nhiều hơn 2 lần",
    // final term
    topicWaitingForChairmanDecision: "Chờ chủ tịch hội đồng duyệt",
    //ending term
    censorshipRemuneration: "Đã tải file tính ngày công",
    waitingForUploadEndingContract: "Tải lên file quyết định thông qua",
    waitingForUploadRemuneration: "Chờ tải lên file tính ngày công",
    completedTopic: "Đề tài đã hoàn thành",
  };
  const transformStages = (stages) => {
    return Object.keys(stages).map((key) => ({
      title: stageMapping[key] || key,
      value: stages[key],
    }));
  };

  const getAllProjects = async () => {
    try {
      const res = await getAllTopics();
      if (res && res.statusCode === 200) {
        setTotal(res.data.length);
      }
    } catch (error) {
      console.log("====================================");
      console.log("có lỗi tại getAllProjects", error);
      console.log("====================================");
    }
  };
  const getCompleteProjects = async () => {
    try {
      const res = await getTopicCompleted();
      if (res && res.statusCode === 200) {
        setCompletedProjects(res.data.total);
      }
    } catch (error) {
      console.log("====================================");
      console.log("có lỗi tại getAllProjects", error);
      console.log("====================================");
    }
  };
  const getIncompleteProjects = async () => {
    try {
      const res = await getTopicInComplete();
      if (res && res.statusCode === 200) {
        setInompletedProjects(res.data.total);
      }
    } catch (error) {
      console.log("====================================");
      console.log("có lỗi tại getAllProjects", error);
      console.log("====================================");
    }
  };
  const getRunningProjects = async () => {
    try {
      const res = await getTopicPending();
      if (res && res.statusCode === 200) {
        setRunningProject(res.data.total);
      }
    } catch (error) {
      console.log("====================================");
      console.log("có lỗi tại getAllProjects", error);
      console.log("====================================");
    }
  };
  const getProjectStages = async () => {
    try {
      const stages1 = await preAndEarlyStatistic().then((res) => res.data);
      setProjectStages((prev) => ({
        ...prev,
        "Đăng kí đề tài": transformStages(stages1),
      }));
    } catch (error) {
      message.error("Failed to fetch stages for Đăng kí đề tài");
    }

    try {
      const stages2 = await middleStatistic().then((res) => res.data);
      setProjectStages((prev) => ({
        ...prev,
        "Đề tài giữa kỳ": transformStages(stages2),
      }));
    } catch (error) {
      message.error("Failed to fetch stages for Đề tài giữa kỳ");
    }

    try {
      const stages3 = await finalStatistic().then((res) => res.data);
      setProjectStages((prev) => ({
        ...prev,
        "Đề tài cuối kỳ": transformStages(stages3),
      }));
    } catch (error) {
      message.error("Failed to fetch stages for Đề tài cuối kỳ");
    }

    try {
      const stages4 = await endingStatistic().then((res) => res.data);
      console.log("====================================");
      console.log(stages4);
      console.log("====================================");
      setProjectStages((prev) => ({
        ...prev,
        "Hoàn thành đề tài": transformStages(stages4),
      }));
    } catch (error) {
      message.error("Failed to fetch stages for Hoàn thành đề tài");
    }
  };

  useEffect(() => {
    getAllProjects();
    getCompleteProjects();
    getRunningProjects();
    getIncompleteProjects();
    getProjectStages();
  }, []);

  return (
    <div style={{ backgroundColor: "#f0f2f5" }}>
      <Dashboard
        totalProjects={total}
        runningProjects={runningProjects}
        completedProjects={completedProjects}
        rejectedProjects={incompletedProjects}
        projectStages={projectStages}
      />
    </div>
  );
};

export default StaffPage;
