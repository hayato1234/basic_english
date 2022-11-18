import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useDocument } from "react-firebase-hooks/firestore";
import { doc, updateDoc } from "firebase/firestore";
import { Button, Col, Container, Row } from "reactstrap";

import VocabList from "../../../components/VocabList";
import FlashCards from "../../../components/FlashCards";

import { Modes } from "../quiz";
import { db } from "../../../utils/initAuth";
import {
  UNITS,
  DB_UNITS,
  DB_USER_DATA,
  DB_USER_VOCAB,
} from "../../../utils/staticValues";
import { getAuth } from "firebase/auth";
import { history } from "../../../types/userType";
import { CustomUnit } from "../../../types/vocabType";
import { useAuthState } from "react-firebase-hooks/auth";

type historyProps = {
  userUid: string;
  unitId: string;
  unitTitle: string;
};

const SendHistory = ({ userUid, unitId, unitTitle }: historyProps) => {
  const [userData, userDataLoading, userDataError] = useDocument(
    doc(db, DB_USER_DATA, userUid),
    {}
  );
  const [historySent, setSent] = useState(false);
  if (userDataError) console.log(userDataError.message);

  if (!historySent) {
    if (userData) {
      const typeVocab = "vocabulary";
      // const unitTitle = isNaN(+unitId) ? `unit${unitId}` : unitId;
      const updateHistory = async () => {
        if (!userDataLoading && userUid)
          if (userData && userData.data()) {
            const allUserData = userData.data();
            if (allUserData?.history) {
              //i- get here if history exists
              if (
                allUserData?.history.find(
                  (h: history) =>
                    h.type === typeVocab && h.unitData.id === unitId
                )
              ) {
                //i- get here if the unit already exist in history, so delete and bring it to the last
                const newList = allUserData?.history.filter(
                  (h: history) =>
                    h.type === typeVocab && h.unitData.id !== unitId
                );

                await updateDoc(doc(db, DB_USER_DATA, userUid), {
                  history: [
                    ...newList,
                    {
                      type: typeVocab,
                      unitData: { id: unitId, title: unitTitle },
                    },
                  ],
                });
              } else {
                //i- get here if the unit doesn't exist in history yet, so make one and add
                await updateDoc(doc(db, DB_USER_DATA, userUid), {
                  history: [
                    ...allUserData?.history,
                    {
                      type: typeVocab,
                      unitData: { id: unitId, title: unitTitle },
                    },
                  ],
                });
              }
            } else {
              //i- get here if no history
              await updateDoc(doc(db, DB_USER_DATA, userUid), {
                history: [
                  {
                    type: typeVocab,
                    unitData: { id: unitId, title: unitTitle },
                  },
                ],
              });
            }
          }
      };
      updateHistory().catch(console.error);
      setSent(true);
    }
  }

  return <></>;
};

const RenderDetail = ({ unitId, unitData, userUid }) => {
  const vocab = unitData.data().list;

  return (
    <Container className="pt-4">
      <Link href="/vocabulary">
        <i className="fa fa-arrow-left" aria-hidden="true" />
      </Link>
      {vocab ? (
        <>
          <h1>{`Unit ${unitId}`}</h1>
          <hr />
          <h2>単語帳</h2>

          <FlashCards vocab={vocab} />

          <hr />
          <Row>
            <h2>Study Modes</h2>
          </Row>
          <Row>
            <Col className="m-1">
              <Link
                href={{
                  pathname: "/vocabulary/quiz",
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
            <Col className="m-1">
              <Link
                href={{
                  pathname: "/vocabulary/quiz",
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
          <Row className="mb-2">
            <Col>
              <h2>単語リスト</h2>
            </Col>
          </Row>

          <VocabList vocabs={vocab} unitId={unitId} />
          {userUid && (
            <SendHistory
              userUid={userUid}
              unitTitle={`unit${unitId}`}
              unitId={unitId}
            />
          )}
        </>
      ) : (
        <h1>Error Loading</h1>
      )}
    </Container>
  );
};

const PresetUnitDetail = ({ unitId, userUid }) => {
  const [vocab, vocabLoading] = useDocument(
    doc(db, DB_UNITS, `unit${unitId}`),
    {}
  );
  return (
    <>
      {vocabLoading ? null : vocab ? (
        <RenderDetail unitId={unitId} unitData={vocab} userUid={userUid} />
      ) : null}
    </>
  );
};

const RenderCustomDetail = ({ unitId, unitData, userUid }) => {
  const userUnits: CustomUnit[] = Object.values(unitData.data());
  const userUnit = userUnits.find((unit) => +unit.id === +unitId);

  return (
    <Container className="pt-4">
      {userUnit ? (
        <>
          <Row className="justify-content-between">
            <Col xs="1">
              <Link href="/vocabulary">
                <i className="fa fa-arrow-left" aria-hidden="true" />
              </Link>
            </Col>
            <Col xs="1">
              <Link href="/edit/[id]" as={`/edit/${userUnit.id}`} role="button">
                <i className="fa fa-pencil" aria-hidden="true" />
              </Link>
            </Col>
          </Row>
          <h1>{userUnit.title}</h1>
          <hr />
          <h2>単語帳</h2>

          <FlashCards vocab={userUnit.vocabs} />

          <hr />
          <Row>
            <h2>Study Modes</h2>
          </Row>
          <Row>
            <Col className="m-1">
              <Link
                href={{
                  pathname: "/vocabulary/quiz",
                  query: {
                    unitId: "user" + unitId,
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
            <Col className="m-1">
              <Link
                href={{
                  pathname: "/vocabulary/quiz",
                  query: {
                    unitId: "user" + unitId,
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
          <Row className="mb-2">
            <Col>
              <h2>単語リスト</h2>
            </Col>
          </Row>

          <VocabList unitId={unitId} vocabs={userUnit.vocabs} />

          {userUid && (
            <SendHistory
              userUid={userUid}
              unitTitle={userUnit.title}
              unitId={`user${userUnit.id}`}
            />
          )}
        </>
      ) : (
        <h1>error loading your unit</h1>
      )}
    </Container>
  );
};

const CustomUnitDetail = ({ unitId, user }) => {
  const [userUnitsData, userUnitsDataLoading, userUnitsDataError] = useDocument(
    doc(db, DB_USER_VOCAB, user.uid),
    {}
  );

  return (
    <>
      {userUnitsDataLoading ? (
        <p>Loading...</p>
      ) : userUnitsData ? (
        <RenderCustomDetail
          unitId={unitId.slice(4)}
          unitData={userUnitsData}
          userUid={user.uid}
        />
      ) : (
        <p>Error {userUnitsDataError?.message}</p>
      )}
    </>
  );
};

const UnitDetail = () => {
  const [user, userLoading] = useAuthState(getAuth());
  const router = useRouter();
  const { unit } = router.query;
  const unitId = unit ? (Number.isInteger(+unit) ? +unit : unit.toString()) : 0;

  return (
    <>
      {/* if userXXX then user custom unit, otherwise preset units */}
      {unitId.toString().includes("user") ? (
        userLoading ? (
          <p>Loading</p>
        ) : (
          user && <CustomUnitDetail unitId={unitId} user={user} />
        )
      ) : unitId < 0 || unitId > UNITS.length - 1 ? (
        <>
          <Link href="/vocabulary">
            <i className="fa fa-arrow-left" aria-hidden="true" />
          </Link>
          <p>{`Error: Unit ${unitId} doesn't exist`}</p>
        </>
      ) : (
        <PresetUnitDetail unitId={unitId} userUid={user?.uid} />
      )}
    </>
  );
};

export default UnitDetail;
