import React from "react";
import { useState } from "react";
import { Button, Col, Container, Row } from "reactstrap";

const questions: string[] = ["I q_blank you later if I have time."];
const correctAnswer: String = "will help";
const choices: string[] = [
  "help",
  "helped",
  "would help",
  "would have helped",
  "will help",
];
const blank: String = "________";

const LearningPage = () => {
  const [wordsSelected, setWordsSelected] = useState("");
  const [result, setResult] = useState("");
  const [checkButtonText, setCheckText] = useState("Check");

  const Choices = () => {
    return (
      <ol>
        {choices.map((choice) => {
          return (
            <li key={choice}>
              <Button
                onClick={() => setWordsSelected(choice)}
                outline
                color="primary"
              >
                {choice}
              </Button>
            </li>
          );
        })}
      </ol>
    );
  };

  const checkAnswer = () => {
    if (wordsSelected === correctAnswer) setResult("Correct!");
    else setResult("Wrong");
    setCheckText("Next");
  };

  return (
    <Container>
      <Row>
        <Col className="my-3">
          <h2>
            次の文が現実の話をしているのかどうか考えて、下線に動詞を入れよう。
          </h2>
        </Col>
      </Row>
      <Row>
        <Col className="my-5">
          <h1>
            {questions[0].slice(0, questions[0].indexOf("q_blank"))}{" "}
            {wordsSelected === ""
              ? blank + " "
              : "___" + wordsSelected + "___ "}
            {questions[0].slice(questions[0].indexOf("q_blank") + 7)}
          </h1>
        </Col>
      </Row>
      <Row>
        <Col className="mt-5">
          <Choices />
        </Col>
      </Row>
      <Row>
        <Col>
          <Button onClick={() => setWordsSelected("")}>Clear</Button>
        </Col>
      </Row>
      <hr />
      <Row>
        <Col md={10}>
          <h1>{result === "" ? "" : result}</h1>
        </Col>
        <Col>
          {" "}
          <Button color="primary" onClick={() => checkAnswer()}>
            {checkButtonText}
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default LearningPage;
