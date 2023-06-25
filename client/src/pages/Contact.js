import { Button, Form, Input, Select } from "antd";
import { useNavigate } from "react-router-dom";

import * as constants from "../constants";

const styles = {
  h2: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "20px",
  },
}

const Contact = () => {
  let navigate = useNavigate();

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
      label: "Category",
      name: "category",
      rules: [
        {
          required: true,
          message: "Please select a category!",
        },
      ],
      input: (
        <Select
          mode="tags"
          options={[
            { value: "Account", label: "Account" },
            { value: "Website", label: "Website" },
            { value: "Scenario Videos", label: "Scenario Videos" },
            { value: "Feedback", label: "Feedback" },
            { value: "Complain", label: "Complain" },
          ]}
        />
      ),
    },
    {
      label: "Inquiry",
      name: "inquiry",
      rules: [
        {
          required: true,
          message: "Please input your inquiry!",
        },
      ],
      input: <Input />,
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
      category: values.category,
      inquiry: values.inquiry,
    };

    //register(req).then((res) => {
    navigate(constants.LOGIN_URL);
    //});
  };

  return (
    <>
    <h2 style={styles.h2}>Contact Us</h2>
      <h4>Fill up the form below with your inquiry and we will get back to you soon.</h4>

      <br></br>

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
            Submit
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}

export default Contact;