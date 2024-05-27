import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import LoginPage from "./pages/login/index.jsx";
import NotFound from "./components/NotFound/index.jsx";

import "antd/dist/reset.css";
import LayoutStaff from "./components/staff/LayoutStaff.jsx";
import StaffPage from "./pages/staff/index.jsx";
import Project from "./pages/projectMangerStaff/index.jsx";
import AddMemberApprove from "./components/staff/project/AddMemberAprove.jsx";
import UploadDoc from "./pages/uploads/index.jsx";
import LayoutUser from "./components/user/LayoutUser.jsx";
import ProjectUser from "./pages/projectMangerUser/index.jsx";
import UserPage from "./pages/user/index.jsx";
import ProjectUserReview from "./pages/projectMangerUserReview/index.jsx";
import TrackProject from "./components/user/project/TrackProject.jsx";
import TrackProjectStaff from "./components/staff/project/TrackProject.jsx";
import ProjectForTrack from "./components/user/project/ProjectForTrack.jsx";
import ResubmitProject from "./components/user/project/ResubmitProject.jsx";
import ProjectResubmit from "./components/user/project/ProjectResubmit.jsx";
import ProjectForTrackStaff from "./components/staff/project/ProjectForTrackStaff.jsx";
import MidtermProject from "./pages/projectMangerStaff/midterm.jsx";
import ProtectedRoute from "./components/ProtectedRoute/index.jsx";
import FinaltermProject from "./pages/projectMangerStaff/finalterm.jsx";
import UserProfile from "./components/user/profile/userProfile.jsx";
import LayoutAdmin from "./components/admin/LayoutAdmin.jsx";
import AdminPage from "./pages/admin/index.jsx";
import ManagerAccount from "./components/admin/ManagerAccount.jsx";
import ManagerHoliday from "./components/admin/MangerHoliday.jsx";
import ManagerDepartment from "./components/admin/ManagerDepart.jsx";
import ManagerFileType from "./components/admin/ManagerFile.jsx";
import ManagerContractType from "./components/admin/ManagerContract.jsx";
import ExportFile from "./components/admin/exportFile.jsx";
import AddCouncil from "./components/staff/project/AddCouncil.jsx";
import ViewTopic from "./components/staff/project/ViewTopicCompleted.jsx";

const Layout = () => {
  return <LoginPage />;
};
function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      errorElement: <NotFound />,
    },
    {
      path: "/login",
      element: <LoginPage />,
    },
    {
      path: "/staff",
      element: (
        <ProtectedRoute>
          <LayoutStaff />
        </ProtectedRoute>
      ),
      children: [
        {
          index: true,
          element: <StaffPage />,
        },
        {
          path: "earlyterm",
          element: <Outlet />,
          children: [
            {
              index: true,
              element: <Project />,
            },
            {
              path: "add-member/:projectId",
              element: <AddMemberApprove />,
            },
            {
              path: "add-council/:projectId",
              element: <AddCouncil />,
            },
          ],
        },
        {
          path: "midterm",
          element: <Outlet />,
          children: [
            {
              index: true,
              element: <MidtermProject />,
            },
            {
              path: "add-council/:projectId",
              element: <AddCouncil />,
            },
          ],
        },
        {
          path: "finalterm",
          element: <Outlet />,
          children: [
            {
              index: true,
              element: <FinaltermProject />,
            },
            {
              path: "add-council/:projectId",
              element: <AddCouncil />,
            },
          ],
        },
        {
          path: "upload-document",
          element: <UploadDoc />,
        },
        {
          path: "view-topic",
          element: <ViewTopic />,
        },
      ],
    },
    {
      path: "/user",
      element: (
        <ProtectedRoute>
          <LayoutUser />
        </ProtectedRoute>
      ),
      errorElement: <NotFound />,
      children: [
        {
          index: true,
          element: <UserPage />,
        },
        {
          path: "manager-review",
          element: <Outlet />,
          children: [
            {
              index: true,
              element: <ProjectUserReview />,
            },
          ],
        },
        {
          path: "manager",
          element: <Outlet />,
          children: [
            {
              index: true,
              element: <ProjectUser />,
            },
          ],
        },
        {
          path: "track",
          element: <Outlet />,
          children: [
            {
              index: true,
              element: <ProjectForTrack />,
            },
            {
              path: "track-topic/:projectId",
              element: <TrackProject />,
            },
          ],
        },
        {
          path: "review",
          element: <Outlet />,
          children: [
            {
              index: true,
              element: <ProjectResubmit />,
            },
            {
              path: "review-topic/:projectId",
              element: <ResubmitProject />,
            },
          ],
        },
        {
          path: "profile",
          element: <UserProfile />,
        },
      ],
    },
    {
      path: "/admin",
      element: (
        <ProtectedRoute>
          <LayoutAdmin />
        </ProtectedRoute>
      ),
      children: [
        {
          index: true,
          element: <AdminPage />,
        },
        {
          path: "accounts",
          element: <ManagerAccount />,
        },
        {
          path: "export-file",
          element: <ExportFile/>,
        },
        {
          path: "file",
          element: <ManagerFileType/>,
        },
        {
          path: "contract",
          element: <ManagerContractType/>,
        },
        {
          path: "add-holiday",
          element: <ManagerHoliday/>,
        },
        {
          path: "add-department",
          element: <ManagerDepartment/>
        }
      ],
    },
  ]);
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
