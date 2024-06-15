import "./card.scss";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { chairmanApprove, getReviewDocuments } from "../../../services/api";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useLocation, useNavigate } from "react-router-dom";
import ModalUpload from "./ModalResubmit";
import ModalChairmanReject from "./ModalChairmanReject";
import CollapseTopic from "./CollapTopic";
import { Button } from "antd";
dayjs.extend(customParseFormat);
const dateFormat = "DD/MM/YYYY";

const ResubmitProject = () => {
  const [data, setDataUser] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenR, setIsModalOpenR] = useState(false);
  const userId = localStorage.getItem("userId");
  const [dataReviewDocument, setDataReviewDocument] = useState([]);
  const [role, setRole] = useState("");
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
            onClick={() => chairmanApprove(topicId)}
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
    if (role == "Leader") {
      return (
        <Button
          className="btn"
          onClick={() => {
            setDataUser(dataReviewDocument);
            setIsModalOpen(true);
          }}
        >
          Tải tài liệu
        </Button>
      );
    }
    return (
      <>
        <div style={{ marginTop: "20px" }}>
          <p style={{ fontWeight: "bold" }}>
            Chủ nhiệm đề tài chưa nộp lại tài liệu
          </p>
        </div>
      </>
    );
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
      console.log("đây là data", res.data);
      setDataReviewDocument(data);
    }
  };

  useEffect(() => {
    getReviewDoc();
  }, []);
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
      <ModalUpload
        data={data}
        setDataUser={setDataUser}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
      <ModalChairmanReject
        data={data}
        setDataUser={setDataUser}
        isModalOpen={isModalOpenR}
        setIsModalOpen={setIsModalOpenR}
      />
    </>
  );
};
export default ResubmitProject;
