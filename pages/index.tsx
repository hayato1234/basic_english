import React, { ReactNode } from "react";
import { Card, CardBody, CardHeader, Col, Container, Row } from "reactstrap";

import { getAuth } from "firebase/auth";
import { doc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useDocument } from "react-firebase-hooks/firestore";

import { db } from "../utils/initAuth";
import { DB_USER_DATA } from "../utils/staticValues";
import SignInScreen from "../components/FirebaseAuth";
import Link from "next/link";
import { history } from "../types/userType";

const styles = require("../styles/Vocab.module.css");

const RecentStudies = () => {
  const currUser = getAuth().currentUser;
  if (!currUser) return <></>;
  const [userData, userDataLoading, userDataError] = useDocument(
    doc(db, DB_USER_DATA, currUser.uid),
    {}
  );

  const recentCards: ReactNode[] = [];

  if (userData && userData.data()?.history) {
    const history: history[] = userData.data()?.history.reverse();
    const maxLength: number = history.length < 4 ? history.length : 4;
    for (let i = 0; i < maxLength; i++) {
      const historyType = history[i].type;
      const historyUnit = history[i].unitData[0];
      recentCards.push(
        <Col key={historyType + historyUnit} md="3">
          <Link
            role="button"
            href="/[type]/[unit]"
            as={`${historyType}/${historyUnit.replace("unit", "")}`}
            passHref
          >
            <Card className={styles.card}>
              <CardHeader>{historyType}</CardHeader>
              <CardBody>{historyUnit}</CardBody>
            </Card>
          </Link>
        </Col>
      );
    }
  } else {
    recentCards.unshift(<p key="nodata">No recent data</p>);
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
        <Col md="4">
          <Link href="/vocabulary">
            <Card className={styles.card}>
              <CardHeader>単語</CardHeader>
              <CardBody>TOEICに必要な単語をUnitごとに勉強しよう！</CardBody>
            </Card>
          </Link>
        </Col>
        <Col md="4">
          <Link href="/grammar">
            <Card className={styles.card}>
              <CardHeader>文法</CardHeader>
              <CardBody>
                基礎英文法を中心に、トピックごとに学習しよう！
              </CardBody>
            </Card>
          </Link>
        </Col>
      </Row>
      <h2>Recent</h2>
      <Row>
        <RecentStudies />
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
