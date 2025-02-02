import { Link, useNavigate } from "react-router-dom";
import '../css/Login.css';
import { useEffect, useState } from "react";
import { fetchDataWithParams } from "../assets/scripts";
import CryptoJS from "crypto-js";

function Signup() {
    const navigate = useNavigate();
    const [data, setData] = useState({
        name: '',
        email: '',
        id: '',
        password: '',
        role: 'Pi',
        BasicSalary: 0,
        HRA_Percentage: 0
    });
    useEffect(() => {
        document.title = 'Add New User';
    }, []);

    const handleChange = (e) => {        
        const { name, value } = e.target;
        setData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

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
                    <label className="loginInput hoverable">Name:<input type='text' name='name' placeholder='Enter your name' required onChange={handleChange} /></label>
                    {data.role == 'Pi' || data.role == 'SuperAdmin' ? 
                        <>
                            <label className="loginInput hoverable">Email: &#9993;<input type='email' name='email' placeholder='mayank@gmail.com' required onChange={handleChange} /></label>
                            <label className="loginInput hoverable">Password: &#128274;<input type='password' name='password' placeholder="Enter Password" required pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{6,}$" title="Password must be 6 characters long and contain an Upper case, smaller case and a special character" onChange={handleChange} /></label>
                        </>
                        :<></>}
                    <label className="loginInput hoverable">Employee Id:;<input type='text' name='id' placeholder="Enter Employee Id" required onChange={handleChange} /></label>
                    {
                        data.role !== 'Pi' && data.role !== 'SuperAdmin' ? 
                            <>
                            <label className="loginInput hoverable">Basic Salary:<input type='number' name='BasicSalary' placeholder="Enter Basic Salary" required min={0} step="0.01" onChange={handleChange} /></label>
                            <label className="loginInput hoverable">HRA Percentage:<input type='number' name='HRA_Percentage' placeholder="Enter HRA Percentage" required min={0} step="0.01" onChange={handleChange} /></label>
                            </>:<></>
                    }
                    <label className="loginInput hoverable">Designation:
                        <select name='role' required defaultValue={"Pi"} onChange={(e) => { handleChange(e); }}>
                            <option value="" disabled>Select</option>
                            {/* <option value="JRF">JRF</option> */}
                            {/* <option value="SRF">SRF</option> */}
                            <option value="RA">RA</option>
                            <option value="Pi">PI</option>
                            <option value="SuperAdmin">Techanican</option>
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