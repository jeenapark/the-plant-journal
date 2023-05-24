import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { DateTime } from "luxon";
import cactus from "../images/cactus.jpeg";
import EntryForm from "./EntryForm";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { collection, query, where, getDocs, getDoc, doc, updateDoc, deleteDoc, orderBy } from "firebase/firestore";
import { db } from "../firebase";

function Entries() {
    const [allEntries, setAllEntries] = useState([]);
    const [newEntryForm, setNewEntryForm] = useState(false);
    const [editEntryForm, setEditEntryForm] = useState(false);
    const [entryNoteToEdit, setEntryNoteToEdit] = useState("");
    const [entryDateToEdit, setEntryDateToEdit] = useState("");
    const [entryIdToEdit, setEntryIdToEdit] = useState("");

    const organismId = useParams().organismId;

    const toggleNewEntryForm = () => setNewEntryForm(!newEntryForm);
    const editToggle = () => setEditEntryForm(!editEntryForm);

    const toggleEditEntryForm = async (e) => {
        setEditEntryForm(!editEntryForm);
        if (e === undefined) {
            return;
        } else {
            setEntryIdToEdit(e.currentTarget.value);
            const findEntryToEdit = await getDoc(doc(db, 'entries', e.currentTarget.value));
            setEntryNoteToEdit(findEntryToEdit.data().note);
            setEntryDateToEdit(findEntryToEdit.data().date);
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            let list = [];
            try {
                const entries = query(collection(db, 'entries'), where('organism_id', '==', organismId), orderBy('date', 'asc'));
                const querySnapshot = await getDocs(entries);
                querySnapshot.forEach((doc) => {
                    list.push({ id: doc.id, ...doc.data() });
                });
                setAllEntries(list);
            } catch (err) {
                console.log(err);
            }
        }
        fetchData();
    }, [organismId]);

    const handleEditEntry = async (e) => {
        e.preventDefault();

        const entryRef = doc(db, 'entries', entryIdToEdit);

        await updateDoc(entryRef, {
            note: entryNoteToEdit,
            date: entryDateToEdit,
        });

        let list = [];
        const entries = query(collection(db, 'entries'), where('organism_id', '==', organismId), orderBy('date', 'asc'));
        const querySnapshot = await getDocs(entries);
        querySnapshot.forEach((doc) => {
            list.push({ id: doc.id, ...doc.data() });
        });
        setAllEntries(list);
    }

    const handleDeleteEntry = async (e) => {
        await deleteDoc(doc(db, 'entries', e.target.value));
        setAllEntries(allEntries.filter((entry) => entry.id !== e.target.value));
        setEditEntryForm(!editEntryForm);
    }

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
                    <Card.Img alt="plant entry image" variant="top" src={entry.photo} style={{ width: '100%', height: '45vh', objectFit: 'cover' }} />
                    <Card.Body>
                        <Card.Subtitle>{formatDate}</Card.Subtitle>
                        <Card.Text style={{ height: '45px', overflowY: 'auto', maxHeight: '45px' }}>{entry.note}</Card.Text>
                        <Button className="card-button" variant="secondary" aria-label="Edit entry" value={entry.id} onClick={toggleEditEntryForm}><i className="bi bi-pencil-square"></i></Button>
                    </Card.Body>
                </Card>
            </Col>
        );
    });

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
                <EntryForm toggleNewEntryForm={toggleNewEntryForm} allEntries={allEntries} setAllEntries={setAllEntries} organismId={organismId} />
            </Modal>
            <Modal centered show={editEntryForm} onHide={toggleEditEntryForm}>
                <Form style={{ backgroundColor: 'rgba(176, 202, 148)', padding: '15px', borderRadius: '.5em', fontFamily: 'Poppins' }} onSubmit={handleEditEntry}>
                    <Form.Group className="pb-2">
                        <Form.Label>Note:</Form.Label>
                        <Form.Control autoFocus type="text" value={entryNoteToEdit} onChange={(e) => setEntryNoteToEdit(e.target.value)}></Form.Control>
                    </Form.Group>
                    <Form.Group className="pb-3">
                        <Form.Label>Date:</Form.Label>
                        <Form.Control type="datetime-local" value={entryDateToEdit} onChange={(e) => setEntryDateToEdit(e.target.value)}></Form.Control>
                    </Form.Group>
                    <Button onClick={editToggle} type="submit" className="card-button" variant="secondary">save</Button>
                    <Button value={entryIdToEdit} onClick={handleDeleteEntry} variant="danger">delete entry</Button>
                </Form>
            </Modal>
        </div>
    );
}

export default Entries;