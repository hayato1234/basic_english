import { useRouter } from "next/router";
import React from "react";
import Link from "next/link";
import { Container } from "reactstrap";
import MultQ from "../../../components/MultQ";
import { UNITS } from "../../../utils/staticValues";
import MultQA from "../../../components/MultQA";
import MultQAllUnit from "../../../components/MultQAllUnit";

export enum Modes {
  Multiple,
  MultipleAssess,
  MultipleAllUnit,
}

const ReturnMode = ({ mode, unitId, inOrder }) => {
  switch (+mode) {
    case Modes.Multiple:
      return <MultQ unitId={unitId} inOrder={inOrder} />;
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

  //i- return error if unitId is not 0~5
  if (unitId === undefined || +unitId < 0 || +unitId > UNITS.length - 1) {
    return <p>{unitId} doesn't exist</p>;
  }

  if (mode === undefined || Modes[+mode] === undefined) {
    return <p>This mode doesn't exist for {unitId}</p>;
  }

  return (
    <Container>
      <ReturnMode mode={mode} unitId={unitId} inOrder={inOrder === "true"} />
    </Container>
  );
};

export default Quiz;
