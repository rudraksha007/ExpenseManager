import { Link, useNavigate } from "react-router-dom";
import '../css/Login.css';
import { useEffect,useContext, useState } from "react";
import { ProfileContext } from "../assets/UserProfile";
import { fetchDataWithParams } from "../assets/scripts";
import loading from '../assets/images/loading.webp';

function Login() {
    // {/*onSubmit={handleSubmit(onSubmit)}*/ }
    const {profile, setProfile} = useContext(ProfileContext);
    const [formData, setFormData] = useState({email:'', password:''});
    const navigate = useNavigate();
    const handleSubmit = async (e)=>{
        e.preventDefault();
        e.currentTarget.value = '';
        e.currentTarget.style.backgroundImage = `url(${loading})`;
        e.currentTarget.style.backgroundSize = 'contain';
        e.currentTarget.style.backgroundRepeat = 'no-repeat';
        e.currentTarget.style.backgroundPosition = 'center';
        const data = await fetchDataWithParams('login', formData);
        if(data){
            setProfile(data.profile);
        }
        else{

            console.log('Failed to Login');
        }
    }
    useEffect(() => {
        if (profile) {
            navigate('/');
        }
        document.title = 'Login';

    }, []);
    return (
        <div id="loginMainDiv">
            <form>
                <h1>Login</h1>
                <div id="inputDiv">
                    <label className="loginInput hoverable">Email: &#9993;<input type='email' placeholder='example@gmail.com' required value={formData.email} onChange={(e)=>setFormData({...formData, email: e.currentTarget.value})}/></label>
                    <label className="loginInput hoverable">Password: &#128274;<input type='password' placeholder="Enter Password" required pattern=".{6,}" title="Password must be 6 characters long" value={formData.password} onChange={(e)=>setFormData({...formData, password: e.currentTarget.value})}/></label>
                </div>
                <div id="submitDiv">
                    <label id="loginNewAcct">Don't have an account? <Link to={"/signin"}>Create New Account</Link></label>
                    <input type="submit" onClick={(e)=>handleSubmit(e)} className="hoverable"/>
                </div>
            </form>
        </div>

    )
}

export default Login;