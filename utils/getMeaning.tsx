import { Vocab } from "../types/vocabType";
import { PARTS_LIST } from "./staticValues";

export const getMeaningsForOne = (vocab: Vocab) => {
  const meanings: { part: string; meaning: string }[] = [];

  for (const part of PARTS_LIST) {
    if (vocab[part]) meanings.push({ part: part, meaning: vocab[part] });
  }

  return meanings;
};

export const getOneMeaningForOne = (vocab: Vocab) => {
  const meanings = getMeaningsForOne(vocab);
  const randomIndex = Math.floor(Math.random() * meanings.length);
  return meanings[randomIndex];
};

export const getMeaningsForAll = (vocabs: Vocab[]) => {
  return vocabs.map((vocab) => getMeaningsForOne(vocab));
};
