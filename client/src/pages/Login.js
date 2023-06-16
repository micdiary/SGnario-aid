import { Button, Checkbox, Form, Input, Typography } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import React from "react";
import { login,getUserType } from "../api/account";
import * as constants from "../constants";
import {
  setToken,
  setUserID,
  setUserType,
} from "../utils/account";
import { userStore } from "../utils/store";

const Login = () => {
  let navigate = useNavigate();
  const updateUserID = userStore((state) => state.setID);
  const updateUserType = userStore((state) => state.setType);

  const onFinish = (values) => {
    const req = {
      email: values.email,
      password: values.password,
    };

    login(req).then((res) => {
      if (res.userID !== undefined) {
        setToken(res.token);
        setUserID(res.userID);
        updateUserID(res.userID);

        getUserType(res.userID).then((res) => {
          if (res.role !== undefined) {
            setUserType(res.role);
            updateUserType(res.role);
          }
          if (res.role === "admin") {
            navigate(constants.ADMIN_URL);
          } else {
            navigate(constants.HOME_URL);
          }
        });
      } else {
        alert("Invalid email or password!");
      }
    });
  };

  return (
    <>
      <Form
        name="normal_login"
        className="login-form"
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        style={{ width: "50%", margin: "auto" }}
      >
        <Form.Item
          name="email"
          rules={[
            {
              required: true,
              message: "Please input your Email!",
            },
          ]}
        >
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="Email"
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your Password!",
            },
          ]}
        >
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Password"
          />
        </Form.Item>
        <Form.Item>
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox>Remember me</Checkbox>
          </Form.Item>
          <Typography.Link
            className="login-form-forgot"
            href={constants.FORGET_PASSWORD_URL}
            style={{ float: "right" }}
          >
            Forgot password
          </Typography.Link>
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
            style={{ width: "100%" }}
          >
            Log in
          </Button>
          Or{" "}
          <Typography.Link href={constants.REGISTER_URL}>
            register now!
          </Typography.Link>
        </Form.Item>
      </Form>
    </>
  );
};

export default Login;
