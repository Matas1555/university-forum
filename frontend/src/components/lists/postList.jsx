import { useEffect, useState } from "react";
import API from "../../utils/API";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";

export default function PostList(){
    const [posts, setPosts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        API.get('/postsExtended').then((response) => {
            console.log(response);
            setPosts(response.data);
        })
    }, [])

    const truncateText = (text, maxLength) => {
        if (text.length > maxLength) {
            return text.substring(0, maxLength) + "...";
        }
        return text;
    };

    return(
        <>
<div className="flex flex-col gap-1 p-3 overflow-hidden bg-lighter-blue rounded-md border-2 border-blue shadow-md lg:flex-grow">
    {posts.map((value) => (
        <div 
            key={value.id} 
            value={value} 
            className="m-5 bg-almost-blue p-4 rounded-md border-2 border-blue transition-shadow duration-300 cursor-pointer hover:shadow-xl hover:shadow-gray-600"
        >
            <NavLink to={`/post`}>
                <div>
                    <h3 className="font-sans" style={{fontWeight: 600, fontSize: "1.4em" }}>{value.title}</h3>
                    <p style={{ fontWeight: 200, fontSize: "1em" }} className="mb-4 italic">
                        Paskelbta {value.created_at}
                    </p>
                    <p style={{ fontWeight: 400, fontSize: "1em" }}>
                        {truncateText(value.description, 80)}
                    </p>
                </div>
                <div className="flex flex-row justify-between mt-2 justify-center">
                    <div 
                        className="flex flex-row gap-1 align-middle" 
                        style={{ fontWeight: 500, fontSize: "1em" }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 0 1 1.037-.443 48.282 48.282 0 0 0 5.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" 
                            />
                        </svg>
                        {value.comments_count}
                    </div>
                    <div 
                        className="flex flex-row gap-4" 
                        style={{ fontWeight: 500, fontSize: "1em" }}
                    >
                        {value.categories.map((category) => (
                            <div 
                                key={category.id} 
                                value={category.name} 
                                className="bg-lighter-blue text-blue pr-2 pl-2 pt-1 pb-1 rounded-md border-blue border-2"
                            >
                                {category.name}
                            </div>
                        ))}
                    </div>
                </div>
            </NavLink>
        </div>
    ))}
</div>

        </>
    )
}