import React, { LegacyRef } from "react";
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
import {
  collection,
  QueryDocumentSnapshot,
  DocumentData,
} from "firebase/firestore";

import { db } from "../utils/initAuth";
import { Vocab } from "../types/vocabType";
import Link from "next/link";

const styles = require("../styles/Vocab.module.css");

export const _UNITS_DB = "unit_data";
const units = [0, 1, 2, 3, 4, 5];

const UnitTiles = ({ unitData, unitId }) => {
  const vocabs: Vocab[] = unitData.data().list;

  return (
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
  );
};

const UnitList = () => {
  const [unitsData, unitsDataLoading, unitsDataError] = useCollection(
    collection(db, _UNITS_DB),
    {}
  );
  const ref = React.createRef();

  return (
    <div>
      <Container>
        <Row>
          <Col md={6}>
            {unitsDataLoading ? (
              <h5>Loading...</h5>
            ) : unitsData ? (
              <UnitTiles unitData={unitsData.docs[0]} unitId={units[0]} />
            ) : (
              <h5>{`Error loading: ${unitsDataError}`}</h5>
            )}
          </Col>
          <Col md={6}>
            {unitsDataLoading ? (
              <></>
            ) : unitsData ? (
              <UnitTiles unitData={unitsData.docs[1]} unitId={units[1]} />
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
              <UnitTiles unitData={unitsData.docs[2]} unitId={units[2]} />
            ) : (
              <></>
            )}
          </Col>
          <Col md={6}>
            {unitsDataLoading ? (
              <></>
            ) : unitsData ? (
              <UnitTiles unitData={unitsData.docs[3]} unitId={units[3]} />
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
              <UnitTiles unitData={unitsData.docs[4]} unitId={units[4]} />
            ) : (
              <></>
            )}
          </Col>
          <Col md={6}>
            {unitsDataLoading ? (
              <></>
            ) : unitsData ? (
              <UnitTiles unitData={unitsData.docs[5]} unitId={units[5]} />
            ) : (
              <></>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default UnitList;
