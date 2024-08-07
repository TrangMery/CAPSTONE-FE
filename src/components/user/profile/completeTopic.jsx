import React, { useEffect, useState } from "react";
import {
  Button,
  ConfigProvider,
  Empty,
  Table,
  Tooltip,
  notification,
} from "antd";
import { BulbOutlined } from "@ant-design/icons";
import {
  getAllArticle,
  getAllCompletedTopics,
  getUserInformation,
} from "../../../services/api";
import dayjs from "dayjs";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import ViewDetailTopic from "./viewDetailTopic";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);
import "./Roboto-Regular";
const dateFormat = "DD/MM/YYYY";
import logo from "../../../assets/logoBV.png";
const CompletedTopic = ({checktab}) => {
  const [loading, setLoading] = useState(false);
  const [listTopic, setListTopic] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [topicId, setTopicId] = useState();
  const [isOwner, setIsOwner] = useState(false);
  const [listProduct, setListProduct] = useState([]);
  const [userProfile, setUserProfile] = useState();
  const userId = sessionStorage.getItem("userId");
  const getTopic = async () => {
    try {
      setLoading(true);
      const res = await getAllCompletedTopics({
        userId: userId,
      });
      if (res && res.statusCode === 200) {
        setListTopic(res.data);
        setLoading(false);
      }
    } catch (error) {
      console.log("====================================");
      console.log("có lỗi tại admin account", error);
      console.log("====================================");
    }
  };
  const getArtical = async () => {
    try {
      const res = await getAllArticle({
        UserId: userId,
      });
      if (res && res?.data) {
        const sortArticles = res.data.sort((a, b) => b.publishYear - a.publishYear);
        setListProduct(sortArticles);
      }
    } catch (error) {
      console.log("Có lỗi tại getArtical", error);
    }
  };
  const getAccountInfor = async () => {
    try {
      const res = await getUserInformation({
        UserId: userId,
      });

      if (res && res.statusCode === 200) {
        const customData = {
          ...res.data,
          birthday: dayjs(res.data.birthday).format(dateFormat),
          issue: dayjs(res.data.issue).format(dateFormat),
          sex: res.data.sex === "Male" ? "Nam" : "Nữ",
        };
        setUserProfile(customData);
      }
    } catch (error) {
      console.log("====================================");
      console.log("Có lỗi tại get account infor", error);
      console.log("====================================");
    }
  };
  const columns = [
    {
      title: "Mã đề tài",
      dataIndex: "code",
    },
    {
      title: "Tên đề tài",
      dataIndex: "topicName",
    },
    {
      title: "Lĩnh vực",
      dataIndex: "categoryName",
    },
    {
      title: "Ngày hoàn thành",
      render: (text, record, index) => {
        return <>{dayjs(record.completedDate).format("DD/MM/YYYY")}</>;
      },
      align: "center",
    },
    {
      title: "Hành động",
      render: (_, record) => {
        const style1 = {
          color: "blue",
          fontSize: "18px",
          cursor: "pointer",
          paddingTop: "2px",
        };
        return (
          <>
            <Tooltip title="Xem chi tiết">
              <BulbOutlined
                style={style1}
                onClick={() => {
                  setIsOpen(true);
                  setTopicId(record.topicId);
                  setIsOwner(record.isOwner);
                }}
              />
            </Tooltip>
          </>
        );
      },
      align: "center",
    },
  ];
  const renderHeader = () => (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {" "}
        <h2 style={{ fontWeight: "bold", fontSize: "20px", color: "#303972" }}>
          Danh sách các đề tài đã hoàn thành
        </h2>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: "#55E6A0",
            },
          }}
        >
          <Button
            type="primary"
            onClick={() => {
              handleExportFile();
            }}
          >
            Xuất hồ sơ cá nhân
          </Button>
        </ConfigProvider>
      </div>
    </div>
  );
  const handleExportFile = async () => {
    if (listTopic.length === 0) {
      notification.error({
        message: "Xuất hồ sơ không thành công",
        description: "Bạn chưa có đề tài để xuất hồ sơ",
      });
      return;
    }
    try {
      const doc = new jsPDF("p", "mm", "a4");
      doc.setFont("Roboto");

      // Header
      doc.setFontSize(16);
      doc.text("Lý lịch khoa học", 105, 15, { align: "center" });
      doc.addImage(logo, "png", 0, 0, 30, 20);

      // Personal Information
      doc.setFontSize(14);
      doc.text("I. LÝ LỊCH SƠ LƯỢC", 10, 40);
      doc.setFontSize(12);
      const fields = [
        { label: "Họ và tên:", value: userProfile.fullName },
        { label: "Ngày, tháng, năm sinh:", value: userProfile.birthday },
        { label: "Quê quán:", value: userProfile.homeTown },
        { label: "Học vị cao nhất:", value: userProfile.degree },
        {
          label: "Chức vụ (hiện tại hoặc trước khi nghỉ hưu):",
          value: userProfile.academicRank,
        },
        {
          label: "Đơn vị công tác (hiện tại hoặc trước khi nghỉ hưu):",
          value: userProfile.departmentName,
        },
        {
          label: "Chỗ ở riêng hoặc địa chỉ liên lạc:",
          value: userProfile.permanentAddress,
        },
        { label: "Điện thoại liên hệ:", value: "" },
        { label: "Giới tính:", value: userProfile.sex },
        { label: "Nơi sinh:", value: userProfile.birthPlace },
        { label: "Dân tộc:", value: userProfile.nationName },
        { label: "NR:", value: userProfile.phoneNumber },
        { label: "CQ:", value: userProfile.officePhoneNumber },
        { label: "Email:", value: userProfile.accountEmail },
      ];

      const positions = [
        { x: 10, y: 50 }, // Họ và tên
        { x: 10, y: 60 }, // Ngày, tháng, năm sinh
        { x: 10, y: 70 }, // Quê quán
        { x: 10, y: 80 }, // Học vị cao nhất
        { x: 10, y: 90 }, // Chức vụ
        { x: 10, y: 100 }, // Đơn vị công tác
        { x: 10, y: 110 }, // Chỗ ở riêng
        { x: 10, y: 120 }, // Điện thoại liên hệ
        { x: 100, y: 50 }, // Giới tính
        { x: 100, y: 60 }, // Nơi sinh
        { x: 100, y: 70 }, // Dân tộc
        { x: 45, y: 120 }, // NR
        { x: 80, y: 120 }, // CQ
        { x: 100, y: 80 }, // Email
      ];

      fields.forEach((field, index) => {
        const pos = positions[index];
        doc.text(`${field.label} ${field.value}`, pos.x, pos.y);
      });

      // Scientific Articles
      doc.setFontSize(14);
      doc.text("II. CÁC BÀI BÁO KHOA HỌC", 10, 140);



      let articleY = 150;
      listProduct.forEach((article, index) => {
        doc.setFontSize(12);
        doc.text(
          `${index + 1}. ${article.achievementName} (${article.publishYear})`,
          10,
          articleY
        );
        doc.setTextColor(0, 0, 255);
        doc.textWithLink("Đường dẫn", 150, articleY, { url: article.articleLink });
        doc.setTextColor(0, 0, 0);
        articleY += 10;
      });

      // Research Table
      doc.setFontSize(14);
      doc.text("III. CÁC NGHIÊN CỨU ĐÃ THAM GIA", 10, articleY + 10);

      const tableData = listTopic.map((item, index) => [
        index + 1,
        item.topicName,
        dayjs(item.completedDate).format("YYYY"),
        "Cơ sở",
        item.isOwner ? "Chủ nhiệm đề tài" : "Thành viên",
      ]);

      doc.autoTable({
        head: [
          [
            "STT",
            "Tên đề tài nghiên cứu",
            "Năm bắt đầu/Năm hoàn thành",
            "Đề tài cấp",
            "Trách nhiệm tham gia trong đề tài",
          ],
        ],
        body: tableData,
        startY: articleY + 20,
        theme: "striped",
        headStyles: { font: "Roboto" },
        bodyStyles: { font: "Roboto" },
      });

      const finalY = doc.lastAutoTable.finalY + 20;
      doc.setFontSize(12);
      doc.text("Xác nhận của cơ quan", 20, finalY);
      doc.text("......., ngày... tháng... năm...", 140, finalY);
      doc.text("Người khai ký tên", 150, finalY + 5);
      doc.setFontSize(10);
      doc.text("(Ghi rõ chức danh, học vị)", 146, finalY + 10);

      doc.save("ly_lich_khoa_hoc.pdf");
    } catch (error) {
      console.error("Error downloading or processing the file", error);
    }
  };
  // add state check tab to get newest data 
  useEffect(() => {
    getTopic();
    getAccountInfor();
    getArtical();
  }, [checktab]);
  const onChange = (pagination, filters, sorter, extra) => {
    if (pagination.current !== current) {
      setCurrent(pagination.current);
    }
    if (pagination.pageSize !== pageSize) {
      setPageSize(pagination.pageSize);
      setCurrent(1);
    }
    console.log("parms: ", pagination, filters, sorter, extra);
  };
  return (
    <div>
      {listTopic.length === 0 ? (
        <Empty
          style={{ marginTop: 100 }}
          description={<span>Chưa hoàn thành đề tài nào</span>}
        />
      ) : (
        <Table
          title={renderHeader}
          columns={columns}
          dataSource={listTopic}
          loading={loading}
          onChange={onChange}
          pagination={{
            current: current,
            pageSize: pageSize,
            showSizeChanger: true,
            pageSizeOptions: ["7", "10", "15"],
            showTotal: (total, range) => {
              return (
                <div>
                  {range[0]} - {range[1]} tên {total} hàng
                </div>
              );
            },
          }}
        />
      )}
      <ViewDetailTopic
        open={isOpen}
        setOpen={setIsOpen}
        topicId={topicId}
        isOwner={isOwner}
      />
    </div>
  );
};
export default CompletedTopic;
