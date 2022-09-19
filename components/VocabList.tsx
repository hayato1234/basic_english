import React from "react";
import { QueryDocumentSnapshot, DocumentData } from "firebase/firestore";
import { Vocab } from "../types/vocabType";

const styles = require("../styles/Vocab.module.css");

const VocabList = ({ unitData }) => {
  // const vocabs: Vocab[] = vocabData
  //   .map((vocabData: QueryDocumentSnapshot<DocumentData>) => vocabData.data())
  //   .sort((a: Vocab, b: Vocab) => a.number - b.number);
  const vocabs: Vocab[] = unitData.data().list;

  return (
    <div>
      {vocabs.map((vocab) => {
        return (
          <div key={vocab.num} className={styles.container}>
            <h5>{`${vocab.num} : ${vocab.en}`}</h5>
          </div>
        );
      })}
    </div>
  );
};

export default VocabList;
