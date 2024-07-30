import React, { useState } from "react";
import { Tabs } from "antd";
import ScientificArticle from "./scientificArticle";
import CompletedTopic from "./completeTopic";
const ProductPage = () => {
  const [checktab, setCheckTab] = useState("")
  const items = [
    {
      key: "1",
      label: "Bài báo và báo cáo",
      children: <ScientificArticle />,
    },
    {
      key: "2",
      label: "Đề tài đã hoàn thành",
      children: <CompletedTopic checktab={checktab}/>,
    },
  ];
  return (
    <div>
      <Tabs
        defaultActiveKey="1"
        tabPosition="left"
        style={{
          height: 220,
        }}
        onChange={(value) => {
          setCheckTab(value)
        }}
        items={items}
      />
    </div>
  );
};
export default ProductPage;
