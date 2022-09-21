import React from "react";
import { QueryDocumentSnapshot, DocumentData } from "firebase/firestore";
import { Vocab } from "../types/vocabType";
import Link from "next/link";

const styles = require("../styles/Vocab.module.css");

const VocabList = ({ unitData, unitId }) => {
  // const vocabs: Vocab[] = vocabData
  //   .map((vocabData: QueryDocumentSnapshot<DocumentData>) => vocabData.data())
  //   .sort((a: Vocab, b: Vocab) => a.number - b.number);
  const vocabs: Vocab[] = unitData.data().list;

  return (
    <div className={styles.list}>
      <h2>単語リスト</h2>
      {vocabs.map((vocab) => {
        return (
          <Link
            href={{
              pathname: "/vocabulary/[unit]/[number]",
              query: { vocabData: JSON.stringify(vocab) },
            }}
            as={`/vocabulary/${unitId}/${vocab.num}`}
            key={vocab.num}
          >
            <div className={styles.container}>
              <h5>
                {`${vocab.num} : ${vocab.en} `}
                <span>{vocab.parts}</span>
              </h5>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default VocabList;
