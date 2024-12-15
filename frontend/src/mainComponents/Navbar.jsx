import React from 'react'
import { NavLink, Link } from 'react-router-dom'
import { FaBars, FaTimes, FaUserPlus, FaSignOutAlt, FaPlus, FaUser, FaTasks, FaAward } from 'react-icons/fa';
import { useContext } from 'react';
import person from '../assets/images/person.webp';

import '../css/Navbar.css';
import logo from '../assets/images/logo.webp';
import { ProfileContext } from '../assets/UserProfile';
import { fetchData } from '../assets/scripts';

function Navbar() {
    const { profile, setProfile } = useContext(ProfileContext);
    const signoff = async (e) => {
        e.preventDefault();
        if ((await fetchData('logout', 'post')).reqStatus == 'success') {
            setProfile(null);
        }
    }
    return (

        <>
            <nav>
                <img src={logo} alt="" height={'100%'} width='auto' id='navLogo' />

                {!profile ? <NavLink to='/login'>Introduction to Project Management System</NavLink> :
                    <>
                        <NavLink to='/'>Home</NavLink>
                        <NavLink to='/projects'>Projects</NavLink>

                    </>
                }
                {profile ? <img src={person} alt="" height='80%' id='sideBarButton' color='white' style={{ position: 'absolute', top: '50%', right: 20, translate: '0% -50%', backgroundColor:'white', borderRadius:'50%' }} className='hoverable' onClick={() => document.getElementById('sideBar').style.transform = 'translateX(-100%)'} /> : <></>}

                {profile ?
                    <div id="sideBar">
                        <FaTimes size={40} color='black' style={{ position: 'absolute', top: 20, right: 20 }} className='hoverable' onClick={() => document.getElementById('sideBar').style.transform = 'translateX(0)'} />
                        <div>
                            <div id="profileDetails" style={{boxSizing: 'border-box', padding: '0px 20px'}}>
                                <div style={{width:'100%', display:'flex', justifyContent: 'center'}}><img src={person} alt="" width='60%'/></div>
                                <p><b>Name:</b> {profile ? profile.name : ""}</p>
                                <p><b>Employee ID:</b> {profile ? profile.id : ""}</p>
                                <p><b>LoggedIn As:</b> {profile ? profile.role : ""}</p>
                            </div>
                            <Link to='/newproject' className='hoverable'> <FaPlus size={40} style={{ marginRight: 8 }} /> Create New Project</Link>
                            {profile && (profile.role == 'admin' || profile.role == 'superadmin' || profile.role == 'root') ?
                                <>
                                    <Link to='/signup' className='hoverable'> <FaUserPlus size={40} style={{ marginRight: 8 }} /> Create New User</Link>
                                    <Link to='/profiles' className='hoverable'> <FaUser size={40} style={{ marginRight: 8 }} /> All Users</Link>
                                    <Link to='/investors' className='hoverable'> <FaUserPlus size={40} style={{ marginRight: 8 }} /> Add Funding Agencies</Link>
                                    <NavLink to='/indents/'>  <FaTasks size={40} style={{ marginRight: 8 }} />Indents</NavLink>
                                    <NavLink to='/purchasereqs/'> <FaAward size={40} style={{ marginRight: 8 }} /> Purchase Reqs</NavLink>

                                </> : <></>}
                            <Link to='/login' className='hoverable' onClick={(e) => { signoff(e) }}> <FaSignOutAlt size={40} style={{ marginRight: 8 }} /> Sign Out</Link>
                        </div>
                    </div> : <></>}
            </nav>

            <div id="navHolder" style={{ height: '10dvh', width: '100dvw' }}></div>
        </>
    )
}
export default Navbar;
