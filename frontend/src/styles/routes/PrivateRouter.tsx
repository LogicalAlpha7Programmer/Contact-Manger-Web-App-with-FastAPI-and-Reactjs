import { useContext } from "react";
import { UserContext } from "../../contexts/UserContext";
import Login from "../../pages/Login";
// import { Navigate } from "react-router-dom";

const PrivateRouter = (props: any) => {
    const { token, } = useContext<any>(UserContext);

    if (token !== "null" && typeof token === "string") {

        return (props.children)

    } // else if (token === "null" || typeof token === "undefined") {

    //  navigate("/login")

    else {
        window.location.href = "/login"
        return <Login />

    }


    // return token !== "null" && typeof token !== "undefined" ? children : useEffect(() => navigate("/login"))
}

export default PrivateRouter;
