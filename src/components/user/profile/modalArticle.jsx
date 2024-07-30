import React, { useState } from "react";
import {
  Button,
  Col,
  ConfigProvider,
  Divider,
  DatePicker,
  Form,
  Input,
  Modal,
  Row,
  notification,
} from "antd";
import dayjs from "dayjs";
import { createArticle } from "../../../services/api";
const ArticalModal = (props) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const userId = sessionStorage.getItem("userId");
  const { YearPicker } = DatePicker;
  const handleOk = () => {
    form.submit();
  };
  const handleCancel = () => {
    props.setOpenModal(false);
  };
  const onSubmit = async (values) => {
    try {
      const data = {
        userId: userId,
        achievementName: values.achievementName,
        publishYear: dayjs(values.publishYear).format("YYYY"),
        articleLink: values.articleLink,
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
  return (
    <>
      <Modal
        maskClosable={false}
        open={props.openModal}
        title="Thêm mới bài báo khoa học"
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Quay về
          </Button>,
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: "#41C221",
              },
            }}
          >
            <Button
              key="submit"
              type="primary"
              loading={loading}
              onClick={handleOk}
            >
              Xác nhận
            </Button>
            ,
          </ConfigProvider>,
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
                name="achievementName"
                label="Tên bài báo khoa học"
                labelCol={{ span: 24 }}
                rules={[
                  {
                    required: true,
                    message: "Xin hãy thêm tên bài báo khoa học",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="publishYear"
                label="Năm báo cáo"
                labelCol={{ span: 24 }}
                rules={[
                  { required: true, message: "Xin hãy chọn năm báo cáo" },
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
            <Col span={24}>
              <Form.Item
                name="articleLink"
                label="Link bài báo khoa học"
                labelCol={{ span: 24 }}
                rules={[
                  {
                    required: true,
                    message: "Xin hãy nhập link bài báo",
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
