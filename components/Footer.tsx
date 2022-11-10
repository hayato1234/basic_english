import Link from "next/link";
import React from "react";
import { useSpring, animated } from "react-spring";
import { Container, Row, Col } from "reactstrap";

const Footer = () => {
  const fadeIn = useSpring({
    to: { opacity: 1 },
    from: { opacity: 0 },
    delay: 2000,
  });
  return (
    <animated.div style={fadeIn}>
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
    </animated.div>
  );
};

export default Footer;
