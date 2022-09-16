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
import {
  collection,
  QueryDocumentSnapshot,
  DocumentData,
} from "firebase/firestore";

import { db } from "../utils/initAuth";
import { Vocab } from "../types/vocabType";

const styles = require("../styles/Vocab.module.css");

const unitTitles = [
  "super_vocabs_0",
  "super_vocabs_1",
  "super_vocabs_2",
  "super_vocabs_3",
  "super_vocabs_4",
  "super_vocabs_5",
];
const unitNames = ["Unit 0", "Unit 1", "Unit 2", "Unit 3", "Unit 4", "Unit 5"];

const UnitTiles = ({ unitData, unitName }) => {
  const vocabs: Vocab[] = unitData.map(
    (vocabData: QueryDocumentSnapshot<DocumentData>) => vocabData.data()
  );

  const unitSelected = (name) => {
    console.log("clicked", name);
  };

  return (
    <Card onClick={() => unitSelected(unitName)} className={styles.card}>
      <CardHeader>{unitName}</CardHeader>
      <CardBody>
        <CardTitle tag="p">Examples:</CardTitle>
        <CardText className="ms-2">
          {vocabs[Math.floor(Math.random() * vocabs.length)].word}
        </CardText>
        <CardText className="ms-2">{vocabs[1].word}</CardText>
      </CardBody>
    </Card>
  );
};

const UnitList = () => {
  const [unit0, unit0loading, unit0error] = useCollection(
    collection(db, unitTitles[0]),
    {}
  );
  const [unit1, unit1loading, unit1error] = useCollection(
    collection(db, unitTitles[1]),
    {}
  );
  const [unit2, unit2loading, unit2error] = useCollection(
    collection(db, unitTitles[2]),
    {}
  );
  const [unit3, unit3loading, unit3error] = useCollection(
    collection(db, unitTitles[3]),
    {}
  );
  const [unit4, unit4loading, unit4error] = useCollection(
    collection(db, unitTitles[4]),
    {}
  );
  const [unit5, unit5loading, unit5error] = useCollection(
    collection(db, unitTitles[5]),
    {}
  );

  return (
    <div>
      <Container>
        <Row>
          <Col md={6}>
            {unit0loading ? (
              <h5>Loading</h5>
            ) : unit0 ? (
              <UnitTiles unitData={unit0.docs} unitName="Unit 0" />
            ) : (
              <h5>{`Error loading: ${unit0error}`}</h5>
            )}
          </Col>
          <Col md={6}>
            {unit1loading ? (
              <h5>Loading</h5>
            ) : unit1 ? (
              <UnitTiles unitData={unit1.docs} unitName="Unit 1" />
            ) : (
              <h5>{`Error loading: ${unit1error}`}</h5>
            )}
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            {unit2loading ? (
              <h5>Loading</h5>
            ) : unit2 ? (
              <UnitTiles unitData={unit2.docs} unitName="Unit 2" />
            ) : (
              <h5>{`Error loading: ${unit2error}`}</h5>
            )}
          </Col>
          <Col md={6}>
            {unit3loading ? (
              <h5>Loading</h5>
            ) : unit3 ? (
              <UnitTiles unitData={unit3.docs} unitName="Unit 3" />
            ) : (
              <h5>{`Error loading: ${unit3error}`}</h5>
            )}
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            {unit4loading ? (
              <h5>Loading</h5>
            ) : unit4 ? (
              <UnitTiles unitData={unit4.docs} unitName="Unit 4" />
            ) : (
              <h5>{`Error loading: ${unit4error}`}</h5>
            )}
          </Col>
          <Col md={6}>
            {unit5loading ? (
              <h5>Loading</h5>
            ) : unit5 ? (
              <UnitTiles unitData={unit5.docs} unitName="Unit 5" />
            ) : (
              <h5>{`Error loading: ${unit5error}`}</h5>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default UnitList;
