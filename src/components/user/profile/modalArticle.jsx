import React, { useState } from "react";
import {
  Button,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  Modal,
  Row,
  Select,
  notification,
} from "antd";
import dayjs from "dayjs";
import { createArticle } from "../../../services/api";
const ArticalModal = (props) => {
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
        ...values,
        publishYear: dayjs(values.publishYear).format("YYYY"),
        numberOfPages: parseInt(values.numberOfPages),
        userId: props.userId,
      };
      const res = await createArticle(data);
      setLoading(true);
      if (res && res.statusCode === 200) {
        setLoading(false);
        notification.success({
          message: "Thông báo",
          description: "Thêm mới bài báo khoa học thành công",
        });
        props.getArtical();
        form.resetFields();
        handleCancel();
      }
    } catch (error) {
      console.log("Error at submit article: ", error);
    }
  };
  const { YearPicker } = DatePicker;

  return (
    <>
      <Modal
        maskClosable={false}
        open={props.openModal}
        title="Thêm mới các báo cáo chuyên đề"
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
            <Col span={12}>
              <Form.Item
                name="articleName"
                label="Tên sản phẩm"
                labelCol={{ span: 24 }}
                rules={[
                  {
                    required: true,
                    message: "Xin hãy nhập vào tên sản phẩm!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="authorName"
                label="Tên tác giả"
                labelCol={{ span: 24 }}
                rules={[
                  {
                    required: true,
                    message: "Xin hãy điền tên tác giả!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="publishYear"
                label="Năm xuất bản"
                labelCol={{ span: 24 }}
                rules={[
                  {
                    required: true,
                    message: "Xin hãy chọn năm xuất bản",
                  },
                ]}
              >
                <YearPicker
                  style={{ width: "100%" }}
                  placeholder="Chọn năm xuất bản"
                  picker="year"
                  format="YYYY"
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="numberOfPages"
                label="Số trang"
                labelCol={{ span: 24 }}
                rules={[
                  {
                    required: true,
                    message: "Xin hãy điền vào số trang",
                  },
                ]}
              >
                <Input type="number" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="fileLink"
                label="Đường dẫn bài báo"
                labelCol={{ span: 24 }}
                rules={[
                  {
                    required: true,
                    message: "Xin hãy thêm đường dẫn bài báo",
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
export default ArticalModal;
