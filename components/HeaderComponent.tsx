import { getAuth, signOut } from "firebase/auth";
import Link from "next/link";
import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

import {
  Navbar,
  NavbarBrand,
  NavbarToggler,
  Collapse,
  Nav,
  NavItem,
  NavLink,
  NavbarText,
  UncontrolledPopover,
  PopoverBody,
} from "reactstrap";

//regular import gives warning (due to typescript)
const styles = require("../styles/Header.module.css");

const Header = () => {
  const [user, loading, error] = useAuthState(getAuth());
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <Navbar light className={styles.nav} sticky="top" expand="md">
      <NavbarBrand className="ms-3" href="/">
        <h1 className="pt-2">Basic English</h1>
      </NavbarBrand>
      <NavbarToggler onClick={() => setMenuOpen(!menuOpen)} />
      <Collapse isOpen={menuOpen} navbar>
        <Nav className="me-auto" navbar>
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
        {!loading && user && user.photoURL && (
          <NavbarText>
            <a id="userPhoto" role="button" className="p-3">
              <img src={user.photoURL} className={styles.user_icon} />
            </a>

            <UncontrolledPopover
              target="userPhoto"
              placement="bottom"
              trigger="legacy"
            >
              <PopoverBody>
                <Link passHref href="/user">
                  <NavLink>Profile</NavLink>
                </Link>
                <Link passHref href="/settings">
                  <NavLink>Settings</NavLink>
                </Link>
                <hr />
                <a role="button" onClick={() => signOut(getAuth())}>
                  Logout
                </a>
              </PopoverBody>
            </UncontrolledPopover>
          </NavbarText>
        )}
        {/* {!loading && !user && (
          <NavbarText>
            <button className={styles.user_icon}>Login</button>
          </NavbarText>
        )} */}
      </Collapse>
    </Navbar>
  );
};

export default Header;
