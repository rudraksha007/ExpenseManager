import { FaTimes } from 'react-icons/fa';

function PDFPopup({ reset, pdf }) {
    return (
        <div className="projectPopup">
            <FaTimes onClick={reset} size={40} color='white' className='hoverable' />
            <div className="pdfCanvas">
                <embed src={`data:application/pdf;base64,${pdf}`} type="application/pdf" width="100%" height="100%"
                    frameBorder="0" />
            </div>
        </div>
    );
}

export default PDFPopup;