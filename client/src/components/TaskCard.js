import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Typography, Tag, Descriptions, Card } from "antd";
import { EditOutlined, LinkOutlined, FileOutlined } from "@ant-design/icons";
import * as constants from "../constants";

const TaskCard = ({ record, editCard }) => {
	const [activeTabKeyCard, setActiveTabKeyCard] = useState("Recording");

	const onTabChangeCard = (key, record) => {
		setActiveTabKeyCard(key);
	};

	const tabList = [
		{
			key: "Recording",
			tab: "Recording",
		},
		{
			key: "Patient",
			tab: "Patient",
		},
		{
			key: "Therapist",
			tab: "Therapist",
		},
	];

	const generateContentCard = (record) => {
		const contentTabList = {
			Recording: (
				<Descriptions column={{ xs: 1, sm: 1, md: 2 }}>
					<Descriptions.Item label="Recommended Duration">
						{record.recommendedLength} seconds
					</Descriptions.Item>
					<Descriptions.Item label="Recording">
						{record.recordingLink.startsWith("https:") ? (
							<Typography.Link href={record.recordingLink} target="_blank">
								<FileOutlined /> File ({record.videoDuration} seconds)
							</Typography.Link>
						) : (
							<Tag color="yellow">No Recording submitted</Tag>
						)}
					</Descriptions.Item>
					{record.dateSubmitted && (
						<Descriptions.Item label="Date Submitted">
							{record.dateSubmitted}
						</Descriptions.Item>
					)}
				</Descriptions>
			),
			Patient: (
				<Descriptions column={{ xs: 1, sm: 1, md: 2 }}>
					<Descriptions.Item label="Stutter">
						{record.patientStutter === "" ? (
							<Tag color="yellow">Pending</Tag>
						) : (
							<Tag color="green">{record.patientStutter}</Tag>
						)}
					</Descriptions.Item>
					<Descriptions.Item label="Fluency">
						{record.patientFluency === "" ? (
							<Tag color="yellow">Pending</Tag>
						) : (
							<Tag color="green">{record.patientFluency}</Tag>
						)}
					</Descriptions.Item>
					<Descriptions.Item label="Remark">
						{record.patientRemark}
					</Descriptions.Item>
				</Descriptions>
			),
			Therapist: (
				<Descriptions column={{ xs: 1, sm: 1, md: 2 }}>
					<Descriptions.Item label="Stutter">
						{record.therapistStutter === "" ? (
							<Tag color="yellow">Pending</Tag>
						) : (
							<Tag color="green">{record.therapistStutter}</Tag>
						)}
					</Descriptions.Item>
					<Descriptions.Item label="Fluency">
						{record.therapistFluency === "" ? (
							<Tag color="yellow">Pending</Tag>
						) : (
							<Tag color="green">{record.therapistFluency}</Tag>
						)}
					</Descriptions.Item>
					<Descriptions.Item label="Remark">
						{record.therapistRemark}
					</Descriptions.Item>
				</Descriptions>
			),
		};

		return contentTabList[activeTabKeyCard];
	};

	return (
		<Card
			style={{ minHeight: "300px" }}
			title={
				<Link
					to={`${constants.SCENARIOS_URL}?category=${encodeURIComponent(
						record.category
					)}&scenario=${encodeURIComponent(record.scenario)}`}
					target="_blank"
				>
					<LinkOutlined />
					&nbsp;
					{record.videoName}
				</Link>
			}
			tabList={tabList}
			activeTabKey={activeTabKeyCard}
			onTabChange={(key) => onTabChangeCard(key, record)}
			extra={
				<EditOutlined
					onClick={() => {
						editCard(record);
					}}
				/>
			}
		>
			{generateContentCard(record)}
		</Card>
	);
};

export default TaskCard;
