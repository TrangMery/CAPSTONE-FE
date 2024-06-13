import React from "react";
import { Drawer } from "antd";

const ReviewCvFile = ({ url, setOpen, open }) => {
  const onClose = () => {
    setOpen(false);
  };
  const googleDocsUrl = `https://view.officeapps.live.com/op/view.aspx?src=${url}`;
  return (
    <div>
      <Drawer
        title="Xem hồ sơ chủ nhiệm"
        placement="right"
        width={700}
        onClose={onClose}
        open={open}
        bodyStyle={{ padding: 0 }}
        style={{ overflowX: "hidden" }}
      >
        <iframe
          src={googleDocsUrl}
          style={{ width: "100%", height: "100%", border: "none" }}
        />
      </Drawer>
    </div>
  );
};

export default ReviewCvFile;
