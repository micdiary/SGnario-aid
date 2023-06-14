import { Button, Checkbox, Form, Input } from "antd";
import { useNavigate } from "react-router-dom";
import React from "react";
import { login } from "../../api/account";
import * as constants from "../../constants";
import { setToken, setUserID } from "../../utils/account";
import { userStore } from "../../utils/store";

const AdminLogin = () => {
  let navigate = useNavigate();
  const updateUserID = userStore((state) => state.setID);

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
        navigate(constants.HOME_URL);
      } else {
        alert("Invalid email or password!");
      }
    });
  };

  const formItem = [
    {
      label: "Email",
      name: "email",
      rules: [
        {
          required: true,
          message: "Please input your email!",
        },
      ],
      input: <Input />,
    },
    {
      label: "Password",
      name: "password",
      rules: [
        {
          required: true,
          message: "Please input your password!",
        },
      ],
      input: <Input.Password />,
    },
    {
      name: "remember",
      rules: [],
      input: <Checkbox>Remember me</Checkbox>,
      valuePropName: "checked",
      wrapperCol: {
        offset: 6,
        span: 14,
      },
    },
  ];

  const generateForm = (formItem) => {
    return formItem.map((item, index) => {
      return (
        <Form.Item
          wrapperCol={item.wrapperCol}
          name={item.name}
          label={item.label}
          rules={item.rules}
          key={index}
          valuePropName={item.valuePropName}
        >
          {item.input}
        </Form.Item>
      );
    });
  };

  return (
    <>
      <h1>Please Login:</h1>
      <Form
        labelCol={{
          span: 6,
        }}
        wrapperCol={{
          span: 14,
        }}
        layout="horizontal"
        style={{
          textAlign: "left",
        }}
        onFinish={onFinish}
        scrollToFirstError
      >
        {generateForm(formItem)}
        <Form.Item
          wrapperCol={{
            span: 12,
            offset: 6,
          }}
        >
          <Button type="primary" htmlType="submit">
            Log in
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default AdminLogin;
