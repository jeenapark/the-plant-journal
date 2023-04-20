import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext"
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

function NavBar() {
    const { currentUser } = useContext(AuthContext);

    return (
        <>
            {currentUser ? (
                <Navbar collapseOnSelect expand="lg" className="navbar fixed-top">
                    <div className="container-fluid">
                        <Navbar.Brand href="/">THE PLANT JOURNAL</Navbar.Brand>
                        <Navbar.Toggle aria-controls="responsive-navbar-nav"></Navbar.Toggle>
                        <Navbar.Collapse id="responsive-navbar-nav">
                            <Nav className="ms-auto">
                                <Nav.Link href="/">My Garden</Nav.Link>
                                <Nav.Link href="#">Logout</Nav.Link>
                            </Nav>
                        </Navbar.Collapse>
                    </div>
                </Navbar>
            ) : (
                null
            )}
        </>

    );
}

export default NavBar;