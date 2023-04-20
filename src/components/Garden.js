import React, { useEffect, useState } from "react";
import OrganismForm from "../pages/OrganismForm";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import Organisms from "../pages/Organisms";

function Garden() {
    const [allOrganisms, setAllOrganisms] = useState([]);

    const [modal, setModal] = useState(false);
    const [organismForm, setOrganismForm] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);

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
            <Organisms organisms={allOrganisms} modal={modal} setModal={setModal}/>
            <OrganismForm modal={modal} setModal={setModal} organismForm={organismForm} setOrganismForm={setOrganismForm} deleteModal={deleteModal} setDeleteModal={setDeleteModal}/>
        </div>
    );
}

export default Garden;