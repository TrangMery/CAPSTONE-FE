import React, { useEffect, useState } from "react";
import {
  Button,
  Checkbox,
  Col,
  ConfigProvider,
  Divider,
  Form,
  Input,
  Modal,
  Row,
  Upload,
  message,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import {
  getAllMembersByLeader,
  postLeaderSubmitFile,
  uploadFile,
} from "../../../services/api";
import * as XLSX from "xlsx";
import sample from "./sample.xlsx?url";
const UploadFileFinal = (props) => {
  const isModalOpen = props.isModalOpen;
  const [form] = Form.useForm();
  const [isSubmit, setIsSubmit] = useState(false);
  const [newTopicFiles, setFileList] = useState({});
  const [listMember, setListMember] = useState([]);
  const handleOk = () => {
    form.submit();
  };
  const handleCancel = () => {
    props.setIsModalOpen(false);
    setFileList({});
  };
  const getAllMenber = async () => {
    try {
      const res = await getAllMembersByLeader({
        TopicId: props.topicId,
        LeaderId: props.leaderId,
      });
      if (res && res.statusCode === 200) {
        const newList = res.data.map((item) => {
          if (item.id === props.leaderId) {
            return { ...item, role: "Chủ nhiệm nhiệm vụ" };
          } else {
            return { ...item, role: "Thành viên" };
          }
        });
        setListMember(newList);
      }
    } catch (error) {
      console.log("====================================");
      console.log("có lỗi tại get all member:", error);
      console.log("====================================");
    }
  };
  const handleExport = async () => {
    try {
      // Đọc file Excel mẫu
      const response = await fetch(sample);
      const arrayBuffer = await response.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: "array" });

      const worksheet = workbook.Sheets[workbook.SheetNames[0]];

      listMember.forEach((list, index) => {
        const rowIndex = index + 2;
        worksheet[`B${rowIndex}`] = { v: list.fullName }; // Cột B
        worksheet[`C${rowIndex}`] = { v: list.role }; // Cột C
      });

      // Lấy thông tin về kích thước cột và hàng từ file gốc
      const originalSheet = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      const cols = [];
      originalSheet[0].forEach((_, colIndex) => {
        let width = 20; // Đặt mặc định là 20 nếu không có thông tin về kích thước cột
        if (worksheet["!cols"] && worksheet["!cols"][colIndex]) {
          width = worksheet["!cols"][colIndex].w;
        }
        cols.push({ wch: width });
      });
      const range = XLSX.utils.decode_range(worksheet["!ref"]);
      const rows = range.e.r - range.s.r + 1;

      // Áp dụng kích thước cột và hàng vào worksheet mới
      worksheet["!cols"] = cols;
      worksheet["!ref"] = XLSX.utils.encode_range({
        s: { c: 0, r: 0 },
        e: { c: cols.length - 1, r: rows - 1 },
      });

      // Chuyển đổi lại workbook thành file Excel
      const updatedArrayBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

      // Tạo link để tải file
      const blob = new Blob([updatedArrayBuffer], {
        type: "application/octet-stream",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "thulao.xlsx";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error exporting to Excel:", error);
    }
  };

  const onSubmit = async () => {
    if (Object.values(newTopicFiles).length === 0) {
      message.error("Xin hãy tải file lên");
      return;
    }
    const data = {
      topicId: props.topicId,
      remunerationName: newTopicFiles.fileName,
      remunerationLink: newTopicFiles.fileLink,
    };
    try {
      const res = await postLeaderSubmitFile(data);
      setIsSubmit(true);
      if (res && res.statusCode === 200) {
        setIsSubmit(false);
        message.success("Tải file lên thành công");
        handleCancel();
        if (props.status) {
          props.setStatus(false);
        } else {
          props.setStatus(true);
        }
      }
    } catch (error) {
      console.log("====================================");
      console.log("có lỗi tại upload result", error);
      console.log("====================================");
    }
  };
  const propsUpload = {
    name: "file",
    multiple: false,
    maxCount: 1,
    newTopicFiles,
    customRequest: async ({ file, onSuccess, onError }) => {
      try {
        const isCompressedFile =
          file.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
        if (!isCompressedFile) {
          message.error("Chỉ được phép tải lên file có định dạng xlsx");
          onError(file);
          return;
        }
        const response = await uploadFile(file);
        if (response.data.fileLink === null) {
          onError(response, file);
          message.error(`${file.name} file tải lên không thành công.`);
        } else {
          setFileList({
            fileName: response.data.fileName,
            fileLink: response.data.fileLink,
          });
          // Gọi onSuccess để xác nhận rằng tải lên đã thành công
          onSuccess(response, file);
          // Hiển thị thông báo thành công
          message.success(`${file.name} file tải lên thành công.`);
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
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };
  useEffect(() => {
    if (props.isModalOpen === true) {
      getAllMenber();
    }
  }, [props.isModalOpen]);
  return (
    <>
      <Modal
        title="Nộp file tổng kết"
        centered
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={isSubmit}
        maskClosable={false}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Quay về
          </Button>,
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: "#41C221",
              },
            }}
          >
            <Button
              type="primary"
              onClick={handleOk}
              disabled={Object.values(newTopicFiles).length === 0}
            >
              Gửi
            </Button>
          </ConfigProvider>,
        ]}
      >
        <Divider />
        <Form form={form} name="basic" onFinish={onSubmit}>
          <Row gutter={20}>
            <>
              <Col span={24}>
                <p>File mẫu tham khảo (file đã tích hợp công thức tính):</p>
                <Button onClick={handleExport}>Xuất file thành viên</Button>
              </Col>
            </>

            <Divider />
            <Col span={24}>
              <Form.Item
                name="file"
                label="Chỉ hỗ trợ file xlsx"
                labelCol={{ span: 24 }}
              >
                <Upload {...propsUpload}>
                  <Button icon={<UploadOutlined />}>Tải lên</Button>
                </Upload>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};
export default UploadFileFinal;
