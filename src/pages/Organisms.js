import React, { useContext } from "react";
import cactus from "../images/cactus.jpeg";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { Link } from "react-router-dom";
import { OrganismNameContext } from "../context/OrganismNameContext";

function Organisms({ organisms, modal, setModal, organismForm, setOrganismForm, setOrganismIdToEdit, setOrganismNameToEdit, setOrganismSpeciesToEdit }) {
    const [showOrganismName, setShowOrganismName] = useContext(OrganismNameContext);
    const toggle = () => setModal(!modal);
    const editToggle = async (e) => {
        setOrganismForm(!organismForm);
        if (e === undefined) {
            return;
        } else {
            setOrganismIdToEdit(e.currentTarget.value);
            const fetchData = await getDoc(doc(db, 'organisms', e.currentTarget.value));
            setOrganismNameToEdit(fetchData.data().name);
            setOrganismSpeciesToEdit(fetchData.data().species);
        }
    }

    let cardsInColumn = 0;

    if (organisms.length <= 2) {
        cardsInColumn = 0;
    } else {
        cardsInColumn = 4;
    }

    function handleShowPlantName(e) {
        localStorage.setItem('show-plantname', JSON.stringify(`${e.target.name} the ${e.target.title}`));
        setShowOrganismName(`${e.target.name} the ${e.target.title}`);
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
                        <Button className="card-button" variant="secondary" aria-label="Edit plant" value={organism.id} onClick={editToggle}><i className="bi bi-pencil-square"></i></Button>
                        <Link to={`/entries/${organism.id}`}>
                            <Button className="card-button" value={organism.id} variant="secondary" name={organism.name} title={organism.species} onClick={handleShowPlantName}>see entries</Button>
                        </Link>
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