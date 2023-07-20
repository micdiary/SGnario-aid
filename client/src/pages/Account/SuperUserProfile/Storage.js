import React, { useEffect, useRef, useState } from "react";
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
	Tour,
} from "antd";
import {
	UploadOutlined,
	InfoCircleOutlined,
	QuestionCircleOutlined,
} from "@ant-design/icons";
import { setStorageConfigurations } from "../../../api/therapist";
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

	const storageConfigIconRef = useRef(null);
	const updateConfigBtnRef = useRef(null);
	const testUploadBtnRef = useRef(null);

	const [tourVisible, setTourVisible] = useState(false);
	const tourSteps = [
		{
			title: "Step 1",
			description:
				"Fill in the form with your Google Drive configurations. You can find the tutorial video by clicking the info icon.",
			placement: "top",
			target: () => storageConfigIconRef.current,
		},
		{
			title: "Step 2",
			description:
				"Click the 'Update configurations' button to save your configurations.",
			placement: "top",
			target: () => updateConfigBtnRef.current,
		},
		{
			title: "Step 3",
			description:
				"Click the 'Test upload' button to upload a file. If the upload is successful, you will see the uploaded file in your Google Drive",
			placement: "top",
			target: () => testUploadBtnRef.current,
		},
	];

	return (
		<Spin spinning={isLoading}>
			<Row justify={"space-between"}>
				<Row ref={storageConfigIconRef}>
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
				<Typography.Text
					strong
					onClick={() => setTourVisible(true)}
					style={{ float: "right" }}
				>
					Need help? <QuestionCircleOutlined />
				</Typography.Text>
			</Row>
			<Divider />
			<Form
				form={storageForm}
				wrapperCol={{
					span: 6,
				}}
				layout="vertical"
				onFinish={onStorageFinish}
				scrollToFirstError
			>
				{generateForm(storageFormItem)}
			</Form>
			<Button
				ref={updateConfigBtnRef}
				type={"primary"}
				onClick={() => storageForm.submit()}
				style={{
					marginRight: "10px",
				}}
			>
				Update configurations
			</Button>
			<Upload customRequest={customRequest} showUploadList={false}>
				<Button icon={<UploadOutlined />} ref={testUploadBtnRef}>
					Test upload (max 100mb)
				</Button>
			</Upload>
			<Tour
				steps={tourSteps}
				open={tourVisible}
				onClose={() => setTourVisible(false)}
			/>
		</Spin>
	);
};

export default Storage;
