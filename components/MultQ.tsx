import { doc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useDocument } from "react-firebase-hooks/firestore";
import { Button, List } from "reactstrap";
import { Choice, Vocab } from "../types/vocabType";
import { shuffle } from "../utils/arraySort";
import { getMeaningsForOne, getOneMeaningForOne } from "../utils/getMeaning";
import { db } from "../utils/initAuth";
import { _partsToJPN, _UNITS_DB } from "../utils/staticValues";

const RenderQuiz = ({ vocabsData }) => {
  const vocabs: Vocab[] = vocabsData.data().list;
  const [numOfChoices, setNumOfChoices] = useState(4);
  if (vocabs) {
    const [currentId, setCurrentId] = useState(0);
    const [currentVocab, setVocab] = useState(vocabs[currentId]);
    const [userChoices, setUserChoices] = useState<
      { userChoice: string; choices: Choice[]; gotCorrect: boolean }[]
    >([]);
    const [choices, setChoices] = useState<Choice[]>([]);
    const [showAnswer, setShowAnswer] = useState(false);

    useEffect(() => setChoices(getChoices()), []);

    const goNext = () => {
      setCurrentId(currentId + 1);
      setVocab(vocabs[currentId + 1]);
      setShowAnswer(false);
    };

    const checkAnswer = (
      event: React.MouseEvent<HTMLButtonElement>,
      userChoice: string
    ) => {
      event.preventDefault();
      let isCorrect = false;
      if (userChoice === choices.find((c) => c.correct === true)?.meaning)
        isCorrect = true;
      setUserChoices([
        ...userChoices,
        { userChoice: userChoice, choices: choices, gotCorrect: isCorrect },
      ]);
      console.log({
        userChoice: userChoice,
        choices: choices,
        gotCorrect: isCorrect,
      });
      setShowAnswer(true);
    };

    const getChoices = () => {
      const choices: { part: string; meaning: string; correct: boolean }[] = [];

      choices.push({
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
        if (!choices.find((c) => c.meaning === choice.meaning)) {
          //meaning no duplicate in choices
          choices.push({
            ...getOneMeaningForOne(
              vocabs[Math.floor(Math.random() * vocabs.length)]
            ),
            correct: false,
          });
        } else {
          //meaning the choice already exist
          --i;
        }
      }

      //shuffle choices order, and add "I don't know" choice at the last
      return [
        ...shuffle(choices),
        { part: "", meaning: "わからない", correct: false },
      ];
    };

    return (
      <>
        <h1>{currentVocab.en}</h1>
        <List type="unstyled">
          {choices.map((meaning) => (
            <li key={meaning.meaning} className="m-2">
              {showAnswer && meaning.correct && <span>-</span>}
              {showAnswer && !meaning.correct && <span>+</span>}
              <Button
                color={
                  showAnswer
                    ? meaning.correct
                      ? "success"
                      : "danger"
                    : "primary"
                }
                outline
                disabled={showAnswer}
                onClick={(e) => checkAnswer(e, meaning.meaning)}
              >{`${meaning.meaning} : ${meaning.correct}`}</Button>
            </li>
          ))}
        </List>
        {showAnswer && <Button onClick={goNext}>Next</Button>}
      </>
    );
  }
  return <></>;
};

const MultQ = ({ unitId }) => {
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
