import React, { useEffect, useState } from "react";
import {
	Input,
	Button,
	Form,
	Typography,
	Divider,
	Upload,
	Spin,
	Tooltip,
	Row,
	Col,
} from "antd";
import { UploadOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { setStorageConfigurations } from "../../../api/profile";
import { generateForm } from "../../../utils/form";
import { testGoogleDrive } from "../../../api/therapist";
import { showNotification } from "../../../components/Notification";
import { Link } from "react-router-dom";
import * as constants from "../../../constants";
const Storage = ({ profile, setProfile }) => {
	const [storageForm] = Form.useForm();
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (profile === undefined) {
			setIsLoading(true);
		}
		storageForm.setFieldsValue({
			clientEmail: profile.clientEmail,
			rootFolderId: profile.rootFolderId,
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [profile]);

	const customRequest = ({ file, onSuccess }) => {
		console.log(file);
		setIsLoading(true);
		testGoogleDrive(file)
			.then((res) => {
				showNotification(res.message);
			})
			.catch((err) => {
				showNotification(err.message, "error");
			})
			.finally(() => {
				setIsLoading(false);
			});

		setTimeout(() => {
			onSuccess("ok");
		}, 0);
	};

	const storageFormItem = [
		{
			label: "Client Email",
			name: "clientEmail",
			rules: [
				{
					required: true,
					message: "Please input your email!",
				},
			],
			input: <Input />,
		},
		{
			label: "Private Key",
			name: "privateKey",
			rules: [
				{
					required: true,
					message: "Please input your private key!",
				},
			],
			input: <Input.TextArea rows={5} />,
		},
		{
			label: "Root Folder Id",
			name: "rootFolderId",
			rules: [
				{
					required: true,
					message: "Please input your root folder id!",
				},
			],
			input: <Input />,
		},
	];

	const onStorageFinish = (values) => {
		const req = {
			clientEmail: values.clientEmail,
			privateKey: values.privateKey,
			rootFolderId: values.rootFolderId,
		};
		// Handle the form submission
		setStorageConfigurations(req)
			.then((res) => {
				showNotification(res.message);
				setProfile(res.user);
			})
			.catch((err) => {
				showNotification(err.message, "error");
			});
	};

	return (
		<Spin spinning={isLoading}>
			<Form
				form={storageForm}
				wrapperCol={{
					span: 6,
				}}
				layout="vertical"
				onFinish={onStorageFinish}
				scrollToFirstError
			>
				<Row>
					<Col>
						<Typography.Title level={4}>
							Storage configurations&nbsp;
						</Typography.Title>
					</Col>
					<Col>
						<Tooltip
							color="white"
							title={
								<Link
									to={constants.GOOGLE_DRIVE_VIDEO_URL}
									target="_blank"
									rel="noopener noreferrer"
								>
									Tutorial video
								</Link>
							}
						>
							<InfoCircleOutlined />
						</Tooltip>
					</Col>
				</Row>
				<Divider />
				{generateForm(storageFormItem)}
				<Button
					type={"primary"}
					onClick={() => storageForm.submit()}
					style={{
						marginRight: "10px",
					}}
				>
					Update configurations
				</Button>
				<Upload customRequest={customRequest} showUploadList={false}>
					<Button icon={<UploadOutlined />}>Test upload</Button>
				</Upload>
			</Form>
		</Spin>
	);
};

export default Storage;
