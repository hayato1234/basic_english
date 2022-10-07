import React from "react";
import { Card, CardHeader, Col, Container, Row } from "reactstrap";

import { getAuth, signOut } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";

import { db } from "../utils/initAuth";
import SignInScreen from "../components/FirebaseAuth";

const Home = () => {
  const [user, loading, error] = useAuthState(getAuth());

  const addNewUnit = async () => {
    if (user) {
      await setDoc(doc(db, "unit_data", "test"), {
        test1: "test1",
      });
    } else {
      console.log("user need to login");
    }
  };

  const dashBoard = (
    <Container>
      {user && <h1>Welcome back {user?.displayName}</h1>}
      <h2>Go to...</h2>
      <Row>
        <Col md="4">
          <Card>
            <CardHeader>単語</CardHeader>
          </Card>
        </Col>
        <Col md="4">
          <Card>
            <CardHeader>文法</CardHeader>
          </Card>
        </Col>
      </Row>
      <h2>Recent</h2>
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
