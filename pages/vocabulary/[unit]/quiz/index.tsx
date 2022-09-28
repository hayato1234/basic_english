import { useRouter } from "next/router";
import React from "react";
import Link from "next/link";
import { Container } from "reactstrap";
import MultQ from "../../../../components/MultQ";
import { _units } from "../../../../utils/staticValues";

export enum Modes {
  Multiple,
}

const ReturnMode = ({ mode, unitId }) => {
  if (+mode === Modes.Multiple) {
    return <MultQ unitId={unitId} />;
  }
  return <></>;
};

const Quiz = () => {
  const router = useRouter();
  const { unitId, mode } = router.query;

  //return error if unitId is not 0~5
  if (unitId === undefined || +unitId < 0 || +unitId > _units.length - 1) {
    return <p>{unitId} doesn't exist</p>;
  }

  if (mode === undefined || Modes[+mode] === undefined) {
    return <p>This mode doesn't exist for {unitId}</p>;
  }

  return (
    <Container>
      <Link href="/vocabulary/[unit]" as={`/vocabulary/${unitId}`}>
        <i className="fa fa-arrow-left" aria-hidden="true" />
      </Link>

      <h1>Unit {unitId} - 選択クイズ</h1>
      <hr />
      <ReturnMode mode={mode} unitId={unitId} />
    </Container>
  );
};

export default Quiz;
