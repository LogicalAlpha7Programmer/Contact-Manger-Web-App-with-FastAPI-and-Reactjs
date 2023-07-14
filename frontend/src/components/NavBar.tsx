import { useContext } from "react"
import { UserContext } from "../contexts/UserContext"
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
    const { setToken, data } = useContext<any>(UserContext);
    const navigate = useNavigate();
    const logout = () => {
        setToken("null");
        navigate("/login");
    }

    return (
        <nav>

            <div className="ml-auto mr-14 w-fit flex">

                <h1 className="hover:underline cursor-pointer h-fit align-middle mr-4 mt-4" onClick={() => navigate("/")}>{data.username} | {data.email}
                </h1> <Button variant={"outline"} className=" bg-slate-200 mt-2" onClick={() => logout()}>Logout</Button>


            </div>


        </nav>
    )
}