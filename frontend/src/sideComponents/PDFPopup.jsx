import { useEffect, useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { fetchData } from '../assets/scripts';
import { Oval } from 'react-loader-spinner';

function PDFPopup({ reset, pdf }) {
    const [loading, setLoading] = useState(true);
    const [pdfData, setPdfData] = useState('');
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
                        <div className="pdfCanvas">
                            <embed src={`data:application/pdf;base64,${pdfData}`} type="application/pdf" width="100%" height="100%" frameBorder="0" />
                        </div>
                    </>
            }

        </div>

    );
}

export default PDFPopup;