import { User } from "firebase/auth";
import { Choice, QuestionData, Vocab } from "../types/vocabType";
import { shuffle } from "./arraySort";
import { getOneMeaningForOne } from "./getMeaning";

export const MISSED_BASE_POINTS = 3;

// -----------------------get choices-----------------------------------------------

export const getChoices = (
  answerVocab: Vocab,
  vocabs: Vocab[],
  numOfChoices: number
): Choice[] => {
  const newChoices: Choice[] = [];

  newChoices.push({
    ...getOneMeaningForOne(answerVocab),
    correct: true,
  });

  for (let i = 0; i < numOfChoices - 1; i++) {
    const choiceWrong = {
      ...getOneMeaningForOne(vocabs[Math.floor(Math.random() * vocabs.length)]),
      correct: false,
    };

    if (!newChoices.find((c) => c.meaning === choiceWrong.meaning)) {
      //- meaning no duplicate in choices
      newChoices.push(choiceWrong);
    } else {
      //- meaning the choice already exist, add one more round
      --i;
    }
  }

  //- shuffle choices order, and add "I don't know" choice at the last
  return [
    ...shuffle(newChoices),
    { part: "", meaning: "わからない", correct: false },
  ];
};

// -----------------------get choices-----------------------------------------------

// -----------------------check answer-----------------------------------------------
export const checkAnswer = (
  event: React.MouseEvent<HTMLButtonElement>,
  choices: Choice[],
  userChoice: string,
  currUser: User | null,
  answerVocab: Vocab,
  currentId: number
) => {
  event.preventDefault();
  const answer = choices.find((c) => c.correct === true);
  if (answer) {
    let isCorrect = false;

    //- checking if user's got correct
    if (userChoice === answer.meaning) {
      isCorrect = true;
    }
    // else {
    //   currUser && uploadMissedVocab(currentVocab.num);
    // }

    return {
      quesNum: currentId,
      question: answerVocab.en,
      answer: answer.meaning,
      userChoice: userChoice,
      choices: choices,
      gotCorrect: isCorrect,
    };
  }
};

// -----------------------check answer-----------------------------------------------

// -----------------------upload missed-----------------------------------------------
const uploadMissedVocab = async (vocabId: number) => {
  // if (userDataError) console.log(userDataError.message);
  // if (
  //   !userDataLoading &&
  //   userData !== undefined &&
  //   userData.data() !== undefined
  // ) {
  //   const unitField = "unit" + unitId;
  //   if (userData.data()?.vocab) {
  //     if (userData.data()?.vocab.missedIds) {
  //       //i- get here if no prev miss found for any unit
  //       if (userData.data()?.vocab.missedIds[unitField]) {
  //         //i- get here if no prev miss found for this unit
  //         currUser &&
  //           (await updateDoc(doc(db, DB_USER_DATA, currUser.uid), {
  //             vocab: {
  //               ...userData.data()?.vocab,
  //               missedIds: {
  //                 ...userData.data()?.vocab.missedIds,
  //                 [unitField]: [
  //                   ...userData.data()?.vocab.missedIds[unitField],
  //                   vocabId,
  //                 ],
  //               },
  //             },
  //           }));
  //       } else {
  //         //i- get here if first miss for this unit
  //         currUser &&
  //           (await updateDoc(doc(db, DB_USER_DATA, currUser.uid), {
  //             vocab: {
  //               ...userData.data()?.vocab,
  //               missedIds: {
  //                 ...userData.data()?.vocab.missedIds,
  //                 [unitField]: [vocabId],
  //               },
  //             },
  //           }));
  //       }
  //     } else {
  //       //i- get here if vocab field exists but no missedIds at all
  //       currUser &&
  //         (await updateDoc(doc(db, DB_USER_DATA, currUser.uid), {
  //           vocab: {
  //             ...userData.data()?.vocab,
  //             missedIds: {
  //               [unitField]: [vocabId],
  //             },
  //           },
  //         }));
  //     }
  //   } else {
  //     //i- get here if vocab field doesn't exist at all
  //     currUser &&
  //       (await updateDoc(doc(db, DB_USER_DATA, currUser.uid), {
  //         vocab: {
  //           missedIds: {
  //             [unitField]: [vocabId],
  //           },
  //         },
  //       }));
  //   }
  // }
};
// -----------------------upload missed-----------------------------------------------
