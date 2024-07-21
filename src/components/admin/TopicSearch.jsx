import React, { useEffect, useState } from "react";

import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Space,
  theme,
  AutoComplete,
  Divider,
} from "antd";
import dayjs from "dayjs";
import { getAllUserAdmin } from "../../services/api";
const TopicSearchForm = (props) => {
  const [year, setYear] = useState(dayjs().year());
  const [searchText, setSearchText] = useState("");
  const [listUser, setListUser] = useState([]);
  const { token } = theme.useToken();
  const [form] = Form.useForm();
  const formStyle = {
    maxWidth: "none",
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    padding: 20,
    marginTop: 20,
  };
  const disabledYear = (current) => {
    // Không cho phép chọn năm sau năm hiện tại
    return current && current > dayjs().endOf("year");
  };
  const onChangeYear = (date, dateString) => {
    setYear(dayjs(date).format("YYYY"));
  };
  const getUser = async () => {
    const res = await getAllUserAdmin();
    if (res && res?.data) {
      setListUser(res?.data);
    }
  };
  const options = listUser.map((user) => ({
    value: user.accountEmail,
    label: (
      <div>
        {user.fullName} <br />
        <small>{user.accountEmail}</small>
      </div>
    ),
  }));
  const filteredOptions =
    searchText.length >= 3
      ? options.filter((option) =>
          option.value.toLowerCase().includes(searchText.toLowerCase())
        )
      : [];
  const onFinish = (values) => {
    let query = "";
    if (values.Email) {
      query += `&Email=${values.Email}`;
    }
    if (values.TopicName) {
      query += `&TopicName=${values.TopicName}`;
    }
    if (values.CompleteYear) {
      query += `&CompleteYear=${year}`;
    } else {
      setYear("");
    }
    if (query) {
      props.handleSearchTopic(query);
    }
  };
  useEffect(() => {
    getUser();
  }, []);
  return (
    <Form
      form={form}
      name="advanced_search"
      style={formStyle}
      onFinish={onFinish}
      labelCol={{
        span: 24,
      }}
    >
      <Row gutter={24}>
        {
          <Col span={8}>
            <Form.Item name="Email" label="Tên chủ nhiệm">
              <AutoComplete
                options={filteredOptions}
                onSearch={setSearchText}
                filterOption={true}
              >
                <Input
                  style={{ width: "100%" }}
                  placeholder="Chủ nhiệm đề tài"
                  allowClear
                />
              </AutoComplete>
            </Form.Item>
          </Col>
        }
        {
          <Col span={8}>
            <Form.Item name="TopicName" label="Tên đề tài">
              <Input placeholder="Ngiên cứu lâm sàn" allowClear />
            </Form.Item>
          </Col>
        }
        {
          <Col span={8}>
            <Form.Item name="CompleteYear" label="Năm hoàn thành">
              <DatePicker
                defaultValue={dayjs()}
                disabledDate={disabledYear}
                onChange={onChangeYear}
                picker="year"
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
        }
      </Row>

      <div>
        <Space size="small">
          <Button type="primary" htmlType="submit">
            Tìm kiếm
          </Button>
          <Button
            danger
            type="primary"
            onClick={() => {
              form.resetFields();
              props.handleSearchTopic("");
              setSearchText("");
            }}
          >
            Xóa tìm kiếm
          </Button>
        </Space>
      </div>
    </Form>
  );
};

export default TopicSearchForm;
