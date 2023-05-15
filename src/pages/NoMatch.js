import React from "react";
import WorkInProgress from "../assets/workinprogress.svg";

const NoMatch = () => {
  return (
    <div class="no-match" style={{ textAlign: "center" }}>
      <h1>Sorry, we are still working on it!</h1>
      <img src={WorkInProgress} alt="WorkInProgress" style={{ height: 200 }} />
    </div>
  );
};

export default NoMatch;
