import React from 'react';
import '../css/Popup.css';
import { FaTimes, FaEdit, FaCheck } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { fetchData } from '../assets/scripts.js';

function IndentPopup({ reset, id }) {
    const navigate = useNavigate();
    const [requestDetails, setRequestDetails] = React.useState(null);

    React.useEffect(() => {
        async function fetchRequestDetails() {
            const data = await fetchData(`/api/requests/${id}`);
            if (data) setRequestDetails(data);
            else setRequestDetails({
                requestNo: 'N/A',
                title: 'N/A',
                amount: 'N/A',
                status: 'N/A',
                category: 'N/A',
                type: 'N/A',
                indentNo: 'N/A',
                indentDate: 'N/A',
                indentPerson: 'N/A'
            });
        }

        fetchRequestDetails();
    }, [id]);
    return (
        <div className='projectPopup'>
            <div className="projectPopupCont">
                <FaTimes size={30} style={{ position: 'absolute', right: 10, top: 10, cursor: 'pointer' }} onClick={() => close(reset)} />
                <h2>Request Details</h2>
                <div className='requestDetailGroup'>
                    <div className='requestDetailField'>
                        <h4>Project No</h4>
                        <span>{requestDetails?.requestNo}</span>
                    </div>
                    <div className='requestDetailField'>
                        <h4>Title</h4>
                        <span>{requestDetails?.title}</span>
                    </div>
                    <div className='requestDetailField'>
                        <h4>Request Amount</h4>
                        <span>{requestDetails?.amount}</span>
                    </div>
                    <div className='requestDetailField'>
                        <h4>Request Status</h4>
                        <span>{requestDetails?.status}</span>
                    </div>
                    <div className='requestDetailField'>
                        <h4>Request Category</h4>
                        <span>{requestDetails?.category}</span>
                    </div>
                    <div className='requestDetailField'>
                        <h4>Indent Person</h4>
                        <span>{requestDetails?.indentPerson}</span>
                    </div>
                    <div className='requestDetailField'>
                        <h4>Request Type</h4>
                        <span>{requestDetails?.type}</span>
                    </div>
                    <div className='requestDetailField'>
                        <h4>Indent No</h4>
                        <span>{requestDetails?.indentNo}</span>
                    </div>
                    <div className='requestDetailField'>
                        <h4>Indent Date</h4>
                        <span>{requestDetails?.indentDate}</span>
                    </div>
                </div>
                <div className="requestPopupActions">
                    <FaEdit size={30} style={{ marginRight: 5 }} className='hoverable' title='Edit This Project' onClick={() => navigate(`/edit/:${id}`)} />
                    <FaCheck size={30} style={{ marginRight: 5 }} className='hoverable' title='Aproove This Request' onClick={() => aproove()} />
                </div>
            </div>
        </div >
    );
};

function close(reset) {
    console.log('closed');
    reset();
}

function aproove(){

}

function edit(){

}

export default IndentPopup;