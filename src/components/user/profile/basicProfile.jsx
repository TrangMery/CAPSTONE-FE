import {
  Button,
  Checkbox,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  Row,
  Select,
} from "antd";
import React, { useState } from "react";
import "./basicProfile.scss";
import { EditOutlined } from "@ant-design/icons";
const BasicProfile = () => {
  const { TextArea } = Input;
  const [form] = Form.useForm();
  const [componentDisabled, setComponentDisabled] = useState(true);
  return (
    <>
      <div className="header">
        <h3>Thông tin các nhân</h3>
        <Button
          type="primary"
          icon={<EditOutlined />}
          onClick={() => setComponentDisabled(!componentDisabled)}
        >
          {componentDisabled ? "Chỉnh sửa " : "Hủy bỏ"}
        </Button>
      </div>

      <Divider />
      <div className="parent-container">
        <div className="form-container">
          <Form
            form={form}
            name="basic"
            layout="vertical"
            disabled={componentDisabled}
            style={{ maxWidth: "700px" }}
          >
            <Row gutter={10}>
              <Col span={12}>
                <Form.Item name="name" label="Họ và Tên">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="birth" label="Ngày tháng năm sinh">
                  <DatePicker className="datePickProfile" placeholder="Chọn ngày" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="birthAt" label="Nơi sinh">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="hometown" label="Quê Quán">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="nation" label="Dân tộc">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="gender"
                  label="Giới tính"
                  rules={[
                    {
                      required: true,
                      message: "Xin hãy chọn giới tính!",
                    },
                  ]}
                >
                  <Select placeholder="Xin hãy lựa chọn giới tính">
                    <Option value="male">Nam</Option>
                    <Option value="female">Nữ</Option>
                    <Option value="other">Khác</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="email" label="Email">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="phone" label="Số điện thoại">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="phoneCp" label="Số điện thoại cơ quan">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="taxNumber" label="Mã số thuế">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="address" label="Địa chỉ thường trú">
                  <TextArea
                    autoSize={{
                      minRows: 2,
                      maxRows: 5,
                    }}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="addressNow" label="Chỗ ở hiện nay">
                  <TextArea
                    autoSize={{
                      minRows: 2,
                      maxRows: 5,
                    }}
                  />
                </Form.Item>
              </Col>
              <Button type="primary">Cập nhật thông tin</Button>
            </Row>
          </Form>
        </div>
      </div>
    </>
  );
};

export default BasicProfile;
