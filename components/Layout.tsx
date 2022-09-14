import React from "react";
import Header from "./headerComponent";
import "bootstrap/dist/css/bootstrap.min.css";
const styles = require("../styles/Layout.module.css");

const Layout = ({ children }) => {
  return (
    <>
      <Header />
      <div className={styles.container}>{children}</div>
    </>
  );
};

export default Layout;
