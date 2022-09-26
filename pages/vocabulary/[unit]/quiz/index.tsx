import { useRouter } from "next/router";
import React from "react";
import { Container } from "reactstrap";
import MultQ from "../../../../components/MultQ";

export enum Modes {
  Multiple,
}

const ReturnMode = ({ mode }) => {
  if (+mode === Modes.Multiple) {
    return <MultQ />;
  }
  return <></>;
};

const Quiz = () => {
  const router = useRouter();
  const { unitId, mode } = router.query;

  return (
    <Container>
      <h1>Unit {unitId} - 選択クイズ</h1>
      <ReturnMode mode={mode} />
    </Container>
  );
};

export default Quiz;
