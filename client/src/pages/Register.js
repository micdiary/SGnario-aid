import { Button, Checkbox, Form, Input, Radio } from "antd";
import { Link } from "react-router-dom";
import React from "react";

import * as constants from "../constants";

const { TextArea } = Input;

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
    label: "Email",
    name: "email",
    rules: [
      {
        type: "email",
        message: "The input is not valid E-mail!",
      },
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
    label: "Country",
    name: "country",
    rules: [],
    input: <Input />,
  },
  {
    label: "User Type",
    name: "userType",
    rules: [
      {
        required: true,
        message: "Please select user type!",
      },
    ],
    input: (
      <Radio.Group>
        <Radio value="individual">Individual</Radio>
        <Radio value="organisation">Organisation</Radio>
      </Radio.Group>
    ),
  },
  {
    label: "Organisation Name",
    name: "organisationName",
    rules: [],
    input: <Input />,
  },
  {
    label: "Reason Of Use",
    name: "reasonOfUse",
    rules: [
      {
        required: true,
        message: "Please input your reason of use!",
      },
    ],
    input: <TextArea />,
  },
  {
    label: (
      <>
        I have read and agreed to the&nbsp;
        <Link
          to={constants.TERMS_CONDITIONS_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          Terms and Conditions
        </Link>
      </>
    ),
    name: "termsAndConditions",
    valuePropName: "checked",
    rules: [
      {
        required: true,
        message: "Please accept terms & conditions!",
      },
    ],
    input: <Checkbox />,
  },
];

const generateForm = (formItem) => {
  return formItem.map((item, index) => {
    return (
      <Form.Item
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

const Register = () => {
  return (
    <>
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
            Sign up
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default Register;
