import { CheckCircleFilled } from "@ant-design/icons";
import { MdAccessTime } from "react-icons/md";
import { FaUserTie } from "react-icons/fa";
import {
  Button,
  Col,
  Divider,
  Form,
  Input,
  List,
  Modal,
  Radio,
  Row,
  Steps,
  message,
  notification,
} from "antd";
import { DatePicker } from "antd";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  councilConfigEarly,
  councilConfigFinalterm,
  councilConfigMidterm,
  getAllHoliday,
} from "../../../services/api";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);
const { TextArea } = Input;
const styles = {
  meetingInfo: {
    marginBottom: "10px",
  },
  label: {
    fontWeight: "bold",
    marginRight: "10px",
  },
  value: {
    color: "#555",
  },
};

const ModalPickTimeLeader = (props) => {
  const isModalOpen = props.isModalOpen;
  const [selectedLeader, setSelectedLeader] = useState(null);
  const [meetingDetails, setMeetingDetails] = useState("");
  const [council, setCouncil] = useState([]);
  const location = useLocation();
  let path = location.pathname.split("/");
  let topicId = path[4];
  let checkTerm = path[2];
  const navigate = useNavigate();
  const handleRadioChange = (itemId) => {
    const updatedDataUser = props.dataUser.map((user) => ({
      ...user,
      isChairman: user.id === itemId,
    }));
    setSelectedLeader(itemId);
    setCouncil(updatedDataUser);
  };

  const handleDetailsChange = (e) => {
    setMeetingDetails(e.target.value);
  };
  const meetingStartTime = dayjs.utc(props.meetingTime.meetingStartTime);
  const meetingEndTime = dayjs.utc(props.meetingTime.meetingEndTime);
  const steps = [
    {
      title: "Lựa chọn chủ tịch hội đồng",
      content: (
        <>
          <div>
            {" "}
            <List
              dataSource={props.dataUser}
              bordered
              renderItem={(item) => (
                <List.Item>
                  <Radio
                    value={item.id}
                    checked={selectedLeader === item.id}
                    onChange={() => handleRadioChange(item.id)}
                  >
                    {item.fullName} - {item.position} - {item.degree}
                  </Radio>
                </List.Item>
              )}
            />
          </div>
        </>
      ),
      icon: <FaUserTie />,
    },
    {
      title: "Phòng họp",
      content: (
        <>
          {" "}
          <div>
            <Divider />
            <Row gutter={[20, 20]} align={"middle"} style={{ padding: "20px" }}>
              <Col span={8}>
                <div className="meeting-info" style={styles.meetingInfo}>
                  <p className="label" style={styles.label}>
                    Ngày họp:
                  </p>
                  <p className="value" style={styles.value}>
                    {dayjs(props.meetingTime.meetingStartTime).format(
                      "DD/MM/YYYY"
                    )}
                  </p>
                </div>
              </Col>
              <Col span={8}>
                <div className="meeting-info" style={styles.meetingInfo}>
                  <p className="label" style={styles.label}>
                    Giờ họp:
                  </p>
                  <p className="value" style={styles.value}>
                    {meetingStartTime.format("HH:mm")}
                  </p>
                </div>
              </Col>
              <Col span={8}>
                <div className="meeting-info" style={styles.meetingInfo}>
                  <p className="label" style={styles.label}>
                    Giờ kết thúc:
                  </p>
                  <p className="value" style={styles.value}>
                    {meetingEndTime.format("HH:mm")}
                  </p>
                </div>
              </Col>
              <Col span={24}>
                <Form.Item
                  name="details"
                  label="Chi tiết"
                  labelCol={{ span: 24 }}
                >
                  <TextArea
                    autoSize={{
                      minRows: 3,
                      maxRows: 5,
                    }}
                    onChange={handleDetailsChange}
                  />
                </Form.Item>
              </Col>
            </Row>
          </div>
        </>
      ),
      icon: <MdAccessTime />,
    },
    {
      title: "Xác nhận lại thông tin",
      content: (
        <>
          <div>
            {" "}
            <p style={{ fontSize: "18px", marginBottom: "8px" }}>
              Danh sách thành viên hội đồng
            </p>
            <List
              dataSource={council}
              bordered
              renderItem={(item) => (
                <List.Item
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  {item.fullName} - {item.position} - {item.degree}{" "}
                  {item.isChairman ? (
                    <span style={{ color: "red" }}> Chủ tịch hội đồng</span>
                  ) : null}
                </List.Item>
              )}
            />
            <div style={{ marginTop: "8px" }}>
              <p style={{ fontSize: "18px", marginBottom: "8px" }}>
                Ngày và giờ họp:{" "}
                {dayjs(props.meetingTime.meetingStartTime).format("DD/MM/YYYY")}{" "}
                {""}
                {meetingStartTime.format("HH:mm")} -{" "}
                {meetingEndTime.format("HH:mm")}
              </p>

              <p style={{ fontSize: "18px", marginBottom: "8px" }}>
                Chi tiết: {meetingDetails}
              </p>
            </div>
          </div>
        </>
      ),
      icon: <CheckCircleFilled />,
    },
  ];
  const [current, setCurrent] = useState(0);
  const next = () => {
    if (current === 0 && selectedLeader === null) {
      message.error("Vui lòng chọn chủ tịch hội đồng trước khi tiếp tục.");
      return;
    } else if (current === 1 && meetingDetails === "") {
      message.error("Vui lòng chọn ngày và nhập chi tiết trước khi tiếp tục.");
      return;
    }
    setCurrent(current + 1);
  };
  const prev = () => {
    setCurrent(current - 1);
  };
  const items = steps.map((item) => ({
    key: item.title,
    icon: item.icon,
  }));
  const handleCancel = () => {
    props.setIsModalOpen(false);
  };
  const handleSubmit = async () => {
    const councilArray = council.map((user) => ({
      councilId: user.id,
      isChairman: user.isChairman,
    }));

    const data = {
      topicId: topicId,
      meetingTime: props.meetingTime.meetingStartTime,
      councils: councilArray,
      meetingDetail: meetingDetails,
      meetingDuration: props.meetingDuration,
    };
    let res;
    try {
      if (checkTerm === "earlyterm") {
        res = await councilConfigEarly(data).catch((error) => {
          console.error("Lỗi trong councilConfigEarly:", error);
          throw error;
        });
      } else if (checkTerm === "midterm") {
        res = await councilConfigMidterm(data).catch((error) => {
          console.error("Lỗi trong councilConfigMidterm:", error);
          throw error;
        });
      } else if (checkTerm === "finalterm") {
        res = await councilConfigFinalterm(data).catch((error) => {
          console.error("Lỗi trong councilConfigFinalterm:", error);
          throw error;
        });
      }
      if (res && res.statusCode === 200) {
        message.success("Lập hội đồng đánh giá thành công");
        navigate("/staff/upload-document");
      } else {
        notification.error({
          description: "Tạo hội đồng không thành công, vui lòng tạo lại sau",
          message: "Tạo hội đồng",
        });
      }
    } catch (error) {
      console.log("Lỗi tại tạo hội đồng: ", error.message);
    }
  };

  return (
    <>
      <Modal
        title={steps[current].title}
        open={isModalOpen}
        onCancel={handleCancel}
        maskClosable={false}
        footer={[
          <div>
            {current > 0 && (
              <Button
                style={{
                  margin: "0 8px",
                }}
                onClick={() => prev()}
              >
                Quay lại
              </Button>
            )}
            {current < steps.length - 1 && (
              <Button type="primary" onClick={() => next()}>
                Tiếp tục
              </Button>
            )}

            {current === steps.length - 1 && (
              <Button type="primary" onClick={handleSubmit}>
                Xác nhận
              </Button>
            )}
          </div>,
        ]}
      >
        <Steps current={current} items={items} />
        {steps[current].content}
      </Modal>
    </>
  );
};
export default ModalPickTimeLeader;
