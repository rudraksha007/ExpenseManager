import React from 'react';
import '../../css/Popup.css';
import { FaTimes, FaCheck } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { fetchData, fetchDataWithParams } from '../../assets/scripts.js';
import { Oval } from 'react-loader-spinner';

function PurchaseReqPopup({ reset, id }) {
    const navigate = useNavigate();
    const [requestDetails, setRequestDetails] = React.useState(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        async function fetchRequestDetails() {
            let data = await fetchData(`indents/${id}`, 'post');
            if (data.reqStatus == 'success') setRequestDetails(data.data);
            else setRequestDetails({
                RequestID: 'N/A',
                RequestCategory: 'N/A',
                ProjectNo: 'N/A',
                ProjectTitle: 'N/A',
                RequestAmount: 'N/A',
                RequestedPersonId: 'N/A',
                RequestDate: 'N/A',
                RequestStatus: 'N/A'
            });
            setLoading(false);
        }

        fetchRequestDetails();
    }, [id]);

    return (
        <div className='projectPopup'>
            {loading ? <Oval color='white' height={80} strokeWidth={5} /> :
                <div className="projectPopupCont">
                    <FaTimes size={30} style={{ position: 'absolute', right: 10, top: 10, cursor: 'pointer' }} onClick={() => close(reset)} />
                    <h2>Request Details</h2>
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
                            <h4>Request ID</h4>
                            <span>{requestDetails?.IndentID}</span>
                        </div>
                        <div className='requestDetailField'>
                            <h4>Request Date</h4>
                            <span>{requestDetails?.IndentDate.split('T')[0]}</span>
                        </div>
                        <div className='requestDetailField'>
                            <h4>Request Status</h4>
                            <span>{requestDetails?.IndentStatus}</span>
                        </div>
                        <div className='requestDetailField'>
                            <h4>Request Category</h4>
                            <span>{requestDetails?.IndentCategory}</span>
                        </div>
                        <div className='requestDetailField'>
                            <h4>Request Amount</h4>
                            <span>{requestDetails?.IndentAmount}</span>
                        </div>
                        <div className='requestDetailField'>
                            <h4>Requested Person ID</h4>
                            <span>{requestDetails?.IndentedPersonId}</span>
                        </div>
                    </div>
                    {requestDetails?.IndentStatus === 'Completed' ? <></>
                    :
                    <div className="requestPopupActions">
                        <FaTimes size={30} style={{ marginRight: 5 }} className='hoverable' title='Reject This Request' onClick={() => reject(requestDetails.IndentID, reset)} />
                        <FaCheck size={30} style={{ marginRight: 5 }} className='hoverable' title='Approve This Request' onClick={() => approve(requestDetails.IndentID, reset)} />
                    </div>
                    }
                </div>}
        </div >
    );
};

function close(reset) {
    console.log('closed');
    reset();
}

async function approve(requestID, reset) {
    let data = await fetchDataWithParams('purchaseReqStatus', 'post', { PurchaseReqID: requestID, Approved: true });
    if (data.reqStatus == 'success') {
        alert('Request Approved');
        reset();
    }
    else alert('Failed: ' + data.message);
}

async function reject(requestID, reset) {
    let data = await fetchDataWithParams('purchaseReqStatus', 'post', { PurchaseReqID: requestID, Approved: false });
    if (data.reqStatus == 'success') {
        alert('Request Rejected');
        reset();
    }
    else alert('Failed: ' + data.message);
}

export default PurchaseReqPopup;