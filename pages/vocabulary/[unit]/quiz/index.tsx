import { useRouter } from "next/router";
import React from "react";
import { Container } from "reactstrap";
import MultQ from "../../../../components/MultQ";

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

  return (
    <Container>
      <h1>Unit {unitId} - 選択クイズ</h1>
      <hr />
      <ReturnMode mode={mode} unitId={unitId} />
    </Container>
  );
};

export default Quiz;
