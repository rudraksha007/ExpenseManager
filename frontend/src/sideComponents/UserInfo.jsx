import React from 'react'

// import isLogin from '../assets/Home';
import person from '../assets/images/person.webp';
import '../css/UserInfo.css';

function UserInfo() {
  return (
    <> {/*parent(container) className = 'dash', styling of parent is in dash.css*/}
      <div id="dashUserInfoDp">
        <img src={person} alt="" width='40%' />
        <h3>Welcome back! {'{name}'}</h3>
      </div>
      <p>Userame: {'{username}'}</p>
      <p>Ongoing Projects:{'{no. of projects}'}</p>
      <p>LoggedIn As:{'{post/rank}'}</p>
    </>
  )
}

export default UserInfo
