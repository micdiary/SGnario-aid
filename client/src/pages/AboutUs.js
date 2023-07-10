import React from 'react';

// css for about us
const styles = {
  container: {
    maxWidth: "600px",
    margin: "0 auto",
    textAlign: "center",
  },
  h2: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "20px",
  },
  p: {
    fontSize: "20px",
    marginBottom: "12px",
    lineHeight: "1.5",
    textAlign: "justify",
  },
};



const AboutUs = () => {
  return (
    <>
      <h2 style={styles.h2}>About Us</h2>

      <p style={styles.p}>
        Sgnario-aid is an updated and improved version oScenari-Aid, which is a web application created by Grant Meredith of the School of Science, Information Technology & Engineering at Federation University Australia. The application is used as therapy for people with speech disabilities such as stuttering, voice disorders, or those recovering from stroke. The web application contains staged videos of different scenarios ranging from job interviews, to ordering food, and many more.
      </p>

      <p style={styles.p}>
        Sgnario-aid will be used as a tool for speech therapists and educators as a platform for them to practise different scenarios with their clients and for educational purposes respectively.
      </p>

      <p style={styles.p}>
        Sgnario-aid’s design will follow Scenari-Aid, and it will contain additional features like scoring and a record storing system to enhance its existing capabilities. The scenarios are tailored to be more in line with scenarios that will be faced in Singapore.
      </p>

    </>

  );
}

export default AboutUs;