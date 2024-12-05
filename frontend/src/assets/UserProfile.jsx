import { createContext } from "react";
import { useState } from "react";

const ProfileContext = createContext();
function ProfileProvider({children}){
    const [profile, setProfile] = useState(null);
    return (
        <ProfileContext.Provider value={{profile, setProfile}}>
            {children}
        </ProfileContext.Provider>
    );
}

export {ProfileContext, ProfileProvider};