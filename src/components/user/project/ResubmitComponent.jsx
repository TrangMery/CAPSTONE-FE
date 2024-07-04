import "./card.scss";
import CollapseTopic from "./CollapTopic";

const ResubmitComponent = ({
  data,
  role,
  setStatus,
  topicId,
  setIsModalOpenR,
}) => {
  const renderRole = () => {
    return (
      <>
        {data.length === 0 ? (
          <p style={{ fontWeight: "bold" }}>
            Chủ nhiệm đề tài chưa nộp lại tài liệu
          </p>
        ) : (
          ""
        )}
      </>
    );
  };
  return (
    <section>
      <div className="container1">
        <div className="cards">
          <div className="card">
            <h2
              style={{
                fontWeight: "bold",
                fontSize: "20px",
                color: "#303972",
                marginBottom: "10px",
              }}
            >
              {data.state === 1 ? "Giai đoạn đầu kỳ" : "Giai đoạn cuối kỳ"}
            </h2>
            {data.decisionOfCouncil === "Accept" ? (
              <p>Đề tài đã được thông qua</p>
            ) : (
              <p>Hạn nộp: {data.deadline}</p>
            )}

            <p>
              {" "}
              <a target="_blank" href={data.resultFileLink}>
                File kết quả của hội đồng
              </a>
            </p>
            <CollapseTopic
              data={data.documents}
              state={data.state}
              setIsModalOpen={setIsModalOpenR}
              topicId={topicId}
              setStatus={setStatus}
              role={role}
            />
            {renderRole()}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResubmitComponent;
