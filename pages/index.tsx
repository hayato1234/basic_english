import React, { ReactNode } from "react";
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
import { useSpring, animated } from "react-spring";

import { getAuth } from "firebase/auth";
import { doc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useDocument } from "react-firebase-hooks/firestore";

import { db } from "../utils/initAuth";
import { DB_USER_DATA, STUDY_TITLES } from "../utils/staticValues";
import SignInScreen from "../components/FirebaseAuth";
import Link from "next/link";
import { history } from "../types/userType";
import { Modes } from "./vocabulary/quiz";

const styles = require("../styles/Vocab.module.css");

const RecentStudies = ({ user }) => {
  const [userData, userDataLoading, userDataError] = useDocument(
    doc(db, DB_USER_DATA, user.uid),
    {}
  );

  const recentCards: ReactNode[] = [];
  const moveUpRecent = useSpring({
    to: { opacity: 1, transform: "translateY(0px)" },
    from: {
      opacity: 0,
      transform: "translateY(150px)",
    },
    delay: 200,
    config: { friction: 40 },
  });

  if (!userDataLoading && userData && userData.data()?.history) {
    const history: history[] = userData.data()?.history.reverse();
    const maxLength: number = history.length < 4 ? history.length : 4;
    for (let i = 0; i < maxLength; i++) {
      const historyType = history[i].type;
      const historyUnit = history[i].unitData;
      const historyUnitId = `${historyType}/${historyUnit.id
        .toString()
        .replace("unit", "")}`;
      recentCards.push(
        <Col key={historyType + historyUnit.id} sm="6" md="4" lg="3">
          <animated.div style={moveUpRecent}>
            <Link role="button" href="/[type]/[unit]" as={historyUnitId}>
              <a className={styles.linkWrapper}>
                <Card innerRef={undefined} className={styles.card}>
                  <CardHeader>
                    {historyType === "vocabulary"
                      ? STUDY_TITLES.vocabulary
                      : STUDY_TITLES.grammar}
                  </CardHeader>
                  <CardBody>{historyUnit.title}</CardBody>
                </Card>
              </a>
            </Link>
          </animated.div>
        </Col>
      );
    }
  } else if (userDataError) {
    recentCards.unshift(<p key="error">Error loading recent data</p>);
  }
  return <>{recentCards}</>;
};

const Home = () => {
  const [user, loading, error] = useAuthState(getAuth());

  const moveUp = useSpring({
    to: { opacity: 1, transform: "translateY(0px)" },
    from: {
      opacity: 0,
      transform: "translateY(150px)",
    },
    delay: 200,
    config: { friction: 40 },
  });

  const dashBoard = (
    <Container>
      {user && <h1>Welcome back {user?.displayName}!</h1>}

      <h2 className="mt-4">Go to...</h2>
      <Row>
        <Col sm="6" md="4" lg="3">
          <animated.div style={moveUp}>
            <Link href="/vocabulary" passHref>
              <a className={styles.linkWrapper}>
                <Card className={`${styles.card}`}>
                  <CardHeader>{STUDY_TITLES.vocabulary}</CardHeader>
                  <CardBody>TOEICに必要な単語をUnitごとに勉強しよう！</CardBody>
                </Card>
              </a>
            </Link>
          </animated.div>
        </Col>
        <Col sm="6" md="4" lg="3">
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
                  <CardHeader>単語 - Level Assessment</CardHeader>
                  <CardBody>
                    自己診断：
                    どのユニットから始めるか自分のレベルを確認しよう！(何度でも挑戦可)
                  </CardBody>
                </Card>
              </a>
            </Link>
          </animated.div>
        </Col>
        <Col sm="6" md="4" lg="3">
          <animated.div style={moveUp}>
            {user ? (
              <Link href="/edit">
                <a className={styles.linkWrapper}>
                  <Card className={styles.card}>
                    <CardHeader>{`Add vocabulary`}</CardHeader>
                    <CardBody>
                      <CardTitle tag="h6">準備中</CardTitle>
                      <CardText>"準備中"</CardText>
                    </CardBody>
                  </Card>
                </a>
              </Link>
            ) : (
              <Card>
                <CardHeader>{`Add vocabulary`}</CardHeader>
                <CardBody>
                  <CardTitle tag="h6">Login in to add vocabulary</CardTitle>
                  <CardText>
                    "新しい単語を足すためにはログインしてください"
                  </CardText>
                </CardBody>
              </Card>
            )}
          </animated.div>
        </Col>
        <Col sm="6" md="4" lg="3">
          <animated.div style={moveUp}>
            <Link href="/grammar">
              <a className={styles.linkWrapper}>
                <Card className={styles.card}>
                  <CardHeader>{STUDY_TITLES.grammar}</CardHeader>
                  <CardBody>
                    基礎英文法を中心に、トピックごとに学習しよう！
                  </CardBody>
                </Card>
              </a>
            </Link>
          </animated.div>
        </Col>
      </Row>
      <h2 className="mt-4">Recent</h2>
      <Row>
        {loading ? null : user ? (
          <RecentStudies user={user} />
        ) : (
          <p>Login to see recent items</p>
        )}
      </Row>
    </Container>
  );

  return (
    <>
      {loading ? (
        <p>Loading data...</p>
      ) : error ? (
        <p>{error?.message}</p>
      ) : user ? (
        dashBoard
      ) : (
        <>
          <SignInScreen />
          {dashBoard}
        </>
      )}
    </>
  );
};

export default Home;
