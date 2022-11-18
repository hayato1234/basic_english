import React from "react";
import { getAuth } from "firebase/auth";
import ErrorMessage from "../../components/ErrorMessage";
import EditVocab from "../../components/customVocab/EditVocab";
import { useAuthState } from "react-firebase-hooks/auth";

const Edit = (): JSX.Element => {
  // const { title: unitTitle } = useRouter().query;
  const [user] = useAuthState(getAuth());

  if (!user)
    return (
      <ErrorMessage
        message="You need to login to add or edit units"
        backURL="/"
      />
    );

  return <EditVocab unitData={undefined} currUser={user} id={undefined} />;
};

export default Edit;
