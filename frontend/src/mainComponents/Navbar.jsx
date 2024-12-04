import React from 'react'
import { NavLink, Link } from 'react-router-dom'
import { FaBars, FaTimes, FaUserPlus, FaSignOutAlt, FaPlus, FaUser } from 'react-icons/fa';


import '../css/Navbar.css';
import logo from '../assets/images/logo.webp';

function Navbar() {
    return (

        <>
            <nav>
                <img src={logo} alt="" height={'100%'} width='auto' />
                <NavLink to='/'>Home</NavLink>
                <NavLink to='/projects'>Projects</NavLink>
                <NavLink to='/indents/'>Indents</NavLink>
                <NavLink to='/purchasereqs/'>Purchase Reqs</NavLink>
                <NavLink to='/purchaseorders/'>Purchase ODs</NavLink>
                <NavLink to='/login'>Login</NavLink>

                <FaBars size={40} color='white' style={{ position: 'absolute', top: '50%', right: 20, translate: '0% -50%' }} className='hoverable' onClick={() => document.getElementById('sideBar').style.transform = 'translateX(-100%)'} />
                <div id="sideBar">
                    <FaTimes size={40} color='black' style={{ position: 'absolute', top: 20, right: 20 }} className='hoverable' onClick={() => document.getElementById('sideBar').style.transform = 'translateX(0)'} />
                    <div>
                        <Link to='/signup' className='hoverable'> <FaUserPlus size={40} style={{ marginRight: 8 }} /> Create New User</Link>
                        <Link to='/newproject' className='hoverable'> <FaPlus size={40} style={{ marginRight: 8 }} /> Create New Project</Link>
                        <Link to='/profiles' className='hoverable'> <FaUser size={40} style={{ marginRight: 8 }} /> All Users</Link>
                        <Link to='/signout' className='hoverable'> <FaSignOutAlt size={40} style={{ marginRight: 8 }} /> Sign Out</Link>
                    </div>
                </div>
            </nav>

            <div id="navHolder" style={{ height: '10dvh', width: '100dvw' }}></div>
        </>
    )
}
export default Navbar;
