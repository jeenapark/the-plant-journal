import React, { useEffect, useState } from "react";
import OrganismForm from "../pages/OrganismForm";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import Organisms from "../pages/Organisms";

function Garden() {
    const [allOrganisms, setAllOrganisms] = useState([]);
    const [organismIdToEdit, setOrganismIdToEdit] = useState("");

    const [modal, setModal] = useState(false);
    const [organismForm, setOrganismForm] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            let list = [];
            try {
                const querySnapshot = await getDocs(collection(db, "organisms"));
                querySnapshot.forEach((doc) => {
                    list.push({ id: doc.id, ...doc.data()});
                });
                setAllOrganisms(list);
            } catch (err) {
                console.log(err);
            }
        }
        fetchData();
    }, []);

    // console.log(allOrganisms, "all organisms")

    return (
        <div>
            <Organisms organisms={allOrganisms} setOrganisms={setAllOrganisms} modal={modal} setModal={setModal} setOrganismIdToEdit={setOrganismIdToEdit}/>
            <OrganismForm organisms={allOrganisms} setOrganisms={setAllOrganisms} modal={modal} setModal={setModal} organismForm={organismForm} setOrganismForm={setOrganismForm} organismIdToEdit={organismIdToEdit} setOrganismIdToEdit={setOrganismIdToEdit} />
        </div>
    );
}

export default Garden;