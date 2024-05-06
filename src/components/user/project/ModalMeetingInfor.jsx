import { Button, Col, Divider, Form, Input, Modal, Row } from "antd";
import { useEffect, useState } from "react";
import { getInforMeetingForCouncil } from "../../../services/api";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);
const dateFormat = "DD/MM/YYYY";

const ModalMeetingInfor = (props) => {
  const isModalOpen = props.isModalOpen;
  const [form] = Form.useForm();
  const topicId = props.data.topicId;
  const userId = "5b5e31b2-cb63-47c7-b92a-129e15a2b2e3";
  const handleCancel = () => {
    props.setIsModalOpen(false);
  };
  const getTopicDetail = async () => {
    try {
      const res = await getInforMeetingForCouncil({
        topicId: topicId,
        userId: userId,
      });
      if (res && res.isSuccess) {
        const data = {
            topicName:res.data.topicName,
            meetingTime: dayjs(res.data.reviewMeetingInfors[0].meetingTime).format(dateFormat),
            meetingDetail: res.data.reviewMeetingInfors[0].meetingDetail,
        }
        form.setFieldsValue(data);
      }
    } catch (error) {
      console.log("Error getting topic detail: ", error);
    }
  };
  // set up initial value for the form
  useEffect(() => {
    getTopicDetail();
  }, [isModalOpen === true]);
  return (
    <>
      <Modal
        title="Thông tin cuộc họp"
        centered
        open={isModalOpen}
        onCancel={handleCancel}
        maskClosable={false}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Thoát
          </Button>,
        ]}
      >
        <Divider />
        <Form form={form} name="basic">
          <Row gutter={20}>
            <Col span={24}>
              <Form.Item
                name="topicName"
                label="Tên đề tài"
                labelCol={{ span: 24 }}
              >
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="meetingTime"
                label="Ngày họp"
                labelCol={{ span: 24 }}
              >
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="meetingDetail"
                label="Ghi chú cho cuộc họp"
                labelCol={{ span: 24 }}
              >
                <Input disabled />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};
export default ModalMeetingInfor;
