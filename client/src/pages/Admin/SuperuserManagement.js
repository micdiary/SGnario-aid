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
	Row,
} from "antd";
import { deleteUser, getTherapists, registerSuperuser } from "../../api/admin";
import { showNotification } from "../../components/Notification";

const { Option } = Select;

const SuperuserManagement = () => {
	const [data, setData] = useState([]);
	const [open, setOpen] = useState(false);
	const [confirmLoading, setConfirmLoading] = useState(false);
	const [form] = Form.useForm();
	const [search, setSearch] = useState("");

	useEffect(() => {
		getTherapists()
			.then((res) => {
				setData(res.therapists);
			})
			.catch((err) => {
				showNotification(err.message, "error");
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

	const onSearch = (value) => {
		setSearch(value);
	};

	const onFormFinish = (values) => {
		registerSuperuser(values)
			.then((res) => {
				showNotification(res.message);
				setData([...data, values]);
				form.resetFields();
				setConfirmLoading(false);
				setOpen(false);
			})
			.catch((err) => {
				showNotification(err.message, "error");
			});
	};

	const deleteBtn = (value) => {
		deleteUser(value._id)
			.then((res) => {
				showNotification(res.message);
				const newData = data.filter((item) => item._id !== value._id);
				setData(newData);
			})
			.catch((err) => {
				showNotification(err.message, "error");
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
				{
					min: 8,
					message: "Password must be at least 8 characters!",
				},
				{
					pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
					message:
						"Password must contain at least one uppercase letter, one lowercase letter and one number!",
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
			<Row>
				<Input.Search
					placeholder="search user"
					onSearch={onSearch}
					onChange={(e) => onSearch(e.target.value)}
					style={{
						width: 200,
						marginBottom: 16,
					}}
				></Input.Search>
			</Row>
			<Table
				columns={columns}
				dataSource={
					search === ""
						? data
						: data.filter(
								(item) =>
									item.name.toLowerCase().includes(search.toLowerCase()) ||
									item.email.toLowerCase().includes(search.toLowerCase())
						  )
				}
				rowKey="_id"
			/>
			<Modal
				destroyOnClose
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
