import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { DateTime } from "luxon";
import cactus from "../images/cactus.jpeg";
import EntryForm from "./EntryForm";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Modal from "react-bootstrap/Modal";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import { collectionGroup, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";

function Entries() {
    const [allEntries, setAllEntries] = useState([]);
    const [newEntryForm, setNewEntryForm] = useState(false);

    const organismId = useParams().organismId;

    const toggleNewEntryForm = () => setNewEntryForm(!newEntryForm);

    useEffect(() => {
        const fetchData = async () => {
            let list = [];
            try {
                const entries = query(collectionGroup(db, 'entries'), where('organism_id', '==', organismId));
                const querySnapshot = await getDocs(entries);
                querySnapshot.forEach((doc) => {
                    list.push({ id: doc.id, ...doc.data()});
                });
                setAllEntries(list);
            } catch (err) {
                console.log(err);
            }
        }
        fetchData();
    }, []);

    let cardsInColumn = 0;

    if (allEntries.length <= 2) {
        cardsInColumn = 0;
    } else {
        cardsInColumn = 4;
    }

    const renderEachEntry = allEntries.map((entry) => {
        let entryDate = DateTime.fromISO(entry.date);
        let formatDate = entryDate.toLocaleString(DateTime.DATETIME_FULL);

        return (
            <Col sm md={cardsInColumn} key={entry.id}>
                <Card className="h-100">
                    <Card.Img alt="plant entry image" variant="top" src={entry.photo} style={{ width: '100%', height: '45vh', objectFit: 'cover'}}/>
                    <Card.Body>
                        <Card.Subtitle>{formatDate}</Card.Subtitle>
                        <Card.Text style={{ height: '45px', overflowY: 'auto', maxHeight: '45px' }}>{entry.note}</Card.Text>
                        <ButtonGroup className="card-button">
                            <DropdownButton as={ButtonGroup} id="bg-nested-dropdown" variant="secondary" title="">
                                <Dropdown.Item as="button">edit entry</Dropdown.Item>
                                <Dropdown.Item as="button">delete entry</Dropdown.Item>
                            </DropdownButton>

                        </ButtonGroup>
                    </Card.Body>
                </Card>
            </Col>
        );
    })

    return (
        <div className="container">
            <Row className="g-3 pt-3">
                {renderEachEntry}
                <Col sm md={cardsInColumn}>
                    <Card className="h-100">
                        <Card.Img alt="plant image" variant="top" src={cactus} style={{ width: '100%', height: '45vh', objectFit: 'cover' }} />
                        <Card.Body>
                            <Card.Subtitle>New Entry Date</Card.Subtitle>
                            <Card.Text style={{ height: '45px', overflowY: 'auto', maxHeight: '45px' }}>New Entry</Card.Text>
                            <Button style={{ float: 'right', backgroundColor: '#b0ca94', borderColor: 'black', color: 'black' }} onClick={toggleNewEntryForm}>add new entry</Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Modal centered show={newEntryForm} onHide={toggleNewEntryForm}>
                <EntryForm toggleNewEntryForm={toggleNewEntryForm} allEntries={allEntries} setAllEntries={setAllEntries} organismId={organismId}/>
            </Modal>
        </div>
    );
}

export default Entries;