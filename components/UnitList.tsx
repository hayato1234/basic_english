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

const styles = require("../styles/Vocab.module.css");

const UnitTiles = ({ unitData, unitId }) => {
  const vocabs: Vocab[] = unitData ? unitData.data().list : null;

  return (
    <>
      {vocabs ? (
        <Link href="/vocabulary/[unit]" as={`/vocabulary/${unitId}`} passHref>
          <Card className={styles.card}>
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

  return (
    <div>
      <Container>
        <Row>
          <Col md={6}>
            {unitsDataLoading ? (
              <h5>Loading...</h5>
            ) : unitsData ? (
              <UnitTiles unitData={unitsData.docs[0]} unitId={UNITS[0]} />
            ) : (
              <h5>{`Error loading: ${unitsDataError}`}</h5>
            )}
          </Col>
          <Col md={6}>
            {unitsDataLoading ? (
              <></>
            ) : unitsData ? (
              <UnitTiles unitData={unitsData.docs[1]} unitId={UNITS[1]} />
            ) : (
              <></>
            )}
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            {unitsDataLoading ? (
              <></>
            ) : unitsData ? (
              <UnitTiles unitData={unitsData.docs[2]} unitId={UNITS[2]} />
            ) : (
              <></>
            )}
          </Col>
          <Col md={6}>
            {unitsDataLoading ? (
              <></>
            ) : unitsData ? (
              <UnitTiles unitData={unitsData.docs[3]} unitId={UNITS[3]} />
            ) : (
              <></>
            )}
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            {unitsDataLoading ? (
              <></>
            ) : unitsData ? (
              <UnitTiles unitData={unitsData.docs[4]} unitId={UNITS[4]} />
            ) : (
              <></>
            )}
          </Col>
          <Col md={6}>
            {unitsDataLoading ? (
              <></>
            ) : unitsData ? (
              <UnitTiles unitData={unitsData.docs[5]} unitId={UNITS[5]} />
            ) : (
              <></>
            )}
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            {unitsDataLoading ? (
              <></>
            ) : (
              <UnitTiles unitData={null} unitId={"単語を追加"} />
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default UnitList;
