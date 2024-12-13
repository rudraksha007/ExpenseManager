import React, { useEffect } from 'react';
import '../css/Requests.css';
import PurchaseReqPopup from '../sideComponents/PurchaseReqs/PurchaseReqPopup';
import { FaPlus } from 'react-icons/fa';
import { Oval } from 'react-loader-spinner';
import PageControls from '../sideComponents/PageControls';
import { fetchDataWithParams } from '../assets/scripts';
import NewPRPopup from '../sideComponents/PurchaseReqs/NewPRPopup';

function PurchaseReqs() {
    const [popup, setPopup] = React.useState(null);
    const [requests, setRequests] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [filter, setFilter] = React.useState({ text: '', status: '', upto: 0, above: 0, fromDate: '', toDate: '', page:1 })
    const total = React.useRef(0);
    useEffect(() => {
        if(popup) return;
        document.title = 'All Purchase Requests';
        async function fetchRequests() {
            try {
                const data = (await fetchDataWithParams('purchaseReqs', 'post', { filter: filter, count: 25 }));
                console.log(data);
                if (data.reqStatus == 'success') {
                    let l = [];
                    data.purchaseReqs.map((request, index) => (
                        l.push(
                            <React.Fragment key={request.PurchaseReqID}>
                                <div>{index + 1}</div>
                                <div>{request.ProjectNo}</div>
                                <div>{request.PRDate.split('T')[0]}</div>
                                <div>{request.PurchaseRequestAmount}</div>
                                <div>{request.PRRequestor}</div>
                                <div>{request.PRStatus}</div>
                                <div title='Click to view Details' className='requestId hoverable' onClick={() => setPopup(<PurchaseReqPopup id={request.PurchaseReqID} reset={() => setPopup(null)} />)}>
                                    {request.PurchaseReqID}
                                </div>
                            </React.Fragment>
                        )
                    ));
                    setRequests(l);
                }
            } catch (error) {
                console.error('Error fetching purchase requests:', error);
            }
            finally {
                setLoading(false);
            }
        }

        fetchRequests();
    }, [popup]);

    return (
        <>
            {loading ? <Oval color='black' height={80} strokeWidth={5} /> :
                <div id='allInputsContent'>
                    {popup}
                    <h1>All Purchase Requests</h1>
                    <PageControls page={filter.page} setPage={(page)=>setFilter({...filter, page:page})} total={total.current} max={25} />
                    <div id="allInputsTable">
                        <div className='tableTitle'>Sl.</div>
                        <div className='tableTitle'>Project</div>
                        <div className='tableTitle'>Date</div>
                        <div className='tableTitle'>Amount</div>
                        <div className='tableTitle'>Requestor ID</div>
                        <div className='tableTitle'>Status</div>
                        <div className='tableTitle'>Request ID (details)</div>
                        {requests}
                        <div className="add hoverable" onClick={()=>setPopup(<NewPRPopup reset={()=>setPopup(null)}/>)}><FaPlus /></div>
                    </div>
                </div>
            }
        </>
    );
};

export default PurchaseReqs;