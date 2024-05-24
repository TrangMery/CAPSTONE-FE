import React, { useState } from "react";
import { Button, Col, Divider, Form, Input, Modal, Row, Select, message } from "antd";
import { addFileType } from "../../services/api";

const FileModal = (props) => {
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
        typeName: values.name,
        state: values.state,
      };
      const res = await addFileType(data);
      setLoading(true);
      if (res && res.statusCode === 200) {
        message.success("Thêm mới loại file thành công");
        setLoading(false);
        props.getFile();
        form.resetFields();
        handleCancel();
      }
    } catch (error) {
      console.log("====================================");
      console.log("Có lỗi tại đăng kí department", error);
      console.log("====================================");
    }
  };
  return (
    <>
      <Modal
        maskClosable={false}
        open={props.openModal}
        title="Thêm mới loại file"
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
                label="Tên loại file"
                labelCol={{ span: 24 }}
                rules={[
                  {
                    required: true,
                    message: "Xin hãy nhập vào tên loại file!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="state"
                label="Thuộc giai đoạn"
                labelCol={{ span: 24 }}
                rules={[
                  {
                    required: true,
                    message: "Xin hãy chọn giai đoạn!",
                  },
                ]}
              >
                <Select
                  placeholder="Chọn giai đoạn"
                  style={{
                    width: 150,
                  }}
                  options={[
                    {
                      value: "0",
                      label: "Sơ duyệt",
                    },
                    {
                      value: "1",
                      label: "Đầu kỳ",
                    },
                    {
                      value: "2",
                      label: "Giữa kỳ",
                    },
                    {
                      value: "3",
                      label: "Cuối kỳ",
                    },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};
export default FileModal;
