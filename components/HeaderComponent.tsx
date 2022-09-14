import Link from "next/link";
import React, { useState } from "react";
// import { NavLink } from "react-router-dom";
import {
  Navbar,
  NavbarBrand,
  NavbarToggler,
  Collapse,
  Nav,
  NavItem,
} from "reactstrap";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <Navbar dark color="primary" sticky="top" expand="md">
      <NavbarBrand className="ms-3" href="/">
        <h1 className="pt-2">Basic English Grammar</h1>
      </NavbarBrand>
      <NavbarToggler onClick={() => setMenuOpen(!menuOpen)} />
      <Collapse isOpen={menuOpen} navbar>
        <Nav navbar>
          <NavItem>
            <Link className="color-warning" href={"/"}>
              Home
            </Link>
          </NavItem>
          <NavItem>
            <Link href={"/vocabulary"}>Vocabulary</Link>
          </NavItem>
          <NavItem>
            {/* <NavLink className="nav-link" to="/grammar">
              Grammar
            </NavLink> */}
          </NavItem>
        </Nav>
      </Collapse>
    </Navbar>
  );
};

export default Header;
