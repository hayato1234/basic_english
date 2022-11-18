import { getAuth } from "firebase/auth";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import UnitList from "../../components/UnitList";

const styles = require("../../styles/Vocab.module.css");
const Vocabulary = () => {
  const [user, loading] = useAuthState(getAuth());

  return (
    <div className={styles.unit_body}>
      {loading ? (
        <p>Loading...</p>
      ) : user ? (
        <UnitList user={user} />
      ) : (
        <UnitList user={null} />
      )}
    </div>
  );
};

export default Vocabulary;
