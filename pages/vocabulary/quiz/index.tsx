import { useRouter } from "next/router";
import React from "react";
import { Container } from "reactstrap";
import MultQA from "../../../components/MultQA";
import MultQAllUnit from "../../../components/MultQAllUnit";
import ErrorMessage from "../../../components/ErrorMessage";
import { getAuth } from "firebase/auth";
import MultQ from "../../../components/MultQ";

export enum Modes {
  Multiple,
  MultipleAssess,
  MultipleAllUnit,
}

const ReturnMode = ({ mode, unitId, inOrder, user }) => {
  switch (+mode) {
    case Modes.Multiple:
      return <MultQ unitId={unitId} inOrder={inOrder} user={user} />;
    case Modes.MultipleAssess:
      return <MultQA />;
    case Modes.MultipleAllUnit:
      return <MultQAllUnit />;
    default:
      return <></>;
  }
};

const Quiz = () => {
  const router = useRouter();
  const { unitId, mode, inOrder } = router.query;
  const user = getAuth().currentUser;

  //i- return error if unitId is not 0~5
  // || +unitId < 0 || +unitId > UNITS.length - 1
  if (unitId === undefined) {
    return (
      <ErrorMessage
        message={`${unitId} doesn't exist`}
        backURL={"/vocabulary"}
      />
    );
  }

  if (mode === undefined || Modes[+mode] === undefined) {
    return <p>This mode doesn't exist for {unitId}</p>;
  }

  return (
    <Container>
      <ReturnMode
        mode={mode}
        unitId={unitId}
        inOrder={inOrder === "true"}
        user={user}
      />
    </Container>
  );
};

export default Quiz;
