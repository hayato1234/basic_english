export interface userData {
  history: history[];
  vocabData: vocabData;
}

export interface history {
  type: string;
  unitData: string[];
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
