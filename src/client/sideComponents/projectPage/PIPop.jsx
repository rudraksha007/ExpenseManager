import React from 'react';
import '../../css/Popup.css';
import { FaTimes, FaCheck } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { fetchData, fetchDataWithParams } from '../../assets/scripts.js';
import { Oval } from 'react-loader-spinner';

function PIPop({ reset, data, type }) {
    const [loading, setLoading] = React.useState(true);

    
    return (
        <div className='projectPopup'>
            {loading ? <Oval color='white' height={80} strokeWidth={5} /> :
                <div className="projectPopupCont">
                    <FaTimes size={30} style={{ position: 'absolute', right: 10, top: 10, cursor: 'pointer' }} onClick={() => close(reset)} />
                    <h2>{type}</h2>
                    <div className='requestDetailGroup'>
                        <div className='requestDetailField'>
                            <h4>Project No</h4>
                            <span>{requestDetails?.ProjectNo}</span>
                        </div>
                        <div className='requestDetailField'>
                            <h4>Title</h4>
                            <span>{requestDetails?.ProjectTitle}</span>
                        </div>
                        <div className='requestDetailField'>
                            <h4>Indent ID</h4>
                            <span>{requestDetails?.IndentID}</span>
                        </div>
                        <div className='requestDetailField'>
                            <h4>Indent Date</h4>
                            <span>{requestDetails?.IndentDate.split('T')[0]}</span>
                        </div>
                        <div className='requestDetailField'>
                            <h4>Indent Status</h4>
                            <span>{requestDetails?.IndentStatus}</span>
                        </div>
                        <div className='requestDetailField'>
                            <h4>Indent Category</h4>
                            <span>{requestDetails?.IndentCategory}</span>
                        </div>
                        <div className='requestDetailField'>
                            <h4>Indent Amount</h4>
                            <span>{requestDetails?.IndentAmount}</span>
                        </div>
                        <div className='requestDetailField'>
                            <h4>Indented Person ID</h4>
                            <span>{requestDetails?.IndentedPersonId}</span>
                        </div>
                    </div>
                </div>}
        </div >
    );
};

function close(reset) {
    console.log('closed');
    reset();
}

async function aproove(indent, reset) {
    let data = await fetchDataWithParams('indentStatus', 'post', { IndentID: indent, Approved: true });
    if (data.reqStatus == 'success') {
        alert('Request Aprooved');
        reset();
    }
    else alert('Failed: ' + data.message);
}

async function reject(IndentID, reset) {
    let data = (await fetchDataWithParams('indentStatus', 'post', { IndentID: IndentID, Approved: false }));
    if (data.reqStatus == 'success') {
        alert('Request Rejected');
        reset();
    }
    else alert('Failed: ' + data.message);

}

export default PIPop;