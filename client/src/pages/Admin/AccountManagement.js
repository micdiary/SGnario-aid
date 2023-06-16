import React, { useEffect, useState } from "react";
import {
  Space,
  Table,
  Tag,
  Typography,
  Button,
  Modal,
  Form,
  Input,
  Select,
} from "antd";
import { getTherapists, registerSuperuser } from "../../api/admin";

const { Option } = Select;

const AccountManagement = () => {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [form] = Form.useForm();
  useEffect(() => {
    getTherapists().then((res) => {
      setData(res.therapists);
    });
  }, []);

  const showModal = () => {
    setOpen(true);
  };

  const handleOk = () => {
    setConfirmLoading(true);
    form.submit();
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const onFormFinish = (values) => {
    registerSuperuser(values).then((res) => {
      alert(res.message);
    });
    setConfirmLoading(false);
    setOpen(false);
  };

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
      label: "Role",
      name: "role",
      rules: [
        {
          required: true,
          message: "Please select a role!",
        },
      ],
      input: (
        <Select placeholder="Select a role">
          <Option value="therapist">Therapist</Option>
          <Option value="educator">Educator</Option>
        </Select>
      ),
    },
    {
      label: "Purpose",
      name: "purpose",
      rules: [
        {
          required: true,
          message: "Please select a purpose!",
        },
      ],
      input: (
        <Select placeholder="Select a purpose" mode="multiple">
          <Option value="treatment">Treatment</Option>
          <Option value="education">Education</Option>
        </Select>
      ),
    },
    {
      label: "Organisiation",
      name: "organisation",
      rules: [
        {
          required: true,
          message: "Please select an organisation!",
        },
      ],
      input: <Input />,
    },
  ];

  const modalForm = (formItem) => {
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

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Purpose",
      key: "purpose",
      dataIndex: "purpose",
      render: (_, { purpose }) => (
        <>
          {purpose.map((tag) => {
            return (
              <Tag color={"green"} key={tag}>
                {tag}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_) => (
        <Space size="middle">
          <Typography.Link>Edit </Typography.Link>
          <Typography.Link>Delete</Typography.Link>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Button type="primary" style={{ marginBottom: 16 }} onClick={showModal}>
        Add Therapist
      </Button>
      <Table columns={columns} dataSource={data} />
      <Modal
        title="Title"
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <Form form={form} onFinish={onFormFinish}>
          {modalForm(formItem)}
        </Form>
      </Modal>
    </>
  );
};

export default AccountManagement;
