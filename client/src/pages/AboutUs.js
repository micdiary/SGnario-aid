import React, { useState } from 'react';
import { Anchor, Button, Carousel } from 'antd';

import register from "../assets/register.jpg";
import login from "../assets/login.jpg";
import reset from "../assets/reset.jpg";
import profile from "../assets/profile.jpg";
import changepw from "../assets/change password.jpg";

import scenarios from "../assets/scenarios.jpg";
import category from "../assets/category.jpg";
import filter from "../assets/filter.jpg";

// css for about us
const styles = {
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    textAlign: 'center',
  },
  h2: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "20px",
  },
  p: {
    fontSize: "16px",
    marginBottom: "12px",
    lineHeight: "1.5",
    textAlign: "justify",
  },
  carouselImageContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  carouselImage: {
    maxWidth: "950px",
    maxHeight: "100%",
  },
  h3: {
    fontSize: "18px",
    marginBottom: "20px",
  },
}

const AboutUs = () => {
  const [showButton, setShowButton] = useState(false)

  const handleScroll = () => {
    const scrollTop =
      document.documentElement.scrollTop || document.body.scrollTop
    setShowButton(scrollTop > 0)
  }

  const scrollToTop = () => {
    window.scrollTo(0, 0)
  }

  window.addEventListener('scroll', handleScroll)

  return (
    <>
      <h2 style={styles.h2}>About Us</h2>

      <p style={styles.p}>
        Sgnario-aid is an updated and improved version of Scenari-Aid, which is
        a web application created by Grant Meredith of the School of Science,
        Information Technology & Engineering at Federation University Australia.
        The application is used as therapy for people with speech disabilities
        such as stuttering, voice disorders, or those recovering from stroke.
        The web application contains staged videos of different scenarios
        ranging from job interviews, to ordering food, and many more.
      </p>

      <p style={styles.p}>
        Sgnario-aid will be used as a tool for speech therapists and educators
        as a platform for them to practise different scenarios with their
        clients and for educational purposes respectively.
      </p>

      <p style={styles.p}>
        Sgnario-aid’s design will follow Scenari-Aid, and it will contain
        additional features like scoring and a record storing system to enhance
        its existing capabilities. The scenarios are tailored to be more in line
        with scenarios that will be faced in Singapore.
      </p>
      <h3 style={styles.p}>
        You can also read the following guide to learn more.
      </h3>

      <div style={{ padding: '20px' }}>
        <Anchor
          direction="horizontal"
          items={[
            {
              key: 'Account',
              href: '#account',
              title: 'Account',
            },
            {
              key: 'Scenarios',
              href: '#scenarios',
              title: 'Scenarios',
            },
          ]}
        />
      </div>
      <div>
        <div
          id="account"
          style={{
            height: '70vh',
            textAlign: 'center',
            background: 'lightGrey',
          }}
        >
          <Carousel autoplay autoplaySpeed={4000}>
            <div>
              <h3 style={styles.h2}>Register</h3>
              <p style={styles.h3}>
                To begin using the simulated scenarios, please register or login
                to your free SGnario-Aid account.
              </p>
              <div style={styles.carouselImageContainer}>
                <img
                  src={register}
                  alt="Account"
                  style={styles.carouselImage}
                />{' '}
                {/*insert register account image*/}
              </div>
            </div>

            <div>
              <h3 style={styles.h2}>Login</h3>
              <p style={styles.h3}>
                To begin using the simulated scenarios, please register or login
                to your free SGnario-Aid account.{' '}
              </p>
              <div style={styles.carouselImageContainer}>
                <img src={login} alt="Account" style={styles.carouselImage} />{' '}
                {/*insert login image*/}
              </div>
            </div>

            <div>
              <h3 style={styles.h2}>Reset Password</h3>
              <p style={styles.h3}>
                If you are an existing user, but forgot your password. You can
                click on the forgot password to reset password.{' '}
              </p>
              <div style={styles.carouselImageContainer}>
                <img src={reset} alt="Account" style={styles.carouselImage} />{' '}
                {/*insert forgot password image*/}
              </div>
            </div>

            <div>
              <h3 style={styles.h2}>Profile</h3>
              <p style={styles.h3}>
                After logging in, you are able to view and edit your personal
                information on the Accounts page.
              </p>
              <div style={styles.carouselImageContainer}>
                <img
                  src={profile}
                  alt="Account"
                  style={{ width: '750px', height: '450px' }}
                />{' '}
                {/* insert profile image */}
                <img
                  src={changepw}
                  alt="Account"
                  style={{ width: '750px', height: '450px' }}
                />{' '}
                {/* insert change password image */}
              </div>
            </div>
          </Carousel>
        </div>

        <div
          id="scenarios"
          style={{
            height: '70vh',
            textAlign: 'center',
            background: 'grey',
          }}
        >
          <Carousel autoplay autoplaySpeed={4000}>
            <div>
              <h3 style={styles.h2}>Scenario</h3>
              <p style={styles.h3}>
                Click on the Scenario tab to view all the scenario videos in
                SGnario-Aid.{' '}
              </p>
              <div style={styles.carouselImageContainer}>
                <img
                  src={scenarios}
                  alt="Scenario"
                  style={styles.carouselImage}
                />{' '}
                {/*insert scenario image*/}
              </div>
            </div>

            <div>
              <h3 style={styles.h2}>Categories</h3>
              <p style={styles.h3}>
                View your selected category videos using our sub menu options.{' '}
              </p>
              <div style={styles.carouselImageContainer}>
                <img
                  src={category}
                  alt="Category"
                  style={styles.carouselImage}
                />{' '}
                {/*insert category image*/}
              </div>
            </div>

            <div>
              <h3 style={styles.h2}>Filtering</h3>
              <p style={styles.h3}>
                You can also make use of our filter to help you out with what
                you are looking for easily.{' '}
              </p>
              <div style={styles.carouselImageContainer}>
                <img src={filter} alt="Filter" style={styles.carouselImage} />{' '}
                {/*insert filter image*/}
              </div>
            </div>
          </Carousel>
        </div>
      </div>

      {showButton && (
        <div
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
          }}
        >
          <Button type="primary" onClick={scrollToTop}>
            Back to Top
          </Button>
        </div>
      )}
    </>
  )
}

export default AboutUs
