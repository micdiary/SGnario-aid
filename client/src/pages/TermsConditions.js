import React from "react";

const styles = {
  h2: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "20px",
  },
  h3: {
    fontSize: "18px",
    fontWeight: "bold",
    marginTop: "24px",
    marginBottom: "12px",
  },
  ul: {
    listStyleType: "disc",
    marginLeft: "24px",
    marginBottom: "12px",
  },
  li: {
    marginBottom: "8px",
  },
  strong: {
    fontWeight: "bold",
  },
  p: {
    marginBottom: "8px",
  },
};


const TermsConditions = () => {
  return (
    <>
      <h2 style={styles.h2}>Terms &amp; Conditions</h2>

      <div>
        <h3 style={styles.h3}>You are free:</h3>
        <ul style={styles.ul}>
          <li style={styles.li}>You are free to distribute the URL of this website to friends, family, and colleagues.</li>
        </ul>
      </div>

      <div>
        <h3 style={styles.h3}>Under the following conditions:</h3>
        <ul style={styles.ul}>
          <li style={styles.li}>
            <strong>Attribution:</strong> You must attribute the work in the manner specified by the author or licensor (but not in any way that suggests that they endorse you or your use of the work). You must ensure SIT is attributed as the author.
          </li>
        </ul>
      </div>

      <div>
        <h3 style={styles.h3}>Non-Commercial:</h3>
        <ul style={styles.ul}>
          <li style={styles.li}>You may not use SGnario-Aid web site for commercial purposes.</li>
          <li style={styles.li}>You are not allowed to profit directly from the contents and purpose of the SGnario-Aid web site.</li>
          <li style={styles.li}>You are not allowed to charge access fees to the SGnario-Aid web site.</li>
        </ul>
      </div>

      <div>
        <h3 style={styles.h3}>Research:</h3>
        <ul style={styles.ul}>
          <li style={styles.li}>
            You may use the SGnario-Aid web site for research purposes under the following conditions:
            <ul style={styles.ul}>
              <li style={styles.li}>Your research must be approved by an appropriately accredited Ethics Committee.</li>
              <li style={styles.li}>You describe the purpose, aims, and methodology of your project.</li>
              <li style={styles.li}>You request permission from SIT.</li>
            </ul>
          </li>
        </ul>
      </div>

      <div>
        <h3 style={styles.h3}>Education:</h3>
        <ul style={styles.ul}>
          <li>
            SGnario-Aid web site can be used for educational purposes under the following conditions:
            <ul style={styles.ul}>
              <li style={styles.li}>You are registered as an educational services provider with government authorities in your jurisdiction.</li>
              <li style={styles.li}>You describe the context of the use of the SGnario-Aid web site.</li>
              <li style={styles.li}>You request permission from SIT.</li>
            </ul>
          </li>
        </ul>
      </div>

      <div>
        <h3 style={styles.h3}>No Derivative Works:</h3>
        <ul style={styles.ul}>
          <li style={styles.li}>You may not alter, transform, or build upon this work.</li>
        </ul>
      </div>

      <h3 style={styles.h3}>With the understanding that:</h3>

      <div>
        <h3 style={styles.h3}>Waiver:</h3>
        <ul style={styles.ul}>
          <li style={styles.li}>Any of the above conditions can be waived if you get permission from SIT.</li>
        </ul>
      </div>

      <div>
        <h3 style={styles.h3}>Public Domain:</h3>
        <ul style={styles.ul}>
          <li style={styles.li}>Where the work or any of its elements is in the public domain under applicable law, that status is in no way affected by the license.</li>
        </ul>
      </div>

      <div>
        <h3 style={styles.h3}>Other Rights:</h3>
        <ul style={styles.ul}>
          <li style={styles.li}>
            In no way are any of the following rights affected by the license:
            <ul style={styles.ul}>
              <li style={styles.li}>Your fair dealing or fair use rights, or other applicable copyright exceptions and limitations.</li>
              <li style={styles.li}>The author's moral rights.</li>
              <li style={styles.li}>Rights other persons may have either in the work itself or in how the work is used, such as publicity or privacy rights.</li>
            </ul>
          </li>
        </ul>
      </div>
    </>
  );
}

export default TermsConditions;
