import React from "react";
import { getAuth } from "firebase/auth";
import { useRouter } from "next/router";
import ErrorMessage from "../../components/ErrorMessage";
import EditVocab from "../../components/customVocab/EditVocab";
import { useAuthState } from "react-firebase-hooks/auth";

const edit = (): JSX.Element => {
  const [user] = useAuthState(getAuth());
  if (!user)
    return (
      <ErrorMessage
        message="You need to login to add or edit units"
        backURL="/"
      />
    );

  const { title: unitTitle } = useRouter().query;
  if (unitTitle === undefined) {
    //i- means adding a new unit
    return <EditVocab unitData={undefined} currUser={user} id={undefined} />;
  }

  return (
    <div>
      <h1>Unit Title: {unitTitle}</h1>
    </div>
  );
};

export default edit;
