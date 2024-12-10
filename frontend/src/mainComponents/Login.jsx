import { Link, useNavigate } from "react-router-dom";
import '../css/Login.css';
import { useEffect,useContext, useState } from "react";
import { ProfileContext } from "../assets/UserProfile";
import { fetchDataWithParams } from "../assets/scripts";
import loading from '../assets/images/loading.webp';
import CryptoJS from 'crypto-js';
import FingerprintJS from '@fingerprintjs/fingerprintjs';

function Login() {
    // {/*onSubmit={handleSubmit(onSubmit)}*/ }
    const {profile, setProfile} = useContext(ProfileContext);
    const [formData, setFormData] = useState({email:'', password:''});
    const navigate = useNavigate();
    const handleSubmit = async (e)=>{
        e.preventDefault();
        if (!e.target.checkValidity()) {return;}        
        let ele = document.getElementById('submitButton');
        ele.value = '';
        ele.style.backgroundImage = `url(${loading})`;
        ele.style.backgroundSize = 'contain';
        ele.style.backgroundRepeat = 'no-repeat';
        ele.style.backgroundPosition = 'center';
        let fingerPrint =(await(await FingerprintJS.load()).get()).visitorId;
        console.log(fingerPrint);
        
        const data = await fetchDataWithParams('login', 'post', {...formData, password: CryptoJS.SHA256(formData.password).toString(), fingerPrint: fingerPrint });
        console.log(data);
        
        if(data){
            setProfile(data.profile);
        }
        else{
            alert('Failed to Login');
            console.log('Failed to Login');
        }
        ele.style.backgroundImage = '';        
        ele.value = 'Login';
    }
    useEffect(() => {
        document.title = 'Login';
        if (profile) {
            navigate('/');
        }

    }, [profile]);
    return (
        <div id="loginMainDiv">
            <form  onSubmit={(e)=>handleSubmit(e)}>
                <h1>Login</h1>
                <div id="inputDiv">
                    <label className="loginInput hoverable">Email: &#9993;<input type='email' placeholder='example@gmail.com' required value={formData.email} onChange={(e)=>setFormData({...formData, email: e.currentTarget.value})}/></label>
                    <label className="loginInput hoverable">Password: &#128274;<input type='password' placeholder="Enter Password" required pattern=".{6,}" title="Password must be 6 characters long" value={formData.password} onChange={(e)=>setFormData({...formData, password: e.currentTarget.value})}/></label>
                </div>
                <div id="submitDiv">
                    {/* <label id="loginNewAcct">Don't have an account? <Link to={"/signin"}>Create New Account</Link></label> */}
                    <input type="submit" value={'Login'} id='submitButton' className="hoverable"/>
                </div>
            </form>
        </div>

    )
}

export default Login;