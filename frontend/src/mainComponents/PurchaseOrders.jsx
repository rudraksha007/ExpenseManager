import React, { useEffect } from 'react';
import '../css/Requests.css';
import PurchaseOrderPopup from '../sideComponents/PurchaseOrderPopup';

function PurchaseOrders() {
    const [popup, setPopup] = React.useState(<></>);
    const [orders, setOrders] = React.useState([]);

    useEffect(() => {
        document.title = 'All Purchase Orders';
        async function fetchOrders() {
            try {
                // const response = await fetch('/api/purchase-orders');
                // const data = await response.json();
                const data = [
                    {
                        id: 'ord123',
                        item: 'Laptop',
                        quantity: '10',
                        amount: '15000',
                        status: 'Pending'
                    },
                    {
                        id: 'ord456',
                        item: 'Monitor',
                        quantity: '20',
                        amount: '5000',
                        status: 'Approved'
                    },
                    {
                        id: 'ord789',
                        item: 'Keyboard',
                        quantity: '50',
                        amount: '2000',
                        status: 'Rejected'
                    }
                ];
                let orderList = [];
                data.map((order, index) => (
                    orderList.push(
                        <div className="allInputsTable" key={order.id}>
                            <div>{index + 1}</div>
                            <div>{order.item}</div>
                            <div>{order.quantity}</div>
                            <div>{order.amount}</div>
                            <div>{order.status}</div>
                            <div title='Click to view Details' className='orderId hoverable' onClick={() => setPopup(<PurchaseOrderPopup id={order.id} reset={() => setPopup(<></>)} />)}>
                                {order.id}
                            </div>
                        </div>
                    )
                ));
                setOrders(orderList);
            } catch (error) {
                console.error('Error fetching purchase orders:', error);
            }
        }

        fetchOrders();
    }, []);

    return (
        <div id='allInputsContent'>
            {popup}
            <h1>All Purchase Orders</h1>
            <div id="allInputsTitle">
                <div>Sl.</div>
                <div>Item</div>
                <div>Quantity</div>
                <div>Amount</div>
                <div>Status</div>
                <div>Order ID (details) </div>
            </div>
            {orders}
        </div>
    );
};

export default PurchaseOrders;