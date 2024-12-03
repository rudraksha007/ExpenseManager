import React from 'react';
import '../css/Popup.css';
import { FaTimes, FaEdit, FaCheck } from 'react-icons/fa';
import { useNavigate} from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchData } from '../assets/scripts.js';

function PurchaseOrderPopup({ reset, id }) {
    const navigate = useNavigate();
    const [orderDetails, setOrderDetails] = useState(null);
    useEffect(() => {
        async function fetchRequestDetails() {
            const data = await fetchData(`/api/requests/${id}`);
            if (data) setOrderDetails(data);
            else setOrderDetails({
                orderNo: 'N/A',
                title: 'N/A',
                amount: 'N/A',
                indentApproveDate: 'N/A',
                purchaseRequestApproveDate: 'N/A',
                status: 'N/A',
                category: 'N/A',
                person: 'N/A',
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
                <h2>Purchase Order Details</h2>
                <div className='requestDetailGroup'>
                    <div className='requestDetailField'>
                        <h4>Order No</h4>
                        <span>{orderDetails?.orderNo}</span>
                    </div>
                    <div className='requestDetailField'>
                        <h4>Indent Approval</h4>
                        <span>{orderDetails?.indentApproveDate}</span>
                    </div>
                    <div className='requestDetailField'>
                        <h4>PR Approval</h4>
                        <span>{orderDetails?.purchaseRequestApproveDate}</span>
                    </div>
                    <div className='requestDetailField'>
                        <h4>Title</h4>
                        <span>{orderDetails?.title}</span>
                    </div>
                    <div className='requestDetailField'>
                        <h4>Order Amount</h4>
                        <span>{orderDetails?.amount}</span>
                    </div>
                    <div className='requestDetailField'>
                        <h4>Order Status</h4>
                        <span>{orderDetails?.status}</span>
                    </div>
                    <div className='requestDetailField'>
                        <h4>Order Category</h4>
                        <span>{orderDetails?.category}</span>
                    </div>
                    <div className='requestDetailField'>
                        <h4>Order Person</h4>
                        <span>{orderDetails?.person}</span>
                    </div>
                    <div className='requestDetailField'>
                        <h4>Order Type</h4>
                        <span>{orderDetails?.type}</span>
                    </div>
                    <div className='requestDetailField'>
                        <h4>Indent No</h4>
                        <span>{orderDetails?.indentNo}</span>
                    </div>
                    <div className='requestDetailField'>
                        <h4>Indent Date</h4>
                        <span>{orderDetails?.indentDate}</span>
                    </div>
                    <div className='requestDetailField'>
                        <h4>Indent Person</h4>
                        <span>{orderDetails?.indentPerson}</span>
                    </div>
                </div>
                <div className="requestPopupActions">
                    <FaEdit size={30} style={{ marginRight: 5 }} className='hoverable' title='Edit This Order' onClick={() => navigate(`/edit/${id}`)} />
                    <FaCheck size={30} style={{ marginRight: 5 }} className='hoverable' title='Approve This Order' onClick={() => approve()} />
                </div>
            </div>
        </div>
    );
};

function close(reset) {
    console.log('closed');
    reset();
}

function approve() {
    console.log('approved');
}

export default PurchaseOrderPopup;