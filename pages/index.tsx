import React from "react";
import { Col, Container, Row } from "reactstrap";

import { getAuth } from "firebase/auth";
import { collection, doc, setDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";

import { db } from "../utils/initAuth";
import SignInScreen from "../components/FirebaseAuth";
import VocabList from "../components/VocabList";

const Home = () => {
  const [user, loading, error] = useAuthState(getAuth());
  const [unit0, unit0loading, unit0error] = useCollection(
    collection(db, "super_vocabs_0"),
    {}
  );

  const handleClick = async () => {
    if (user) {
      await setDoc(doc(db, "user_data", user.uid), {
        unit0Missed: [110, 6, 88, 85],
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
        {unit0 && <p>{`${unit0.docs.length} - ${unit0error} `}</p>}
      </Row>
      <Row>
        <Col md={2}>
          <button onClick={handleClick}>Add</button>
        </Col>
      </Row>
      <Row>{unit0 && <VocabList vocabData={unit0.docs} />}</Row>
    </Container>
  );
};

export default Home;
