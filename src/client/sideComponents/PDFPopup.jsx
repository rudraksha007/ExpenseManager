import { useEffect, useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { fetchData } from '../assets/scripts';
import { Oval } from 'react-loader-spinner';

function PDFPopup({ reset, pdf }) {
    const [loading, setLoading] = useState(true);
    const [pdfData, setPdfData] = useState([]);
    useEffect(() => {
        async function getPDF() {
            let base64 = await fetchData(pdf, 'post');
            setPdfData(base64.BillCopy);
            setLoading(false);            
        }
        getPDF();
    }, []);
    return (

        <div className="projectPopup">
            {
                loading ? <Oval color='black' height={80} strokeWidth={5} /> :
                    <>
                        <FaTimes onClick={reset} size={40} color='white' className='hoverable' />
                        <div id='pages' style={{ display: 'flex', alignItems: 'center',justifyContent:'center', gap: 10, height: 30, margin: 10 }}>
                            {
                                pdfData.map((page, index) => (
                                <div style={{height: '100%', backgroundColor: 'white', width: 30}} 
                                className='hoverable' 
                                onClick={()=>document.getElementById('pdfRender').src = `data:application/pdf;base64,${pdfData[index]}`}
                                >
                                    {index+1}</div>))
                            }
                        </div>
                        <div className="pdfCanvas" style={{ width: '80vw', height: '80vh', display: 'flex', overflow: 'hidden'}}>
                            <embed id='pdfRender' src={`data:application/pdf;base64,${pdfData[0]}`} type="application/pdf" frameBorder="0" style={{width: '90vw', height:'100%',flex: '0 0 100%', overflow: 'hidden'}}/>
                            
                        </div>
                    </>
            }

        </div>

    );
}

export default PDFPopup;