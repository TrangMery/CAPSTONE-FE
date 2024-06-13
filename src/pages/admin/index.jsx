import { useEffect, useState } from "react";
import Dashboard from "../../components/admin/Dashboard";
import "./index.scss";
import {
  getAllTopics,
  getTopicCompleted,
  getTopicInComplete,
  getTopicPending,
} from "../../services/api";
const AdminPage = () => {
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
      console.log(res.data);
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
    <div className="AdminPage">
      <Dashboard
        totalProjects={total}
        runningProjects={runningProjects}
        completedProjects={completedProjects}
        rejectedProjects={incompletedProjects}
      />
    </div>
  );
};

export default AdminPage;
