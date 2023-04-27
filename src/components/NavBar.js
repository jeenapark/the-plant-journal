import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext"
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function NavBar() {
    const { currentUser, dispatch } = useContext(AuthContext);
    const navigate = useNavigate();

    function handleLogoutClick() {
        signOut(auth).then(() => {
            dispatch({ type: "LOGOUT" });
            navigate("/login");
        })
    }

    return (
        <>
            {currentUser ? (
                <Navbar collapseOnSelect expand="lg" className="navbar fixed-top">
                    <div className="container-fluid">
                        <Navbar.Brand href="/">THE PLANT JOURNAL</Navbar.Brand>
                        <Navbar.Toggle aria-controls="responsive-navbar-nav"></Navbar.Toggle>
                        <Navbar.Collapse id="responsive-navbar-nav">
                            <Nav className="ms-auto">
                                <Nav.Link href="/">{currentUser.displayName ? `${currentUser.displayName}'s Garden` : `My Garden`}</Nav.Link>
                                <Nav.Link href="#" onClick={handleLogoutClick}>Logout</Nav.Link>
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