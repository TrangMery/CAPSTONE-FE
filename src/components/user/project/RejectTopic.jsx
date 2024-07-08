import React from 'react';
import { CloseCircleOutlined } from '@ant-design/icons';
import { Result, Typography } from 'antd';
const { Paragraph, Text } = Typography;
const RejectTopic = (props) => (
  <Result
    status="error"
    title="Đề tài đã kết thúc"
    subTitle="Nguyên nhân hiển thị bên dưới"
  >
    <div className="desc">
      <Paragraph>
        <Text
          strong
          style={{
            fontSize: 16,
          }}
        >
          Đề tài của bạn đã kết thúc theo lý do sau:
        </Text>
      </Paragraph>
      <Paragraph>
        <CloseCircleOutlined style={{color: "red"}}/> Trường phòng không thông qua
      </Paragraph>
    </div>
  </Result>
);
export default RejectTopic;