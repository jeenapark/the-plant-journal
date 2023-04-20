import React from "react";
import cactus from "../images/cactus.jpeg";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import { Link } from "react-router-dom";

function Organisms({ organisms, modal, setModal }) {

    const toggle = () => setModal(!modal);

    const renderEachOrganism = organisms.map((organism) => {
        return (
            <Col key={organism.id}>
                <Card>
                    <Card.Img alt="plant image" variant="top" src={organism.photo} style={{ height: '35vh', objectFit: 'cover' }} />
                    <Card.Body>
                        <Card.Title>{organism.name}</Card.Title>
                        <Card.Subtitle>{organism.species}</Card.Subtitle>
                        <br></br>
                        <ButtonGroup className="card-button">
                            <Button variant="secondary">see entries</Button>
                            <DropdownButton as={ButtonGroup} id="bg-nested-dropdown" variant="secondary" title="">
                                <Dropdown.Item eventKey="1">edit plant</Dropdown.Item>
                                <Dropdown.Item eventKey="2">plant died :(</Dropdown.Item>
                            </DropdownButton>
                        </ButtonGroup>
                    </Card.Body>
                </Card>
            </Col>
        );
    });

    return (
        <div className="container">
            <Row xs={2} md={3} className="g-3 pt-3">
                {renderEachOrganism}
                <Col>
                    <Card>
                        <Card.Img alt="plant image" variant="top" src={cactus} style={{ height: '35vh', objectFit: 'cover' }} width="100%" />
                        <Card.Body>
                            <Card.Title>Plant Name</Card.Title>
                            <Card.Subtitle>Plant Species</Card.Subtitle>
                            <br></br>
                            <Button style={{ float: 'right', backgroundColor: '#b0ca94', borderColor: 'black', color: 'black' }} onClick={toggle}>add new plant</Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}

export default Organisms;