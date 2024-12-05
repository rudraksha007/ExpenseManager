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
import PurchaseOrders from './mainComponents/PurchaseOrders';
import AllProfiles from './mainComponents/AllProfiles';
import { login } from './assets/scripts.js';
import { ProfileContext } from './assets/UserProfile';
import { Oval } from 'react-loader-spinner';
// import LoadingScreen from './sideComponents/LoadingScreen.jsx';

function App() {
  const { profile, setProfile } = useContext(ProfileContext);
  const [loading, setLoading] = React.useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    document.title = 'Project Management System';
    async function autoLogin() {
      if (!(await login(setProfile))) {
        navigate('/login');
      }
      setLoading(false);
    }
    autoLogin();
  }, []);
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
              <Route exact path='/purchaseorders' element={<PurchaseOrders />} />
              <Route path='/projects/:id' element={<Project />} />
              <Route path='/profiles' element={<AllProfiles />} />

              {/* <Route path='/addproject' element={<ExpenseForm />} /> */}
              {/* <Route path='/editproject/:id' element={<Editproject />} /> */}
            </Routes>
          </div>
        </>
      }</>
  );
}

export default App;
