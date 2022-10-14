import React from "react";
import Header from "./HeaderComponent";
import "font-awesome/css/font-awesome.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
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
