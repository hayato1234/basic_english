import React, { useEffect, useState } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import { collection } from "firebase/firestore";

import { db } from "../utils/initAuth";
import { DB_UNITS } from "../utils/staticValues";
import {
  Button,
  Col,
  List,
  ListGroup,
  ListGroupItem,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
} from "reactstrap";
import { Choice, QuestionData, Vocab } from "../types/vocabType";
import { getChoices, checkAnswer } from "../utils/quizUtil";
import { getAuth, User } from "firebase/auth";
import Link from "next/link";
import { shuffle } from "../utils/arraySort";
import QuizFooter from "./QuizFooter";
import QuizHeader from "./QuizHeader";

const RenderQuiz = ({ originalVocabs }) => {
  const [vocabs, setVocabs] = useState(originalVocabs);
  const [currentId, setCurrentId] = useState(0);
  const [currentVocab, setCurrentVocab] = useState(vocabs[currentId]);
  const [choices, setChoices] = useState(getChoices(currentVocab, vocabs, 5));
  const [userChoices, setUserChoices] = useState<QuestionData[]>([]);
  const [numOfQs, setNumOfQs] = useState(20);

  const [showAnswer, setShowAnswer] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    setCurrentVocab(vocabs[currentId]);
    setChoices(getChoices(currentVocab, vocabs, 5));
  }, [currentId]);

  const handleAnswer = (
    event: React.MouseEvent<HTMLButtonElement>,
    choices: Choice[],
    userChoice: string,
    currUser: User | null,
    answerVocab: Vocab,
    currentId: number
  ) => {
    const qData = checkAnswer(
      event,
      choices,
      userChoice,
      currUser,
      answerVocab,
      currentId
    );
    if (qData) {
      setUserChoices([...userChoices, qData]);
      setShowAnswer(true);
    }

    //i- show the next button if less than numOfQs
    if (!(currentId + 1 >= numOfQs)) setShowNext(true);
  };
  const goNext = () => {
    setCurrentId(currentId + 1);
    setCurrentVocab(vocabs[currentId + 1]);
    setShowAnswer(false);
    setShowNext(false);
  };
  const retry = () => {
    setVocabs(shuffle(vocabs));
    setCurrentId(0);
    setShowAnswer(false);
    setShowNext(false);
    setUserChoices([]);
    toggleModal();
  };
  const finish = () => {
    toggleModal();
  };

  const toggleModal = () => {
    setModalOpen(!isModalOpen);
  };

  return (
    <>
      <QuizHeader
        linkHref="/vocabulary"
        linkAs={null}
        title="全単語テスト"
        currentId={currentId}
        numOfQs={numOfQs}
        setNumOfQs={setNumOfQs}
      />
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
                handleAnswer(
                  e,
                  choices,
                  meaning.meaning,
                  getAuth().currentUser,
                  currentVocab,
                  currentId
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
      <QuizFooter
        currentId={currentId}
        showNext={showAnswer}
        goNext={goNext}
        finish={finish}
        numOfQs={numOfQs}
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
          <Link href="/vocabulary" passHref>
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

const MultQAllUnit = ({}) => {
  const [unitsData, unitsDataLoading, unitsDataError] = useCollection(
    collection(db, DB_UNITS),
    {}
  );
  const unitsDataDocs = unitsData ? unitsData.docs : null;

  let allVocabData =
    unitsDataDocs &&
    unitsDataDocs.reduce((a, c) => {
      if (c.data()) {
        const b: Vocab[] = c.data().list;
        return [...a, ...b];
      }
      return [...a];
    }, [] as Vocab[]);

  return (
    <div>
      {unitsDataLoading ? (
        <Row>
          <h5>Loading...</h5>
        </Row>
      ) : allVocabData ? (
        <>
          <RenderQuiz originalVocabs={shuffle(allVocabData)} />
        </>
      ) : (
        <p>Error loading</p>
      )}
    </div>
  );
};

export default MultQAllUnit;
