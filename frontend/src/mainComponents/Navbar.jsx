import React, { useEffect } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { FaBars, FaTimes, FaUserPlus, FaSignOutAlt, FaPlus, FaUser, FaTasks } from 'react-icons/fa';
import { useContext } from 'react';


import '../css/Navbar.css';
import logo from '../assets/images/logo.webp';
import { ProfileContext } from '../assets/UserProfile';
import { fetchData } from '../assets/scripts';

function Navbar() {
    const { profile, setProfile } = useContext(ProfileContext);
    const navigate = useNavigate();
    useEffect(() => {
        if (profile) {
            navigate('/');
        }
    }, []);
    return (

        <>
            <nav>
                <img src={logo} alt="" height={'100%'} width='auto' />

                {!profile ? <NavLink to='/login'>Introduction to Project Management System</NavLink> :
                    <>
                        <NavLink to='/'>Home</NavLink>
                        <NavLink to='/projects'>Projects</NavLink>
                        <NavLink to='/indents/'>Indents</NavLink>
                        {profile.role == 'superadmin' || profile.role == 'admin' ? <NavLink to='/purchasereqs/'>Purchase Reqs</NavLink> : <></>}
                        {(profile.role == 'superadmin') ? <NavLink to='/purchaseorders/'>Purchase Orders</NavLink> : <></>}
                    </>
                }

                {profile? <FaBars size={40} color='white' style={{ position: 'absolute', top: '50%', right: 20, translate: '0% -50%' }} className='hoverable' onClick={() => document.getElementById('sideBar').style.transform = 'translateX(-100%)'} />:<></>}
                
                <div id="sideBar">
                    <FaTimes size={40} color='black' style={{ position: 'absolute', top: 20, right: 20 }} className='hoverable' onClick={() => document.getElementById('sideBar').style.transform = 'translateX(0)'} />
                    <div>
                        <Link to='/newproject' className='hoverable'> <FaPlus size={40} style={{ marginRight: 8 }} /> Create New Project</Link>
                        { profile &&(profile.role == 'admin'||profile.role=='superadmin') ?
                            <>
                                <Link to='/signup' className='hoverable'> <FaUserPlus size={40} style={{ marginRight: 8 }} /> Create New User</Link>
                                <Link to='/profiles' className='hoverable'> <FaUser size={40} style={{ marginRight: 8 }} /> All Users</Link>
                                <Link to='/investors' className='hoverable'> <FaUserPlus size={40} style={{ marginRight: 8 }} /> Add Funding Agencies</Link>
                                {/* <Link to='/approval' className='hoverable'> <FaTasks size={40} style={{ marginRight: 8 }} /> Show Status</Link> */}
                            </> : <></>}
                        <Link to='/signout' className='hoverable' onClick={()=>{fetchData('logout')}}> <FaSignOutAlt size={40} style={{ marginRight: 8 }} /> Sign Out</Link>
                    </div>
                </div>
            </nav>

            <div id="navHolder" style={{ height: '10dvh', width: '100dvw' }}></div>
        </>
    )
}
export default Navbar;
