import { useStateContext } from "../context/contextProvider";
import API from "../utils/API";

const Profile = () => {
    const {user} = useStateContext();

    return (
        <>
            <h1>User Information</h1>
            {user ? (
                <ul>
                    {Object.keys(user).map((key) => (
                        <li key={key}>
                            <strong>{key}:</strong> {user[key] ? user[key].toString() : "N/A"}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No user data available</p>
            )}
        </>
    );
  };
  
  export default Profile;