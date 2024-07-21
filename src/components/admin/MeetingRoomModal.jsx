import React, { useState } from "react";
import { Button, Col, Divider, Form, Input, Modal, Row, message } from "antd";
import { createMeetingRoom } from "../../services/api";

const MeetingRoomModal = (props) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const handleOk = () => {
    form.submit();
  };
  const handleCancel = () => {
    props.setOpenModal(false);
  };
  const onSubmit = async (values) => {
    try {
      const data = {
        roomName: values.name,
      };
      const res = await createMeetingRoom(data);

      setLoading(true);
      if (res && res.statusCode === 200) {
        message.success("Thêm mới phòng họp thành công");
        setLoading(false);
        props.getMeetingRoomApi();
        form.resetFields();
        handleCancel();
      }
    } catch (error) {
      console.log("====================================");
      console.log("Có lỗi tại đăng kí meeting room", error);
      console.log("====================================");
    }
  };
  return (
    <>
      <Modal
        maskClosable={false}
        open={props.openModal}
        title="Thêm mới phòng họp"
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Quay về
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={handleOk}
          >
            Xác nhận
          </Button>,
        ]}
      >
        <Divider />
        <Form
          form={form}
          name="basic"
          style={{ maxWidth: 600 }}
          onFinish={onSubmit}
        >
          <Row gutter={20}>
            <Col span={24}>
              <Form.Item
                name="name"
                label="Tên phòng họp"
                labelCol={{ span: 24 }}
                rules={[
                  {
                    required:  true,
                    message: "Xin hãy nhập vào tên phòng họp!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};
export default MeetingRoomModal;
