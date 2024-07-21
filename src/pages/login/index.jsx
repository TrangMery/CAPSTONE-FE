import { useEffect } from "react";
import { Form, Input, Button, message } from "antd";
import "./login.css";
import Img from "./img/log.svg";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { loginAccount } from "../../services/api";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
const Login = () => {
  const navigation = useNavigate();
  const checkRoleNavitgate = (decoded) => {
    if (decoded.role === "Dean") {
      navigation("/user/manager");
    } else if (decoded.role === "User") {
      navigation("/user");
    } else if (decoded.role === "Staff") {
      navigation("/staff");
    } else if (decoded.role === "Admin") {
      navigation("/admin/accounts");
    }
  };
  const onFinish = async (values) => {
    try {
      const data = {
        email: values.email,
        password: values.password,
      };
      const res = await loginAccount(data);
      if (res && res.isSuccess) {
        localStorage.setItem("token", res.data.token);
        const decoded = jwtDecode(res.data.token);
        sessionStorage.setItem("userId", decoded?.userid);
        checkRoleNavitgate(decoded);
      } else {
        message.error("Vui lòng kiểm tra lại thông tin");
      }
    } catch (error) {
      console.log("Error at login component", error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      checkRoleNavitgate(decoded);
      sessionStorage.setItem("userId", decoded?.userid);
    }
  }, []);
  return (
    <>
      <div className="container">
        <div className="forms-container">
          <div className="signin-signup">
            <Form
              size="large"
              name="loginForm"
              initialValues={{ remember: true }}
              onFinish={onFinish}
              className="sign-in-form"
            >
              <h2 className="title">RMS</h2>
              <Form.Item
                name="email"
                rules={[
                  { required: true, message: "Xin hãy nhập email!" },
                  { type: "email", message: "Xin hãy nhập đúng email!" },
                ]}
                className="input-container"
              >
                <Input
                  prefix={<i className="fas fa-envelope"></i>}
                  placeholder="Email"
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[{ required: true, message: "Xin hãy nhập password" }]}
                className="input-container"
              >
                <Input.Password
                  prefix={<i className="fas fa-lock"></i>}
                  placeholder="Mật khẩu"
                />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" className="btn">
                  Đăng nhập
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>

        <div className="panels-container">
          <div className="panel left-panel">
            <div className="content">
              <p>
                Hệ thống RMS là hệ thống đăng ký, quản lí đề tài và lưu trữ
                thông tin.
              </p>
            </div>
            <img src={Img} className="image" alt="" />
          </div>
        </div>
      </div>
    </>
  );
};
export default Login;
