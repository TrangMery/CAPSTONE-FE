import "./card.scss";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { getReviewDocuments } from "../../../services/api";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useLocation, useNavigate } from "react-router-dom";
import ModalChairmanReject from "./ModalChairmanReject";
import CollapseTopic from "./CollapTopic";
import { Button } from "antd";
dayjs.extend(customParseFormat);
const dateFormat = "DD/MM/YYYY";
const ResubmitProject = () => {
  const [isModalOpenR, setIsModalOpenR] = useState(false);
  const userId = sessionStorage.getItem("userId");
  const [dataReviewDocument, setDataReviewDocument] = useState([]);
  const [role, setRole] = useState("");
  const [status, setStatus] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  let topicId = location.pathname.split("/");
  topicId = topicId[4];
  const renderRole = () => {
    return (
      <>
        {dataReviewDocument.length === 0 ? (
          <p style={{ fontWeight: "bold" }}>
            Chủ nhiệm đề tài chưa nộp lại tài liệu
          </p>
        ) : (
          ""
        )}
        <div style={{ marginTop: "20px" }}>
          <Button type="primary" onClick={() => navigate(-1)}>
            Quay lại
          </Button>
        </div>
      </>
    );
  };

  const getReviewDoc = async () => {
    const res = await getReviewDocuments({
      userId: userId,
      topicId: topicId,
    });
    console.log("check res: ", res);
    if (res && res?.data) {
      const data = [
        {
          topicId,
          role: res.data.role,
          state: res.data?.reviewEarlyDocument
            ? "Giai đoạn đề cương"
            : "Giai đoạn tiếp theo",
          deadline: dayjs(res.data.reviewEarlyDocument.resubmitDeadline).format(
            dateFormat
          ),
          decisionOfCouncil: res.data.reviewEarlyDocument.decisionOfCouncil,
          resultFileLink: res.data.reviewEarlyDocument.resultFileLink,
          documents:
            res.data.reviewEarlyDocument.documents.length > 0
              ? res.data.reviewEarlyDocument.documents
              : [],
        },
      ];
      setRole(res.data.role);
      setDataReviewDocument(data);
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
        <section>
          <div className="container1">
            <div className="cards">
              {dataReviewDocument.map((card, i) => (
                <div key={i} className="card">
                  <h2
                    style={{
                      fontWeight: "bold",
                      fontSize: "20px",
                      color: "#303972",
                      marginBottom: "10px",
                    }}
                  >
                    {card.state}
                  </h2>
                  {card.decisionOfCouncil === "Accept" ? (
                    <p>Đề tài đã được thông qua</p>
                  ) : (
                    <p>Hạn nộp: {card.deadline}</p>
                  )}

                  <p>
                    {" "}
                    <a target="_blank" href={card.resultFileLink}>
                      File kết quả của hội đồng
                    </a>
                  </p>
                  <CollapseTopic
                    data={card.documents}
                    setIsModalOpen={setIsModalOpenR}
                    topicId={topicId}
                    setStatus={setStatus}
                    role={role}
                  />
                  {renderRole()}
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
      <ModalChairmanReject
        topicId={topicId}
        isModalOpen={isModalOpenR}
        setIsModalOpen={setIsModalOpenR}
      />
    </>
  );
};
export default ResubmitProject;
