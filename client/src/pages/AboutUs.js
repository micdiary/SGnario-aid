import React from "react";
import { Card, Row, Col, Typography } from "antd";

import card1 from "../assets/card1.jpg";
import card2 from "../assets/card2.jpg";
import card3 from "../assets/card3.jpg";
import card4 from "../assets/card4.jpeg";

const { Meta } = Card;

const cardStyle = {
	height: "100%",
	marginBottom: 16,
};

const AboutUs = () => {
	return (
		<>
			<Typography.Title level={1}>About Speech Therapy</Typography.Title>
			<Row gutter={[16, 16]}>
				<Col xxl={6} xl={8} md={12} xs={24}>
					<Card
						hoverable
						style={cardStyle}
						cover={
							<img alt="example" src={card1} style={{ height: "200px" }} />
						}
					>
						<Meta
							title="What is Speech Therapy?"
							description={
								<div>
									<Typography.Paragraph align="justify">
										Speech-language pathology is a healthcare field of expertise
										practiced globally.
									</Typography.Paragraph>
									<Typography.Paragraph align="justify">
										Speech therapy, also known as speech-language pathology or
										speech-language therapy, is a specialized field of
										healthcare that focuses on diagnosing and treating
										communication disorders and swallowing disorders.
										Speech-language pathologists (SLPs) are trained
										professionals who provide speech therapy services to
										individuals of all ages, from infants to older adults. The
										primary goal of speech therapy is to help individuals
										improve their communication skills and overcome difficulties
										related to speech, language, and swallowing.
									</Typography.Paragraph>
								</div>
							}
						/>
					</Card>
				</Col>
				<Col xxl={6} xl={8} md={12} xs={24}>
					<Card
						hoverable
						style={cardStyle}
						cover={
							<img alt="example" src={card2} style={{ height: "200px" }} />
						}
					>
						<Meta
							title="What activities are done in speech therapy?"
							description={
								<div>
									<Typography.Paragraph align="justify">
										For children, speech therapy usually involves play, like
										sequencing activities or language-based board games.
									</Typography.Paragraph>
									<Typography.Paragraph align="justify">
										For adults, speech therapy is usually focused on improving
										or rebuilding particular skill sets like strengthening
										coordination between your brain and mouth.
									</Typography.Paragraph>
									<Typography.Paragraph align="justify">
										Some activities includes:
									</Typography.Paragraph>
									<Typography.Paragraph align="justify">
										<ul>
											<li>Tongue and mouth exercises</li>
											<li>Facial movements</li>
											<li>Reading out loud</li>
											<li>Playing word games</li>
										</ul>
									</Typography.Paragraph>
								</div>
							}
						/>
					</Card>
				</Col>
				<Col xxl={6} xl={8} md={12} xs={24}>
					<Card
						hoverable
						style={cardStyle}
						cover={
							<img alt="example" src={card3} style={{ height: "200px" }} />
						}
					>
						<Meta
							title="What are the benefits?"
							description={
								<div>
									<Typography.Paragraph align="justify">
										Speech therapy offers numerous benefits for individuals with
										communication and swallowing disorders. Here are some key
										advantages of speech therapy:
									</Typography.Paragraph>
									<Typography.Paragraph align="justify">
										Some Benefits includes:{" "}
									</Typography.Paragraph>
									<Typography.Paragraph align="justify">
										<ul>
											<li>
												Improved communication skills and clarity of speech.
											</li>
											<li>Enhanced language development and understanding.</li>
											<li>
												Increased confidence in expressing thoughts and ideas.
											</li>
											<li>Increased fluency and smoother speech patterns.</li>
											<li>
												Enhanced social skills and ability to connect with
												others.
											</li>
											<li>
												Support for cognitive skills and overcoming
												communication challenges.
											</li>
										</ul>
									</Typography.Paragraph>
								</div>
							}
						/>
					</Card>
				</Col>
				<Col xxl={6} xl={8} md={12} xs={24}>
					<Card
						hoverable
						style={cardStyle}
						cover={
							<img alt="example" src={card4} style={{ height: "200px" }} />
						}
					>
						<Meta
							title="Tips to Make Speech Therapy Successful"
							description={
								<Typography.Paragraph align="justify">
									<ul>
										<li>
											Carryover
											<ul>
												<li>
													Carryover is a highly important aspect of speech
													therapy. The success of speech therapy depends
													significantly on the individual’s ability to receive
													additional practice time.
												</li>
											</ul>
										</li>
									</ul>
									<ul>
										<li>
											Prioritizing Speech Therapy
											<ul>
												<li>
													Speech therapy can only be successful if it is made a
													priority. Taking breaks from speech therapy can result
													in regressing newly acquired skills and often will
													prolong the speech therapy progress.
												</li>
											</ul>
										</li>
									</ul>
									<ul>
										<li>
											Positive Experience
											<ul>
												<li>
													Speech therapists work hard to ensure that speech
													therapy is a positive experience for all of the
													individuals they work with. When speech therapy is
													enjoyable, participation is more likely, and
													motivation to work and focus is increased.
												</li>
											</ul>
										</li>
									</ul>
								</Typography.Paragraph>
							}
						/>
					</Card>
				</Col>
			</Row>
		</>
	);
};

export default AboutUs;
