export interface CustomUnit {
  id: number;
  title: string;
  vocabs: Vocab[];
}
export interface CustomUnitList {
  list: CustomUnit[];
}

export interface Vocab {
  id: number;
  unit: number | string;
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

export type QuestionData = {
  quesNum: number;
  question: string;
  answer: string;
  userChoice: string;
  choices: Choice[];
  gotCorrect: boolean;
};
