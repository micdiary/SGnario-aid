import React, { useEffect, useState } from "react";
import { Input, Button, Table, Typography, Popconfirm, Form } from "antd";
import { getTaskById } from "../../api/task";

const { Column, ColumnGroup } = Table;
const Task = ({ taskID, setView }) => {
	const [count, setCount] = useState(0);
	const [expandableData, setExpandableData] = useState([]);
	const [editingKey, setEditingKey] = useState("");
	const isEditing = (record) => record.key === editingKey;

	const EditableCell = ({
		editing,
		dataIndex,
		title,
		inputType,
		record,
		index,
		children,
		...restProps
	}) => {
		return (
			<td {...restProps}>
				{editing ? (
					<Form.Item
						name={dataIndex}
						style={{
							margin: 0,
						}}
						rules={[
							{
								required: true,
								message: `Please Input ${title}!`,
							},
						]}
					>
						<Input />
					</Form.Item>
				) : (
					children
				)}
			</td>
		);
	};

	useEffect(() => {
		getTaskById(taskID).then((res) => {
			console.log(res);
		});
	}, [taskID]);

	const [form] = Form.useForm();

	const edit = (record) => {
		form.setFieldsValue({
			selfEvaluation: "",
			selfScore: "",
			...record,
		});
		setEditingKey(record.key);
	};

	const cancel = () => {
		setEditingKey("");
	};

	const save = async (key) => {
		try {
			const row = await form.validateFields();
			const newData = [...expandableData];
			const index = newData.findIndex((item) => key === item.key);
			if (index > -1) {
				const item = newData[index];
				newData.splice(index, 1, {
					...item,
					...row,
				});
				setExpandableData(newData);
				setEditingKey("");
			} else {
				newData.push(row);
				setExpandableData(newData);
				setEditingKey("");
			}
		} catch (errInfo) {
			console.log("Validate Failed:", errInfo);
		}
	};

	const expandedRowRender = () => {
		const columns = [
			{
				title: "video",
				dataIndex: "video",
				key: "video",
			},
			{
				title: "Self Evaluation",
				dataIndex: "selfEvaluation",
				key: "selfEvaluation",
				editable: true,
			},
			{
				title: "Self Score",
				dataIndex: "selfScore",
				key: "selfScore",
				editable: true,
			},
			{
				title: "Therapist Feedback",
				dataIndex: "therapistFeedback",
				key: "therapistFeedback",
			},
			{
				title: "Therapist Score",
				dataIndex: "therapistScore",
				key: "therapistScore",
			},
			{
				title: "Action",
				dataIndex: "action",
				key: "action",
				render: (_, record) => {
					const editable = isEditing(record);
					return editable ? (
						<span>
							<Typography.Link
								onClick={() => save(record.key)}
								style={{
									marginRight: 8,
								}}
							>
								Save
							</Typography.Link>
							<Popconfirm title="Sure to cancel?" onConfirm={cancel}>
								<Typography.Link>Cancel</Typography.Link>
							</Popconfirm>
						</span>
					) : (
						<Typography.Link
							disabled={editingKey !== ""}
							onClick={() => edit(record)}
						>
							Edit
						</Typography.Link>
					);
				},
			},
		];

		const mergedColumns = columns.map((col) => {
			if (!col.editable) {
				return col;
			}
			return {
				...col,
				onCell: (record) => ({
					record,
					inputType: col.dataIndex === "age" ? "number" : "text",
					dataIndex: col.dataIndex,
					title: col.title,
					editing: isEditing(record),
				}),
			};
		});

		return (
			<Form form={form} component={false}>
				<Table
					columns={mergedColumns}
					dataSource={expandableData}
					pagination={false}
					components={{
						body: {
							cell: EditableCell,
						},
					}}
				/>
			</Form>
		);
	};

	const data = [
		{
			key: "0",
			id: "0",
			scenario: "Scenario 1",
			type: "Type 1",
			date: "2021-01-01",
		},
	];

	const handleAdd = () => {
		const newData = {
			key: count,
			video: count,
			selfEvaluation: `Self Evaluation ${count}`,
			selfScore: `Self Score ${count}`,
			therapistFeedback: `Therapist Feedback ${count}`,
			therapistScore: `Therapist Score ${count}`,
		};
		setExpandableData([...expandableData, newData]);
		setCount(count + 1);
	};

	return (
		<>
			<Button
				onClick={() => {
					setView("dashboard");
				}}
				type="primary"
				style={{
					marginRight: 16,
				}}
			>
				Back
			</Button>
			<Button
				onClick={handleAdd}
				type="primary"
				style={{
					marginBottom: 16,
				}}
			>
				Add a row
			</Button>
			<Table
				expandable={{ expandedRowRender, defaultExpandedRowKeys: ["0"] }}
				dataSource={data}
				pagination={false}
			>
				<Column title="Video Title" dataIndex="title" key="title"></Column>
				<ColumnGroup title="Self Evaluation">
					<Column
						title="Stuttering"
						dataIndex="selfEvaluationStuttering"
						key="selfEvaluationStuttering"
					/>
					<Column
						title="Fluency"
						dataIndex="selfEvaluationFluency"
						key="selfEvaluationFluency"
					/>
				</ColumnGroup>
				<ColumnGroup title="Therapist Evaluation">
					<Column
						title="Stuttering"
						dataIndex="therapistEvaluationStuttering"
						key="therapistEvaluationStuttering"
					/>
					<Column
						title="Fluency"
						dataIndex="therapistEvaluationFluency"
						key="therapistEvaluationFluency"
					/>
				</ColumnGroup>
				<Column
					title="Recording"
					dataIndex="recording"
					key="recording"
				></Column>
				<Column
					title="Date Added"
					dataIndex="dateAdded"
					key="dateAdded"
				></Column>
				<Column title="Action" key="action"></Column>
			</Table>
		</>
	);
};

export default Task;
