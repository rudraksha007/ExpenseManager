import React from 'react'
import { NavLink } from 'react-router-dom'


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

                <div id='navAcct'>
                    <NavLink to='/login' className='navBut'>Login</NavLink>
                    <NavLink to='/signin' className='navBut'>Signup</NavLink>
                </div>
            </nav>
            <div id="navHolder" style={{height:'10dvh', width:'100dvw'}}></div>
        </>
    )
}
export default Navbar;
