import { Oval } from "react-loader-spinner";

function Loading({position}){
    return (
        <div style={{position: position||'relative', top:'50%', left: '50%', transform: 'translate(-50%, -50%)'}} >
            <Oval color='black' height={80} strokeWidth={5} />
        </div>
    )
}

export default Loading;