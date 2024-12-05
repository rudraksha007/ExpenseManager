import React, { useEffect } from 'react';
import '../css/Requests.css';
import PurchaseReqPopup from '../sideComponents/PurchaseReqPopup';
import { FaPlus } from 'react-icons/fa';
import { Oval } from 'react-loader-spinner';
import PageControls from '../sideComponents/PageControls';
import { fetchData } from '../assets/scripts';

function PurchaseReqs() {
    const [popup, setPopup] = React.useState(<></>);
    const [requests, setRequests] = React.useState([]);
    const [page, setPage] = React.useState(1);
    const [loading, setLoading] = React.useState(true);
    const total = React.useRef(0);
    useEffect(() => {
        document.title = 'All Purchase Requests';
        async function fetchRequests() {
            try {
                // const response = await fetch('/api/purchase-requests');
                // const data = await response.json();
                const data = (await fetchData('purchaseReqs')).purchaseReqs;
                console.log(data);

                let l = [];
                data.map((request, index) => (
                    l.push(
                        <React.Fragment key={request.id}>
                            <div>{index + 1}</div>
                            <div>{request.item}</div>
                            <div>{request.quantity}</div>
                            <div>{request.amount}</div>
                            <div>{request.status}</div>
                            <div title='Click to view Details' className='requestId hoverable' onClick={() => setPopup(<PurchaseReqPopup id={request.id} reset={() => setPopup(<></>)} />)}>
                                {request.id}
                            </div>
                        </React.Fragment>
                    )
                ));
                setRequests(l);
            } catch (error) {
                console.error('Error fetching purchase requests:', error);
            }
            finally {
                setLoading(false);
            }
        }

        fetchRequests();
    }, []);
    return (
        <>
            {loading ? <Oval color='black' height={80} strokeWidth={5} /> :
                <div id='allInputsContent'>
                    {popup}
                    <h1>All Purchase Requests</h1>
                    <PageControls page={page} setPage={setPage} total={total.current} max={25} />
                    <div id="allInputsTable">
                        <div className='allInputsTableTitle'>Sl.</div>
                        <div className='allInputsTableTitle'>Item</div>
                        <div className='allInputsTableTitle'>Quantity</div>
                        <div className='allInputsTableTitle'>Amount</div>
                        <div className='allInputsTableTitle'>Status</div>
                        <div className='allInputsTableTitle'>Request ID (details)</div>
                        {requests}
                        <div className="add hoverable"><FaPlus /></div>
                    </div>
                </div>
            }
        </>
    );
};

export default PurchaseReqs;