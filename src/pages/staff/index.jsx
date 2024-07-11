import { useEffect, useState } from "react";
import Dashboard from "../../components/staff/project/Dashboard";
import {
  getAllTopics,
  getTopicCompleted,
  getTopicInComplete,
  getTopicPending,
} from "../../services/api";
const StaffPage = () => {
  const [completedProjects, setCompletedProjects] = useState(0);
  const [runningProjects, setRunningProject] = useState(0);
  const [total, setTotal] = useState(0);
  const [incompletedProjects, setInompletedProjects] = useState(0);

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
  useEffect(() => {
    getAllProjects();
    getCompleteProjects();
    getRunningProjects();
    getIncompleteProjects();
  }, []);
  return (
    <div style={{backgroundColor : "#f0f2f5"}}>
      <Dashboard
        totalProjects={total}
        runningProjects={runningProjects}
        completedProjects={completedProjects}
        rejectedProjects={incompletedProjects}
      />
    </div>
  );
};

export default StaffPage;