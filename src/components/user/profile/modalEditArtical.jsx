import React, { useState } from "react";
import {
  Button,
  Col,
  Divider,
  Form,
  Input,
  Modal,
  Row,
  notification,
} from "antd";
import { updateArticle } from "../../../services/api";
const ArticalEditModal = (props) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const handleOk = () => {
    form.submit();
  };
  const handleCancel = () => {
    props.setProduct();
    props.setOpenModal(false);
  };
  const onSubmit = async (values) => {
    try {
      const res = await updateArticle(values);
      setLoading(true);
      if (res && res.statusCode === 200) {
        setLoading(false);
        notification.success({
          message: "Thông báo",
          description: "Chỉnh sửa bài báo khoa học thành công",
        });
        props.getArtical();
        form.resetFields();
        handleCancel();
      }
    } catch (error) {
      console.log("Error at submit article: ", error);
    }
  };
  if (props.product !== undefined) {
    form.setFieldsValue(props.product);
  }
  return (
    <>
      <Modal
        maskClosable={false}
        open={props.openModal}
        title="Chỉnh sửa bài báo khoa học"
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
            Cập nhật
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
                name="newsName"
                label="Tên bài báo khoa học"
                labelCol={{ span: 24 }}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="link"
                label="Link bài báo khoa học"
                labelCol={{ span: 24 }}
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
export default ArticalEditModal;
