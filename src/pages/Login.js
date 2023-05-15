import { Button, Checkbox, Form, Input } from "antd";
import React from "react";

const onFinish = (values) => {
  console.log("Received values of form: ", values);
};

const formItem = [
  {
    label: "Username",
    name: "username",
    rules: [
      {
        required: true,
        message: "Please input your username!",
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

const Login = () => {
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

export default Login;
