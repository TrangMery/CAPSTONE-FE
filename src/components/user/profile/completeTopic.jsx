import React, { useEffect, useState } from "react";
import {
  Button,
  ConfigProvider,
  Empty,
  Space,
  Table,
  Tabs,
  Tag,
  Tooltip,
  message,
  notification,
} from "antd";
import { BulbOutlined, CloudDownloadOutlined } from "@ant-design/icons";
import axios from "axios";
import { exportFileCv, getAllCompletedTopics } from "../../../services/api";
import dayjs from "dayjs";
import ViewDetailTopic from "./viewDetailTopic";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);
import "./Roboto-Regular";
const dateFormat = "DD/MM/YYYY";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { saveAs } from "file-saver";
import { Base64 } from "js-base64";
const CompletedTopic = () => {
  const [loading, setLoading] = useState(false);
  const [listTopic, setListTopic] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [topicId, setTopicId] = useState();
  const [isOwner, setIsOwner] = useState(false);
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);
  const proxyUrl = "https://cors-anywhere.herokuapp.com/";
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
  const getFileCvNewest = async () => {
    try {
      const res = await exportFileCv({
        userId: userId,
      });
      if (res && res.statusCode === 200) {
        setFileUrl(proxyUrl + res.data);
      }
    } catch (error) {
      console.log("====================================");
      console.log("Có lỗi tại getFileCvNewest: ", error);
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
        {/* <ConfigProvider
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
        </ConfigProvider> */}
      </div>
    </div>
  );
  const loadFileFromUrl = async (url) => {
    try {
      const response = await axios.get(url, { responseType: "arraybuffer" });
      const zip = new PizZip(response.data);
      const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
      });
      setFile(doc);
    } catch (error) {
      console.error("Error loading DOCX file:", error);
    }
  };
  const handleExportFile = async () => {
    if (!fileUrl || listTopic.length === 0) {
      notification.error({
        message: "Xuất hồ sơ không thành công",
        description: "Bạn chưa có đề tài để xuất hồ sơ",
      });
      return;
    }
    try {
      const response = await axios.get(fileUrl, {
        responseType: "arraybuffer",
      });
      const zip = new PizZip(response.data);
      const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
      });

      const fullText = doc.getFullText();
      const tablePosition = fullText.indexOf(
        "Các đề tài nghiên cứu khoa học đã và đang tham gia:"
      );
      if (tablePosition !== -1) {
        const tableText = fullText.slice(tablePosition);
        const existingRows =
          tableText.split("\n").filter((row) => row.trim().length > 0).length -
          1; 
        const newRowText = listTopic
          .map(
            (item, index) =>
              `${existingRows + index + 1}\t${item.topicName}\t${dayjs(
                item.createdAt
              ).format("YYYY")}/${dayjs(item.completedDate).format(
                "YYYY"
              )}\t${"Cấp cơ sở"}\t${
                item.leaderName === null ? "Chủ nhiệm đề tài" : ""
              }`
          )
          .join("\n");
        const updatedTableText = `${tableText}\n${newRowText}`;
        doc.setData({ table: updatedTableText });
        doc.render();
      }

      const output = doc.getZip().generate({ type: "blob" });
      saveAs(output, "Ly_Lich_Khoa_Hoc.docx");
    } catch (error) {
      console.error("Error downloading or processing the file", error);
    }
  };
  useEffect(() => {
    getTopic();
    getFileCvNewest();
  }, []);
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
