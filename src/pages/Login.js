import React, { useContext, useState } from "react";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";


function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});

    const navigate = useNavigate();

    const { dispatch } = useContext(AuthContext);

    function handleLoginSubmit(e) {
        e.preventDefault();

        const { isValid, validationErrors } = validate();
        if (isValid) {
            setErrors({});
            signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    const user = userCredential.user;
                    dispatch({ type: "LOGIN", payload: user });
                    navigate("/");
                })
                .catch((error) => {
                    setErrors({ postErrors: "Wrong email or password" })
                });
        } else {
            setErrors(validationErrors);
        }
    };

    function validate() {
        const validationErrors = {};
        if (email.length === 0) {
            validationErrors.email = "Username cannot be blank";
        }

        if (password.length === 0) {
            validationErrors.password = "Password cannot be blank";
        }

        const isValid = Object.keys(validationErrors).length === 0;
        return {
            isValid,
            validationErrors,
        }
    };

    return (
        <div className="login">
            <Form className="formdiv rounded p-4" onSubmit={handleLoginSubmit}>
                <h1 className="header">LOGIN</h1>
                <Form.Group className="mb-3" controlId="formEmail">
                    <Form.Label>Email Address:</Form.Label>
                    <Form.Control type="email" onChange={e => setEmail(e.target.value)} />
                    <p style={{ color: "red" }}>
                        {errors.email}
                    </p>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formPassword">
                    <Form.Label>Password:</Form.Label>
                    <Form.Control type="password" onChange={e => setPassword(e.target.value)} />
                    <p style={{ color: "red" }}>
                        {errors.password}
                    </p>
                </Form.Group>
                <p style={{ color: "red" }}>
                    {errors.postErrors}
                </p>
                <Button className="mb-2" variant="secondary" type="submit">Login</Button>
                <br></br>
                <Form.Text color="black">
                    New to us? <a href="/signup">Sign up here.</a>
                </Form.Text>
            </Form>
        </div>
    );
}

export default Login;