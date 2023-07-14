import React, { useContext, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useNavigate } from "react-router-dom";

// import Navbar from "./NavBar";


export default function Login() {
    const [errorMessage, setErrorMessage] = useState("");
    const { token, setToken } = useContext<any>(UserContext);
    const navigate = useNavigate();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const data = new FormData(event.currentTarget);
        const username = data.get("username");
        const password = data.get("password");

        const response = await fetch(`http://localhost:8000/users/token`, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: JSON.stringify(
                `grant_type=&username=${username?.toString()}&password=${password?.toString()}&scope=&client_id=&client_secret=`
            )
        })

        const responseJSON = await response.json();
        if (!response.ok) {
            setErrorMessage(responseJSON.detail)
        } else {
            setToken(responseJSON.access_token);
            navigate("/");

        }
    }

    return (

        <div className="flex justify-center items-center h-screen pb-52">
            {token === "null" || typeof token === "undefined" ?
                <form className=" w-96" onSubmit={handleSubmit}>
                    <Label htmlFor="username">Username / Email</Label>
                    <Input type="text" name="username" id="login_username" required />
                    <Label htmlFor="password">Password</Label>
                    <Input type="password" name="password" id="password" required />
                    <p className="font-bold text-red-600">{errorMessage}</p>
                    <div className="flex mt-3">
                        <Input className=" hover:bg-gray-300 cursor-pointer w-25" type="submit" value="Login" />
                        <a href="/register" className="ml-auto justify-center hover:underline h-fit">Want to register?</a>
                    </div>
                </form>
                : <p>Sorry, You are already logged in!</p>

            }
        </div>
    )
}
