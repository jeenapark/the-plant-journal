import React, { useEffect, useState } from "react";
import NewOrganism from "./NewOrganism";

function Garden() {
    const [allOrganisms, setAllOrganisms] = useState([]);


    return (
        <div>
            <NewOrganism />
        </div>
    );
}

export default Garden;