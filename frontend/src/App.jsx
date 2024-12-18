import React, { useContext, useEffect } from 'react';
import './css/LoadingScreen.css';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Navbar from './mainComponents/Navbar';
import Dash from './mainComponents/Dash';
import Login from './mainComponents/Login';
import Signup from './mainComponents/Signup';
import AllProjects from './mainComponents/AllProjects';
import Project from './mainComponents/Project';
import Indents from './mainComponents/Indents';
import PurchaseReqs from './mainComponents/PurchaseReqs';
import AllProfiles from './mainComponents/AllProfiles';
import { autoLogin, initialize } from './assets/scripts.js';
import { ProfileContext } from './assets/UserProfile';
import { Oval } from 'react-loader-spinner';
import NewProject from './mainComponents/NewProject.jsx';

function App() {
  const { profile, setProfile } = useContext(ProfileContext);
  const [loading, setLoading] = React.useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    document.title = 'Project Management System';
    async function login() {
      if(profile){return;}
      await initialize();
      let prof = await autoLogin();
      setProfile(prof);
      setLoading(false);
    }
    login();
  }, []);
  useEffect(() => {
    if (profile) {navigate('/');}
    else {navigate('/login');}
  }, [profile]);
  return (
    <>
      {loading ? <Oval color='black' height={80} /> :
        <>
          <Navbar />
          <div id="appMainElement" style={{ backgroundColor: 'white' }}>
            <Routes>
              <Route exact path='/' element={<Dash />} />
              <Route exact path='/projects' element={<AllProjects />} />
              <Route exact path='/login' element={<Login />} />
              <Route exact path='/signup' element={<Signup />} />
              <Route exact path='/indents' element={<Indents />} />
              <Route exact path='/purchasereqs' element={<PurchaseReqs />} />
              <Route path='/projects/:id' element={<Project />} />
              <Route path='/profiles' element={<AllProfiles />} />
              <Route path='/newproject' element={<NewProject/>}/>
            </Routes>
          </div>
        </>
      }</>
  );
}

export default App;
