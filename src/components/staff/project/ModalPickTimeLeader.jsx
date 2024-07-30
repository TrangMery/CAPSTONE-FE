import { CheckCircleFilled, UploadOutlined } from "@ant-design/icons";
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
  Select,
  Steps,
  Tag,
  Upload,
  message,
  notification,
} from "antd";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  councilConfigEarly,
  councilConfigFinalterm,
  councilConfigMidterm,
  getMeetingRoom,
  uploadFile,
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
  const [meetingRoom, setMeetingRoom] = useState("");
  const [room, setRoom] = useState([]);
  const [council, setCouncil] = useState([]);
  const [newTopicFiles, setFileList] = useState({});
  const [errorMessage, setError] = useState("");
  const location = useLocation();
  const meetingStartTime = dayjs.utc(props.meetingTime.meetingStartTime);
  const meetingEndTime = dayjs.utc(props.meetingTime.meetingEndTime);
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
  const getMeetingRoomApi = async () => {
    try {
      const res = await getMeetingRoom({
        startTime: meetingStartTime,
        endTime: meetingEndTime,
      });
      if (res && res.statusCode === 200) {
        const newData = res.data.map((item) => ({
          value: item.roomId,
          label: item.roomName,
        }));
        setRoom(newData);
      }
    } catch (error) {
      console.log("Có lỗi tại getMeetingRoom: ", error);
    }
  };
  const handleDetailsChange = (e) => {
    setMeetingDetails(e.target.value);
  };
  const handleRoomChange = (data) => {
    setMeetingRoom(data);
  };
  const translate = (key) => {
    const item = room.find((item) => item.value === key);
    return item ? item.label : undefined;
  };

  const propsUpload = {
    name: "file",
    multiple: false,
    maxCount: 1,
    customRequest: async ({ file, onSuccess, onError }) => {
      try {
        const isCompressedFile =
          file.type ===
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
          file.type === "application/pdf";
        if (!isCompressedFile) {
          message.error("Chỉ được phép tải lên các file docx hoặc pdf!");
          setError("Chỉ được phép tải lên các file docx hoặc pdf!");
          onError(file);
          return;
        }
        const response = await uploadFile(file);
        if (response.data.fileLink === null) {
          onError(response, file);
          message.error(`${file.name} file tải lên không thành công!.`);
        } else {
          setFileList({
            fileName: response.data.fileName,
            fileLink: response.data.fileLink,
          });
          // Gọi onSuccess để xác nhận rằng tải lên đã thành công
          onSuccess(response, file);
          // Hiển thị thông báo thành công
          message.success(`${file.name} tải lên thành công.`);
        }
      } catch (error) {
        // Gọi onError để thông báo lỗi nếu có vấn đề khi tải lên
        onError(error);
        // Hiển thị thông báo lỗi
        message.error(`${file.name} file tải lên thất bại.`);
      }
    },
    onRemove: (file) => {
      setFileList({});
      setError("");
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };
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
                <p>Chọn phòng họp</p>
                <Select
                  style={{ width: 200 }}
                  onChange={handleRoomChange}
                  options={room}
                />
              </Col>
              <Col span={24}>
                <p>Chỉ hỗ trợ cái file như docx hoặc pdf</p>
                <Upload {...propsUpload}>
                  <Button icon={<UploadOutlined />}>Tải file minh chứng </Button>
                </Upload>
                {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
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
                    <Tag color="success">Chủ tịch hội đồng</Tag>
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
                Phòng họp: {translate(meetingRoom)}
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
    } else if (current === 1 && meetingRoom === "") {
      message.error("Vui lòng chọn phòng họp trước khi tiếp tục.");
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
      creationCouncilDirectiveFile: newTopicFiles.fileLink,
      roomId: meetingRoom,
    };
    console.log(data);
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
  useEffect(() => {
    getMeetingRoomApi();
  }, []);

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
