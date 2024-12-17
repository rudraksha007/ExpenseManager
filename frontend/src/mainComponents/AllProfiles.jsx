import { Link } from 'react-router-dom';
import { FaEdit } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { fetchDataWithParams } from '../assets/scripts.js';
import React from 'react';
import PageControls from '../sideComponents/PageControls.jsx';
import { Oval } from 'react-loader-spinner';

function AllProfiles() {

    const [profiles, setProfiles] = useState([]);
    const [filter, setFilter] = useState({ page: 1, text: '', role: '' });
    const total = React.useRef(0);
    const [loading, setLoading] = useState(true);

    const handleSubmit = (e) => {
        e.preventDefault();
        getProfiles();
    }
    const getProfiles = async () => {
        setLoading(true);
        const data = await fetchDataWithParams('users', 'post', { filters: filter, count: 25 });
        if (data.reqStatus == 'success') {
            let l = [];
            total.current = data.total;
            data.users.map((profile, index) => {
                let style = {};
                if (profile.role == 'Manager') {
                    style = { backgroundColor: 'rgb(200, 200, 250)' };
                }
                else if (profile.role == 'Admin') {
                    style = { backgroundColor: 'rgb(250, 200, 200)' };
                }
                l.push(
                    <React.Fragment key={profile.id}>
                        <div style={style}>{index + 1}</div>
                        <div style={style}>{profile.name}</div>
                        <div style={style}>{profile.role}</div>
                        <div style={style}>{profile.email}</div>
                        <div style={style}>{profile.id}</div>
                        <div style={style}>{profile.projects.length}</div>
                        <div className='allProfilesActions' style={style}>
                            <Link to={`/profiles/${profile.id}`} title="View Profile Details"><FaEdit size={20} /></Link>
                        </div>
                    </React.Fragment>
                )
            });
            setProfiles(l);
        }
        setLoading(false);
    }
    useEffect(() => {
        document.title = 'All Profiles';
        getProfiles();
    }, []);
    return (
        <>
            {loading ? <Oval color='black' height={80} strokeWidth={5} /> :
                <div id='allProfilesContent'>
                    <h1>Profiles</h1>
                    <PageControls page={filter.page}
                        setPage={(newPage) => setFilter({ ...filter, page: newPage })} total={total.current} max={25} />
                    <form id="filters" onSubmit={(e) => handleSubmit(e)}>
                        <label>
                            Search:
                            <input type="text" placeholder="Search" name='text' value={filter.text} onChange={(e) => setFilter({ ...filter, text: e.target.value })} />
                        </label>
                        <label>
                            Role:
                            <select name="role" id="role" value={filter.role} onChange={(e) => setFilter({ ...filter, role: e.currentTarget.value })}>
                                <option value="" >All</option>
                                <option value="Pi">PI</option>
                                <option value="Scientist">Scientist</option>
                                <option value="Admin">Admin</option>
                                <option value="SuperAdmin">Super Admin</option>
                            </select>
                        </label>
                        <label><input type="submit" value="Apply" id='applyFilter' /></label>
                    </form>
                    <div id="allProfilesTable" className='table'>
                        <div className='tableTitle'>Sl.</div>
                        <div className='tableTitle'>Name</div>
                        <div className='tableTitle'>Role</div>
                        <div className='tableTitle'>Email</div>
                        <div className='tableTitle'>Emp Id</div>
                        <div className='tableTitle'>Projects</div>
                        <div className='tableTitle'>Action</div>
                        {profiles}
                    </div>
                </div>}
        </>
    )
}

export default AllProfiles;