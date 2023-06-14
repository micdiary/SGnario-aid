import { Button, Form, Input, Typography } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { forgetPassword } from "../api/account";
import * as constants from "../constants";
import { useState } from "react";

const ForgetPassword = () => {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const onFinish = (values) => {
    setIsSubmitting(true);
    forgetPassword({ email: values.email })
      .then((res) => {
        console.log(res);
        setIsSuccess(true);
      })
      .catch((error) => {
        console.error("Password reset failed:", error);
        setIsSubmitting(false);
        form.resetFields();
      });
  };

  if (isSuccess) {
    return (
      <Typography.Text>
        An email has been sent to your email address with instructions to reset
        your password.
      </Typography.Text>
    );
  }

  return (
    <Form
      form={form}
      onFinish={onFinish}
      layout="vertical"
      style={{ width: "50%", margin: "auto" }}
    >
      <Form.Item
        name="email"
        rules={[
          {
            required: true,
            message: "Please input your email!",
          },
          {
            type: "email",
            message: "Please enter a valid email address!",
          },
        ]}
      >
        <Input prefix={<UserOutlined />} placeholder="Email" />
      </Form.Item>
      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          disabled={isSubmitting}
          loading={isSubmitting}
          style={{ margin: "0 auto", display:"inline-block"}}
        >
          Reset Password
        </Button>
        <Typography.Link href={constants.LOGIN_URL} style={{ float: "right" }}>
          Back to Login
        </Typography.Link>
      </Form.Item>
    </Form>
  );
};

export default ForgetPassword;
