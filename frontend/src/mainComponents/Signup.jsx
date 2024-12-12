import { Link, useNavigate } from "react-router-dom";
import '../css/Login.css';
import { useEffect } from "react";
import { fetchDataWithParams } from "../assets/scripts";
import CryptoJS from "crypto-js";

function Signup() {
    const navigate = useNavigate()
    useEffect(() => {
        document.title = 'Add New User';
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!e.currentTarget.checkValidity()) return;
        const formData = Object.fromEntries( new FormData(e.currentTarget));
        const json = {...formData, password: CryptoJS.SHA256(formData.password).toString()}
        let res = await fetchDataWithParams('users', 'put', json);
        console.log(json);
        
        if (res.reqStatus === 'success') {
            navigate('/');
        } else {
            alert(`Failed: ${res.message}`);

        }
    }
    return (
        <div id="loginMainDiv">
            <form onSubmit={(e) => handleSubmit(e)}>
                <h1>Signup</h1>
                <div id="inputDiv">
                    <label className="loginInput hoverable">Name:<input type='text' name='name' placeholder='Enter your name' required /></label>
                    <label className="loginInput hoverable">Email: &#9993;<input type='email' name='email' placeholder='mayank@gmail.com' required /></label>
                    <label className="loginInput hoverable">Employee Id:;<input type='number' name='id' placeholder="Enter Employee Id" required min={0}/></label>
                    <label className="loginInput hoverable">Password: &#128274;<input type='password' name='password' placeholder="Enter Password" required pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{6,}$" title="Password must be 6 characters long and contain an Upper case, smaller case and a special character" /></label>
                    <label className="loginInput hoverable">Designation:
                        <select name='role' required defaultValue={"Pi"}>
                            <option value="" disabled>Select</option>
                            <option value="Pi">PI</option>
                            <option value="Scientist">Scientist</option>
                            <option value="Admin">Admin</option>
                            <option value="SuperAdmin">Super Admin</option>
                        </select>
                    </label>
                </div>
                <div id="submitDiv">
                    <label id="loginNewAcct">Have an account? <Link to={"/login"}>Login</Link></label>
                    <input type="submit" className="hoverable" style={{ color: "white" }} />
                </div>
            </form >
        </div >
    )
}

export default Signup;