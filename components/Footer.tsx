import Link from "next/link";
import React from "react";
import { Container, Row, Col } from "reactstrap";

const Footer = () => {
  return (
    <footer className="site-footer">
      <Container>
        <hr />
        <Row>
          <Col md="4">
            <h5>Links</h5>
            <ul className="list-unstyled offset-1">
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="/vocabulary">Vocabulary</Link>
              </li>
              <li>
                <Link href="/grammar">Grammar</Link>
              </li>
            </ul>
          </Col>
          <Col md="4">
            <p className="text-center">COPYRIGHT ©️ HayaTan Project 2022</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
