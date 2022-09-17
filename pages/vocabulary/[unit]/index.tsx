import React from "react";
import { useRouter } from "next/router";
import { useCollection } from "react-firebase-hooks/firestore";
import {
  collection,
  QueryDocumentSnapshot,
  DocumentData,
} from "firebase/firestore";

import { db } from "../../../utils/initAuth";
import { unitTitles } from "../../../components/UnitList";
import VocabList from "../../../components/VocabList";

const unitDetail = () => {
  const router = useRouter();
  const { unit } = router.query;
  const unitId = unit ? +unit : 0;
  const [vocab, vocabLoading, vocabError] = useCollection(
    collection(db, unitTitles[+unitId]),
    {}
  );
  return (
    <div>
      {vocabLoading ? (
        <h1>Loading...</h1>
      ) : vocab ? (
        <VocabList vocabData={vocab.docs} />
      ) : (
        <h1>{vocabError?.message}</h1>
      )}
    </div>
  );
};

export default unitDetail;
