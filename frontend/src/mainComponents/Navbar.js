import React from 'react'
import { NavLink } from 'react-router-dom'


//css file
// import './Components.css'
// import '../Grid.css'
import '../css/Navbar.css';
import logo from '../assets/images/logo.webp';

function Navbar() {
    return (

        <nav>
            <img src={logo} alt="" height={'10%'} width='auto' />
            <NavLink to='/'>Home</NavLink>
            <NavLink to='/projects'>Projects</NavLink>
            {/* <NavLink to='/signin'><h6 className='navItem'>Signup</h6></NavLink> */}
            <div id='navAcct'>
                <NavLink to='/login' className='navBut'>Login</NavLink>
                <NavLink to='/signin' className='navBut'>Signup</NavLink>
            </div>
        </nav>
    )
}
export default Navbar;
