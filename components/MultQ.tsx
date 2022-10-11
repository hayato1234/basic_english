import { doc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
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
import { Choice, QuestionData } from "../types/vocabType";
import { shuffle } from "../utils/arraySort";
import { getOneMeaningForOne } from "../utils/getMeaning";
import { db } from "../utils/initAuth";
import { UNITS, DB_UNITS, DB_USER_DATA } from "../utils/staticValues";
import ErrorMessage from "./ErrorMessage";
import Link from "next/link";

/* -------------------------------------------------- render with user -------------------------------------- */
const RenderQuizWithUser = ({ vocabsData, inOrder, unitId, currUser }) => {
  const [userData, userDataLoading, userDataError] = useDocument(
    doc(db, DB_USER_DATA, currUser.uid),
    {}
  );
  const [vocabs, setVocabs] = useState(
    vocabsData.data()
      ? inOrder
        ? vocabsData.data().list
        : shuffle(vocabsData.data().list)
      : []
  );
  const [currentId, setCurrentId] = useState(0);
  const [currentVocab, setCurrentVocab] = useState(vocabs[currentId]);
  const [userChoices, setUserChoices] = useState<QuestionData[]>([]);
  const [choices, setChoices] = useState<Choice[]>([]);

  const [numOfChoices, setNumOfChoices] = useState(4);
  const [numOfQs, setNumOfQs] = useState(20);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (vocabsData.data()) setChoices(getChoices());
  }, [currentId]);

  if (!vocabsData.data())
    return (
      <ErrorMessage message="unexpected error happened" backURL="/vocabulary" />
    );

  if (vocabs === undefined)
    return <ErrorMessage message="error loading" backURL="/vocabulary" />;

  const goNext = () => {
    setCurrentId(currentId + 1);
    setCurrentVocab(vocabs[currentId + 1]);
    setShowAnswer(false);
    setShowNext(false);
  };

  const finish = () => {
    toggleModal();
  };

  const changeNumOfQ = (num: number) => {
    setNumOfQs(num);
  };

  const changeNumOfChoices = (num: number) => {
    setNumOfChoices(num);
  };

  const retry = () => {
    setVocabs(shuffle(vocabs));
    setCurrentId(0);
    setShowAnswer(false);
    setShowNext(false);
    setUserChoices([]);
    toggleModal();
  };

  // -----------------------check answer-----------------------------------------------
  const checkAnswer = (
    event: React.MouseEvent<HTMLButtonElement>,
    userChoice: string
  ) => {
    event.preventDefault();
    const answer = choices.find((c) => c.correct === true);
    if (answer) {
      let isCorrect = false;

      //- checking if user's got correct
      if (userChoice === answer.meaning) {
        isCorrect = true;
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

  // -----------------------upload missed-----------------------------------------------
  const uploadMissedVocab = async (vocabId: number) => {
    if (userDataError) console.log(userDataError.message);
    if (
      !userDataLoading &&
      userData !== undefined &&
      userData.data() !== undefined
    ) {
      const unitField = "unit" + unitId;
      if (userData.data()?.vocab) {
        if (userData.data()?.vocab.missedIds) {
          //i- get here if no prev miss found for any unit
          if (userData.data()?.vocab.missedIds[unitField]) {
            //i- get here if no prev miss found for this unit
            currUser &&
              (await updateDoc(doc(db, DB_USER_DATA, currUser.uid), {
                vocab: {
                  ...userData.data()?.vocab,
                  missedIds: {
                    ...userData.data()?.vocab.missedIds,
                    [unitField]: [
                      ...userData.data()?.vocab.missedIds[unitField],
                      vocabId,
                    ],
                  },
                },
              }));
          } else {
            //i- get here if first miss for this unit
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
          //i- get here if vocab field exists but no missedIds at all
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
        //i- get here if vocab field doesn't exist at all
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

  // -----------------------get choice-----------------------------------------------
  //move this in useEffect
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

  // -----------------------get choice-----------------------------------------------

  const toggleModal = () => {
    setModalOpen(!isModalOpen);
  };

  return (
    <>
      <p>{`${currentId + 1} / ${numOfQs}`}</p>
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
              onClick={(e) => checkAnswer(e, meaning.meaning)}
            >
              {showAnswer && meaning.correct && <span>o</span>}
              {showAnswer && !meaning.correct && <span>x</span>}
              {` ${meaning.meaning}`}
            </Button>
          </li>
        ))}
      </List>
      {showNext && <Button onClick={goNext}>Next</Button>}
      <Button onClick={finish}>Finish</Button>

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
            <Button color="secondary" onClick={toggleModal}>
              End
            </Button>
          </Link>
        </ModalFooter>
      </Modal>
      {/* ------------ result Modal ------------------- */}
    </>
  );
};
/* ------------------------------------------------------------- render with user -------------------------------------- */

/* ------------------------------------------------------------- render without user -------------------------------------- */
const RenderQuizWithoutUser = ({ vocabsData, inOrder, unitId }) => {
  console.log("without", vocabsData);
  return <p>without</p>;
};
// const RenderQuizWithoutUser = ({ vocabsData, inOrder, unitId }) => {
//   const [vocabs, setVocabs] = useState(
//     vocabsData.data()
//       ? inOrder
//         ? vocabsData.data().list
//         : shuffle(vocabsData.data().list)
//       : []
//   );
//   const [currentId, setCurrentId] = useState(0);
//   const [currentVocab, setCurrentVocab] = useState(vocabs[currentId]);
//   const [userChoices, setUserChoices] = useState<QuestionData[]>([]);
//   const [choices, setChoices] = useState<Choice[]>([]);

//   const [numOfChoices, setNumOfChoices] = useState(4);
//   const [numOfQs, setNumOfQs] = useState(20);
//   const [showAnswer, setShowAnswer] = useState(false);
//   const [showNext, setShowNext] = useState(false);
//   const [isModalOpen, setModalOpen] = useState(false);

//   useEffect(() => {
//     if (vocabsData.data()) setChoices(getChoices());
//   }, [currentId]);

//   if (!vocabsData.data())
//     return (
//       <ErrorMessage message="unexpected error happened" backURL="/vocabulary" />
//     );

//   if (vocabs === undefined)
//     return <ErrorMessage message="error loading" backURL="/vocabulary" />;

//   const goNext = () => {
//     setCurrentId(currentId + 1);
//     setCurrentVocab(vocabs[currentId + 1]);
//     setShowAnswer(false);
//     setShowNext(false);
//   };

//   const finish = () => {
//     toggleModal();
//   };

//   const changeNumOfQ = (num: number) => {
//     setNumOfQs(num);
//   };

//   const changeNumOfChoices = (num: number) => {
//     setNumOfChoices(num);
//   };

//   const retry = () => {
//     setVocabs(shuffle(vocabs));
//     setCurrentId(0);
//     setShowAnswer(false);
//     setShowNext(false);
//     setUserChoices([]);
//     toggleModal();
//   };

//   // -----------------------check answer-----------------------------------------------
//   const checkAnswer = (
//     event: React.MouseEvent<HTMLButtonElement>,
//     userChoice: string
//   ) => {
//     event.preventDefault();
//     const answer = choices.find((c) => c.correct === true);
//     if (answer) {
//       let isCorrect = false;

//       //- record the question data
//       setUserChoices([
//         ...userChoices,
//         {
//           quesNum: currentId,
//           question: currentVocab.en,
//           answer: answer.meaning,
//           userChoice: userChoice,
//           choices: choices,
//           gotCorrect: isCorrect,
//         },
//       ]);
//     }

//     setShowAnswer(true);
//     // - show the next button if less than numOfQs
//     if (!(currentId + 1 >= numOfQs)) setShowNext(true);
//   };
//   // -----------------------check answer-----------------------------------------------

//   // -----------------------get choice-----------------------------------------------
//   //move this in useEffect
//   const getChoices = () => {
//     const newChoices: { part: string; meaning: string; correct: boolean }[] =
//       [];

//     newChoices.push({
//       ...getOneMeaningForOne(currentVocab),
//       correct: true,
//     });

//     for (let i = 0; i < numOfChoices - 1; i++) {
//       const choiceWrong = {
//         ...getOneMeaningForOne(
//           vocabs[Math.floor(Math.random() * vocabs.length)]
//         ),
//         correct: false,
//       };

//       if (!newChoices.find((c) => c.meaning === choiceWrong.meaning)) {
//         //- meaning no duplicate in choices
//         newChoices.push(choiceWrong);
//       } else {
//         //- meaning the choice already exist, add one more round
//         --i;
//       }
//     }

//     //- shuffle choices order, and add "I don't know" choice at the last
//     return [
//       ...shuffle(newChoices),
//       { part: "", meaning: "わからない", correct: false },
//     ];
//   };

//   // -----------------------get choice-----------------------------------------------

//   const toggleModal = () => {
//     setModalOpen(!isModalOpen);
//   };

//   return (
//     <>
//       <p>{`${currentId + 1} / ${numOfQs}`}</p>
//       <h1>{currentVocab.en}</h1>
//       <List type="unstyled">
//         {choices.map((meaning) => (
//           <li key={meaning.meaning} className="m-2">
//             <Button
//               color={
//                 showAnswer //- color green if correct, gray if incorrect, red if incorrect && user selected
//                   ? meaning.correct
//                     ? "success"
//                     : userChoices.at(-1)?.userChoice === meaning.meaning
//                     ? "danger"
//                     : "second"
//                   : "primary"
//               }
//               outline
//               disabled={showAnswer}
//               onClick={(e) => checkAnswer(e, meaning.meaning)}
//             >
//               {showAnswer && meaning.correct && <span>o</span>}
//               {showAnswer && !meaning.correct && <span>x</span>}
//               {` ${meaning.meaning}`}
//             </Button>
//           </li>
//         ))}
//       </List>
//       {showNext && <Button onClick={goNext}>Next</Button>}
//       <Button onClick={finish}>Finish</Button>

//       {/* ------------ result Modal ------------------- */}
//       <Modal isOpen={isModalOpen} toggle={toggleModal}>
//         <ModalHeader toggle={toggleModal}>Your result</ModalHeader>
//         <ModalBody>
//           <p>{`Score : ${userChoices.reduce((a, c) => {
//             return c.gotCorrect ? a + 1 : a;
//           }, 0)} / ${userChoices.length}`}</p>
//           <ListGroup>
//             {userChoices.map((c) => {
//               return (
//                 <ListGroupItem key={c.quesNum}>
//                   <h6 style={{ color: c.gotCorrect ? "black" : "red" }}>{`#${
//                     c.quesNum + 1
//                   }. ${c.question}`}</h6>
//                   <>
//                     {c.gotCorrect ? (
//                       <div style={{ color: "green" }}>
//                         <i
//                           className="fa fa-check-circle-o"
//                           aria-hidden="true"
//                         />{" "}
//                         {c.userChoice}
//                       </div>
//                     ) : (
//                       <>
//                         <div style={{ color: "red" }}>
//                           <i
//                             className="fa fa-times-circle-o"
//                             aria-hidden="true"
//                           />{" "}
//                           <del>{c.userChoice}</del>
//                         </div>
//                         <div style={{ color: "green" }}>{c.answer}</div>
//                       </>
//                     )}
//                   </>
//                 </ListGroupItem>
//               );
//             })}
//           </ListGroup>
//         </ModalBody>
//         <ModalFooter>
//           <Button color="primary" onClick={retry}>
//             Try Again
//           </Button>{" "}
//           <Link href="/vocabulary/[unit]" as={`/vocabulary/${unitId}`} passHref>
//             <Button color="secondary" onClick={toggleModal}>
//               End
//             </Button>
//           </Link>
//         </ModalFooter>
//       </Modal>
//       {/* ------------ result Modal ------------------- */}
//     </>
//   );
// };
/* ---------------------------------------------- render without user ----------------------------------------------------- */

/* ---------------------------------------------- result Main Component ----------------------------------------------------- */
const MultQ = ({ unitId, inOrder }) => {
  const [vocabsData, vocabLoading, vocabError] = useDocument(
    doc(db, DB_UNITS, `unit${unitId}`),
    {}
  );
  if (unitId < 0 || unitId > UNITS.length - 1) {
    return <p>{`${unitId} doesn't exist`}</p>;
  }

  const user = getAuth().currentUser;
  console.log(vocabsData);
  console.log(user);

  return (
    <>
      {vocabError && <p>{vocabError?.message}</p>}
      {vocabLoading && <p>Loading...</p>}
      {vocabsData ? (
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
