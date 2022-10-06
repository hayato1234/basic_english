import React, { ReactNode } from "react";
import { Container, Row } from "reactstrap";

const user = () => {
  const isTrue = true;
  let message: ReactNode;
  if (isTrue) {
    message = <p>true</p>;
  } else {
    message = <p>false</p>;
  }

  return (
    <Container>
      <Row>user</Row>
      {message}
    </Container>
  );
};

export default user;
