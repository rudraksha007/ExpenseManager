import { Link } from "react-router-dom";
import '../css/Login.css';
import { useEffect } from "react";

function Signup() {
    useEffect(() => {
        document.title = 'Add New User';
    }, []);
    return (
        <div id="loginMainDiv">
            <form>
                <h1>Signup</h1>
                <div id="inputDiv">
                    <label className="loginInput hoverable">Name:<input type='text' placeholder='Enter your name' required /></label>
                    <label className="loginInput hoverable">Email: &#9993;<input type='email' placeholder='mayank@gmail.com' required /></label>
                    <label className="loginInput hoverable">Employee Id:;<input type='text' placeholder="Enter Employee Id" required /></label>
                    <label className="loginInput hoverable">Password: &#128274;<input type='password' placeholder="Enter Password" required pattern=".{6,}" title="Password must be 6 characters long" /></label>
                    <label className="loginInput hoverable">Designation:
                        <select required>
                            <option value="" disabled selected>Select</option>
                            <option value="1">PI</option>
                            <option value="2">Scientist</option>
                            <option value="3">Admin</option>
                            <option value="4">Super Admin</option>
                        </select>
                    </label>
                </div>
                <div id="submitDiv">
                    <label id="loginNewAcct">Don't have an account? <Link to={"/login"}>Create New Account</Link></label>
                    <input type="submit" className="hoverable" />
                </div>
            </form >
        </div >

    )
}

export default Signup;