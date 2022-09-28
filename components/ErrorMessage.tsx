import Link from "next/link";
import React from "react";

const ErrorMessage = ({ message, backURL }) => {
  return (
    <>
      <Link href={backURL}>
        <i className="fa fa-arrow-left" aria-hidden="true" />
      </Link>
      <h1>Error</h1>
      <p>{message}</p>
    </>
  );
};

export default ErrorMessage;
