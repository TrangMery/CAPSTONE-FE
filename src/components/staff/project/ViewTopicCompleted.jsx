import React, { useEffect, useState } from "react";
import { Table, Row, Col, Button, message, Tag } from "antd";
import { getAllTopics } from "../../../services/api";
import TopicSearchFormStaff from "./TopicSearchStaff";
import { CloudUploadOutlined } from "@ant-design/icons";
import * as ExcelJS from "exceljs";
import dayjs from "dayjs";
const ViewTopic = () => {
  const [loading, setLoading] = useState(false);
  const [listTopic, setListTopic] = useState();
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [filters, setFilters] = useState("");
  const [total, setTotal] = useState(0);
  const [subTotal, setSubTotal] = useState(0);
  const [state, setState] = useState("");
  const getAllTopic = async () => {
    try {
      setLoading(true);
      const res = await getAllTopics(filters);
      if (res && res.statusCode === 200) {
        setListTopic(res.data);
        setLoading(false);
        if (filters === "") {
          setTotal(res.data.length);
          setSubTotal(0);
        } else {
          setSubTotal(res.data.length);
        }
      }
    } catch (error) {
      console.log("====================================");
      console.log("có lỗi tại admin account", error);
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
      title: "Chủ nhiệm đề tài",
      dataIndex: "leaderName",
    },
    {
      title: "Lĩnh vực ",
      dataIndex: "categoryName",
    },
    {
      title: "Loại đề tài",
      sorter: (a, b) => {
        if (a.type < b.type) return -1;
        if (a.type > b.type) return 1;
        return 0;
      },
      render: (text, record, index) => {
        const content =
          record.topicType === "Internal" ? "Nội Khoa" : "Ngoại Khoa";
        const color = record.topicType === "Internal" ? "success" : "processing";
        return (
          <Tag
            style={{
              fontSize: "13px",
            }}
            color={color}
          >
            {content}
          </Tag>
        );
      },
      align: "center",
    },
    {
      title: "Trạng thái ",
      render: (text, record, index) => {
        const translations = {
          PreliminaryReview: "Đánh giá sơ bộ",
          EarlyTermReport: "Báo cáo đề cương",
          MidtermReport: "Báo cáo giữa kỳ",
          FinaltermReport: "Báo cáo cuối kỳ",
          EndingPhase: "Giai đoạn kết thúc",
        };
        const stateDescription =
          translations[record.state] || "Giai đoạn không xác định";
        return <div>{stateDescription}</div>;
      },
    },
  ];
  const handleSearchTopic = (query) => {
    setFilters(query);
  };
  const handleState = (state) => {
    setState(state);
  };
  const exportFile = async () => {
    if (listTopic.length > 0) {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Sheet1");

      // Định dạng cho header
      const headerStyle = {
        font: { bold: true, color: { argb: "FFFFFFFF" } },
        fill: {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FF42BC81" },
        },
        alignment: { horizontal: "center", vertical: "middle" },
        border: {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        },
      };

      // Các tiêu đề
      const headers = [
        "Mã đề tài",
        "Tên đề tài",
        "Chủ nhiệm đề tài",
        "Lĩnh vực ",
        "Ngày tạo",
      ];

      // Áp dụng tiêu đề và định dạng
      worksheet.addRow(headers).eachCell((cell, colNumber) => {
        cell.font = headerStyle.font;
        cell.fill = headerStyle.fill;
        cell.alignment = headerStyle.alignment;
        cell.border = headerStyle.border;
      });
      worksheet.columns = [
        { header: "Mã đề tài", key: "code", width: 10 },
        { header: "Tên đề tài", key: "topicName", width: 30 },
        { header: "Chủ nhiệm đề tài", key: "leaderName", width: 20 },
        { header: "Lĩnh vực ", key: "categoryName", width: 30 },
        { header: "Ngày tạo", key: "createdAt", width: 15 },
      ];
      listTopic.forEach((data, index) => {
        const rowIndex = index + 2; // Bắt đầu từ hàng thứ hai (sau header)
        worksheet.addRow({
          code: data.code,
          topicName: data.topicName,
          leaderName: data.leaderName,
          categoryName: data.categoryName,
          createdAt: dayjs(data.createdAt).format("DD/MM/YYYY"),
        });
      });

      const file = await workbook.xlsx.writeBuffer();

      // Xuất file ra
      const downloadLink = document.createElement("a");
      downloadLink.download = "Danh_sach_de_tai.xlsx"; // File name
      downloadLink.href = window.URL.createObjectURL(
        new Blob([file], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        })
      );
      downloadLink.style.display = "none";

      // Add the link to DOM
      document.body.appendChild(downloadLink);

      // "Click" the link
      downloadLink.click();

      // Remove the link from the DOM
      downloadLink.remove();
    } else {
      message.error("Không có đề tài để xuất file ");
    }
  };
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
          Danh sách đề tài
        </h2>
        <Button
          type="primary"
          icon={<CloudUploadOutlined />}
          onClick={() => exportFile()}
        >
          Xuất file
        </Button>
      </div>
      {subTotal === 0 ? (
        <p style={{ fontSize: "large" }}>Có tổng số {total} đề tài </p>
      ) : (
        <p style={{ fontSize: "large" }}>
          Có {subTotal} đề tài trên tổng số {total} đề tài ở giai đoạn {state}
        </p>
      )}
    </div>
  );
  useEffect(() => {
    getAllTopic();
  }, [filters]);
  const onChange = (pagination, filters, sorter, extra) => {
    if (pagination.current !== current) {
      setCurrent(pagination.current);
    }
    if (pagination.pageSize !== pageSize) {
      setPageSize(pagination.pageSize);
      setCurrent(1);
    }
  };
  const locale = {
    // Tùy chỉnh thông báo sắp xếp
    sortTitle: "Sắp xếp theo loại đề tài",
    triggerDesc: "Đề tài Nội Khoa",
    triggerAsc: "Đề tài Ngoại Khoa",
    cancelSort: "Hủy sắp xếp",
  };
  return (
    <>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <TopicSearchFormStaff
            handleSearchTopic={handleSearchTopic}
            handleState={handleState}
          />
        </Col>
        <Col span={24}>
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
            locale={locale}
          />
        </Col>
      </Row>
    </>
  );
};
export default ViewTopic;
