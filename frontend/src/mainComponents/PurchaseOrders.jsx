import React, { useEffect } from 'react';
import '../css/Requests.css';
import PurchaseOrderPopup from '../sideComponents/PurchaseOrderPopup';
import { FaPlus } from 'react-icons/fa';
import PageControls from '../sideComponents/PageControls';
import { fetchData } from '../assets/scripts';
import { Oval } from 'react-loader-spinner';

function PurchaseOrders() {
    const [popup, setPopup] = React.useState(<></>);
    const [orders, setOrders] = React.useState([]);
    const [page, setPage] = React.useState(1);
    const [loading, setLoading] = React.useState(true);
    const total = React.useRef(0);

    useEffect(() => {
        document.title = 'All Purchase Orders';
        async function fetchOrders() {
            try {

                const data = (await fetchData('purchaseOrders')).purchaseOrders;
                total.current = data.length;
                let orderList = [];
                data.map((order, index) => (
                    orderList.push(
                        <React.Fragment key={order.id}>
                            <div>{index + 1}</div>
                            <div>{order.item}</div>
                            <div>{order.quantity}</div>
                            <div>{order.amount}</div>
                            <div>{order.status}</div>
                            <div title='Click to view Details' className='orderId hoverable' onClick={() => setPopup(<PurchaseOrderPopup id={order.id} reset={() => setPopup(<></>)} />)}>
                                {order.id}
                            </div>
                        </React.Fragment>
                    )
                ));
                setOrders(orderList);
            } catch (error) {
                console.error('Error fetching purchase orders:', error);
            }
            finally {
                setLoading(false);
            }
        }

        fetchOrders();
    }, []);

    return (
        <>
            {loading ? <Oval color='black' height={80} strokeWidth={5} /> :
                <div id='allInputsContent'>
                    {popup}
                    <h1>All Purchase Orders</h1>
                    <PageControls page={page} setPage={setPage} total={total.current} max={25} />
                    <div id="allInputsTable">
                        <div className='allInputsTableTitle'>Sl.</div>
                        <div className='allInputsTableTitle'>Item</div>
                        <div className='allInputsTableTitle'>Quantity</div>
                        <div className='allInputsTableTitle'>Amount</div>
                        <div className='allInputsTableTitle'>Status</div>
                        <div className='allInputsTableTitle'>Order ID (details)</div>
                        {orders}
                        <div className="add hoverable"><FaPlus /></div>
                    </div>
                </div>
            }
        </>
    );
};

export default PurchaseOrders;