import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './mainComponents/Navbar';
import Dash from './mainComponents/Dash';
import Login from './mainComponents/Login';
import Signup from './mainComponents/Signup';
import AllProjects from './mainComponents/AllProjects';
import Project from './mainComponents/Project';
import Indents from './mainComponents/Indents';
import PurchaseReqs from './mainComponents/PurchaseReqs';
import PurchaseOrders from './mainComponents/PurchaseOrders';

function App() {
  return (
    <>
      <Navbar />
      <div id="appMainElement" style={{ backgroundColor: 'white', height: '90vh', width:'100vw'}}>
        <Routes>
          <Route exact path='/' element={<Dash />} />
          <Route exact path='/projects' element={<AllProjects />} />
          <Route exact path='/login' element={<Login />} />
          <Route exact path='/signin' element={<Signup />} />
          <Route exact path='/indents' element={<Indents />} />
          <Route exact path='/purchasereqs' element={<PurchaseReqs />} />
          <Route exact path='/purchaseorders' element={<PurchaseOrders />} />
          <Route path='/projects/:id' element={<Project />} />

          {/* <Route path='/addproject' element={<ExpenseForm />} /> */}
          {/* <Route path='/editproject/:id' element={<Editproject />} /> */}
        </Routes>
      </div>
    </>
  );
}

export default App;
