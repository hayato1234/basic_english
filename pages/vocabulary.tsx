import React from "react";
import UnitList from "../components/UnitList";

const styles = require("../styles/Vocab.module.css");
const vocabulary = () => {
  return (
    <div className={styles.unit_body}>
      <UnitList />
    </div>
  );
};

export default vocabulary;
