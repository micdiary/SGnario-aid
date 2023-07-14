import React from 'react'

import * as constants from '../constants'

import logo from '../assets/logo.jpg'
import videos from '../assets/videos.jpg'
import steps from '../assets/steps.jpg'

import card1 from '../assets/card1.jpg'
import card2 from '../assets/card2.jpg'
import card3 from '../assets/card3.jpg'
import card4 from '../assets/card4.jpg'

import { Carousel, Card, Row, Col } from 'antd'
const { Meta } = Card

// css for intro
const styles = {
  h1: {
    fontSize: '32px',
    fontWeight: 'bold',
    margin: '12px 0',
    wordWrap: 'break-word',
  },
  h2: {
    fontSize: '26px',
    fontWeight: 'bold',
    margin: '12px 0',
    wordWrap: 'break-word',
  },
  h3: {
    fontSize: '18px',
    margin: '12px 0',
    wordWrap: 'break-word',
  },
  p: {
    fontSize: '20px',
    margin: '12px 0',
    wordWrap: 'break-word',
  },

  // css for carousel
  carouselImageContainer: {
    height: '500px',
    width: '100%',
    textAlign: 'center',
    flexDirection: 'column',
    margin: 'auto',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  carouselImage: {
    width: '700px',
    height: '350px',
  },
}

// css for card
const cardStyle = {
  height:'100%',
  marginBottom: 16,
}

const Home = () => {
  return (
    <>
      <div>
        <br />
        <h1 style={styles.h1}>Welcome to SGnario-Aid</h1>
        <h2 style={styles.h2}>The Simulated Scenario System</h2>

        <p style={styles.p}>
          Improve your social, interview, and speech skills by practicing
          real-life interactions with the free SGnario-Aid Simulated Scenario
          System. SGnario-Aid contains over 100 recorded video scenarios for you
          to work through. To learn more about this exciting system, visit the{' '}
          <a href={constants.ABOUT_US_URL}>About Us</a> page.
        </p>

        <p style={styles.p}>
          To begin using the simulated scenarios, please{' '}
          <a href={constants.REGISTER_URL}>Register</a> or{' '}
          <a href={constants.LOGIN_URL}>Login</a> to your free SGnario-Aid
          account and then navigate to the scenarios by the scenarios menu item.
        </p>
      </div>

      <br></br>
      <br></br>
      <br></br>
      <div>
        {/* codes for carousel */}
        <Carousel autoplay autoplaySpeed={4000}>
          <div>
            <div style={styles.carouselImageContainer}>
              <h3 style={styles.h2}>Want to try out SGnario-Aid for free?</h3>
              <p style={styles.h3}>
                Click on the link to sign up now!{' '}
                <a href={constants.REGISTER_URL}> Sign Up</a>
              </p>
              <img src={logo} alt="logo" style={styles.carouselImage} />
            </div>
          </div>

          <div>
            <div style={styles.carouselImageContainer}>
              <h3 style={styles.h2}>Over 100 staged streaming videos to try</h3>
              <p style={styles.h3}>
                Scenarios of different categories to try out for free!{' '}
                <a href={constants.SCENARIOS_URL}> View More</a>
              </p>
              <img src={videos} alt="videos" style={styles.carouselImage} />
            </div>
          </div>

          <div>
            <div style={styles.carouselImageContainer}>
              <h3 style={styles.h2}>Seamless and easy to use</h3>
              <p style={styles.h3}>
                With a guide to teach you how to use!{' '}
                <a href={constants.ABOUT_US_URL}> View More</a>
              </p>
              <img src={steps} alt="steps" style={styles.carouselImage} />
            </div>
          </div>
        </Carousel>
      </div>
      <br></br>
      <br></br>
      <br></br>

      {/* codes for card */}
      <Row gutter={[16,16]}>
        <Col lg={8} md={12} xs={24}>
          <Card
            hoverable
            style={cardStyle}
            cover={
              <img alt="example" src={card1} style={{ height: '200px' }} />
            }
          >
            <Meta
              title="What is Speech Therapy?"
              description={
                <div>
                  <p>
                    "Speech-language pathology is a healthcare field of
                    expertise practiced globally.{' '}
                  </p>
                  <p>
                    Speech-language pathology specializes in the evaluation,
                    diagnosis, treatment, and prevention of communication
                    disorders, cognitive-communication disorders, voice
                    disorders, and swallowing disorder across the lifelg.{' '}
                  </p>
                </div>
              }
            />
          </Card>
        </Col>
        <Col lg={8} md={12} xs={24}>
          <Card
            hoverable
            style={cardStyle}
            cover={
              <img alt="example" src={card2} style={{ height: '200px' }} />
            }
          >
            <Meta
              title="What activities are done in speech therapy?"
              description={
                <div>
                  <p>
                    For children, speech therapy usually involves play, like
                    sequencing activities or language-based board games.{' '}
                  </p>
                  <p>
                    For adults, speech therapy is usually focused on improving
                    or rebuilding particular skill sets like strengthening
                    coordination between your brain and mouth.{' '}
                  </p>
                  <p>Some activities includes: </p>
                  <ul>
                    <li>Tongue and mouth exercises</li>
                    <li>Facial movements</li>
                    <li>Reading out loud</li>
                    <li>Playing word games</li>
                  </ul>
                </div>
              }
            />
          </Card>
        </Col>
        <Col lg={8} md={12} xs={24}>
          <Card
            hoverable
            style={cardStyle}
            cover={
              <img alt="example" src={card3} style={{ height: '200px' }} />
            }
          >
            <Meta
              title="What are the benefits?"
              description={
                <div>
                  <p>
                    The goal of speech therapy is to improve skills that will
                    allow you to communicate more effectively.
                  </p>
                  <p>Some Benefits includes: </p>
                  <ul>
                    <li>
                      Improvement in the ability to understand and express
                      thoughts, ideas and feelings
                    </li>
                    <li>
                      Increased ability to problem-solve in an independent
                      environment
                    </li>
                    <li>Development of pre-literacy skills</li>
                    <li>Development of pre-literacy skills</li>
                    <li>Fluent speech</li>
                  </ul>
                </div>
              }
            />
          </Card>
        </Col>
        <Col lg={8} md={12} xs={24}>
          <Card
            hoverable
            style={cardStyle}
            cover={
              <img alt="example" src={card4} style={{ height: '200px' }} />
            }
          >
            <Meta
              title="Tips to Make Speech Therapy Successful"
              description={
                <div>
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
                </div>
              }
            />
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default Home
