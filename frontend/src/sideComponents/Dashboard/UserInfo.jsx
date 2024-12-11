import React, { useContext, useEffect } from 'react'

import person from '../../assets/images/person.webp';
import '../../css/UserInfo.css';
import { ProfileContext } from '../../assets/UserProfile';

function UserInfo() {
  const { profile } = useContext(ProfileContext);

  return (
    <> {/*parent(container) className = 'dash', styling of parent is in dash.css*/}
      <div id="dashUserInfoDp">
        <img src={person} alt="" width='40%' />
        <h3>Welcome back! {profile?profile.name:""}</h3>
      </div>
      <p>Employee ID: {profile?profile.id:""}</p>
      {/* <p>Ongoing Projects: {profile?profile.projects.active.length:0}</p> */}
      <p>LoggedIn As: {profile?profile.role:""}</p>
    </>
  )
}

export default UserInfo
