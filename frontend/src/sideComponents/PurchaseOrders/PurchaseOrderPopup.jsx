import React from 'react';
import '../../css/Popup.css';
import { FaTimes, FaEdit, FaCheck } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { fetchData } from '../../assets/scripts.js';
import { Oval } from 'react-loader-spinner';

function PurchaseOrderPopup({ reset, id }) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [orderDetails, setOrderDetails] = useState(null);

    useEffect(() => {
        async function fetchOrderDetails() {
            setLoading(true);
            const data = await fetchData(`/api/orders/${id}`);
            if (data) setOrderDetails(data);
            else setOrderDetails({
                orderNo: 'N/A', title: 'N/A', orderDate: 'N/A', amount: 'N/A', status: 'N/A', category: 'N/A', person: 'N/A',
                type: 'N/A', indentNo: 'N/A', indentDate: 'N/A', indentPerson: 'N/A',
            });
            setLoading(false);
        }

        fetchOrderDetails();
    }, [id]);

    return (
        <div className='projectPopup'>
            {loading ? <Oval color='white' height={80} strokeWidth={5} /> :
                <div className="projectPopupCont">
                    <FaTimes size={30} style={{ position: 'absolute', right: 10, top: 10, cursor: 'pointer' }} onClick={() => close(reset)} />
                    <h2>Purchase Order Details</h2>
                    <div className='orderDetailGroup'>
                        <div className='orderDetailField'>
                            <h4>Order ID</h4>
                            <span>{orderDetails?.PurchaseOrderID}</span>
                        </div>
                        <div className='orderDetailField'>
                            <h4>Order Date</h4>
                            <span>{orderDetails?.OrderDate}</span>
                        </div>
                        <div className='orderDetailField'>
                            <h4>Project No.</h4>
                            <span>{orderDetails?.ProjectNo}</span>
                        </div>
                        <div className='orderDetailField'>
                            <h4>Indent ID</h4>
                            <span>{orderDetails?.IndentID}</span>
                        </div>
                        <div className='orderDetailField'>
                            <h4>Order Amount</h4>
                            <span>{orderDetails?.PurchaseOrderAmount}</span>
                        </div>
                        <div className='orderDetailField'>
                            <h4>Requestor ID</h4>
                            <span>{orderDetails?.OrderRequestor}</span>
                        </div>
                        <div className='orderDetailField'>
                            <h4>Status</h4>
                            <span>{orderDetails?.OrderStatus}</span>
                        </div>
                        <div className='orderDetailField'>
                            <h4>Category</h4>
                            <span>{orderDetails?.IndentCategory}</span>
                        </div>
                        <div className='orderDetailField'>
                            <h4>Indent Date</h4>
                            <span>{orderDetails?.IndentDate}</span>
                        </div>
                        <div className='orderDetailField'>
                            <h4>Indented Person ID</h4>
                            <span>{orderDetails?.IndentedPersonId}</span>
                        </div>
                    </div>
                    <div className="orderPopupActions">
                        <FaTimes size={30} style={{ marginRight: 5 }} className='hoverable' title='Reject This Order' onClick={() => navigate(`/edit/:${id}`)} />
                        <FaCheck size={30} style={{ marginRight: 5 }} className='hoverable' title='Approve This Order' onClick={() => approve()} />
                    </div>
                </div>}
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