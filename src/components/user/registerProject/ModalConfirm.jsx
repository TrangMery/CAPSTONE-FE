import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  ConfigProvider,
  Modal,
  message,
  Checkbox,
  Divider,
} from "antd";
import ReCAPTCHA from "react-google-recaptcha";
import { createTopicAPI, getFileType } from "../../../services/api";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);
const ModalConfirm = (props) => {
  const recaptchaRef = useRef(null);
  const [checkCapcha, setCheckCapcha] = useState(true);
  const [checkedList, setCheckedList] = useState([]);
  const [fileType, setFileType] = useState([]);
  const navigate = useNavigate();
  const onChange1 = (list) => {
    setCheckedList(list);
  };
  const onSubmit = async () => {
    const data = props.data;
    try {
      const res = await createTopicAPI(data);
      if (res && res.statusCode === 200) {
        message.success("Đăng ký đề tài thành công");
        props.setFileList([]);
        props.setAddMember([]);
        props.form.resetFields();
        navigate("/user/track");
      } else {
        message.error("Tạo topic không thành công");
      }
    } catch (error) {
      console.error("lỗi thêm mới topic", error.message);
    }
  };

  const hideModal = () => {
    props.setOpen(false);
    setCheckCapcha(true);
    if (recaptchaRef.current) {
      recaptchaRef.current.reset();
    }
  };
  const onChange = (value) => {
    if (value !== null) {
      setCheckCapcha(false);
    } else {
      setCheckCapcha(true);
    }
  };
  const renderFooter = () => (
    <div style={{ display: "flex", justifyContent: "flex-end" }}>
      <Button shape="round" type="primary" onClick={hideModal}>
        Quay về
      </Button>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#55E6A0",
          },
        }}
      >
        <Button
          disabled={
            checkCapcha || fileType.length === checkedList.length ? false : true
          }
          shape="round"
          type="primary"
          onClick={onSubmit}
          style={{ margin: "0 10px" }}
        >
          Nộp đề tài
        </Button>
      </ConfigProvider>
    </div>
  );
  const listFileType = async () => {
    try {
      const res = await getFileType({
        stateNumber: 0,
      });
      if (res && res.isSuccess) {
        setFileType(res.data);
      }
    } catch (error) {
      console.log("====================================");
      console.log("error: ", error);
      console.log("====================================");
    }
  };
  useEffect(() => {
    listFileType();
  }, [props.data]);

  return (
    <>
      <Modal
        title="Xác nhận nộp đề tài"
        open={props.openConfirm}
        onCancel={hideModal}
        maskClosable={false}
        forceRender
        footer={renderFooter}
      >
        <Divider />
        <h3>Hợp đồng đính kèm:</h3>
        <Checkbox.Group
          style={{ display: "flex", flexDirection: "column" }}
          value={checkedList}
          onChange={onChange1}
        >
          {fileType.map((option) => (
            <Checkbox key={option.typeName} value={option.typeName}>
              {option.typeName}
            </Checkbox>
          ))}
        </Checkbox.Group>
        <Divider />
        <ReCAPTCHA
          ref={recaptchaRef}
          sitekey="6LdBn60pAAAAAADn0d2__-zqT4Tk9CqPY_4DBIdW"
          onChange={onChange}
        />
      </Modal>
    </>
  );
};
export default ModalConfirm;
