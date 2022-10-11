import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useDocument } from "react-firebase-hooks/firestore";
import { doc, FieldValue, setDoc, updateDoc } from "firebase/firestore";
import { Button, Col, Container, Row } from "reactstrap";

import VocabList from "../../../components/VocabList";
import FlashCards from "../../../components/FlashCards";

import { Modes } from "./quiz";
import { db } from "../../../utils/initAuth";
import { UNITS, DB_UNITS, DB_USER_DATA } from "../../../utils/staticValues";
import { getAuth } from "firebase/auth";
import { history } from "../../../types/userType";

const sendHistory = (user: { uid: string }, unitId: number) => {
  const [userData, userDataLoading, userDataError] = useDocument(
    doc(db, DB_USER_DATA, user.uid),
    {}
  );
  const typeVocab = "vocabulary";
  const updateHistory = async () => {
    if (user)
      if (userData && userData.data()) {
        const allUserData = userData.data();
        if (allUserData?.history) {
          //i- get here if history exists

          // console.log(allUserData?.history);
          // console.log(
          //   allUserData?.history.find(
          //     (h: history) =>
          //       h.type === typeVocab && h.unitData[0] === `unit${unitId}`
          //   )
          // );

          if (
            allUserData?.history.find(
              (h: history) =>
                h.type === typeVocab && h.unitData[0] === `unit${unitId}`
            )
          ) {
            console.log("existed");
            const newList = allUserData?.history.filter(
              (h: history) =>
                h.type === typeVocab && h.unitData[0] != `unit${unitId}`
            );
            console.log(newList);

            await updateDoc(doc(db, DB_USER_DATA, user.uid), {
              history: [
                ...newList,
                { type: typeVocab, unitData: [`unit${unitId}`] },
              ],
            });
          } else {
            console.log("new");
            await updateDoc(doc(db, DB_USER_DATA, user.uid), {
              history: [
                ...allUserData?.history,
                { type: typeVocab, unitData: [`unit${unitId}`] },
              ],
            });
          }
        } else {
          //i- get here if no history
          await updateDoc(doc(db, DB_USER_DATA, user.uid), {
            history: [{ type: typeVocab, unitData: [`unit${unitId}`] }],
          });
        }
      }
  };
  updateHistory().catch(console.error);
};

const RenderDetail = ({ unitId }) => {
  const [vocab, vocabLoading, vocabError] = useDocument(
    doc(db, DB_UNITS, `unit${unitId}`),
    {}
  );

  return (
    <Container className="pt-4">
      <Link href="/vocabulary">
        <i className="fa fa-arrow-left" aria-hidden="true" />
      </Link>
      {vocabLoading ? (
        <h1>Loading...</h1>
      ) : vocab ? (
        <>
          <h1>{`Unit ${unitId}`}</h1>
          <hr />
          <h2>単語帳</h2>
          <h4>右のカードの日本語の意味は？</h4>
          <FlashCards unitData={vocab} />

          <hr />
          <Row>
            <h2>Study Modes</h2>
          </Row>
          <Row>
            <Col xs="3" className="m-1">
              <Link
                href={{
                  pathname: "vocabulary/quiz",
                  query: {
                    unitId: unitId,
                    mode: Modes.Multiple,
                    inOrder: false,
                  },
                }}
                passHref
              >
                <Button>4択クイズ(ランダム順番)</Button>
              </Link>
            </Col>
          </Row>
          <Row>
            <Col xs="3" className="m-1">
              <Link
                href={{
                  pathname: "vocabulary/quiz",
                  query: {
                    unitId: unitId,
                    mode: Modes.Multiple,
                    inOrder: true,
                  },
                }}
                passHref
              >
                <Button>4択クイズ(単語番号順)</Button>
              </Link>
            </Col>
          </Row>

          <hr />
          <VocabList unitData={vocab} unitId={unitId} />
        </>
      ) : (
        <h1>{vocabError?.message}</h1>
      )}
    </Container>
  );
};

const UnitDetail = () => {
  const router = useRouter();
  const { unit } = router.query;
  const unitId = unit ? +unit : 0;

  const user = getAuth().currentUser;
  if (user) sendHistory(user, unitId);

  return (
    <>
      {unitId < 0 || unitId > UNITS.length - 1 ? (
        <>
          <Link href="/vocabulary">
            <i className="fa fa-arrow-left" aria-hidden="true" />
          </Link>
          <p>{`Error: Unit ${unitId} doesn't exist`}</p>
        </>
      ) : (
        <RenderDetail unitId={unitId} />
      )}
    </>
  );
};

export default UnitDetail;
