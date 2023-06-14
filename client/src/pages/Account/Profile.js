import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Card,
  Input,
  Button,
  DatePicker,
  Select,
  Form,
  Radio,
} from "antd";
import { editProfile, getProfile } from "../../api/profile";
import { getToken } from "../../utils/account";
import dayjs from "dayjs";

const { Option } = Select;

const Profile = () => {
  const [form] = Form.useForm();
  const [isDisabled, setIsDisabled] = useState(true);
  const [profile, setProfile] = useState({});
  const [date, setDate] = useState(null);

  useEffect(() => {
    let token = getToken();
    getProfile(token).then((res) => {
      setProfile(res);
    });
    form.setFieldsValue({
      name: profile.name,
      email: profile.email,
      dob: date,
      gender: profile.gender,
      therapist: profile.therapist,
      issue: profile.issue,
    });
  }, [date]);

  useEffect(() => {
    if (profile.dob) {
      setDate(dayjs(profile.dob, "YYYY-MM-DD"));
    } else {
      setDate(null);
    }
  }, [profile.dob]);

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
      input: <Input disabled={isDisabled} />,
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
      input: <Input disabled />,
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
          value={date}
          disabled={isDisabled}
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
        <Radio.Group disabled={isDisabled}>
          <Radio value="male">Male</Radio>
          <Radio value="female">Female</Radio>
        </Radio.Group>
      ),
    },
    {
      label: "Therapist",
      name: "therapist",
      input: <Select disabled />,
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
      input: (
        <Select
          mode="tags"
          options={[
            { value: "Stuttering", label: "Stuttering" },
            { value: "Voice Disorder", label: "Voice Disorder" },
            { value: "Stroke Recovery", label: "Stroke Recovery" },
          ]}
          disabled={isDisabled}
        />
      ),
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
          initialValue={item.initialValue}
        >
          {item.input}
        </Form.Item>
      );
    });
  };

  const generateCard = () => {
    return (
      <Card
        extra={
          <>
            <Button
              hidden={!isDisabled}
              onClick={() => setIsDisabled(!isDisabled)}
            >
              Edit Profile
            </Button>
            <Button
              hidden={isDisabled}
              onClick={() => {
                setIsDisabled(!isDisabled);
                form.submit();
              }}
            >
              Save
            </Button>
          </>
        }
        style={{
          width: 720,
        }}
      >
        {generateForm(formItem)}
      </Card>
    );
  };

  const onFinish = (values) => {
    const req = {
      name: values.name,
      dob: date,
      gender: values.gender,
      issue: values.issue,
    };
    // Handle the form submission
    editProfile(req).then((res) => {
      alert(res.message);
    });
  };

  return (
    <Form
      form={form}
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
      {generateCard()}
    </Form>
  );
};

export default Profile;
