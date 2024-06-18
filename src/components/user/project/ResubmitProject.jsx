import "./card.scss";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { chairmanApprove, getReviewDocuments } from "../../../services/api";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useLocation, useNavigate } from "react-router-dom";
import ModalChairmanReject from "./ModalChairmanReject";
import CollapseTopic from "./CollapTopic";
import { Button } from "antd";
dayjs.extend(customParseFormat);
const dateFormat = "DD/MM/YYYY";

const ResubmitProject = () => {
  const [data, setDataUser] = useState({});
  const [isModalOpenR, setIsModalOpenR] = useState(false);
  const userId = localStorage.getItem("userId");
  const [dataReviewDocument, setDataReviewDocument] = useState([]);
  const [role, setRole] = useState("");
  const [status, setStatus] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  let topicId = location.pathname.split("/");
  topicId = topicId[4];
  const renderRole = () => {
    if (role == "Chairman" && dataReviewDocument[0].documents !== null) {
      return (
        <>
          <Button
            type="primary"
            className="btnOk"
            onClick={() => chairmanApproved(topicId)}
          >
            Đồng ý
          </Button>
          <Button
            type="primary"
            danger
            className="btnRe"
            onClick={() => {
              setDataUser(dataReviewDocument);
              setIsModalOpenR(true);
            }}
          >
            Từ chối
          </Button>
        </>
      );
    }
    return (
      <>
        <div style={{ marginTop: "20px" }}>
          <Button type="primary" onClick={() => navigate(-1)}>
            Quay lại
          </Button>
          <p style={{ fontWeight: "bold" }}>
            Chủ nhiệm đề tài chưa nộp lại tài liệu
          </p>
        </div>
      </>
    );
  };
  const chairmanApproved = async (topicId) => {
    try {
      const res = await chairmanApprove({
        topicId: topicId,
      });
      console.log('====================================');
      console.log(res);
      console.log('====================================');
      if (res && res.statusCode === 200) {
        if (status === true) {
          setStatus(false);
        } else {
          setStatus(true);
        }
      }
    } catch (error) {
      console.log("====================================");
      console.log("có lỗi tại chairman approve", error);
      console.log("====================================");
    }
  };
  const getReviewDoc = async () => {
    const res = await getReviewDocuments({
      userId: userId,
      topicId: topicId,
    });
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
              : null,
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
                  <p>Hạn nộp: {card.deadline}</p>
                  <p>
                    {" "}
                    <a target="_blank" href={card.resultFileLink}>
                      File kết quả của hội đồng
                    </a>
                  </p>
                  <CollapseTopic data={card.documents} />
                  {renderRole()}
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
      <ModalChairmanReject
        data={data}
        topicId={topicId}
        setDataUser={setDataUser}
        isModalOpen={isModalOpenR}
        setIsModalOpen={setIsModalOpenR}
      />
    </>
  );
};
export default ResubmitProject;
