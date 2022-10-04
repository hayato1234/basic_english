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
import { _units, _UNITS_DB } from "../utils/staticValues";

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
    collection(db, _UNITS_DB),
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
              <UnitTiles unitData={unitsData.docs[0]} unitId={_units[0]} />
            ) : (
              <h5>{`Error loading: ${unitsDataError}`}</h5>
            )}
          </Col>
          <Col md={6}>
            {unitsDataLoading ? (
              <></>
            ) : unitsData ? (
              <UnitTiles unitData={unitsData.docs[1]} unitId={_units[1]} />
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
              <UnitTiles unitData={unitsData.docs[2]} unitId={_units[2]} />
            ) : (
              <></>
            )}
          </Col>
          <Col md={6}>
            {unitsDataLoading ? (
              <></>
            ) : unitsData ? (
              <UnitTiles unitData={unitsData.docs[3]} unitId={_units[3]} />
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
              <UnitTiles unitData={unitsData.docs[4]} unitId={_units[4]} />
            ) : (
              <></>
            )}
          </Col>
          <Col md={6}>
            {unitsDataLoading ? (
              <></>
            ) : unitsData ? (
              <UnitTiles unitData={unitsData.docs[5]} unitId={_units[5]} />
            ) : (
              <></>
            )}
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <UnitTiles unitData={null} unitId={"単語を追加"} />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default UnitList;
