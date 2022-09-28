export interface Vocab {
  id: number;
  unit: number;
  num: number;
  parts: string;
  en: string;
  noun: string;
  tverb: string;
  itverb: string;
  adj: string;
  adv: string;
  prep: string;
  conn: string;
  sentence: string;
}

export type Choice = {
  part: string;
  meaning: string;
  correct: boolean;
};
