import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { Collapse, Divider } from "antd";
import { useEffect, useState } from "react";

const CollapseTopic = ({ data = [] }) => {
  const [itemsCollapse, setItemsCollapse] = useState([]);
  const renderExtra = (status) => {
    if (status === true) {
      return <CheckOutlined style={{ color: "green" }} />;
    } else {
      return <CloseOutlined  style={{ color: "red" }} />;
    }
  };
  useEffect(() => {
    if (!data && !data?.length) return;

    const newData = data.map((items, index) => ({
      key: index,
      label: "Nộp lại lần " + [index + 1],
      children: [
        <>
          <div>
            <p style={{ margin: 0 }} key={index}>
              File nộp lại:
            </p>
            <a target="_blank" href={items.documentFileLink}>
              {items.documentFileLink}
            </a>
            <Divider />
          </div>
          <p>
            Quyết định của chủ tịch hội đồng:{" "}
            {items.isAccepted ? "Đồng ý" : "Không đồng ý"} <br />
            <a target="_blank" href={items.feedbackFileLink}>
              File góp ý
            </a>
          </p>
        </>,
      ],
      extra: renderExtra(items.isAccepted),
    }));
    setItemsCollapse(newData);
  }, [data]);

  return <Collapse items={itemsCollapse} />;
};
export default CollapseTopic;
