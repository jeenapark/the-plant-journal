import React, { useContext, useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button"
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { AuthContext } from "../context/AuthContext";

function Signup() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const { dispatch } = useContext(AuthContext);

    const handleSubmit = (e) => {
        e.preventDefault();
        const { isValid, validationErrors } = validate();
        if (isValid) {
            setErrors({});
            createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    const user = userCredential.user;
                    dispatch({ type: "LOGIN", payload: user });
                    navigate("/");
                    updateProfile(userCredential.user, {
                        displayName: username,
                    });
                });
        } else {
            setErrors(validationErrors);
        }
    }

    function validate() {
        const validationErrors = {};
        if (username.length === 0) {
            validationErrors.username = "Username cannot be blank";
        }

        if (email.length === 0) {
            validationErrors.email = "Email cannot be blank";
        }

        if (password !== passwordConfirmation) {
            validationErrors.password = "Passwords do not match";
        }

        const isValid = Object.keys(validationErrors).length === 0;
        return {
            isValid,
            validationErrors,
        }
    }

    return (
        <div className="login">
            <Form className="formdiv rounded p-4 p-sm-4" onSubmit={handleSubmit}>
                <h2 className="header">SIGN UP</h2>
                <Form.Group className="mb-3" controlId="formUsername">
                    <Form.Label>Username:</Form.Label>
                    <Form.Control
                        type="text"
                        name="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="plants4lyfe"
                    />
                    <p style={{ color: "red" }}>
                        {errors.username}
                    </p>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formEmail">
                    <Form.Label>Email:</Form.Label>
                    <Form.Control
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="queenbee@garden.com"
                    />
                    <p style={{ color: "red" }}>
                        {errors.email}
                    </p>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formPassword">
                    <Form.Label>Password:</Form.Label>
                    <Form.Control
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="******"
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formPasswordConfirmation">
                    <Form.Label>Confirm Password:</Form.Label>
                    <Form.Control
                        type="password"
                        value={passwordConfirmation}
                        onChange={(e) => setPasswordConfirmation(e.target.value)}
                        placeholder="******"
                    />
                    <p style={{ color: "red" }}>
                        {errors.password}
                    </p>
                </Form.Group>
                <Button className="mb-2" variant="secondary" type="submit">Submit</Button>
                <br></br>
                <Form.Text color="black">
                    Already have an account? <a href="/login">Log in here.</a>
                </Form.Text>
            </Form>
        </div>
    );
}

export default Signup;