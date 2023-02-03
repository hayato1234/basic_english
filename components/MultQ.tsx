import { doc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { User } from "firebase/auth";
import { useDocument } from "react-firebase-hooks/firestore";
import {
  Button,
  List,
  ListGroup,
  ListGroupItem,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "reactstrap";
import { Choice, CustomUnit, QuestionData, Vocab } from "../types/vocabType";
import { shuffle } from "../utils/arraySort";
import { getOneMeaningForOne } from "../utils/getMeaning";
import { db } from "../utils/initAuth";
import { DB_UNITS, DB_USER_DATA, DB_USER_VOCAB } from "../utils/staticValues";
import ErrorMessage from "./ErrorMessage";
import Link from "next/link";
import QuizFooter from "./QuizFooter";
import QuizHeader from "./QuizHeader";

const styles = require("../styles/Vocab.module.css");

/* -------------------------------------------------- render with user -------------------------------------- */
const RenderQuizWithUser = ({ vocabsData, inOrder, unitId, currUser }) => {
  const [userData, userDataLoading, userDataError] = useDocument(
    doc(db, DB_USER_DATA, currUser.uid),
    {}
  );
  // console.log(vocabsData.data());

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
              // console.log(missedIds, vocabId);
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
            // console.log(missedIds, vocabId);
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

  if (unitId.includes("user")) {
    //this is a unit made by the user
    const units: CustomUnit[] = Object.values(vocabsData.data());
    const unit = units.filter(
      (unit: CustomUnit) => +unit.id === +unitId.slice(4)
    );
    if (unit) {
      if (!unit[0] || !unit[0].vocabs || unit[0].vocabs.length < 4) {
        return (
          <ErrorMessage
            message="You need to add more than 4 words in this unit to take the
            quiz. ４つ以上単語がなければクイズはできません。"
            backURL={`/vocabulary/${unitId}`}
          />
        );
      } else {
        vocabs = inOrder ? unit[0].vocabs : shuffle(unit[0].vocabs);
      }
    }
  } else {
    //this is a preset unit
    if (!userDataLoading) {
      console.log("user data", userData?.data());
      if (userData && userData.data()?.vocab) {
        vocabs = inOrder
          ? vocabsData.data().list
          : shuffle(vocabsData.data().list);
      }
    }
  }

  // -----------------------set up vocab data----------------------------------------------- //

  const defaultNumOfQs = vocabs ? Math.min(20, vocabs.length) : 0;

  return (
    <>
      {!userDataLoading && vocabs.length > 0 ? (
        <QuizStructure
          unitId={unitId}
          defaultNumOfQs={defaultNumOfQs}
          vocabs={vocabs}
          checkAnswer={checkAnswer}
        />
      ) : (
        <p>{vocabs.length}</p>
      )}
    </>
  );
};
/* ------------------------------------------------------------- render with user -------------------------------------- */

/* ------------------------------------------------------------- render without user -------------------------------------- */

const RenderQuizWithoutUser = ({ vocabsData, inOrder, unitId }) => {
  if (!vocabsData.data())
    return (
      <ErrorMessage message="unexpected error happened" backURL="/vocabulary" />
    );

  if (!vocabsData.data().list)
    return (
      <ErrorMessage message="error loading the list" backURL="/vocabulary" />
    );

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

  return (
    <QuizStructure
      unitId={unitId}
      defaultNumOfQs={20}
      vocabs={vocabsData.data().list}
      checkAnswer={checkAnswer}
    />
  );
};
/* ---------------------------------------------- render without user ----------------------------------------------------- */

/* ---------------------------------------------- quiz structure ----------------------------------------------------- */
export const QuizStructure = ({
  unitId,
  defaultNumOfQs,
  vocabs,
  checkAnswer,
}) => {
  const [vocab, setVocab] = useState(vocabs);
  const [currentId, setCurrentId] = useState(0);
  const [currentVocab, setCurrentVocab] = useState(vocab[currentId]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [choices, setChoices] = useState<Choice[]>([]);
  const [userChoices, setUserChoices] = useState<QuestionData[]>([]);

  const [numOfChoices] = useState(4);
  const [numOfQs, setNumOfQs] = useState(defaultNumOfQs);

  const [showAnswer, setShowAnswer] = useState(false);
  const [showNext, setShowNext] = useState(false);

  useEffect(() => {
    setVocab(vocabs);
  }, [vocabs]);

  useEffect(() => {
    setCurrentVocab(vocab[currentId]);
  }, [currentId]);

  useEffect(() => {
    // -----------------------making multiple choices-----------------------------------------------
    const getChoices = () => {
      const newChoices: { part: string; meaning: string; correct: boolean }[] =
        [];

      newChoices.push({
        ...getOneMeaningForOne(currentVocab),
        correct: true,
      });

      for (let i = 0; i < numOfChoices - 1; i++) {
        const choiceWrong = {
          ...getOneMeaningForOne(
            vocabs[Math.floor(Math.random() * vocabs.length)]
          ),
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
    // -----------------------making multiple choices-----------------------------------------------

    if (currentVocab) setChoices(getChoices());
  }, [currentVocab]);

  const goNext = () => {
    setCurrentId(currentId + 1);
    setShowAnswer(false);
    setShowNext(false);
  };

  const finish = () => {
    toggleModal();
  };

  const retry = () => {
    // !--- vocabs reshuffle if random true
    // vocabs = shuffle(vocabs);
    setCurrentId(0);
    setShowAnswer(false);
    setShowNext(false);
    setUserChoices([]);
    toggleModal();
  };

  const toggleModal = () => {
    setModalOpen(!isModalOpen);
  };

  return (
    <>
      <QuizHeader
        linkHref="/vocabulary/[unit]"
        linkAs={`/vocabulary/${unitId}`}
        title={`選択クイズ - Unit: ${currentVocab && currentVocab.unit}`}
        currentId={currentId}
        numOfQs={numOfQs}
        setNumOfQs={setNumOfQs}
        maxNumOfQs={vocab.length}
      />

      {currentVocab && (
        <>
          <h1>{currentVocab.en}</h1>
          <List type="unstyled">
            {choices.map((meaning) => (
              <li key={meaning.meaning} className="m-2">
                <Button
                  color={
                    showAnswer //- color green if correct, gray if incorrect, red if incorrect && user selected
                      ? meaning.correct
                        ? "success"
                        : userChoices.at(-1)?.userChoice === meaning.meaning
                        ? "danger"
                        : "second"
                      : "primary"
                  }
                  outline
                  disabled={showAnswer}
                  onClick={(e) =>
                    checkAnswer(
                      e,
                      meaning.meaning,
                      choices,
                      currentId,
                      currentVocab,
                      setUserChoices,
                      userChoices,
                      setShowAnswer,
                      numOfQs,
                      setShowNext
                    )
                  }
                >
                  {showAnswer && meaning.correct && <span>o</span>}
                  {showAnswer && !meaning.correct && <span>x</span>}
                  {` ${meaning.meaning}`}
                </Button>
              </li>
            ))}
          </List>
        </>
      )}

      <QuizFooter
        currentId={currentId}
        showNext={showNext}
        goNext={goNext}
        finish={finish}
        numOfQs={numOfQs}
        showAnswer={showAnswer}
      />

      {/* ------------ result Modal ------------------- */}
      <Modal isOpen={isModalOpen} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>Your result</ModalHeader>
        <ModalBody>
          <p>{`Score : ${userChoices.reduce((a, c) => {
            return c.gotCorrect ? a + 1 : a;
          }, 0)} / ${userChoices.length}`}</p>
          <ListGroup>
            {userChoices.map((c) => {
              return (
                <ListGroupItem key={c.quesNum}>
                  <h6 style={{ color: c.gotCorrect ? "black" : "red" }}>{`#${
                    c.quesNum + 1
                  }. ${c.question}`}</h6>
                  <>
                    {c.gotCorrect ? (
                      <div style={{ color: "green" }}>
                        <i
                          className="fa fa-check-circle-o"
                          aria-hidden="true"
                        />{" "}
                        {c.userChoice}
                      </div>
                    ) : (
                      <>
                        <div style={{ color: "red" }}>
                          <i
                            className="fa fa-times-circle-o"
                            aria-hidden="true"
                          />{" "}
                          <del>{c.userChoice}</del>
                        </div>
                        <div style={{ color: "green" }}>{c.answer}</div>
                      </>
                    )}
                  </>
                </ListGroupItem>
              );
            })}
          </ListGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={retry}>
            Try Again
          </Button>{" "}
          <Link href="/vocabulary/[unit]" as={`/vocabulary/${unitId}`} passHref>
            <a className={styles.linkWrapper}>
              <Button color="secondary" onClick={toggleModal}>
                End
              </Button>
            </a>
          </Link>
        </ModalFooter>
      </Modal>
      {/* ------------ result Modal ------------------- */}
    </>
  );
};
/* ---------------------------------------------- quiz structure ----------------------------------------------------- */

/* ---------------------------------------------- quiz main component ----------------------------------------------------- */

type propType = {
  unitId: string;
  inOrder: boolean;
  user: User;
};
const MultQ = ({ unitId, inOrder, user }: propType) => {
  const [vocabsData, vocabLoading] = useDocument(
    unitId.includes("user")
      ? doc(db, DB_USER_VOCAB, user.uid)
      : doc(db, DB_UNITS, `unit${unitId}`),
    {}
  );

  return (
    <>
      {vocabLoading ? (
        <p>Loading...</p>
      ) : vocabsData ? (
        user ? (
          <RenderQuizWithUser
            vocabsData={vocabsData}
            inOrder={inOrder}
            unitId={unitId}
            currUser={user}
          />
        ) : (
          <RenderQuizWithoutUser
            vocabsData={vocabsData}
            inOrder={inOrder}
            unitId={unitId}
          />
        )
      ) : (
        <ErrorMessage message="Failed to get data" backURL={"/vocabulary"} />
      )}
    </>
  );
};

export default MultQ;
