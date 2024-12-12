import React from 'react'
import { NavLink, Link } from 'react-router-dom'
import { FaBars, FaTimes, FaUserPlus, FaSignOutAlt, FaPlus, FaUser, FaTasks } from 'react-icons/fa';
import { useContext } from 'react';

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
                <img src={logo} alt="" height={'100%'} width='auto' />

                {!profile ? <NavLink to='/login'>Introduction to Project Management System</NavLink> :
                    <>
                        <NavLink to='/'>Home</NavLink>
                        <NavLink to='/projects'>Projects</NavLink>
                        <NavLink to='/indents/'>Indents</NavLink>
                        {profile.role == 'superadmin' || profile.role == 'pme' || profile.role == 'root' ? <NavLink to='/purchasereqs/'>Purchase Reqs</NavLink> : <></>}
                        {(profile.role == 'superadmin' || profile.role == 'root') ? <NavLink to='/purchaseorders/'>Purchase Orders</NavLink> : <></>}
                    </>
                }

                {profile ? <FaBars id='sideBarButton' size={40} color='white' style={{ position: 'absolute', top: '50%', right: 20, translate: '0% -50%' }} className='hoverable' onClick={() => document.getElementById('sideBar').style.transform = 'translateX(-100%)'} /> : <></>}

                {profile?
                <div id="sideBar">
                <FaTimes size={40} color='black' style={{ position: 'absolute', top: 20, right: 20 }} className='hoverable' onClick={() => document.getElementById('sideBar').style.transform = 'translateX(0)'} />
                <div>
                    <Link to='/newproject' className='hoverable'> <FaPlus size={40} style={{ marginRight: 8 }} /> Create New Project</Link>
                    {profile && (profile.role == 'admin' || profile.role == 'superadmin' || profile.role == 'root') ?
                        <>
                        <Link to='/newproject' className='hoverable'> <FaPlus size={40} style={{ marginRight: 8 }} /> Create Project Report</Link>
                            <Link to='/signup' className='hoverable'> <FaUserPlus size={40} style={{ marginRight: 8 }} /> Create New User</Link>
                            <Link to='/profiles' className='hoverable'> <FaUser size={40} style={{ marginRight: 8 }} /> All Users</Link>
                            <Link to='/investors' className='hoverable'> <FaUserPlus size={40} style={{ marginRight: 8 }} /> Add Funding Agencies</Link>
                            {/* <Link to='/approval' className='hoverable'> <FaTasks size={40} style={{ marginRight: 8 }} /> Show Status</Link> */}
                        </> : <></>}
                    <Link to='/login' className='hoverable' onClick={(e) => { signoff(e) }}> <FaSignOutAlt size={40} style={{ marginRight: 8 }} /> Sign Out</Link>
                </div>
            </div>:<></>}
            </nav>

            <div id="navHolder" style={{ height: '10dvh', width: '100dvw' }}></div>
        </>
    )
}
export default Navbar;
