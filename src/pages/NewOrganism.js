import React, { useState } from "react";
import { addDoc, collection, doc, serverTimestamp, setDoc } from "firebase/firestore";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { db } from "../firebase";

function NewOrganism() {
    const [modal, setModal] = useState(true);
    const [organismForm, setOrganismForm] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);

    const toggle = () => setModal(!modal);
    const editToggle = () => setOrganismForm(!organismForm);
    const deleteToggle = () => setDeleteModal(!deleteModal);

    const handleAddNewOrganism = async(e) => {
        e.preventDefault();
        const res = await addDoc(collection(db, "cities"), {
            name: "Los Angeles",
            state: "CA",
            country: "USA",
            timeStamp: serverTimestamp(),
          });
    }

    return (
        <div>
            {/* <Modal centered isOpen={modal} toggle={toggle}> */}
                <Form style={{ backgroundColor: 'rgba(176, 202, 148)', padding: '15px', borderRadius: '.5em', fontFamily: 'Poppins' }} onSubmit={handleAddNewOrganism}>
                    <Form.Group>
                        <Form.Label>Plant Name:</Form.Label>
                        <Form.Control type="text" placeholder="What's your plant's name?"></Form.Control>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Species:</Form.Label>
                        <Form.Control type="text" placeholder="What kind of plant is it?"></Form.Control>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Photo:</Form.Label>
                        <Form.Control type="file" accept="image/*" placeholder="Upload photo here"></Form.Control>
                    </Form.Group>
                    <Button onClick={toggle} type="submit">Add new plant</Button>
                </Form>
            {/* </Modal> */}
            <Modal centered isOpen={organismForm} toggle={editToggle}>
                <Form style={{ backgroundColor: 'rgba(176, 202, 148)', padding: '15px', borderRadius: '.5em', fontFamily: 'Poppins' }}>
                    <Form.Group>
                        <Form.Label>Plant Name:</Form.Label>
                        <Form.Control type="text" placeholder="Edit plant name"></Form.Control>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Species:</Form.Label>
                        <Form.Control type="text" placeholder="Edit plant species"></Form.Control>
                    </Form.Group>
                    <Button onClick={editToggle} type="submit">Edit</Button>
                </Form>
            </Modal>
            <Modal centered isOpen={deleteModal} toggle={deleteToggle}>
                <Form style={{ backgroundColor: 'rgba(176, 202, 148)', padding: '15px', borderRadius: '.5em', fontFamily: 'Poppins' }}>
                    <Form.Group>
                        <Button style={{ float: 'right' }} className="btn-close" aria-label="Close" onClick={deleteToggle}></Button>
                        <Form.Label>
                            Are you sure you want to delete your plant?
                        </Form.Label>
                    </Form.Group>
                    <Button style={{ float: 'right' }} color="danger" onClick={deleteToggle} type="submit">yes, delete plant</Button>
                </Form>
            </Modal>
        </div>
    );
}

export default NewOrganism;