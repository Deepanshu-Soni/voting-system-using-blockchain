import React from "react";
import { Spinner, Image } from "react-bootstrap";
const SpinnerBar = () => {
  return (
    <Spinner
      animation="grow"
      style={{
        width: "100px",
        height: "100px",
        margin: "auto",
        display: "block",
        marginTop: "4rem",
      }}
    ></Spinner>
   
  );
};

export default SpinnerBar;