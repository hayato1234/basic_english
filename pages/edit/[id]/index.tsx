import { getAuth } from "firebase/auth";
import { doc } from "firebase/firestore";
import { useRouter } from "next/router";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useDocument } from "react-firebase-hooks/firestore";
import EditVocab from "../../../components/customVocab/EditVocab";
import ErrorMessage from "../../../components/ErrorMessage";
import { db } from "../../../utils/initAuth";
import { DB_USER_VOCAB } from "../../../utils/staticValues";

const RenderVocab = ({ id, user }) => {
  const [userUnitsData, userUnitsDataLoading, userUnitsDataError] = useDocument(
    doc(db, DB_USER_VOCAB, user.uid),
    {}
  );

  return (
    <>
      {userUnitsDataLoading ? (
        <p>Loading...</p>
      ) : userUnitsData ? (
        <EditVocab unitData={userUnitsData.data()} id={id} currUser={user} />
      ) : (
        <ErrorMessage
          message={`Error loading : ${userUnitsDataError?.message}`}
          backURL="/"
        />
      )}
    </>
  );
};

function Edit() {
  const [user, userLoading] = useAuthState(getAuth());
  const router = useRouter();
  const { id } = router.query;

  return (
    <>
      {userLoading ? (
        <p>Loading...</p>
      ) : user ? (
        <RenderVocab id={id} user={user} />
      ) : (
        <ErrorMessage message="You need to login" backURL="/edit" />
      )}
    </>
  );
}

export default Edit;
