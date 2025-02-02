import { useNavigate } from "react-router-dom";
import '../css/Login.css';
import { useEffect,useContext, useState } from "react";
import { ProfileContext } from "../assets/UserProfile";
import { fetchDataWithParams } from "../assets/scripts";
import CryptoJS from 'crypto-js';

function Login() {
    const {profile, setProfile} = useContext(ProfileContext);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const handleSubmit = async (e)=>{
        e.preventDefault();
        if (!e.target.checkValidity()) {return;}
        setLoading(true);
        let formData = Object.fromEntries(new FormData(e.target).entries());
        formData = {...formData, password: CryptoJS.SHA256(formData.password).toString()}
        console.log(formData);
        const data = await fetchDataWithParams('login', 'post', formData);        
        if(data.reqStatus=='success'){
            setProfile(data.profile);
        }
        else{
            alert('Failed to Login: '+data.message);
            console.log('Failed to Login');
        }
        setLoading(false);
    }
    useEffect(() => {
        document.title = 'Login To Project Management';
        if (profile) {
            navigate('/');
        }
    }, []);
    return (
        <div id="loginMainDiv">
            <form onSubmit={(e) => handleSubmit(e)}>
                <h1>Login</h1>
                <div id="inputDiv">
                    <label className="loginInput hoverable">Email: &#9993;
                        <input 
                            type='email' 
                            name='email' 
                            placeholder='example@gmail.com' 
                            required 
                        />
                    </label>
                    <label className="loginInput hoverable">Password: &#128274;
                        <input 
                            type='password' 
                            name='password' 
                            placeholder="Enter Password" 
                            required 
                            pattern=".{6,}" 
                            title="Password must be 6 characters long" 
                        />
                    </label>
                </div>
                <div id="submitDiv">
                    {/* <label id="loginNewAcct">Don't have an account? <Link to={"/signin"}>Create New Account</Link></label> */}
                    <input type="submit" value={loading?'':'Login'} id='submitButton' className="hoverable" style={loading?
                        {
                            color: "white",
                            backgroundImage: `url(${loading})`,
                            backgroundSize: 'contain',
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'center'
                        }:{color: "white"}
                    }/>
                </div>
            </form>
        </div>
    )
}

export default Login;