import React from "react";
import { Col, Container, Row } from "reactstrap";

import { getAuth } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";

import { db } from "../utils/initAuth";
import SignInScreen from "../components/FirebaseAuth";

const Home = () => {
  const [user, loading, error] = useAuthState(getAuth());

  const handleClick = async () => {
    if (user) {
      await setDoc(doc(db, "unit_data", "test"), {
        test1: "test1",
      });
    } else {
      console.log("user need to login");
    }
  };

  return (
    <Container>
      <Row>
        <Col>
          <h1>Welcome to Basic English Grammar page!</h1>
        </Col>
      </Row>
      <Row className="mt-2">
        {loading ? (
          <p>Logging in</p>
        ) : user ? (
          <p>{user.email}</p>
        ) : (
          <p>{error?.message}</p>
        )}
        <SignInScreen />
      </Row>
      <Row>
        <Col md={2}>
          <button onClick={handleClick}>Add</button>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
