import { useContext, useState, FormEvent } from "react";
import { UserContext } from "../contexts/UserContext";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useNavigate } from "react-router-dom";

export default function Register() {

    const [errorMessage, setErrorMessage] = useState("");
    const { token, setToken } = useContext<any>(UserContext);
    const navigate = useNavigate();

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const data = new FormData(event.currentTarget)
        const username = data.get("username")
        const email = data.get("email")
        const password = data.get("password")
        const ConfirmPassword = data.get("ConfirmPassword")


        if (password?.toString().trim() === ConfirmPassword?.toString().trim() && password !== null && password.toString().trim().length > 5) {
            const response = await fetch("http://localhost:8000/users/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: username?.toString().trim(),
                    email: email?.toString().trim(),
                    hashed_password: password.toString().trim()
                })
            })
            const responseJSON = await response.json()
            if (response.status === 400) {
                setErrorMessage(responseJSON.detail)
            } else if (response.status === 422) {
                const field = responseJSON.detail[0].loc[1]
                if (field === "username") {
                    setErrorMessage("invalid username")
                } else if (field === "email") {
                    setErrorMessage("invalid Email")
                } else if (field === "password") {
                    setErrorMessage("invalid Password")
                }
            } else {
                setToken(responseJSON.access_token)
                navigate("/");
            }

        } else {
            setErrorMessage("Password not confirmed and password length not greater then 5")
        }

    }

    return (

        <div className="flex justify-center items-center h-screen pb-52">
            {token === "null" || typeof token === "undefined" ?
                <form className="w-96" onSubmit={handleSubmit}>
                    <Label htmlFor="username">Username</Label>
                    <Input type="text" name="username" id="username" required />
                    <Label htmlFor="email">Email</Label>
                    <Input type="email" name="email" id="email" required />
                    <Label htmlFor="password">Password</Label>
                    <Input type="password" name="password" id="password" required />
                    <Label htmlFor="ConfirmPassword">Confirm Password</Label>
                    <Input type="password" name="ConfirmPassword" id="ConfirmPassword" />
                    <p className="font-bold text-red-600">{errorMessage}</p>
                    <div className="flex mt-3">
                        <Input className=" hover:bg-gray-300 cursor-pointer w-25" type="submit" value="Register" />
                        <a href="/login" className="ml-auto justify-center hover:underline h-fit">Want to login?</a>
                    </div>
                </form>
                :
                <p>Sorry, You are already logged in!</p>
            }

        </div>

    )
}