import { useEffect, useState } from "react";
import API from "../API";

export default function PostList(){
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        API.get('/posts').then((response) => {
            console.log(response);
            setPosts(response.data);
        })
    }, [])

    return(
        <>
        <div className="flex flex-col gap-8">
            {posts.map((value) => (
                <>
                <div key={value.id} value={value}>{value.title}</div>
                </>
            ))}
        </div>
        </>
    )
}