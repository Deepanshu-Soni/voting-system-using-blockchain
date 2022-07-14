import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { NavLink } from "react-router-dom";
const NavHeading = () => {
  return (
    <div>
      <Navbar
        bg="dark"
        variant="dark"
        collapseOnSelect
        className="rounded-bottom"
      >
        <Container>
          <Navbar.Brand as={NavLink} to="/">
          NewGenVoting.com
          </Navbar.Brand>
        </Container>
      </Navbar>
    </div>
  );
};

export default NavHeading;
