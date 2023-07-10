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

const { Link } = Anchor;

// css for tutorial
const styles = {
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
};

const Tutorial = () => {
  const [showButton, setShowButton] = useState(false);

  const handleScroll = () => {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    setShowButton(scrollTop > 0);
  };

  const scrollToTop = () => {
    window.scrollTo(0, 0);
  };


  window.addEventListener('scroll', handleScroll);

  return (
    <>
      <h2 style={styles.h2}>Tutorial</h2>

      <h3 style={styles.p}>Below is a video tutorial that would teach you how to use SGnario-Aid.</h3>

      <div>
        <iframe
          width="560"
          height="315"
          src="https://www.youtube.com/embed/XMQJ7fMlPWc"
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>

      <br></br><br></br>
      <h3 style={styles.p}>You can also read the following guide to learn more.</h3>

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
              <p style={styles.h3}>To begin using the simulated scenarios, please register or login to your free SGnario-Aid account.</p>
              <div style={styles.carouselImageContainer}>
                <img src={register} alt="Account Image" style={styles.carouselImage} />  {/*insert register account image*/}
              </div>
            </div>

            <div>
              <h3 style={styles.h2}>Login</h3>
              <p style={styles.h3}>To begin using the simulated scenarios, please register or login to your free SGnario-Aid account. </p>
              <div style={styles.carouselImageContainer}>
                <img src={login} alt="Account Image" style={styles.carouselImage} />  {/*insert login image*/}
              </div>
            </div>

            <div>
              <h3 style={styles.h2}>Reset Password</h3>
              <p style={styles.h3}>If you are an existing user, but forgot your password. You can click on the forgot password to reset password. </p>
              <div style={styles.carouselImageContainer}>
                <img src={reset} alt="Account Image" style={styles.carouselImage} />  {/*insert forgot password image*/}
              </div>
            </div>

            <div>
              <h3 style={styles.h2}>Profile</h3>
              <p style={styles.h3}>After logging in, you are able to view and edit your personal information on the Accounts page.</p>
              <div style={styles.carouselImageContainer}>
                <img src={profile} alt="Account Image" style={{ width: "750px", height: "450px" }} /> {/* insert profile image */}
                <img src={changepw} alt="Account Image" style={{ width: "750px", height: "450px" }} /> {/* insert change password image */}
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
              <p style={styles.h3}>Click on the Scenario tab to view all the scenario videos in SGnario-Aid. </p>
              <div style={styles.carouselImageContainer}>
                <img src={scenarios} alt="Scenario" style={styles.carouselImage} />  {/*insert scenario image*/}
              </div>
            </div>

            <div>
              <h3 style={styles.h2}>Categories</h3>
              <p style={styles.h3}>View your selected category videos using our sub menu options. </p>
              <div style={styles.carouselImageContainer}>
                <img src={category} alt="Category" style={styles.carouselImage} />  {/*insert category image*/}
              </div>
            </div>

            <div>
              <h3 style={styles.h2}>Filtering</h3>
              <p style={styles.h3}>You can also make use of our filter to help you out with what you are looking for easily. </p>
              <div style={styles.carouselImageContainer}>
                <img src={filter} alt="Filter" style={styles.carouselImage} />  {/*insert filter image*/}
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
  );
};

export default Tutorial;
