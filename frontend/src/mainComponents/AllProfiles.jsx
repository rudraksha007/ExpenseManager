import { Link } from 'react-router-dom';
import { FaInfoCircle, FaEdit } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { fetchData } from '../assets/scripts.js';
import React from 'react';

function AllProfiles() {

    const [profiles, setProfiles] = useState([]);

    useEffect(() => {
        async function getProfiles() {
            const data = await fetchData('profiles');
            if (data) {
                let l = [];
                data.profiles.map((profile, index) => {
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
                            <div style={style}>{profile.startDate}</div>
                            <div style={style}>{profile.isActive ? 'Active' : profile.endDate}</div>
                            <div className='allProfilesActions' style={style}>
                                <Link to={`/profiles/${profile.id}`} title="View Profile Details"><FaInfoCircle size={20} /></Link>
                                <Link to={`/profiles/edit/${profile.id}`} title="Edit Profile"><FaEdit size={20} /></Link>
                            </div>
                        </React.Fragment>
                    )
                });
                setProfiles(l);
            }
        }
        getProfiles();
    }, []);
    return (
        <div id='allProfilesContent'>
            <h1>Profiles</h1>
            <div id="filters">
                <label>
                    Search:
                    <input type="text" placeholder="Search" />
                </label>
                <label>
                    Role:
                    <select name="role" id="role">
                        <option value="all">All</option>
                        <option value="Developer">Developer</option>
                        <option value="Designer">Designer</option>
                        <option value="Manager">Manager</option>
                    </select>
                </label>
                <label><input type="button" value="Apply" id='applyFilter' /></label>
            </div>
            <div id="allProfilesTable">
                <div className='allProfilesTableTitle'>Sl.</div>
                <div className='allProfilesTableTitle'>Name</div>
                <div className='allProfilesTableTitle'>Role</div>
                <div className='allProfilesTableTitle'>Email</div>
                <div className='allProfilesTableTitle'>Start Date</div>
                <div className='allProfilesTableTitle'>End Date</div>
                <div className='allProfilesTableTitle'>Action</div>
                {profiles}
            </div>
        </div>
    )
}

export default AllProfiles;