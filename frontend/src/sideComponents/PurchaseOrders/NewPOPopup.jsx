import React, { useContext, useEffect, useRef, useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { Oval } from 'react-loader-spinner';
import { fetchDataWithParams } from '../../assets/scripts';
import { ProfileContext } from '../../assets/UserProfile';

function NewPOPopup({ reset, selectIndent }) {
    const [filter, setFilter] = useState({ text: '', status: '', upto: 0, above: 0, fromDate: '' });
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [render, reRender] = useState(false);
    const selectedIndent = useRef(null);
    const today = new Date().toISOString().split('T')[0];
    const [date, setDate] = useState(today);
    const { profile } = useContext(ProfileContext);

    const changeSelected = (newId) => {
        if (selectedIndent && selectedIndent.current === newId) {
            let selectedDivs = document.querySelectorAll(`.ind-${selectedIndent.current}`);
            selectedDivs.forEach((div) => {
                div.style.backgroundColor = 'rgb(222,222,222)';
            });
            selectedIndent.current = null;
            reRender(false);
            return;
        }
        reRender(true);
        const selectedDivs = selectedIndent.current ? document.querySelectorAll(`.ind-${selectedIndent.current}`) : null;
        const newSelectedDivs = document.querySelectorAll(`.ind-${newId}`);
        for (let i = 0; i < newSelectedDivs.length; i++) {
            newSelectedDivs[i].style.backgroundColor = 'rgb(222, 250, 222)';
            if (selectedDivs != null) selectedDivs[i].style.backgroundColor = 'rgb(222,222,222)';
        }
        selectedIndent.current = newId;
    }

    const fetchAll = async () => {
        setLoading(true);
        try {
            const response = await fetchDataWithParams('indents', 'post', { filters: { ...filter, status: 'PO' } });
            console.log(response);

            const mappedData = []
            response.indents.map((item, index) => (
                mappedData.push(<React.Fragment key={item.IndentID}>
                    <div className={`tableCell ind-${item.IndentID}`}>{index + 1}</div>
                    <div className={`tableCell ind-${item.IndentID}`}>{item.ProjectNo}</div>
                    <div className={`tableCell ind-${item.IndentID}`}>{item.ProjectTitle}</div>
                    <div className={`tableCell ind-${item.IndentID}`}>{item.IndentAmount}</div>
                    <div className={`tableCell hoverable ind-${item.IndentID}`} onClick={() => changeSelected(item.IndentID)}>{item.IndentID}</div>
                </React.Fragment>)
            ));
            console.log(mappedData);

            setData(mappedData);
        } catch (error) {
            console.error('Error fetching indents:', error);
        } finally {
            setLoading(false);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!e.currentTarget.checkValidity()) return;
        if (render) {
            let response = await fetchDataWithParams('purchaseOrders', 'put', { IndentID: selectedIndent.current, PODate: date, PORequestor: profile.id });
            if (response.reqStatus == 'success') {
                console.log('here');
                alert('PO Created Successfully');
                reset();
            } else {
                alert('Failed to create PO' + response.message);
            }
        } else {
            fetchAll();
        }
    };

    useEffect(() => {
        fetchAll();
    }, []);

    return (
        <div className="projectPopup">
            <div id="largePopupCont" className='projectPopupCont'>
                {loading ? <Oval color='black' height={80} strokeWidth={5} /> :
                    <>
                        <FaTimes size={30} style={{ position: 'absolute', right: 10, top: 10, cursor: 'pointer' }} onClick={(e) => reset()} />
                        <h2>Add Purchase Order</h2>
                        <form className='largePopupForm' onSubmit={handleSubmit} id='newPRForm'>
                            {render ?
                                <div id='newPRFilters'>
                                    <label>PO Date:</label>
                                    <input type="date" required max={today} value={date} onChange={(e) => setDate(e.target.value)} />
                                    <input type="submit" value="Create PO" className='hoverable tableTitle' />
                                </div>
                                :
                                <div id='newPRFilters'>
                                    <label>By Text:</label>
                                    <input type="text" placeholder="Text" value={filter.text} onChange={(e) => setFilter({ ...filter, text: e.target.value })} />
                                    <label>Upto:</label>
                                    <input type="number" placeholder="Upto" value={filter.upto} onChange={(e) => setFilter({ ...filter, upto: e.target.value })} />
                                    <label>Above:</label>
                                    <input type="number"
                                        placeholder="Above"
                                        value={filter.above}
                                        onChange={(e) => setFilter({ ...filter, above: e.target.value })}
                                    />
                                    <label>From Date:</label>
                                    <input
                                        type="date"
                                        placeholder="From Date"
                                        value={filter.fromDate}
                                        onChange={(e) => setFilter({ ...filter, fromDate: e.target.value })}
                                    />
                                    <input type="submit" className='hoverable tableTitle' value={'Apply'} />
                                </div>}
                            <div id="newPRItems">
                                <div className="tableTitle">Sl.</div>
                                <div className="tableTitle">Project No</div>
                                <div className="tableTitle">Project Title</div>
                                <div className="tableTitle">Indent Amount</div>
                                <div className="tableTitle">Indent ID</div>
                                {data}
                            </div>
                        </form>
                    </>
                }
            </div>
        </div>
    );
}

export default NewPOPopup;