import React, { useState } from "react";
import { Tabs } from "antd";
import ScientificArticle from "./scientificArticle";
import CompletedTopic from "./completeTopic";
const ProductPage = () => {
  const items = [
    {
      key: "1",
      label: "Báo cáo chuyên đề",
      children: <ScientificArticle />,
    },
    {
      key: "2",
      label: "Đề tài đã hoàn thành",
      children: <CompletedTopic/>,
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
        items={items}
      />
    </div>
  );
};
export default ProductPage;
