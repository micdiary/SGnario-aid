import React from "react";

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
};


const Tutorial = () => {
  return (
    <>
      <h2 style={styles.h2}>Tutorial</h2>

      <p style={styles.p}>Below is a short video tutorial that would teach you how to use SGnario-Aid.</p>

      <div>
        <iframe
          width="560"
          height="315"
          src="https://www.youtube.com/embed/5HZ9qeFjhYk"
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>

      <br></br><br></br>
      <p style={styles.p}>You can also read the following guide to learn more.</p>
    </>
  );
}

export default Tutorial;