import {
  AutoComplete,
  Button,
  Col,
  Divider,
  Form,
  Input,
  message,
  Row,
  Space,
} from "antd";
import React, { useEffect, useState } from "react";
import "./basicProfile.scss";
import {
  getAllDepartment,
  getUserInformation,
  editUserInformation,
} from "../../../services/api";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import axios from "axios";
dayjs.extend(customParseFormat);
const dateFormat = "DD/MM/YYYY";

const BasicProfile = () => {
  const { TextArea } = Input;
  const [form] = Form.useForm();
  const [bankName, setBankName] = useState([{}]);
  const [isEdit, setIsEdit] = useState(true);
  const [searchText, setSearchText] = useState("");
  const userId = sessionStorage.getItem("userId");
  const options = bankName.map((bank) => ({
    value: bank.shortName,
    label: bank.name,
  }));
  const filteredOptions = searchText.length
    ? options.filter((option) =>
        option.value.toLowerCase().includes(searchText.toLowerCase())
      )
    : [];
  const getDepartment = async () => {
    try {
      const res = await getAllDepartment();
      if (res && res.statusCode === 200) {
        getAccountInfor(res.data);
      }
    } catch (error) {
      console.log("====================================");
      console.log("có lỗi tại get departMent", error);
      console.log("====================================");
    }
  };
  const getAccountInfor = async (departMent) => {
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
  const handleOk = () => {
    form.submit();
  };
  const editAccount = async (values) => {
    try {
      const data = {
        userId: userId,
        phoneNumber: values.phoneNumber,
        bankAccountNumber: values.bankAccountNumber,
        bank: values.bank,
      };
      const res = await editUserInformation(data);
      if (res && res.statusCode === 200) {
        message.success("Cập nhật thành công");
        setIsEdit(true);
        getAccountInfor();
      } else {
        message.error("Vui lòng thử lại sau");
      }
    } catch (error) {
      console.log("Error at edit user information", error);
    }
  };
  const getBankName = async () => {
    try {
      const res = await axios.get("https://api.vietqr.io/v2/banks");
      if (res.data && res.status === 200) {
        setBankName(res.data.data);
      }
    } catch (error) {
      console.log("====================================");
      console.log("có lỗi tại get bank name", error);
      console.log("====================================");
    }
  };
  useEffect(() => {
    getDepartment();
    getBankName();
  }, []);
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
      <div>
        <Space
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          {isEdit === true ? (
            <></>
          ) : (
            <>
              {" "}
              <Button type="primary" danger onClick={() => setIsEdit(true)}>
                Hủy
              </Button>
            </>
          )}

          <Button
            type="primary"
            htmlType="submit"
            onClick={() => {
              setIsEdit(false);
              if (isEdit !== true) {
                handleOk();
              }
            }}
          >
            {isEdit === true ? "Chỉnh sửa" : "Xác nhận"}
          </Button>
        </Space>
      </div>
      <Divider />
      <div className="parent-container">
        <div className="form-container">
          <Form
            form={form}
            name="basic"
            layout="vertical"
            disabled={true}
            onFinish={editAccount}
          >
            <Row gutter={10}>
              <Col span={12}>
                <Form.Item name="fullName" label="Họ và Tên">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="phoneNumber" label="Số điện thoại">
                  <Input disabled={isEdit} />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item name="bank" label="Ngân hàng sử dụng">
                  <AutoComplete
                    value={searchText}
                    options={filteredOptions}
                    onSearch={setSearchText}
                    filterOption={true}
                    disabled={isEdit}
                  >
                    <Input />
                  </AutoComplete>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="bankAccountNumber" label="Số tài khoản">
                  <Input disabled={isEdit} />
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
