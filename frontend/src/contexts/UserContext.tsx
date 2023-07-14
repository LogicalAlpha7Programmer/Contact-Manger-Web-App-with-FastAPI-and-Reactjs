import { createContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
// import { useNavigate } from "react-router-dom";



export const UserContext = createContext({});

export const UserProvider = (props: any) => {
    const [token, setToken] = useState<string | undefined>(Cookies.get("access_token"));
    const [data, setData] = useState({ username: "", email: "", hashed_password: "" });

    useEffect(() => {
        const fetchUser = async () => {
            const requestOptions = {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token
                }
            }

            const response = await fetch("http://localhost:8000/users/user", requestOptions);
            const responseJSON = await response.json();

            if (!response.ok) {
                setToken("null");
            }

            setData(responseJSON)

            Cookies.set("access_token", typeof token === "string" ? token : "null");
        }

        fetchUser();
    }, [token]);

    return (
        <UserContext.Provider
            value={{
                token,
                setToken,
                data
            }}
        >
            {props.children}
        </UserContext.Provider>
    )

}