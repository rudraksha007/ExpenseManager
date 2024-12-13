import React, { useEffect } from 'react';
import '../css/Requests.css';
import PurchaseReqPopup from '../sideComponents/PurchaseReqs/PurchaseReqPopup';
import { FaPlus } from 'react-icons/fa';
import { Oval } from 'react-loader-spinner';
import PageControls from '../sideComponents/PageControls';
import { fetchDataWithParams } from '../assets/scripts';
import NewPRPopup from '../sideComponents/PurchaseReqs/NewPRPopup';
import NewPOPopup from '../sideComponents/PurchaseOrders/NewPOPopup';

function PurchaseOrders() {
    const [popup, setPopup] = React.useState(null);
    const [orders, setOrders] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [filter, setFilter] = React.useState({ text: '', status: '', upto: 0, above: 0, fromDate: '', toDate: '', page: 1 });
    const total = React.useRef(0);

    useEffect(() => {
        if (popup) return;
        document.title = 'All Purchase Orders';
        async function fetchOrders() {
            try {
                const data = (await fetchDataWithParams('purchaseOrders', 'post', { filter: filter, count: 25 }));
                console.log(data);
                if (data.reqStatus === 'success') {
                    let l = [];
                    data.purchaseOrders.map((order, index) => (
                        l.push(
                            <React.Fragment key={order.PurchaseOrderID}>
                                <div>{index + 1}</div>
                                <div>{order.ProjectNo}</div>
                                <div>{order.OrderDate.split('T')[0]}</div>
                                <div>{order.PurchaseOrderAmount}</div>
                                <div>{order.OrderRequestor}</div>
                                <div>{order.OrderStatus}</div>
                                <div title='Click to view Details' className='orderId hoverable' onClick={() => setPopup(<PurchaseReqPopup id={order.PurchaseOrderID} reset={() => setPopup(null)} />)}>
                                    {order.PurchaseOrderID}
                                </div>
                            </React.Fragment>
                        )
                    ));
                    setOrders(l);
                }
            } catch (error) {
                console.error('Error fetching purchase orders:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchOrders();
    }, [popup]);

    const selectIndent = (indentID) => {
        // setPopup(<NewPRPopup reset={()=>setPopup(null)} selectIndent={indentID} />);
    }

    return (
        <>
            {loading ? <Oval color='black' height={80} strokeWidth={5} /> :
                <div id='allInputsContent'>
                    {popup}
                    <h1>All Purchase Orders</h1>
                    <PageControls page={filter.page} setPage={(page) => setFilter({ ...filter, page: page })} total={total.current} max={25} />
                    <div id="allInputsTable">
                        <div className='tableTitle'>Sl.</div>
                        <div className='tableTitle'>Project</div>
                        <div className='tableTitle'>Date</div>
                        <div className='tableTitle'>Amount</div>
                        <div className='tableTitle'>Requestor ID</div>
                        <div className='tableTitle'>Status</div>
                        <div className='tableTitle'>Order ID (details)</div>
                        {orders}
                        <div className="add hoverable" onClick={() => setPopup(<NewPOPopup selectIndent={selectIndent} reset={() => setPopup(null)} />)}><FaPlus /></div>
                    </div>
                </div>
            }
        </>
    );
};

export default PurchaseOrders;