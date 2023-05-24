import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { OrganismNameContext } from "../context/OrganismNameContext";
import OrganismForm from "./OrganismForm";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "../firebase";
import Organisms from "./Organisms";

function Garden() {
    const { currentUser } = useContext(AuthContext);
    const [showOrganismName, setShowOrganismName] = useContext(OrganismNameContext);

    const [allOrganisms, setAllOrganisms] = useState([]);
    const [organismIdToEdit, setOrganismIdToEdit] = useState("");
    const [organismNameToEdit, setOrganismNameToEdit] = useState("");
    const [organismSpeciesToEdit, setOrganismSpeciesToEdit] = useState("");

    const [modal, setModal] = useState(false);
    const [organismForm, setOrganismForm] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            let list = [];
            try {
                const q = query(collection(db, "organisms"), where("user_id", "==", currentUser.uid), orderBy("name"));
                const querySnapshot = await getDocs(q);
                querySnapshot.forEach((doc) => {
                    list.push({ id: doc.id, ...doc.data() });
                });
                setAllOrganisms(list);
                setShowOrganismName("");
            } catch (err) {
                console.log(err);
            }
        }
        fetchData();
    }, [currentUser, setShowOrganismName]);

    return (
        <div>
            <OrganismNameContext.Provider value={[showOrganismName, setShowOrganismName]}>
                <Organisms organisms={allOrganisms} setOrganisms={setAllOrganisms} modal={modal} setModal={setModal} organismForm={organismForm} setOrganismForm={setOrganismForm} organismIdToEdit={organismIdToEdit} setOrganismIdToEdit={setOrganismIdToEdit} organismNameToEdit={organismNameToEdit} setOrganismNameToEdit={setOrganismNameToEdit} organismSpeciesToEdit={organismSpeciesToEdit} setOrganismSpeciesToEdit={setOrganismSpeciesToEdit} />
                <OrganismForm organisms={allOrganisms} setOrganisms={setAllOrganisms} modal={modal} setModal={setModal} organismForm={organismForm} setOrganismForm={setOrganismForm} organismIdToEdit={organismIdToEdit} setOrganismIdToEdit={setOrganismIdToEdit} organismNameToEdit={organismNameToEdit} setOrganismNameToEdit={setOrganismNameToEdit} organismSpeciesToEdit={organismSpeciesToEdit} setOrganismSpeciesToEdit={setOrganismSpeciesToEdit} />
            </OrganismNameContext.Provider>
        </div>
    );
}

export default Garden;