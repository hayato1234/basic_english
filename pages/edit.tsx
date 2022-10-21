import React from "react";
import { getAuth } from "firebase/auth";
import { useRouter } from "next/router";
import ErrorMessage from "../components/ErrorMessage";

const edit = (): JSX.Element => {
  const user = getAuth().currentUser;

  if (!user)
    return (
      <ErrorMessage
        message="You need to login to add or edit units"
        backURL="/"
      />
    );

  const { title: unitTitle } = useRouter().query;
  if (!unitTitle)
    return <ErrorMessage message={`${unitTitle} not found`} backURL="/" />;

  return (
    <div>
      <h1>Unit Title: {unitTitle}</h1>
    </div>
  );
};

export default edit;
