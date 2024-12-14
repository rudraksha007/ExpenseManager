import React, { useEffect, useRef, useState } from 'react';
import '../css/Requests.css';
import IndentPopup from '../sideComponents/projectPage/IndentPopup';
import { Oval } from 'react-loader-spinner';
import PageControls from '../sideComponents/PageControls';
import { fetchDataWithParams } from '../assets/scripts';

function Indents() {
    const [popup, setPopup] = React.useState(null);
    const [indents, setIndents] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [filter, setFilter] = useState({page:1, text:'', status:'', fundedBy:'', fromDate:'', toDate:'', upto:0, above:0});

    const total = useRef(0);
    const[page, setPage] = React.useState(1);
    useEffect(() => {
        document.title = 'All Indents';
        if(popup) return;
        async function fetchIndents() {
            try {
                setLoading(true);
                const data = await fetchDataWithParams('indents', 'post', {filters:filter, count: 25});
                total.current = data.indents.length;
                let l = [];
                console.log(data.indents);
                
                data.indents.map((indent, index) => {
                    let color = {};
                    switch (indent.IndentStatus) {
                        case 'Approved':
                            color = { backgroundColor: 'rgb(200, 250, 200)' };
                            break;
                        case 'Rejected':
                            color = { backgroundColor: 'rgb(250, 200, 200)' };
                            break;
                        default:
                            color = {};
                            break;
                    }
                    l.push(
                        <React.Fragment key={indent.IndentID}>
                            <div style={color}>{index + 1}</div>
                            <div style={color}>{indent.ProjectNo}</div>
                            <div style={color}>{indent.ProjectTitle}</div>
                            <div style={color}>{indent.IndentAmount}</div>
                            <div style={color}>{indent.IndentStatus}</div>
                            <div style={color} title='Click to view Details' className='indentId hoverable' onClick={() => setPopup(<IndentPopup id={indent.IndentID} reset={() => setPopup(null)} />)}>
                                {indent.IndentID}
                            </div>
                        </React.Fragment>
                    )
            });
                setIndents(l);
            } catch (error) {
                console.error('Error fetching indents:', error);
            }
            finally{
                setLoading(false);
            }
        }

        fetchIndents();
    }, [popup, filter]);
    return (
        <>
            {loading ? <Oval color='black' height={80} strokeWidth={5}/> :
                <div id='allInputsContent'>
                    {popup}
                    <h1>All Indents</h1>
                    <PageControls page={page} setPage={setPage} total={total.current} max={25}/>
                    <div id="indentsTable" className='table'>
                        <div className='tableTitle'>Sl.</div>
                        <div className='tableTitle'>Project No</div>
                        <div className='tableTitle'>Project Title</div>
                        <div className='tableTitle'>Indent Amount</div>
                        <div className='tableTitle'>Indent Status</div>
                        <div className='tableTitle'>Indent ID (details) </div>
                        {indents}
                        {/* <div className="add hoverable"><FaPlus /></div> */}
                    </div>
                </div>
            }
        </>
    );
};

export default Indents;