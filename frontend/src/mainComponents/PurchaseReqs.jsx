import React, { useEffect } from 'react';
import '../css/Requests.css';
import PurchaseReqPopup from '../sideComponents/PurchaseReqPopup';

function PurchaseReqs() {
    const [popup, setPopup] = React.useState(<></>);
    const [requests, setRequests] = React.useState([]);
    useEffect(() => {
        document.title = 'All Purchase Requests';
        async function fetchRequests() {
            try {
                // const response = await fetch('/api/purchase-requests');
                // const data = await response.json();
                const data = [
                    {
                        id: 'req123',
                        item: 'Laptop',
                        quantity: '10',
                        amount: '15000',
                        status: 'Pending'
                    },
                    {
                        id: 'req456',
                        item: 'Monitor',
                        quantity: '20',
                        amount: '5000',
                        status: 'Approved'
                    },
                    {
                        id: 'req789',
                        item: 'Keyboard',
                        quantity: '50',
                        amount: '2000',
                        status: 'Rejected'
                    }
                ];
                let l = [];
                data.map((request, index) => (
                    l.push(
                        <div className="allInputsTable" key={request.id}>
                            <div>{index + 1}</div>
                            <div>{request.item}</div>
                            <div>{request.quantity}</div>
                            <div>{request.amount}</div>
                            <div>{request.status}</div>
                            <div title='Click to view Details' className='requestId hoverable' onClick={() => setPopup(<PurchaseReqPopup id={request.id} reset={() => setPopup(<></>)} />)}>
                                {request.id}
                            </div>
                        </div>
                    )
                ));
                setRequests(l);
            } catch (error) {
                console.error('Error fetching purchase requests:', error);
            }
        }

        fetchRequests();
    }, []);
    return (
        <div id='allInputsContent'>
            {popup}
            <h1>All Purchase Requests</h1>
            <div id="allInputsTitle">
                <div>Sl.</div>
                <div>Item</div>
                <div>Quantity</div>
                <div>Amount</div>
                <div>Status</div>
                <div>Request ID (details) </div>
            </div>
            {requests}
        </div>
    );
};

export default PurchaseReqs;