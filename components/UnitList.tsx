import React, { useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardText,
  CardTitle,
  Col,
  Container,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
} from "reactstrap";
import { useCollection, useDocument } from "react-firebase-hooks/firestore";
import { collection, deleteField, doc, updateDoc } from "firebase/firestore";

import { db } from "../utils/initAuth";
import { CustomUnit, Vocab } from "../types/vocabType";
import Link from "next/link";
import {
  UNITS,
  DB_UNITS,
  DB_USER_VOCAB,
  DB_USER_DATA,
} from "../utils/staticValues";
import { history } from "../types/userType";
import { Modes } from "../pages/vocabulary/quiz";
import { useSpring, animated } from "react-spring";
import { getAuth, User } from "firebase/auth";

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
            <a className={styles.linkWrapper}>
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
            </a>
          </Link>
        </animated.div>
      ) : getAuth().currentUser ? (
        <animated.div style={moveUpUnits}>
          <Link href="/edit">
            <a className={styles.linkWrapper}>
              <Card className={styles.card}>
                <CardHeader>{`${unitId}`}</CardHeader>
                <CardBody>
                  <CardTitle tag="h6">準備中</CardTitle>
                  <CardText>"準備中"</CardText>
                </CardBody>
              </Card>
            </a>
          </Link>
        </animated.div>
      ) : (
        <animated.div style={moveUpUnits}>
          <Card>
            <CardHeader>{`${unitId}`}</CardHeader>
            <CardBody>
              <CardTitle tag="h6">Login in to add vocabulary</CardTitle>
              <CardText>
                "新しい単語を足すためにはログインしてください"
              </CardText>
            </CardBody>
          </Card>
        </animated.div>
      )}
    </>
  );
};

const RenderCustomUnit = ({ unitData, userId }) => {
  const [userData] = useDocument(doc(db, DB_USER_DATA, userId), {});
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<CustomUnit>();
  const userUnits: CustomUnit[] = Object.values(unitData);
  const toggleDeleteModal = () => setModalOpen(!modalOpen);

  const handleDeletePrompt = (
    event: React.MouseEvent<HTMLButtonElement>,
    userUnit: CustomUnit
  ) => {
    //i- when user click trash icon
    event.stopPropagation();
    setSelectedUnit(userUnit);
    toggleDeleteModal();
  };
  const handleDelete = async () => {
    //i- when user click delete button in modal
    if (selectedUnit) {
      console.log("deleting", selectedUnit.id);
      try {
        await updateDoc(doc(db, DB_USER_VOCAB, userId), {
          [selectedUnit.id]: deleteField(),
        });
        const allUserData = userData?.data();
        if (allUserData) {
          if (allUserData?.history) {
            //i- get here if history exists
            const typeVocab = "vocabulary";
            if (
              allUserData.history.find(
                (h: history) =>
                  h.type === typeVocab &&
                  h.unitData.id === "user" + selectedUnit.id
              )
            ) {
              //i- get here if the unit already exist in history, so delete the unit and make new history
              const newList = allUserData?.history.filter(
                (h: history) =>
                  h.type === typeVocab &&
                  h.unitData.id !== "user" + selectedUnit.id
              );
              await updateDoc(doc(db, DB_USER_DATA, userId), {
                history: [...newList],
              });
            }
          }
        }
      } catch {
        console.log("failed to delete");
      } finally {
        toggleDeleteModal();
      }
    }
  };
  return (
    <>
      {userUnits &&
        userUnits.map((userUnit) => {
          return (
            <Col key={userUnit.id} sm="6" md="4" lg="3">
              <Link
                href="/vocabulary/[unit]"
                as={`/vocabulary/user${userUnit.id}`}
                passHref
              >
                <a className={styles.linkWrapper}>
                  <Card
                    className={styles.card}
                    style={{
                      borderColor: cardColors[0],
                      borderWidth: "2px",
                    }}
                  >
                    <CardHeader>
                      <Row>
                        <Col xs="10" className="me-auto">
                          {userUnit.title}
                        </Col>
                        <Col
                          xs="1"
                          className="d-flex align-items-center justify-content-end"
                        >
                          <Button
                            onClick={(e) => handleDeletePrompt(e, userUnit)}
                          >
                            <i className="fa fa-trash-o" aria-hidden="true" />
                          </Button>
                        </Col>
                      </Row>
                    </CardHeader>

                    <CardBody>
                      <CardTitle tag="p">Examples:</CardTitle>
                      {userUnit.vocabs && (
                        <CardText className="ms-2">
                          {userUnit.vocabs[0].en}
                        </CardText>
                      )}
                    </CardBody>
                  </Card>
                </a>
              </Link>
            </Col>
          );
        })}
      <Modal isOpen={modalOpen} toggle={toggleDeleteModal}>
        <ModalHeader toggle={toggleDeleteModal}>Delete this unit?</ModalHeader>
        <ModalBody>
          {selectedUnit && selectedUnit.title}
          を削除しますか？（元には戻せません）
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggleDeleteModal}>
            Cancel
          </Button>
          <Button color="primary" onClick={() => handleDelete()}>
            Delete
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

const CustomUnitTiles = ({ user }: { user: User }) => {
  const [userUnitsData, userUnitsDataLoading, userUnitsDataError] = useDocument(
    doc(db, DB_USER_VOCAB, user.uid),
    {}
  );
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
      <animated.div style={moveUpUnits}>
        <Row className="mb-5">
          <Col sm="6" md="4" lg="3">
            <Link href="/edit">
              <a className={styles.linkWrapper}>
                <Card className={styles.card}>
                  <CardHeader>Add vocabulary</CardHeader>
                  <CardBody>
                    <CardTitle tag="h6">自分の単語を追加</CardTitle>
                    <CardText tag="p">自分専用の単語</CardText>
                  </CardBody>
                </Card>
              </a>
            </Link>
          </Col>
          {userUnitsDataLoading ? (
            <p>Loading</p>
          ) : userUnitsData && userUnitsData.data() ? (
            <RenderCustomUnit
              unitData={userUnitsData.data()}
              userId={user.uid}
            />
          ) : (
            <p>{userUnitsDataError?.message}</p>
          )}
        </Row>
      </animated.div>
    </>
  );
};

const UnitList = ({ user }: { user: User | null }) => {
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
              <a className={styles.linkWrapper}>
                <Card className={styles.card}>
                  <CardHeader>Level Assessment</CardHeader>
                  <CardBody>
                    <CardTitle tag="p">
                      自己診断：
                      どのユニットから始めるか自分のレベルを確認しよう！(何度でも挑戦可)
                    </CardTitle>
                  </CardBody>
                </Card>
              </a>
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
              <a className={styles.linkWrapper}>
                <Card className={styles.card}>
                  <CardHeader>All Units</CardHeader>
                  <CardBody>
                    <CardTitle tag="p">
                      全てのUnitの単語が混ざったクイズに挑戦
                    </CardTitle>
                  </CardBody>
                </Card>
              </a>
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

          {user ? (
            <CustomUnitTiles user={user} />
          ) : (
            <Col sm="6" md="4" lg="3">
              <Card>
                <CardHeader>Add your vocabulary</CardHeader>
                <CardBody>
                  <CardTitle tag="h6">Login to add vocabulary</CardTitle>
                  <CardText>
                    "新しい単語を足すためにはログインしてください"
                  </CardText>
                </CardBody>
              </Card>
            </Col>
          )}
        </>
      ) : (
        <h5>{`Error loading: ${unitsDataError}`}</h5>
      )}
    </Container>
  );
};

export default UnitList;
