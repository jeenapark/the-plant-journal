import React from "react";
import cactus from "../images/cactus.jpeg";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import Ratio from "react-bootstrap/Ratio";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { Link } from "react-router-dom";

function Organisms({ organisms, setOrganisms, modal, setModal, setOrganismIdToEdit }) {

    const toggle = () => setModal(!modal);

    const handleDeleteOrganism = async (e) => {
        await deleteDoc(doc(db, "organisms", e.target.value));
        setOrganisms(organisms.filter((organism) => organism.id !== e.target.value));
    }

    let cardsInColumn = 0;

    if (organisms.length <= 2) {
        cardsInColumn = 0;
    } else {
        cardsInColumn = 4;
    }

    const renderEachOrganism = organisms.map((organism) => {
        return (
            <Col sm md={cardsInColumn} key={organism.id}>
                <Card className="h-100">
                    <Card.Img alt="plant image" variant="top" src={organism.photo} style={{ width: '100%', height: '45vh', objectFit: 'cover' }} />
                    <Card.Body>
                        <Card.Title>{organism.name}</Card.Title>
                        <Card.Subtitle>{organism.species}</Card.Subtitle>
                        <br></br>
                        <ButtonGroup className="card-button">
                            <Button variant="secondary">see entries</Button>
                            <DropdownButton as={ButtonGroup} id="bg-nested-dropdown" variant="secondary" title="">
                                <Dropdown.Item as="button">edit plant</Dropdown.Item>
                                <Dropdown.Item as="button" value={organism.id} onClick={handleDeleteOrganism} variant="danger">plant died :(</Dropdown.Item>
                            </DropdownButton>
                        </ButtonGroup>
                    </Card.Body>
                </Card>
            </Col>
        );
    });

    return (
        <div className="container">
            <Row className="g-3 pt-3">
                {renderEachOrganism}
                <Col sm md={cardsInColumn}>
                    <Card className="h-100">
                        <Card.Img alt="plant image" variant="top" src={cactus} style={{ width: '100%', height: '45vh', objectFit: 'cover' }} />
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