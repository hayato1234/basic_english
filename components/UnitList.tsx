import React from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardText,
  CardTitle,
  Col,
  Container,
  Row,
} from "reactstrap";
import { useCollection } from "react-firebase-hooks/firestore";
import { collection } from "firebase/firestore";

import { db } from "../utils/initAuth";
import { Vocab } from "../types/vocabType";
import Link from "next/link";
import { UNITS, DB_UNITS } from "../utils/staticValues";
import { Modes } from "../pages/vocabulary/quiz";
import { useSpring, animated } from "react-spring";

const styles = require("../styles/Vocab.module.css");
const cardColors = [
  "rgba(0,212,255,1)",
  "rgba(28,165,222,1)",
  "rgba(43,140,205,1)",
  "rgba(76,84,166,1)",
  "rgba(96,50,142,1)",
  "rgba(121,9,113,1)",
  "rgba(2,0,36,1)",
];

const UnitTiles = ({ unitData, unitId }) => {
  const vocabs: Vocab[] = unitData ? unitData.data().list : null;
  const moveUpUnits = useSpring({
    to: { opacity: 1, transform: "translateY(0px)" },
    from: {
      opacity: 0,
      transform: "translateY(150px)",
    },
    delay: 200,
    config: { friction: 40 },
  });

  return (
    <>
      {vocabs ? (
        <animated.div style={moveUpUnits}>
          <Link href="/vocabulary/[unit]" as={`/vocabulary/${unitId}`} passHref>
            <Card
              className={styles.card}
              style={{ borderColor: cardColors[unitId], borderWidth: "2px" }}
            >
              <CardHeader>{`Unit ${unitId}`}</CardHeader>
              <CardBody>
                <CardTitle tag="p">Examples:</CardTitle>
                <CardText className="ms-2">
                  {vocabs[Math.floor(Math.random() * vocabs.length)].en}
                </CardText>
                <CardText className="ms-2">
                  {vocabs[Math.floor(Math.random() * vocabs.length)].en}
                </CardText>
              </CardBody>
            </Card>
          </Link>
        </animated.div>
      ) : (
        <>
          <Card className={styles.card}>
            <CardHeader>{`${unitId}`}</CardHeader>
            <CardBody>
              <CardTitle tag="p">機能準備中</CardTitle>
            </CardBody>
          </Card>
        </>
      )}
    </>
  );
};

const UnitList = () => {
  const [unitsData, unitsDataLoading, unitsDataError] = useCollection(
    collection(db, DB_UNITS),
    {}
  );
  const moveUp = useSpring({
    to: { opacity: 1, transform: "translateY(0px)" },
    from: {
      opacity: 0,
      transform: "translateY(150px)",
    },
    delay: 200,
    config: { friction: 40 },
  });

  return (
    <Container>
      <Row>
        <Col md="4" sm="6">
          <animated.div style={moveUp}>
            <Link
              href={{
                pathname: "vocabulary/quiz",
                query: {
                  unitId: 1,
                  mode: Modes.MultipleAssess,
                  inOrder: true,
                },
              }}
              passHref
            >
              <Card className={styles.card}>
                <CardHeader>Level Assessment</CardHeader>
                <CardBody>
                  <CardTitle tag="p">
                    自己診断：
                    どのユニットから始めるか自分のレベルを確認しよう！(何度でも挑戦可)
                  </CardTitle>
                </CardBody>
              </Card>
            </Link>
          </animated.div>
        </Col>
        <Col md="4" sm="6">
          <animated.div style={moveUp}>
            <Link
              href={{
                pathname: "vocabulary/quiz",
                query: {
                  unitId: 1,
                  mode: Modes.MultipleAllUnit,
                  inOrder: true,
                },
              }}
              passHref
            >
              <Card className={styles.card}>
                <CardHeader>All Units</CardHeader>
                <CardBody>
                  <CardTitle tag="p">
                    全てのUnitの単語が混ざったクイズに挑戦
                  </CardTitle>
                </CardBody>
              </Card>
            </Link>
          </animated.div>
        </Col>
      </Row>
      <hr />
      {unitsDataLoading ? (
        <Row>
          <h5>Loading...</h5>
        </Row>
      ) : unitsData ? (
        <>
          <Row>
            <Col sm="6" md="4" lg="3">
              {unitsData.docs[0] ? (
                <UnitTiles unitData={unitsData.docs[0]} unitId={UNITS[0]} />
              ) : (
                <h5>{`Error loading: ${unitsDataError}`}</h5>
              )}
            </Col>
            <Col sm="6" md="4" lg="3">
              {unitsData.docs[1] ? (
                <UnitTiles unitData={unitsData.docs[1]} unitId={UNITS[1]} />
              ) : (
                <></>
              )}
            </Col>
            <Col sm="6" md="4" lg="3">
              {unitsData.docs[2] ? (
                <UnitTiles unitData={unitsData.docs[2]} unitId={UNITS[2]} />
              ) : (
                <></>
              )}
            </Col>
            <Col sm="6" md="4" lg="3">
              {unitsData.docs[3] ? (
                <UnitTiles unitData={unitsData.docs[3]} unitId={UNITS[3]} />
              ) : (
                <></>
              )}
            </Col>
            <Col sm="6" md="4" lg="3">
              {unitsData.docs[4] ? (
                <UnitTiles unitData={unitsData.docs[4]} unitId={UNITS[4]} />
              ) : (
                <></>
              )}
            </Col>
            <Col sm="6" md="4" lg="3">
              {unitsData.docs[5] ? (
                <UnitTiles unitData={unitsData.docs[5]} unitId={UNITS[5]} />
              ) : (
                <></>
              )}
            </Col>
          </Row>
          <hr />
          <Row>
            <Col sm="6" md="4" lg="3">
              <UnitTiles unitData={null} unitId={"単語を追加"} />
            </Col>
          </Row>
        </>
      ) : (
        <h5>{`Error loading: ${unitsDataError}`}</h5>
      )}
    </Container>
  );
};

export default UnitList;
