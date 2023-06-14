import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import {
  Card,
  Input,
  Button,
  DatePicker,
  Select,
  Form,
  Radio,
  Row,
  Col,
  Typography,
} from "antd";
import { editProfile, getProfile } from "../../api/profile";
import { getToken } from "../../utils/account";
import Loader from "../../components/Loader";
import { resetPassword } from "../../api/account";

const { Title } = Typography;

const Profile = () => {
  const [form] = Form.useForm();
  const [cardToSubmit, setCardToSubmit] = useState(0);
  const [isProfileDisabled, setIsProfileDisabled] = useState(true);
  const [isPasswordDisabled, setIsPasswordDisabled] = useState(true);
  const [profile, setProfile] = useState({});

  useEffect(() => {
    let token = getToken();
    getProfile(token).then((res) => {
      setProfile(res);
    });
    form.setFieldsValue({
      name: profile.name,
      email: profile.email,
      dob: dayjs(profile.dob),
      gender: profile.gender,
      therapist: profile.therapist,
      issue: profile.issue,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile.dob]);

  const profileFormItem = [
    {
      label: "Name",
      name: "name",
      rules: [
        {
          required: true,
          message: "Please input your name!",
        },
      ],
      input: <Input disabled={isProfileDisabled} />,
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
          disabled={isProfileDisabled}
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
        <Radio.Group disabled={isProfileDisabled}>
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
          disabled={isProfileDisabled}
        />
      ),
    },
  ];

  const passwordFormItem = [
    {
      label: "New Password",
      name: "password",
      // rules: [
      //   {
      //     required: true,
      //     message: "Please input your new password!",
      //   },
      // ],
      input: <Input.Password disabled={isPasswordDisabled} />,
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

  const generateProfileCard = () => {
    return (
      <Card
        extra={
          <>
            <Button
              hidden={!isProfileDisabled}
              onClick={() => {
                setCardToSubmit(0);
                setIsProfileDisabled(!isProfileDisabled);
                setIsPasswordDisabled(true);
              }}
            >
              Edit Profile
            </Button>
            <Button
              hidden={isProfileDisabled}
              onClick={() => {
                setIsProfileDisabled(!isProfileDisabled);
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
        {generateForm(profileFormItem)}
      </Card>
    );
  };

  const generatePasswordCard = () => {
    return (
      <Card
        extra={
          <>
            <Button
              hidden={!isPasswordDisabled}
              onClick={() => {
                setCardToSubmit(1);
                setIsPasswordDisabled(!isPasswordDisabled);
                setIsProfileDisabled(true);
              }}
            >
              Edit Password
            </Button>
            <Button
              hidden={isPasswordDisabled}
              onClick={() => {
                setIsPasswordDisabled(!isPasswordDisabled);
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
        {generateForm(passwordFormItem)}
      </Card>
    );
  };

  const onProfileFinish = (values) => {
    const req = {
      name: values.name,
      dob: values.dob,
      gender: values.gender,
      issue: values.issue,
    };
    // Handle the form submission
    editProfile(req).then((res) => {
      alert(res.message);
    });
  };

  const onPasswordFinish = (values) => {
    const req = {
      newPassword: values.password,
    };
    // Handle the form submission
    resetPassword(req).then((res) => {
      alert(res.message || res.error);
    });
  };

  return profile.name ? (
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
      onFinish={cardToSubmit === 0 ? onProfileFinish : onPasswordFinish}
      scrollToFirstError
    >
      <Row gutter={12}>
        <Col span={12}>
          <Title level={4}>Profile</Title>
          {generateProfileCard()}
        </Col>
        <Col span={12}>
          <Title level={4}>Password</Title>
          {generatePasswordCard()}
        </Col>
      </Row>
    </Form>
  ) : (
    <Loader />
  );
};

export default Profile;
