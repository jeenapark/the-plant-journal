import React, { useState, useEffect } from "react";
import { addDoc, collection, getDocs, query, where, serverTimestamp, orderBy } from "firebase/firestore";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { db, storage } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

function EntryForm({ toggleNewEntryForm, allEntries, setAllEntries, organismId }) {
    const [newEntryNote, setNewEntryNote] = useState("");
    const [newEntryDate, setNewEntryDate] = useState("");
    const [newEntryImage, setNewEntryImage] = useState("");
    const [file, setFile] = useState("");
    const [uploadPer, setUploadPer] = useState(null);

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
                        setNewEntryImage(downloadURL);
                    });
                }
            );

        }
        file && uploadFile();
    }, [file])

    const handleAddNewEntry = async (e) => {
        e.preventDefault();
        await addDoc(collection(db, 'entries'), {
            note: newEntryNote,
            date: newEntryDate,
            photo: newEntryImage,
            organism_id: organismId,
            timeStamp: serverTimestamp(),
        });

        let list = [];
        const entries = query(collection(db, 'entries'), where('organism_id', '==', organismId), orderBy('date', 'asc'));
        const querySnapshot = await getDocs(entries);
        querySnapshot.forEach((doc) => {
            list.push({ id: doc.id, ...doc.data()});
        });
        setAllEntries(list);

        e.target.reset();
        setNewEntryNote("");
        setNewEntryDate("");
        setNewEntryImage("");
        setFile("");
    }

    return (
        <>
            <Form style={{ backgroundColor: 'rgba(176, 202, 148)', padding: '15px', borderRadius: '.5em', fontFamily: 'Poppins' }} onSubmit={handleAddNewEntry}>
                <Form.Group className="pb-2">
                    <Form.Label>Note:</Form.Label>
                    <Form.Control autoFocus type="text" placeholder="What's going on with your plant today?" onChange={e => setNewEntryNote(e.target.value)}></Form.Control>
                </Form.Group>
                <Form.Group className="pb-2">
                    <Form.Label>Date:</Form.Label>
                    <Form.Control type="datetime-local" onChange={e => setNewEntryDate(e.target.value)}></Form.Control>
                </Form.Group>
                <Form.Group className="pb-3">
                    <Form.Label>Photo:</Form.Label>
                    <Form.Control type="file" accept="image/*" placeholder="Upload photo here" onChange={e => setFile(e.target.files[0])}></Form.Control>
                </Form.Group>
                <Button onClick={toggleNewEntryForm} type="submit" className="card-button" variant="secondary" disabled={uploadPer !== null && uploadPer < 100}>add new entry</Button>
            </Form>
        </>
    );
}

export default EntryForm;