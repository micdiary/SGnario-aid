import { Button, Checkbox, Form, Input, Radio, DatePicker } from "antd";
import { Link } from "react-router-dom";
import React, { useState } from "react";

import * as constants from "../constants";
import { register } from "../api/account";

const { TextArea } = Input;

const Register = () => {
  const [date, setDate] = useState(null);

  const formItem = [
    {
      label: "Name",
      name: "name",
      rules: [
        {
          required: true,
          message: "Please input your name!",
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
      label: "Date Of Birth",
      name: "dob",
      rules: [
        {
          required: true,
          message: "Please input your date of birth!",
        },
      ],
      input: (
        <DatePicker
          onChange={(date, dateString) => {
            setDate(dateString);
          }}
        />
      ),
    },
    {
      label: "Gender",
      name: "gender",
      rules: [
        {
          required: true,
          message: "Please select your gender!",
        },
      ],
      input: (
        <Radio.Group>
          <Radio value="male">Male</Radio>
          <Radio value="female">Female</Radio>
        </Radio.Group>
      ),
    },
    {
      label: "Therapist",
      name: "therapist",
      rules: [
        {
          required: true,
          message: "Please select your therapist!",
        },
      ],
      input: <Input />,
    },
    {
      label: "Issue",
      name: "issue",
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

  const onFinish = (values) => {
    const req = {
      name: values.name,
      email: values.email,
      password: values.password,
      dob: date,
      gender: values.gender,
      issue: values.issue,
      therapist: values.therapist,
    };

    register(req).then((res) => {
      console.log(res);
    });
  };

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
