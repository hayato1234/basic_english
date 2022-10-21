import Link from "next/link";
import React from "react";
import { Container } from "reactstrap";

const ErrorMessage = ({ message, backURL }) => {
  return (
    <Container>
      <Link href={backURL}>
        <i className="fa fa-arrow-left" aria-hidden="true" />
      </Link>
      <h1>Error</h1>
      <p>{message}</p>
    </Container>
  );
};

export default ErrorMessage;
