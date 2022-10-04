import Link from "next/link";
import React, { useState } from "react";

import {
  Navbar,
  NavbarBrand,
  NavbarToggler,
  Collapse,
  Nav,
  NavItem,
  NavLink,
} from "reactstrap";

//regular import gives warning (due to typescript)
const styles = require("../styles/Header.module.css");

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <Navbar light className={styles.nav} sticky="top" expand="md">
      <NavbarBrand className="ms-3" href="/">
        <h1 className="pt-2">Basic English</h1>
      </NavbarBrand>
      <NavbarToggler onClick={() => setMenuOpen(!menuOpen)} />
      <Collapse isOpen={menuOpen} navbar>
        <Nav navbar>
          <NavItem>
            <Link passHref href={"/"}>
              <NavLink>Home</NavLink>
            </Link>
          </NavItem>
          <NavItem>
            <Link passHref href={"/vocabulary"}>
              <NavLink>Vocabulary</NavLink>
            </Link>
          </NavItem>
          <NavItem>
            <Link passHref href={"/grammar"}>
              <NavLink>Grammar</NavLink>
            </Link>
          </NavItem>
        </Nav>
      </Collapse>
    </Navbar>
  );
};

export default Header;
