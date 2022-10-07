export interface userData {
  history: string[];
  vocab: vocabData;
  favorite: unitData;
}

export interface history {
  type: string;
  unit: string[];
}

export interface vocabData {
  missedVocab: unitData;
  favorite: number[];
}

export interface unitData {
  unit0: number[];
  unit1: number[];
  unit2: number[];
  unit3: number[];
  unit4: number[];
  unit5: number[];
}
