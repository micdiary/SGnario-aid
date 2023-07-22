import { Card, Col, Row, Typography } from "antd";
import React from "react";
import heroIcon from "../assets/heroIcon.svg";
import wave from "../assets/wave.svg";
import feedback from "../assets/feedback.svg";
import videoStorage from "../assets/videoStorage.svg";
import taskAssignment from "../assets/taskAssignment.svg";
import { useMediaQuery } from "react-responsive";

const Home = () => {
	// media query for mobile
	const isLaptop = useMediaQuery({
		query: "(min-width: 1024px)",
	});

	return (
		<div
			style={{
				margin: "0 -50px",
				marginTop: "-24px",
			}}
		>
			<Row
				justify={"space-evenly"}
				align={"middle"}
				gutter={[0, 24]}
				style={{
					padding: "12px 50px",
					backgroundColor: "rgba(255, 235, 201, 1)",
				}}
			>
				<Col xs={24} md={12}>
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							margin: "0 auto",
							width: "75%",
						}}
					>
						<Typography.Title level={1}>SGnario-Aid</Typography.Title>
						<Typography.Text
							style={{
								fontSize: "18px",
							}}
						>
							A learning management system, enabling speech therapists to engage
							patients in practice scenarios, and serve as an educational
							platform for educators and students as well.
						</Typography.Text>
					</div>
				</Col>
				<Col xs={24} md={12}>
					<img
						style={{
							display: "block",
							margin: "0 auto",
						}}
						width={isLaptop ? "60%" : "80%"}
						src={heroIcon}
						alt="hero"
					/>
				</Col>
			</Row>
			<img
				width={"100%"}
				src={wave}
				alt="wave"
				style={{
					marginBottom: "32px",
				}}
			/>
			<Row
				gutter={[24, 24]}
				style={{
					margin: "0 50px",
				}}
			>
				<Col xs={24} md={8}>
					<Card title="Performance Review System"
		>
						<img
							width="65%"
							style={{
								margin: "0 auto",
								display: "block",
								aspectRatio: "1/1",
							}}
							src={feedback}
							alt="feedback"
						/>
						<Typography.Text>
							Drive personal and professional growth with comprehensive self and
							professional evaluation tools
						</Typography.Text>
					</Card>
				</Col>
				<Col xs={24} md={8}>
					<Card title="Video Storage Management">
						<img
							width="65%"
							style={{
								margin: "0 auto",
								display: "block",
								aspectRatio: "1/1",
							}}
							src={videoStorage}
							alt="video storage"
						/>
						<Typography.Text>
							Streamlined existing video storage processes with efficiently
							managed solutions
						</Typography.Text>
					</Card>
				</Col>
				<Col xs={24} md={8}>
					<Card title="Personalised Task Assignment">
						<img
							width="65%"
							style={{
								margin: "0 auto",
								display: "block",
								aspectRatio: "1/1",
							}}
							src={taskAssignment}
							alt="task assignment"
						/>
						<Typography.Text>
							Tailored assignments based on individual requirements
						</Typography.Text>
					</Card>
				</Col>
			</Row>
		</div>
	);
};

export default Home;
