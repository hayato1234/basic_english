import React from "react";
import { useRouter } from "next/router";
import { useCollection } from "react-firebase-hooks/firestore";
import { collection } from "firebase/firestore";

import { db } from "../../../utils/initAuth";
import { _UNITS_DB } from "../../../components/UnitList";
import VocabList from "../../../components/VocabList";

const unitDetail = () => {
  const router = useRouter();
  const { unit } = router.query;
  const unitId = unit ? +unit : 0;
  const [vocab, vocabLoading, vocabError] = useCollection(
    collection(db, _UNITS_DB),
    {}
  );
  return (
    <div>
      {vocabLoading ? (
        <h1>Loading...</h1>
      ) : vocab ? (
        <VocabList unitData={vocab.docs[unitId]} />
      ) : (
        <h1>{vocabError?.message}</h1>
      )}
    </div>
  );
};

export default unitDetail;
