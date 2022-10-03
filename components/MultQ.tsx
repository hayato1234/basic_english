import { doc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useDocument } from "react-firebase-hooks/firestore";
import {
  Button,
  Col,
  List,
  ListGroup,
  ListGroupItem,
  Modal,
  ModalBody,
  ModalHeader,
} from "reactstrap";
import { Choice, QuestionData, Vocab } from "../types/vocabType";
import { shuffle } from "../utils/arraySort";
import { getOneMeaningForOne } from "../utils/getMeaning";
import { db } from "../utils/initAuth";
import { _partsToJPN, _units, _UNITS_DB } from "../utils/staticValues";
import ErrorMessage from "./ErrorMessage";

const RenderQuiz = ({ vocabsData }) => {
  if (vocabsData === undefined)
    return (
      <ErrorMessage message="unexpected error happened" backURL="/vocabulary" />
    );

  const vocabs: Vocab[] = vocabsData.data().list;

  if (vocabs === undefined)
    return <ErrorMessage message="error loading" backURL="/vocabulary" />;

  const [numOfChoices, setNumOfChoices] = useState(4);
  const [numOfQs, setNumOfQs] = useState(20);
  const [currentId, setCurrentId] = useState(0);
  const [currentVocab, setVocab] = useState(vocabs[currentId]);
  const [userChoices, setUserChoices] = useState<QuestionData[]>([]);
  const [choices, setChoices] = useState<Choice[]>([]);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(() => setChoices(getChoices()), [currentId]);

  const goNext = () => {
    setCurrentId(currentId + 1);
    setVocab(vocabs[currentId + 1]);
    setShowAnswer(false);
    setShowNext(false);
  };

  const finish = () => {
    toggleModal();
  };

  const checkAnswer = (
    event: React.MouseEvent<HTMLButtonElement>,
    userChoice: string
  ) => {
    event.preventDefault();
    const answer = choices.find((c) => c.correct === true);
    if (answer) {
      let isCorrect = false;

      //- checking if user's got correct
      if (userChoice === answer.meaning) isCorrect = true;

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

      console.log({
        userChoice: userChoice,
        choices: choices,
        gotCorrect: isCorrect,
      });
    }

    setShowAnswer(true);
    // - show the next button if less than numOfQs
    if (!(currentId + 1 >= numOfQs)) setShowNext(true);
  };

  const getChoices = () => {
    const newChoices: { part: string; meaning: string; correct: boolean }[] =
      [];

    newChoices.push({
      ...getOneMeaningForOne(currentVocab),
      correct: true,
    });
    for (let i = 0; i < numOfChoices - 1; i++) {
      const choice = {
        ...getOneMeaningForOne(
          vocabs[Math.floor(Math.random() * vocabs.length)]
        ),
        correct: false,
      };
      // console.log("choice meaning", choice.meaning);
      // console.log(
      //   "find",
      //   newChoices.find((c) => c.meaning === choice.meaning)
      // );
      // console.log("choices", newChoices);
      if (!newChoices.find((c) => c.meaning === choice.meaning)) {
        //- meaning no duplicate in choices
        newChoices.push({
          ...getOneMeaningForOne(
            vocabs[Math.floor(Math.random() * vocabs.length)]
          ),
          correct: false,
        });
      } else {
        //- meaning the choice already exist
        --i;
      }
    }

    //- shuffle choices order, and add "I don't know" choice at the last
    return [
      ...shuffle(newChoices),
      { part: "", meaning: "わからない", correct: false },
    ];
  };

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
                  <p>
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
                  </p>
                </ListGroupItem>
              );
            })}
          </ListGroup>
        </ModalBody>
      </Modal>
      {/* ------------ result Modal ------------------- */}
    </>
  );
};

const MultQ = ({ unitId }) => {
  if (unitId < 0 || unitId > _units.length - 1) {
    return <p>{`${unitId} doesn't exist`}</p>;
  }
  const [vocabsData, vocabLoading, vocabError] = useDocument(
    doc(db, _UNITS_DB, `unit${unitId}`),
    {}
  );

  return (
    <>
      {vocabError && <p>{vocabError?.message}</p>}
      {vocabLoading && <p>Loading...</p>}
      {vocabsData && <RenderQuiz vocabsData={vocabsData} />}
    </>
  );
};

export default MultQ;
