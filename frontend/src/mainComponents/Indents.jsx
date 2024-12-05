import React, { useEffect, useRef } from 'react';
import '../css/Requests.css';
import IndentPopup from '../sideComponents/IndentPopup';
import { FaPlus } from 'react-icons/fa';
import { Oval } from 'react-loader-spinner';
import PageControls from '../sideComponents/PageControls';
import { fetchData } from '../assets/scripts';

function Indents() {
    const [popup, setPopup] = React.useState(<></>);
    const [indents, setIndents] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const total = useRef(0);
    const[page, setPage] = React.useState(1);
    useEffect(() => {
        document.title = 'All Indents';
        async function fetchIndents() {
            try {
                
                const data = await fetchData('indents');
                total.current = data.indents.length;
                let l = [];
                console.log(data.indents);
                
                data.indents.map((indent, index) => (
                    l.push(
                        <React.Fragment key={indent.id}>
                            <div>{index + 1}</div>
                            <div>{indent.projectNo}</div>
                            <div>{indent.title}</div>
                            <div>{indent.amount}</div>
                            <div>{indent.status}</div>
                            <div title='Click to view Details' className='indentId hoverable' onClick={() => setPopup(<IndentPopup id={indent.id} reset={() => setPopup(<></>)} />)}>
                                {indent.id}
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