import { Link } from "react-router-dom";
import '../css/Login.css';

function Login() {
    // {/*onSubmit={handleSubmit(onSubmit)}*/ }
    return (
        // <p style={{ fontFamily: 'Arial', textAlign: 'center' }}>Password 6 characters or more &#169;</p>
        <div id="loginMainDiv">
            <form>
                <h1>Login</h1>
                <div id="inputDiv">
                    <label className="loginInput hoverable">Email: &#9993;<input type='email' placeholder='mayank@gmail.com' required /></label>
                    <label className="loginInput hoverable">Password: &#128274;<input type='password' placeholder="Enter Password" required pattern=".{6,}" title="Password must be 6 characters long" /></label>
                </div>
                <div id="submitDiv">
                    <label id="loginNewAcct">Don't have an account? <Link to={"/signin"}>Create New Account</Link></label>

                    <input type="submit" className="hoverable"/>
                </div>
            </form>
        </div>

    )
}

export default Login;