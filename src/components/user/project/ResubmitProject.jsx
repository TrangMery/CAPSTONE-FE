import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { getReviewDocuments } from "../../../services/api";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useLocation, useNavigate } from "react-router-dom";
import ModalChairmanReject from "./ModalChairmanReject";
import { Button } from "antd";
import ResubmitComponent from "./ResubmitComponent";
dayjs.extend(customParseFormat);
const dateFormat = "DD/MM/YYYY";
const ResubmitProject = () => {
  const userId = sessionStorage.getItem("userId");
  const [dataReviewDocument, setDataReviewDocument] = useState({});
  const [dataReviewDocumentMiddle, setDataReviewDocumentMiddle] = useState([]);
  const [dataReviewDocumentFinal, setDataReviewDocumentFinal] = useState({});
  const [role, setRole] = useState("");
  const [status, setStatus] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  let topicId = location.pathname.split("/");
  topicId = topicId[4];

  const getReviewDoc = async () => {
    const res = await getReviewDocuments({
      userId: userId,
      topicId: topicId,
    });
    if (res && res?.data) {
      if (res.data.reviewEarlyDocument !== null) {
        const dataEarly = {
          state: 1,
          deadline: dayjs(res.data.reviewEarlyDocument.resubmitDeadline).format(
            dateFormat
          ),
          decisionOfCouncil: res.data.reviewEarlyDocument.decisionOfCouncil,
          resultFileLink: res.data.reviewEarlyDocument.resultFileLink,
          documents:
            res.data.reviewEarlyDocument.documents.length > 0
              ? res.data.reviewEarlyDocument.documents
              : [],
        };
        setDataReviewDocument(dataEarly);
      }
      setDataReviewDocumentMiddle(res.data.reviewMiddleDocuments);
      if (res.data.reviewFinalDocument !== null) {
        const dataFinal = {
          state: 3,
          deadline: dayjs(res.data.reviewFinalDocument.resubmitDeadline).format(
            dateFormat
          ),
          decisionOfCouncil: res.data.reviewFinalDocument.decisionOfCouncil,
          resultFileLink: res.data.reviewFinalDocument.resultFileLink,
          documents:
            res.data.reviewFinalDocument.documents.length > 0
              ? res.data.reviewFinalDocument.documents
              : [],
        };
        setDataReviewDocumentFinal(dataFinal);
      }
      setRole(res.data.role);
    }
  };
  useEffect(() => {
    getReviewDoc();
  }, [status]);
  return (
    <>
      <h2
        style={{
          fontWeight: "bold",
          fontSize: "30px",
          color: "#303972",
          marginBottom: "40px",
        }}
      >
        {role === "Chairman"
          ? "Phê duyệt tài liệu nộp lại"
          : role === "Leader"
          ? "Nộp lại tài liệu đã chỉnh sửa"
          : "Theo dõi quá trình chỉnh sửa"}
      </h2>
      <div>
        <ResubmitComponent
          data={dataReviewDocument}
          role={role}
          setStatus={setStatus}
          topicId={topicId}
          active={status}
        />
        {dataReviewDocumentFinal ? (
          <>
            <ResubmitComponent
              data={dataReviewDocumentFinal}
              role={role}
              setStatus={setStatus}
              topicId={topicId}
              active={status}
            />
          </>
        ) : (
          <></>
        )}

        <div style={{ marginTop: "10px" }}>
          <Button type="primary" onClick={() => navigate(-1)}>
            Quay lại
          </Button>
        </div>
      </div>
    </>
  );
};
export default ResubmitProject;
