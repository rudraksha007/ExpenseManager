import React, { useContext, useEffect } from 'react'

import person from '../../assets/images/person.webp';
import '../../css/UserInfo.css';
import { ProfileContext } from '../../assets/UserProfile';

function UserInfo() {
  const { profile } = useContext(ProfileContext);

  return (
    <> {/*parent(container) className = 'dash', styling of parent is in dash.css*/}
      <h3>Welcome back! {profile ? profile.name : ""}</h3>
      <p>Employee ID: {profile ? profile.id : ""}</p>
      <p>LoggedIn As: {profile ? profile.role : ""}</p>
    </>
  )
}

export default UserInfo
