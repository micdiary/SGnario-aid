import React, { useEffect, useState } from "react";
import {
	Space,
	Table,
	Typography,
	Button,
	Modal,
	Form,
	Input,
	Select,
	Popconfirm,
} from "antd";
import { deleteUser, getTherapists, registerSuperuser } from "../../api/admin";

const { Option } = Select;

const SuperuserManagement = () => {
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
		setData([...data, values]);
		form.resetFields();
		setConfirmLoading(false);
		setOpen(false);
	};

	const deleteBtn = (value) => {
		deleteUser(value._id).then((res) => {
			alert(res.message);
			const newData = data.filter((item) => item._id !== value._id);
			setData(newData);
		});
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
			filters: [
				{
					text: "Therapist",
					value: "therapist",
				},
				{
					text: "Educator",
					value: "educator",
				},
			],
			onFilter: (value, record) => record.role.indexOf(value) === 0,
		},
		{
			title: "Action",
			key: "action",
			render: (value) => (
				<Space size="middle">
					<Popconfirm
						title="Sure to delete?"
						onConfirm={() => deleteBtn(value)}
					>
						<Typography.Link>Delete</Typography.Link>
					</Popconfirm>
				</Space>
			),
		},
	];

	return (
		<>
			<Button type="primary" style={{ marginBottom: 16 }} onClick={showModal}>
				Add Therapist
			</Button>
			<Table columns={columns} dataSource={data} rowKey="_id" />
			<Modal
				title="Add Therapist"
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

export default SuperuserManagement;
