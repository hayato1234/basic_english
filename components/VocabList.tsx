import React from "react";
import { QueryDocumentSnapshot, DocumentData } from "firebase/firestore";
import { Vocab } from "../types/vocabType";

const styles = require("../styles/Vocab.module.css");

const VocabList = ({ vocabData }) => {
  const vocabs: Vocab[] = vocabData
    .map((vocabData: QueryDocumentSnapshot<DocumentData>) => vocabData.data())
    .sort((a: Vocab, b: Vocab) => a.number - b.number);

  return (
    <div>
      {vocabs.map((vocab) => {
        return (
          <div key={vocab.id} className={styles.container}>
            <h5>{`${vocab.number} : ${vocab.word}`}</h5>
          </div>
        );
      })}
    </div>
  );
};

export default VocabList;
