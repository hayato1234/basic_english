import { User } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import React, { useState } from "react";
import { useDocument } from "react-firebase-hooks/firestore";
import { Choice, CustomUnit, QuestionData, Vocab } from "../../types/vocabType";
import { shuffle } from "../../utils/arraySort";
import { db } from "../../utils/initAuth";
import {
  DB_UNITS,
  DB_USER_DATA,
  DB_USER_VOCAB,
} from "../../utils/staticValues";
import ErrorMessage from "../ErrorMessage";
import { QuizStructure } from "../MultQ";

const RenderQuiz = ({ vocabsData, inOrder, unitId, currUser }) => {
  const [userData, userDataLoading, userDataError] = useDocument(
    doc(db, DB_USER_DATA, currUser.uid),
    {}
  );
  const [missedWordIds, setMissedWordIds] = useState<number[]>([]);
  if (!vocabsData.data())
    return (
      <ErrorMessage message="unexpected error happened" backURL="/vocabulary" />
    );
  if (vocabsData.data() === undefined)
    return <ErrorMessage message="error loading" backURL="/vocabulary" />;
  // -----------------------check answer-----------------------------------------------
  const checkAnswer = (
    event: React.MouseEvent<HTMLButtonElement>,
    userChoice: string,
    choices: Choice[],
    currentId: number,
    currentVocab: Vocab,
    setUserChoices: (
      arg0: {
        quesNum: number;
        question: any;
        answer: string;
        userChoice: string;
        choices: Choice[];
        gotCorrect: boolean;
      }[]
    ) => void,
    userChoices: QuestionData[],
    setShowAnswer: (arg0: boolean) => void,
    numOfQs: number,
    setShowNext: (arg0: boolean) => void
  ) => {
    event.preventDefault();
    const answer = choices.find((c) => c.correct === true);
    if (answer) {
      let isCorrect = false;

      //- checking if user's got correct
      if (userChoice === answer.meaning) {
        isCorrect = true;
        currUser && removeFromMissed(currentVocab.num);
      } else {
        currUser && uploadMissedVocab(currentVocab.num);
      }

      //- record the question data
      setUserChoices([
        ...userChoices,
        {
          quesNum: currentId,
          question: currentVocab.en,
          answer: answer.meaning,
          userChoice: userChoice,
          choices: choices,
          gotCorrect: isCorrect,
        },
      ]);
    }

    setShowAnswer(true);
    // - show the next button if less than numOfQs
    if (!(currentId + 1 >= numOfQs)) setShowNext(true);
  };
  // -----------------------check answer-----------------------------------------------

  // -----------------------remove from missed-----------------------------------------------
  const removeFromMissed = async (vocabId: number) => {
    if (!userDataLoading && userData) {
      if (userData.data()?.vocab) {
        if (userData.data()?.vocab.missedIds) {
          //i- get here if prev miss data found
          const unitField = unitId.includes("user") ? unitId : "unit" + unitId;
          let missedIds: number[] = userData.data()?.vocab.missedIds[unitField];
          if (missedIds) {
            //i- get here if prev miss found for this unit
            if (missedIds.includes(vocabId)) {
              //i- get here if the word doesn't exist in the missedIds => add it
              missedIds = missedIds.filter((id: number) => id !== vocabId);
              console.log(missedIds, vocabId);
              await updateDoc(doc(db, DB_USER_DATA, currUser.uid), {
                vocab: {
                  ...userData.data()?.vocab,
                  missedIds: {
                    ...userData.data()?.vocab.missedIds,
                    [unitField]: [...missedIds],
                  },
                },
              });
            }
          }
        }
      }
    }
  };

  // -----------------------upload missed-----------------------------------------------
  const uploadMissedVocab = async (vocabId: number) => {
    if (userDataError) console.log(userDataError.message);
    if (
      !userDataLoading &&
      userData !== undefined &&
      userData.data() !== undefined
    ) {
      const unitField = unitId.includes("user") ? unitId : "unit" + unitId;
      // const missedData: Missed = { num: vocabId, point: MISSED_BASE_POINTS };
      if (userData.data()?.vocab) {
        if (userData.data()?.vocab.missedIds) {
          //i- get here if prev miss data found
          const missedIds = userData.data()?.vocab.missedIds[unitField];
          if (missedIds) {
            //i- get here if prev miss found for this unit
            // const missedIds = userData.data()?.vocab.missedIds[unitField];
            console.log(missedIds, vocabId);
            if (!missedIds.includes(vocabId)) {
              //i- get here if the word doesn't exist in the missedIds => add it
              // console.log("new missed");
              await updateDoc(doc(db, DB_USER_DATA, currUser.uid), {
                vocab: {
                  ...userData.data()?.vocab,
                  missedIds: {
                    ...userData.data()?.vocab.missedIds,
                    [unitField]: [...missedIds, vocabId],
                  },
                },
              });
            }
          } else {
            //i- get here if first time missing for this unit
            currUser &&
              (await updateDoc(doc(db, DB_USER_DATA, currUser.uid), {
                vocab: {
                  ...userData.data()?.vocab,
                  missedIds: {
                    ...userData.data()?.vocab.missedIds,
                    [unitField]: [vocabId],
                  },
                },
              }));
          }
        } else {
          //i- get here if user vocab field exists but no missedIds at all
          currUser &&
            (await updateDoc(doc(db, DB_USER_DATA, currUser.uid), {
              vocab: {
                ...userData.data()?.vocab,
                missedIds: {
                  [unitField]: [vocabId],
                },
              },
            }));
        }
      } else {
        //i- get here if user vocab field doesn't exist at all
        currUser &&
          (await updateDoc(doc(db, DB_USER_DATA, currUser.uid), {
            vocab: {
              missedIds: {
                [unitField]: [vocabId],
              },
            },
          }));
      }
    }
  };
  // -----------------------upload missed-----------------------------------------------

  // -----------------------set up vocab data-----------------------------------------------
  let vocabs: Vocab[] = [];
  let tempVocabs: Vocab[] = [];
  if (unitId.includes("user")) {
    //i- get her if user's custom unit
    const units: CustomUnit[] = Object.values(vocabsData.data());
    const unit = units.filter(
      (unit: CustomUnit) => +unit.id === +unitId.slice(4)
    );
    if (unit && unit[0] && unit[0].vocabs) {
      if (unit[0].vocabs.length < 4) {
        return (
          <ErrorMessage
            message="You need to add more than 4 words in this unit to take the
            quiz. ４つ以上単語がなければクイズはできません。"
            backURL={`/vocabulary/${unitId}`}
          />
        );
      } else {
        tempVocabs = inOrder ? unit[0].vocabs : shuffle(unit[0].vocabs);
      }
    } else {
      return (
        <ErrorMessage
          message="Error loading your unit"
          backURL={`/vocabulary/${unitId}`}
        />
      );
    }
  } else {
    //i- get here if this is a preset unit
    tempVocabs = inOrder
      ? vocabsData.data().list
      : shuffle(vocabsData.data().list);
  }

  //        -----------------------adding missed words at the top--------------------------
  const missedVocabs: Vocab[] = [];

  if (
    !userDataLoading &&
    userData &&
    userData.data()?.vocab &&
    userData.data()?.vocab.missedIds
  ) {
    //i- get here if missed data exists && missed data exists

    const unitField = unitId.includes("user") ? unitId : "unit" + unitId;
    const missedIds = userData.data()?.vocab.missedIds[unitField];

    if (missedIds && missedIds.length > 0) {
      //i-get here if missed data for this unit exists
      if (missedWordIds.length <= 0) setMissedWordIds(missedIds);
      for (const id of missedWordIds) {
        missedVocabs.push(tempVocabs.filter((v: Vocab) => v.num === id)[0]);
      }
      vocabs = [...missedVocabs, ...tempVocabs];
    } else {
      vocabs = tempVocabs;
    }
  } else {
    vocabs = tempVocabs;
  }
  // -----------------------set up vocab data----------------------------------------------- //

  const defaultNumOfQs = vocabs ? Math.min(20, vocabs.length) : 0;

  return (
    <>
      {!userDataLoading && vocabs.length > 0 && (
        <QuizStructure
          unitId={unitId}
          defaultNumOfQs={defaultNumOfQs}
          vocabs={vocabs}
          checkAnswer={checkAnswer}
        />
      )}
    </>
  );
};

type propType = {
  unitId: string;
  inOrder: boolean;
  user: User;
};
const MultQImprove = ({ unitId, inOrder, user }: propType) => {
  const [vocabsData, vocabLoading] = useDocument(
    unitId.includes("user")
      ? doc(db, DB_USER_VOCAB, user.uid)
      : doc(db, DB_UNITS, `unit${unitId}`),
    {}
  );

  //!!!!!!  need to stop randomize missed part

  return (
    <>
      {vocabLoading ? (
        <p>Loading...</p>
      ) : vocabsData ? (
        user ? (
          <RenderQuiz
            vocabsData={vocabsData}
            inOrder={inOrder}
            unitId={unitId}
            currUser={user}
          />
        ) : (
          <p>You need to login</p>
        )
      ) : (
        <ErrorMessage message="Failed to get data" backURL={"/vocabulary"} />
      )}
    </>
  );
};

export default MultQImprove;
