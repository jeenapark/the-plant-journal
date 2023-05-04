import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { addDoc, collection, doc, serverTimestamp, getDocs, query, where, updateDoc } from "firebase/firestore";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { db, storage } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

function OrganismForm({ modal, setModal, organismForm, setOrganismForm, organismIdToEdit, setOrganisms, organismNameToEdit, setOrganismNameToEdit, organismSpeciesToEdit, setOrganismSpeciesToEdit }) {
    const { currentUser } = useContext(AuthContext)

    const [newOrganismName, setOrganismName] = useState("");
    const [newOrganismSpecies, setOrganismSpecies] = useState("");
    const [newOrganismImage, setOrganismImage] = useState("");
    const [file, setFile] = useState("");
    const [uploadPer, setUploadPer] = useState(null);

    const toggle = () => setModal(!modal);
    const editToggle = () => setOrganismForm(!organismForm);

    useEffect(() => {
        const uploadFile = () => {
            const storageRef = ref(storage, file.name);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on('state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done');
                    setUploadPer(progress);
                    switch (snapshot.state) {
                        case 'paused':
                            console.log('Upload is paused');
                            break;
                        case 'running':
                            console.log('Upload is running');
                            break;
                        default:
                            break;
                    }
                },
                (error) => {
                    console.log(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        setOrganismImage(downloadURL);
                    });
                }
            );

        }
        file && uploadFile();
    }, [file])

    const handleAddNewOrganism = async (e) => {
        e.preventDefault();
        await addDoc(collection(db, "organisms"), {
            name: newOrganismName,
            species: newOrganismSpecies,
            photo: newOrganismImage,
            user_id: currentUser.uid,
            timeStamp: serverTimestamp(),
        });

        let list = [];
        const q = query(collection(db, "organisms"), where("user_id", "==", currentUser.uid));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            list.push({ id: doc.id, ...doc.data() });
        })
        setOrganisms(list);

        e.target.reset();
        setOrganismName("");
        setOrganismSpecies("");
        setOrganismImage("");
        setFile("");
    }

    const handleEditOrganism = async (e) => {
        e.preventDefault();

        const organismRef = doc(db, "organisms", organismIdToEdit);

        await updateDoc(organismRef, {
            name: organismNameToEdit,
            species: organismSpeciesToEdit,
        });

        let list = [];
        const q = query(collection(db, "organisms"), where("user_id", "==", currentUser.uid));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            list.push({ id: doc.id, ...doc.data() });
        })
        setOrganisms(list);
    }

    return (
        <div>
            <Modal centered show={modal} onHide={toggle}>
                <Form style={{ backgroundColor: 'rgba(176, 202, 148)', padding: '15px', borderRadius: '.5em', fontFamily: 'Poppins' }} onSubmit={handleAddNewOrganism}>
                    <Form.Group className="pb-2">
                        <Form.Label>Plant Name:</Form.Label>
                        <Form.Control autoFocus type="text" placeholder="What's your plant's name?" onChange={e => setOrganismName(e.target.value)}></Form.Control>
                    </Form.Group>
                    <Form.Group className="pb-2">
                        <Form.Label>Species:</Form.Label>
                        <Form.Control type="text" placeholder="What kind of plant is it?" onChange={e => setOrganismSpecies(e.target.value)}></Form.Control>
                    </Form.Group>
                    <Form.Group className="pb-3">
                        <Form.Label>Photo:</Form.Label>
                        <Form.Control type="file" accept="image/*" placeholder="Upload photo here" onChange={e => setFile(e.target.files[0])}></Form.Control>
                    </Form.Group>
                    <Button onClick={toggle} type="submit" style={{ float: 'right' }} variant="secondary" disabled={uploadPer !== null && uploadPer < 100}>add new plant</Button>
                </Form>
            </Modal>
            <Modal centered show={organismForm} onHide={editToggle}>
                <Form style={{ backgroundColor: 'rgba(176, 202, 148)', padding: '15px', borderRadius: '.5em', fontFamily: 'Poppins' }} onSubmit={handleEditOrganism}>
                    <Form.Group className="pb-2">
                        <Form.Label>Plant Name:</Form.Label>
                        <Form.Control type="text" placeholder="Edit plant name" value={organismNameToEdit} onChange={(e) => setOrganismNameToEdit(e.target.value)}></Form.Control>
                    </Form.Group>
                    <Form.Group className="pb-3">
                        <Form.Label>Species:</Form.Label>
                        <Form.Control type="text" placeholder="Edit plant species" value={organismSpeciesToEdit} onChange={(e) => setOrganismSpeciesToEdit(e.target.value)}></Form.Control>
                    </Form.Group>
                    <Button onClick={editToggle} type="submit" style={{ float: 'right' }} variant="secondary">Save</Button>
                </Form>
            </Modal>
        </div>
    );
}

export default OrganismForm;