import React from "react";
import { useRouter } from "next/router";
import { Vocab } from "../../../../types/vocabType";
import Link from "next/link";

export const partsToJPN = {
  noun: "名詞",
  tverb: "他動詞",
  itverb: "自動詞",
  adj: "形容詞",
  adv: "副詞",
  prep: "前置詞",
  conn: "接続詞",
};
export const partsList = [
  "noun",
  "tverb",
  "itverb",
  "adj",
  "adv",
  "prep",
  "conn",
];

const VocabDetail = () => {
  const router = useRouter();
  const data = router.query;
  const unitId = data.unit ? +data.unit : 0;
  const vocab: Vocab = data.vocabData
    ? JSON.parse(data.vocabData as string)
    : undefined;

  const meaning = partsList.map((part) => {
    return (
      vocab[part] && <p key={part}>{`${partsToJPN[part]} : ${vocab[part]}`}</p>
    );
  });

  return (
    <div>
      <h1>{vocab.en}</h1>
      {meaning}
      <button>
        <Link href="/vocabulary/[unit]" as={`/vocabulary/${unitId}`}>
          Go Back
        </Link>
      </button>
    </div>
  );
};

export default VocabDetail;
