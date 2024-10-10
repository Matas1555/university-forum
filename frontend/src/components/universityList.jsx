import { useEffect, useState } from "react";
import API from "../API";

export default function UniversityList(){
    const [universities, setUniversities] = useState([]);

    useEffect(() => {
        API.get('/universities').then((response) => {
            console.log(response);
            setUniversities(response.data);
        })
    }, [])

    return(
        <>
        <div className="flex flex-col gap-8">
            {universities.map((value) => (
                <>
                <div key={value.id} value={value}>{value.name}</div>
                </>
            ))}
        </div>
        </>
    )
}