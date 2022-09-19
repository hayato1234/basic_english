import React from "react";
import { useRouter } from "next/router";
import { useCollection, useDocument } from "react-firebase-hooks/firestore";
import { collection, doc, getDoc, query } from "firebase/firestore";

import { db } from "../../../utils/initAuth";
import { _UNITS_DB } from "../../../components/UnitList";
import VocabList from "../../../components/VocabList";

const unitDetail = () => {
  const router = useRouter();
  const { unit } = router.query;
  const unitId = unit ? +unit : 0;
  const [vocab, vocabLoading, vocabError] = useDocument(
    doc(db, _UNITS_DB, `unit${unitId}`),
    {}
  );
  return (
    <div>
      {vocabLoading ? (
        <h1>Loading...</h1>
      ) : vocab ? (
        <VocabList unitData={vocab} />
      ) : (
        <h1>{vocabError?.message}</h1>
      )}
    </div>
  );
};

export default unitDetail;
