import React, { useState } from "react";
import { Button, Col, Row } from "reactstrap";
import Switch from "@mui/material/Switch";
import { Vocab } from "../types/vocabType";

import { FormControlLabel } from "@mui/material";
import { shuffle } from "../utils/arraySort";
import Link from "next/link";
import { PARTS_LIST, PARTS_TO_JPN } from "../utils/staticValues";

const styles = require("../styles/Vocab.module.css");

const FlashCards = ({ unitData }) => {
  const [vocabs, setVocabs] = useState(unitData?.data().list);

  const [leftIndex, setLeftIndex] = useState(0);
  const lastIndex = vocabs.length - 1;

  const [randomize, setRandomize] = useState(false);
  if (!unitData) {
    return (
      <>
        <h1>Error</h1>
        <Link href="/">
          <button>Reload</button>
        </Link>
      </>
    );
  }

  const label = { inputProps: { "aria-label": "randomize order" } };
  const handleRandomize = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRandomize(event.target.checked);
    if (!randomize) setVocabs(shuffle(vocabs));
    else vocabs.sort((a: Vocab, b: Vocab) => a.num - b.num);
  };

  // ! change this to reduce
  const meaning = PARTS_LIST.map((part) => {
    const vocab = vocabs[leftIndex - 1];
    if (vocab) {
      return (
        vocab[part] && (
          <Row key={part}>
            <Col>
              <p>{`${PARTS_TO_JPN[part]} : ${vocab[part]}`}</p>
            </Col>
          </Row>
        )
      );
    } else {
      return;
    }
  });

  return (
    <>
      <Row className="justify-content-end">
        <Col xs="3">
          <FormControlLabel
            control={
              <Switch
                {...label}
                checked={randomize}
                onChange={handleRandomize}
              />
            }
            label="Random"
            labelPlacement="start"
          />
        </Col>
      </Row>
      <Row className="justify-content-center">
        {leftIndex === 0 ? (
          <Col xs="5" className={styles.flashcard}>
            <h1>{`Unit ${vocabs[0].unit}`}</h1>
          </Col>
        ) : (
          <Col xs="5" className={styles.flashcard}>
            <Row className="justify-content-center">
              <Col xs="10">
                <p style={{ textAlign: "center" }}>{`${
                  vocabs[leftIndex - 1].num
                } : ${vocabs[leftIndex - 1].en}`}</p>
              </Col>
            </Row>
            <Row>
              <Col>{meaning}</Col>
            </Row>

            <Button onClick={() => setLeftIndex(leftIndex - 1)}>&lt;</Button>
          </Col>
        )}
        {leftIndex + 1 >= lastIndex ? (
          <Col xs="5" className={styles.flashcard}>
            <p>終わり</p>
          </Col>
        ) : (
          <Col xs="5" className={styles.flashcard}>
            <p style={{ textAlign: "center" }}>{`${leftIndex + 1} / ${
              vocabs.length
            }`}</p>
            <h1>{vocabs[leftIndex].en}</h1>
            <Button onClick={() => setLeftIndex(leftIndex + 1)}>&gt;</Button>
          </Col>
        )}
      </Row>
    </>
  );
};

export default FlashCards;
