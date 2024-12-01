import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './mainComponents/Navbar';
import Dash from './mainComponents/Dash';
import Login from './mainComponents/Login';
import Signup from './mainComponents/Signup';
import AllProjects from './mainComponents/AllProjects';

function App() {
  return (
    <>
      <Navbar />
      <div id="appMainElement" style={{ backgroundColor: 'white', height: '100vh', width:'100vw'}}>
        <Routes>
          <Route path='/' element={<Dash />} />
          <Route path='/projects' element={<AllProjects />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signin' element={<Signup />} />

          {/* <Route path='/home' element={<Layout><Home /></Layout>} /> */}
          {/* <Route path='/projrctmanager' element={<Projects />} /> */}
          {/* <Route path='/addproject' element={<ExpenseForm />} /> */}
          {/* <Route path='/project/:id' element={<Project />} /> */}
          {/* <Route path='/editproject/:id' element={<Editproject />} /> */}
        </Routes>
      </div>
    </>
  );
}

export default App;
