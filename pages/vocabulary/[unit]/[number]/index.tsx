import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Vocab } from "../../../../types/vocabType";
import { useDocument } from "react-firebase-hooks/firestore";
import { doc } from "firebase/firestore";

import { db } from "../../../../utils/initAuth";

import { Col, Container, Row } from "reactstrap";
import ReportIssue from "../../../../components/ReportIssue";
import {
  PARTS_LIST,
  PARTS_TO_JPN,
  DB_UNITS,
  DB_USER_VOCAB,
} from "../../../../utils/staticValues";
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "firebase/auth";
import ErrorMessage from "../../../../components/ErrorMessage";

const styles = require("../../../../styles/Vocab.module.css");

type props = {
  vocabs: Vocab[];
  vocabId: number;
  unitId: number;
  customUnit: boolean;
};

export const RenderVocabDetail = ({
  vocabs,
  vocabId,
  unitId,
  customUnit,
}: props) => {
  const vocab = vocabs.filter((v: Vocab) => v.num === vocabId)[0];
  const firstVocabId = vocabs[0].num;
  const lastVocabId = vocabs[vocabs.length - 1].num;

  const [isModalOpen, setModalOpen] = useState(false);

  const toggleModal = () => {
    setModalOpen(!isModalOpen);
  };

  const errorReportData = { url: useRouter().pathname, tango: vocab };

  if (vocab) {
    return (
      <>
        <Row className={styles.word}>
          <Col xs={6}>
            <h1>{`${vocab.num} : ${vocab.en}`}</h1>
          </Col>
        </Row>

        <Row className="justify-content-center mt-3">
          <Col xs={6} style={{ border: "1px solid black" }}>
            <h5>意味</h5>
          </Col>
        </Row>

        {PARTS_LIST.map((part) => {
          return (
            vocab[part] && (
              <Row key={part} className={styles.meaningRow}>
                <Col xs={6} className={styles.meaningCol}>
                  <p>{`${PARTS_TO_JPN[part]} : ${vocab[part]}`}</p>
                </Col>
              </Row>
            )
          );
        })}

        <Row className="justify-content-end">
          <Col xs={3} className="align-self-end">
            <button onClick={() => toggleModal()}>間違えを報告する</button>
          </Col>
        </Row>

        <Row className={styles.word}>
          {vocab.num > firstVocabId && (
            <Col xs={{ offset: 1, size: 3 }}>
              <Link
                href={"/vocabulary/[unit]/[number]"}
                as={`/vocabulary/${unitId}/${vocab.num - 1}`}
              >
                ←Previous
              </Link>
            </Col>
          )}
          <Col xs={3}>
            <Link
              href={"/vocabulary/[unit]"}
              as={`/vocabulary/${customUnit ? "user" + unitId : unitId}`}
            >
              {`Unit${vocab.unit}に戻る`}
            </Link>
          </Col>
          {vocab.num < lastVocabId && (
            <Col xs={3}>
              <Link
                href={"/vocabulary/[unit]/[number]"}
                as={`/vocabulary/${unitId}/${vocab.num + 1}`}
              >
                Next→
              </Link>
            </Col>
          )}
        </Row>
        <ReportIssue
          isModalOpen={isModalOpen}
          toggleModal={toggleModal}
          data={errorReportData}
        />
      </>
    );
  } else {
    return (
      <h1>{`Unit${unitId}　の　単語番号：${vocabId}　は見つかりません`}</h1>
    );
  }
};

const ShowVocabDetail = ({ vocabId, unitId }) => {
  const [vocabData, vocabLoading] = useDocument(
    doc(db, DB_UNITS, `unit${unitId}`),
    {}
  );
  let vocabs = vocabData ? vocabData.data()!.list : undefined;
  return (
    <>
      {vocabLoading ? (
        <h5>Loading...</h5>
      ) : vocabData ? (
        <RenderVocabDetail
          vocabs={vocabs}
          vocabId={vocabId}
          unitId={unitId}
          customUnit={false}
        />
      ) : (
        <p>Error loading</p>
      )}
    </>
  );
};

const ShowCustomVocabDetail = ({ vocabId, unitId, userUid }) => {
  const [userUnitsData, userUnitsDataLoading] = useDocument(
    doc(db, DB_USER_VOCAB, userUid),
    {}
  );
  let vocabsData = userUnitsData ? userUnitsData.data()![+unitId] : undefined;
  let vocabs = vocabsData ? vocabsData.vocabs : undefined;
  return (
    <>
      {userUnitsDataLoading ? (
        <h5>Loading...</h5>
      ) : vocabs ? (
        <RenderVocabDetail
          vocabs={vocabs}
          vocabId={vocabId}
          unitId={unitId}
          customUnit={true}
        />
      ) : (
        <p>Error loading</p>
      )}
    </>
  );
};

const VocabDetail = () => {
  const [user, userLoading] = useAuthState(getAuth());
  const router = useRouter();
  const data = router.query;
  const unitId = data.unit ? +data.unit : 0;
  const vocabId = data.number ? +data.number : 0;

  // console.log(unitId);

  return (
    <Container fluid>
      {+unitId < 5 ? (
        <ShowVocabDetail vocabId={vocabId} unitId={unitId} />
      ) : userLoading ? (
        <p>User info loading</p>
      ) : user ? (
        <ShowCustomVocabDetail
          vocabId={vocabId}
          unitId={unitId}
          userUid={user.uid}
        />
      ) : (
        <p>Error loading your vocabulary</p>
      )}
      {/* {vocabLoading ? (
        <h5>Loading...</h5>
      ) : vocabData ? (
        <ShowVocabDetail
          vocabData={vocabData.data()}
          vocabId={vocabId}
          unitId={unitId}
        />
      ) : (
        // <></>
        <p>{vocabError?.message}</p>
      )} */}
    </Container>
  );
};

export default VocabDetail;
