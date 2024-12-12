import React, { useEffect, useRef, useState } from 'react';
import '../css/Requests.css';
import IndentPopup from '../sideComponents/projectPage/IndentPopup';
import { FaPlus } from 'react-icons/fa';
import { Oval } from 'react-loader-spinner';
import PageControls from '../sideComponents/PageControls';
import { fetchData, fetchDataWithParams } from '../assets/scripts';

function Indents() {
    const [popup, setPopup] = React.useState(<></>);
    const [indents, setIndents] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [filter, setFilter] = useState({page:1, name:'', status:'all', fundedBy:'all', fromDate:'', toDate:''});

    const total = useRef(0);
    const[page, setPage] = React.useState(1);
    useEffect(() => {
        document.title = 'All Indents';
        async function fetchIndents() {
            try {
                const data = await fetchDataWithParams('indents', 'post', {filters:filter, count: 25});
                total.current = data.indents.length;
                let l = [];
                console.log(data.indents);
                
                data.indents.map((indent, index) => (
                    l.push(
                        <React.Fragment key={indent.IndentID}>
                            <div>{index + 1}</div>
                            <div>{indent.ProjectNo}</div>
                            <div>{indent.IndentCategory}</div>
                            <div>{indent.IndentAmount}</div>
                            <div>{indent.IndentStatus}</div>
                            <div title='Click to view Details' className='indentId hoverable' onClick={() => setPopup(<IndentPopup id={indent.IndentID} reset={() => setPopup(<></>)} />)}>
                                {indent.IndentID}
                            </div>
                        </React.Fragment>
                    )
                ));
                setIndents(l);
            } catch (error) {
                console.error('Error fetching indents:', error);
            }
            finally{
                setLoading(false);
            }
        }

        fetchIndents();
    }, []);
    return (
        <>
            {loading ? <Oval color='black' height={80} strokeWidth={5}/> :
                <div id='allInputsContent'>
                    {popup}
                    <h1>All Indents</h1>
                    <PageControls page={page} setPage={setPage} total={total.current} max={25}/>
                    <div id="allInputsTable">
                        <div className='allInputsTableTitle'>Sl.</div>
                        <div className='allInputsTableTitle'>Project No</div>
                        <div className='allInputsTableTitle'>Title</div>
                        <div className='allInputsTableTitle'>Indent Amount</div>
                        <div className='allInputsTableTitle'>Indent Status</div>
                        <div className='allInputsTableTitle'>Indent ID (details) </div>
                        {indents}
                        <div className="add hoverable"><FaPlus /></div>
                    </div>
                </div>
            }
        </>
    );
};

export default Indents;