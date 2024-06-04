import { Button, Col, Divider, Form, Input, Row } from "antd";
import React, { useEffect, useState } from "react";
import "./basicProfile.scss";
import { getAllDepartment, getUserInformation } from "../../../services/api";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);
const dateFormat = "DD/MM/YYYY";

const BasicProfile = () => {
  const { TextArea } = Input;
  const [form] = Form.useForm();
  const [departMent, setDepartMent] = useState([]);
  const userId = localStorage.getItem("userId");
  const getDepartment = async () => {
    try {
      const res = await getAllDepartment();
      if (res && res.statusCode === 200) {
        setDepartMent(res.data);
      }
    } catch (error) {
      console.log("====================================");
      console.log("có lỗi tại get departMent", error);
      console.log("====================================");
    }
  };
  const getAccountInfor = async () => {
    try {
      const res = await getUserInformation({
        UserId: userId,
      });

      if (res && res.statusCode === 200) {
        const department = departMent.find(
          (dep) => dep.departmentId === res.data.departmentId
        );
        const departmentName = department
          ? department.departmentName
          : "Unknown Department";
        const customData = {
          ...res.data,
          birthday: dayjs(res.data.birthday).format(dateFormat),
          issue: dayjs(res.data.issue).format(dateFormat),
          departmentId: departmentName,
          sex: res.data.sex === "Male" ? "Nam" : "Nữ",
        };

        form.setFieldsValue(customData);
      }
    } catch (error) {
      console.log("====================================");
      console.log("Có lỗi tại get account infor", error);
      console.log("====================================");
    }
  };
  useEffect(() => {
    getDepartment();
  }, []);
  if (departMent.length) {
    getAccountInfor();
  }
  return (
    <>
      <div
        className="header"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h3>Thông tin cá nhân</h3>
      </div>

      <Divider />
      <div className="parent-container">
        <div className="form-container">
          <Form form={form} name="basic" layout="vertical" disabled={true}>
            <Row gutter={10}>
              <Col span={12}>
                <Form.Item name="fullName" label="Họ và Tên">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="birthday" label="Ngày tháng năm sinh">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="birthPlace" label="Nơi sinh">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="homeTown" label="Quê Quán">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="nationName" label="Dân tộc">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="sex" label="Giới tính">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="accountEmail" label="Email">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="phoneNumber" label="Số điện thoại">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="officePhoneNumber"
                  label="Số điện thoại cơ quan"
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="departmentId" label="Bộ phận làm việc">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="identityNumber"
                  label="Chứng minh nhân dân hoặc căn cước"
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="placeOfIssue" label="Nơi cấp">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="issue" label="Ngày cấp">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="taxCode" label="Mã số thuế">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="permanentAddress" label="Địa chỉ thường trú">
                  <TextArea
                    autoSize={{
                      minRows: 2,
                      maxRows: 5,
                    }}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="currentResidence" label="Chỗ ở hiện nay">
                  <TextArea
                    autoSize={{
                      minRows: 2,
                      maxRows: 5,
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    </>
  );
};

export default BasicProfile;
