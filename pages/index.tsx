import React, { ReactNode } from "react";
import { Card, CardBody, CardHeader, Col, Container, Row } from "reactstrap";

import { getAuth, User } from "firebase/auth";
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

const RecentStudies = ({ user }: { user: User }) => {
  const [userData, userDataLoading, userDataError] = useDocument(
    doc(db, DB_USER_DATA, user.uid),
    {}
  );
  const recentCards: ReactNode[] = [];

  if (!userDataLoading && userData && userData.data()?.history) {
    const history: history[] = userData.data()?.history.reverse();
    const maxLength: number = history.length < 4 ? history.length : 4;
    for (let i = 0; i < maxLength; i++) {
      const historyType = history[i].type;
      const historyUnit = history[i].unitData[0];
      recentCards.push(
        <Col key={historyType + historyUnit} sm="6" md="4" lg="3">
          <Link
            role="button"
            href="/[type]/[unit]"
            as={`${historyType}/${historyUnit.replace("unit", "")}`}
            passHref
          >
            <Card className={styles.card}>
              <CardHeader>
                {historyType === "vocabulary"
                  ? STUDY_TITLES.vocabulary
                  : STUDY_TITLES.grammar}
              </CardHeader>
              <CardBody>{historyUnit}</CardBody>
            </Card>
          </Link>
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

  const dashBoard = (
    <Container>
      {user && <h1>Welcome back {user?.displayName}!</h1>}
      <hr />
      <h2>Go to...</h2>
      <Row>
        <Col sm="6" md="4" lg="3">
          <Link href="/vocabulary">
            <Card className={`${styles.card}`}>
              <CardHeader>{STUDY_TITLES.vocabulary}</CardHeader>
              <CardBody>TOEICに必要な単語をUnitごとに勉強しよう！</CardBody>
            </Card>
          </Link>
        </Col>
        <Col sm="6" md="4" lg="3">
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
            <Card className={styles.card}>
              <CardHeader>Level Assessment</CardHeader>
              <CardBody>
                自己診断：
                どのユニットから始めるか自分のレベルを確認しよう！(何度でも挑戦可)
              </CardBody>
            </Card>
          </Link>
        </Col>
        <Col sm="6" md="4" lg="3">
          <Link href="/grammar">
            <Card className={styles.card}>
              <CardHeader>{STUDY_TITLES.grammar}</CardHeader>
              <CardBody>
                基礎英文法を中心に、トピックごとに学習しよう！
              </CardBody>
            </Card>
          </Link>
        </Col>
      </Row>
      <h2>Recent</h2>
      <Row>
        {user ? (
          <RecentStudies user={user} />
        ) : (
          <p>Login to see recent items</p>
        )}
      </Row>
    </Container>
  );

  return (
    <div>
      {loading ? (
        <p>Logging in</p>
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
    </div>
  );
};

export default Home;
