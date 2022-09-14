import Image from "next/image";
import React from "react";
// import { Link } from "react-router-dom";
import { Col, Container, Row } from "reactstrap";
// import myImage from "../public/assets/images/bg-home.jpg"
const myImage = require("../public/assets/images/bg-home.jpg");

const Home = () => {
  return (
    <Container>
      <Row>
        <Col>
          <h1>Welcome to Basic English Grammar page!</h1>
        </Col>
      </Row>
      <Row className="mt-2">
        {/* <Link to="/grammar">
          <button>Learn Grammar</button>
        </Link> */}
        <h1>hello</h1>
        {/* <Image src={myImage} /> */}
      </Row>
    </Container>
  );
};

export default Home;
