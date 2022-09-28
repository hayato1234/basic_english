import React from "react";
import { useRouter } from "next/router";
import { useCollection, useDocument } from "react-firebase-hooks/firestore";
import { collection, doc, getDoc, query } from "firebase/firestore";

import { db } from "../../../utils/initAuth";

import VocabList from "../../../components/VocabList";
import FlashCards from "../../../components/FlashCards";
import Link from "next/link";
import { Button, Container } from "reactstrap";

import { Modes } from "./quiz";
import { _units, _UNITS_DB } from "../../../utils/staticValues";

const RenderDetail = ({ unitId }) => {
  const [vocab, vocabLoading, vocabError] = useDocument(
    doc(db, _UNITS_DB, `unit${unitId}`),
    {}
  );
  return (
    <Container className="pt-4">
      <Link href="/vocabulary">
        <i className="fa fa-arrow-left" aria-hidden="true" />
      </Link>
      {vocabLoading ? (
        <h1>Loading...</h1>
      ) : vocab ? (
        <>
          <h1>{`Unit ${unitId}`}</h1>
          <hr />
          <h2>単語帳</h2>
          <h4>右のカードの日本語の意味は？</h4>
          <FlashCards unitData={vocab} />

          <hr />
          <h2>Study Modes</h2>
          <Link
            href={{
              pathname: "vocabulary/quiz",
              query: { unitId: unitId, mode: Modes.Multiple },
            }}
          >
            <Button>4択クイズ</Button>
          </Link>
          <hr />
          <VocabList unitData={vocab} unitId={unitId} />
        </>
      ) : (
        <h1>{vocabError?.message}</h1>
      )}
    </Container>
  );
};

const unitDetail = () => {
  const router = useRouter();
  const { unit } = router.query;
  const unitId = unit ? +unit : 0;

  return (
    <>
      {unitId < 0 || unitId > _units.length - 1 ? (
        <>
          <Link href="/vocabulary">
            <i className="fa fa-arrow-left" aria-hidden="true" />
          </Link>
          <p>{`Error: Unit ${unitId} doesn't exist`}</p>
        </>
      ) : (
        <RenderDetail unitId={unitId} />
      )}
    </>
  );
};

export default unitDetail;
