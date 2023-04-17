import React, { useContext, useState } from "react";
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";


function Login() {
    const [error, setError] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const { dispatch } = useContext(AuthContext);

    function handleLoginSubmit(e) {
        e.preventDefault();

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;
                dispatch({type: "LOGIN", payload: user})
                navigate("/")
            })
            .catch((error) => {
                // const errorCode = error.code;
                // const errorMessage = error.message;
                setError(true);
            });
    }

    return (
        <div className="login">
            <Form className="formdiv rounded p-4" onSubmit={handleLoginSubmit}>
                <h1 className="header">LOGIN</h1>
                <Form.Group className="mb-3" controlId="formUsername">
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control type="email" onChange={e => setEmail(e.target.value)}/>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formPassword">
                    <Form.Label>Password:</Form.Label>
                    <Form.Control type="password" onChange={e => setPassword(e.target.value)}/>
                </Form.Group>
                <Button variant="secondary" type="submit">Login</Button>
                <br></br>
                {error && <span className="login-errors">Wrong email or password!</span>}
            </Form>
        </div>
    );
}

export default Login;