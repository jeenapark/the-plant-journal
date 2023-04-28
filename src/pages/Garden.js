import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import OrganismForm from "./OrganismForm";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import Organisms from "./Organisms";

function Garden({ setShowOrganismName }) {
    const { currentUser } = useContext(AuthContext)

    const [allOrganisms, setAllOrganisms] = useState([]);
    const [organismIdToEdit, setOrganismIdToEdit] = useState("");

    const [modal, setModal] = useState(false);
    const [organismForm, setOrganismForm] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            let list = [];
            try {
                const q = query(collection(db, "organisms"), where("user_id", "==", currentUser.uid));
                const querySnapshot = await getDocs(q);
                querySnapshot.forEach((doc) => {
                    list.push({ id: doc.id, ...doc.data()});
                });
                setAllOrganisms(list);
                setShowOrganismName("");
            } catch (err) {
                console.log(err);
            }
        }
        fetchData();
    }, []);

    // console.log(allOrganisms, "all organisms")
    // console.log(currentUser.uid, "current user")

    return (
        <div>
            <Organisms organisms={allOrganisms} setOrganisms={setAllOrganisms} modal={modal} setModal={setModal} setOrganismIdToEdit={setOrganismIdToEdit} setShowOrganismName={setShowOrganismName}/>
            <OrganismForm organisms={allOrganisms} setOrganisms={setAllOrganisms} modal={modal} setModal={setModal} organismForm={organismForm} setOrganismForm={setOrganismForm} organismIdToEdit={organismIdToEdit} setOrganismIdToEdit={setOrganismIdToEdit} />
        </div>
    );
}

export default Garden;