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
  _partsList,
  _partsToJPN,
  _UNITS_DB,
} from "../../../../utils/staticValues";

const styles = require("../../../../styles/Vocab.module.css");

export const ShowVocabDetail = ({ vocabData, vocabId, unitId }) => {
  const vocab = vocabData.list.filter((v: Vocab) => v.num === vocabId)[0];
  const firstVocabId = vocabData.list[0].num;
  const lastVocabId = vocabData.list.at(-1).num;

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

        {_partsList.map((part) => {
          return (
            vocab[part] && (
              <Row key={part} className={styles.meaningRow}>
                <Col xs={6} className={styles.meaningCol}>
                  <p>{`${_partsToJPN[part]} : ${vocab[part]}`}</p>
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
            <Link href={"/vocabulary/[unit]"} as={`/vocabulary/${unitId}`}>
              {`Unit${unitId}に戻る`}
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

const VocabDetail = () => {
  const router = useRouter();
  const data = router.query;
  const unitId = data.unit ? +data.unit : 0;
  const vocabId = data.number ? +data.number : 0;

  const [vocabData, vocabLoading, vocabError] = useDocument(
    doc(db, _UNITS_DB, `unit${unitId}`),
    {}
  );

  return (
    <Container fluid>
      {vocabLoading ? (
        <h5>Loading...</h5>
      ) : vocabData ? (
        <ShowVocabDetail
          vocabData={vocabData.data()}
          vocabId={vocabId}
          unitId={unitId}
        />
      ) : (
        <p>{vocabError?.message}</p>
      )}
    </Container>
  );
};

export default VocabDetail;
