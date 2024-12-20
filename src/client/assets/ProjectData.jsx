import { createContext, useState } from "react";

const ProjectContext = createContext();
function ProjectProvider({children}){
    const [project, setProject] = useState(null);
    return (
        <ProjectContext.Provider value={{project, setProject}}>
            {children}
        </ProjectContext.Provider>
    );
}

export {ProjectContext, ProjectProvider};