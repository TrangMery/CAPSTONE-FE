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
  Select,
} from "antd";
import dayjs from "dayjs";
import { getAllUserAdmin, stateProject } from "../../../services/api";

const TopicSearchFormStaff = (props) => {
  const [year, setYear] = useState(dayjs().year());
  const [searchText, setSearchText] = useState("");
  const [listState, setListState] = useState([]);
  const [listUser, setListUser] = useState([]);
  const { token } = theme.useToken();
  const [form] = Form.useForm();
  const userId = sessionStorage.getItem("userId");
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
  const getStateProject = async () => {
    try {
      const res = await stateProject();
      const translations = {
        preliminaryReview: "Đánh giá sơ bộ",
        earlyTermReport: "Báo cáo đề cương",
        midtermReport: "Báo cáo giữa kỳ",
        finaltermReport: "Báo cáo cuối kỳ",
        endingPhase: "Giai đoạn kết thúc",
        compeleted: "Hoàn thành đề tài"
      };
      if (res && res?.data) {
        const resultArray = Object.keys(res?.data).map((key) => ({
          label: translations[key] || key,
          value: res?.data[key],
        }));
        setListState(resultArray);
      }
    } catch (error) {
      console.log("====================================");
      console.log("Error: ", error);
      console.log("====================================");
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
    const translations = {
      0: "Đánh giá sơ bộ",
      1: "Báo cáo đề cương",
      2: "Báo cáo giữa kỳ",
      3: "Báo cáo cuối kỳ",
      4: "Giai đoạn kết thúc",
      5: "Đề tài hoàn thành",
    };
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
    if (values.State !== null && values.State !== undefined) {
      query += `&State=${values.State}`;
      props.handleState(translations[values.State]);
    }
    if (query) {
      props.handleSearchTopic(query);
    }
  };
  const getUser = async () => {
    const res = await getAllUserAdmin({
      userId: userId,
    });
    console.log(res);
    if (res && res?.data) {
      setListUser(res?.data);
    }
  };
  useEffect(() => {
    getStateProject();
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
          <Col span={6}>
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
          <Col span={6}>
            <Form.Item name="TopicName" label="Tên đề tài">
              <Input placeholder="Ngiên cứu lâm sàn" allowClear />
            </Form.Item>
          </Col>
        }
        {
          <Col span={6}>
            <Form.Item name="CompleteYear" label="Năm hoàn thành">
              <DatePicker
                disabledDate={disabledYear}
                onChange={onChangeYear}
                picker="year"
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
        }
        {
          <Col span={6}>
            <Form.Item name="State" label="Giai đoạn đề tài">
              <Select placeholder="Chọn giai đoạn đề tài" options={listState} />
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

export default TopicSearchFormStaff;
