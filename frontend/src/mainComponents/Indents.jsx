import React, { useEffect } from 'react';
import '../css/Requests.css';
import IndentPopup from '../sideComponents/IndentPopup';

function Indents() {
    const [popup, setPopup] = React.useState(<></>);
    const [indents, setIndents] = React.useState([]);
    useEffect(() => {
        document.title = 'All Indents';
        async function fetchIndents() {
            try {
                // const response = await fetch('/api/indents');
                // const data = await response.json();
                const data = [
                    {
                        id: '554sdssafese',
                        projectNo: '123',
                        title: 'Project1',
                        amount: '1000',
                        status: 'Pending'
                    },
                    {
                        id: 'abc123',
                        projectNo: '124',
                        title: 'Project2',
                        amount: '2000',
                        status: 'Approved'
                    },
                    {
                        id: 'def456',
                        projectNo: '125',
                        title: 'Project3',
                        amount: '3000',
                        status: 'Rejected'
                    }
                ];
                let l = [];
                data.map((indent, index) => (
                    l.push(
                        <div className="allInputsTable" key={indent.id}>
                            <div>{index + 1}</div>
                            <div>{indent.projectNo}</div>
                            <div>{indent.title}</div>
                            <div>{indent.amount}</div>
                            <div>{indent.status}</div>
                            <div title='Click to view Details' className='indentId hoverable' onClick={() => setPopup(<IndentPopup id={indent.id} reset={() => setPopup(<></>)} />)}>
                                {indent.id}
                            </div>
                        </div>
                    )
                ));
                setIndents(l);
            } catch (error) {
                console.error('Error fetching indents:', error);
            }
        }

        fetchIndents();
    }, []);
    return (
        <div id='allInputsContent'>
            {popup}
            <h1>All Indents</h1>
            <div id="allInputsTitle">
                <div>Sl.</div>
                <div>Project No</div>
                <div>Title</div>
                <div>Indent Amount</div>
                <div>Indent Status</div>
                <div>Indent ID (details) </div>

            </div>
            {indents}
        </div>
    );
};

export default Indents;