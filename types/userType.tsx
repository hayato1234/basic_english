export interface userData {
  history: string[];
  vocabData: vocabData;
}

export interface history {
  type: string;
  unit: string[];
}

export interface vocabData {
  missedVocab: unitData;
  favorite: unitData;
}

export interface unitData {
  unit0: number[];
  unit1: number[];
  unit2: number[];
  unit3: number[];
  unit4: number[];
  unit5: number[];
}
