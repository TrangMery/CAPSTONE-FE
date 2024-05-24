import React, { useState } from "react";
import { Button, Col, Divider, Form, Input, Modal, Row, Select, message } from "antd";
import { addContractType } from "../../services/api";

const ContractModal = (props) => {
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
        state: 0,
      };
      const res = await addContractType(data);
      setLoading(true);
      if (res && res.statusCode === 200) {
        message.success("Thêm mới loại hợp đồng thành công");
        setLoading(false);
        props.getContract();
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
        title="Thêm mới hợp đồng"
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
                label="Tên loại hợp đồng"
                labelCol={{ span: 24 }}
                rules={[
                  {
                    required: true,
                    message: "Xin hãy nhập vào tên loại hợp đồng!",
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
export default ContractModal;
