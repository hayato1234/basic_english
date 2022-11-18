import { getAuth, signOut } from "firebase/auth";
import Link from "next/link";
import React, { useState } from "react";
import { useAuthState, useSignInWithGoogle } from "react-firebase-hooks/auth";

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
  Button,
} from "reactstrap";

//i- regular import gives warning (due to typescript)
const styles = require("../styles/Header.module.css");

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [signInWithGoogle] = useSignInWithGoogle(getAuth());
  const [user] = useAuthState(getAuth());
  // const user = getAuth().currentUser;

  // userError && console.log(userError);
  // console.log(user?.photoURL);

  const closeNav = () => {
    //when nav item clicked, the nav doesn't close without this.
    setMenuOpen(false);
  };

  return (
    <Navbar light className={styles.nav} sticky="top" expand="md">
      <NavbarBrand className="ms-3" href="/">
        <h1 className="pt-2">English 4.0</h1>
      </NavbarBrand>
      <NavbarToggler onClick={() => setMenuOpen(!menuOpen)} />
      <Collapse isOpen={menuOpen} navbar>
        <Nav className="me-auto" navbar>
          <NavItem onClick={closeNav}>
            <Link passHref href={"/"}>
              <NavLink>Home</NavLink>
            </Link>
          </NavItem>
          <NavItem onClick={closeNav}>
            <Link passHref href={"/vocabulary"}>
              <NavLink>Vocabulary</NavLink>
            </Link>
          </NavItem>
          <NavItem onClick={closeNav}>
            <Link passHref href={"/grammar"}>
              <NavLink>Grammar</NavLink>
            </Link>
          </NavItem>
        </Nav>
        {user && user.photoURL && (
          <NavbarText>
            <Button
              id="userPhoto"
              role="button"
              style={{ backgroundColor: "transparent", border: 0 }}
            >
              <img
                src={user.photoURL}
                className={styles.user_icon}
                alt="icon"
              />
            </Button>

            <UncontrolledPopover
              target="userPhoto"
              placement="bottom"
              trigger="legacy"
            >
              <PopoverBody>
                <Link passHref href="/user">
                  <NavLink onClick={closeNav}>
                    <i className="fa fa-user" aria-hidden="true" /> Profile
                  </NavLink>
                </Link>
                <Link passHref href="/settings">
                  <NavLink onClick={closeNav}>
                    <i className="fa fa-cog" aria-hidden="true" /> Settings
                  </NavLink>
                </Link>
                <hr />
                <a role="button" onClick={() => signOut(getAuth())} href="#/">
                  <i className="fa fa-sign-out" aria-hidden="true" /> Logout
                </a>
              </PopoverBody>
            </UncontrolledPopover>
          </NavbarText>
        )}
        {!user && (
          <NavbarText onClick={closeNav}>
            <Button
              outline
              color="secondary"
              className="me-5"
              onClick={() => signInWithGoogle()}
            >
              Login
            </Button>
          </NavbarText>
        )}
      </Collapse>
    </Navbar>
  );
};

export default Header;
