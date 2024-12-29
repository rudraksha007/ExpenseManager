import { FaEdit } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { fetchDataWithParams } from '../assets/scripts.js';
import React from 'react';
import PageControls from '../sideComponents/PageControls.jsx';
import Loading from '../assets/Loading.jsx';
import Popup from '../assets/Popup.jsx';
import CryptoJS from 'crypto-js';

function AllProfiles() {

    const [profiles, setProfiles] = useState([]);
    const [filter, setFilter] = useState({ page: 1, text: '', role: '' });
    const total = React.useRef(0);
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        getProfiles();
    }

    async function handleEdit(e) {
        setLoading(true);
        if (e.target.checkValidity()) {
            e.preventDefault();
            console.log(profile);
            let pass = CryptoJS.SHA256(profile.password).toString()
            const res = await fetchDataWithParams('editProfile', 'put', {...profile, password: pass});
            if (res.reqStatus == 'success') {
                alert('Profile Updated Successfully');
                setProfile(null);
                await getProfiles();
            }
            else {
                alert(res.message);
            }
        }
        setLoading(false);
    }

    function editProfile(edittingProfile) {
        setProfile(edittingProfile);
    }
    const getProfiles = async () => {
        setLoading(true);
        const data = await fetchDataWithParams('users', 'post', { filters: filter, count: 25 });
        if (data.reqStatus == 'success') {
            let l = [];
            total.current = data.total;
            data.users.map((profile, index) => {
                let style = {};
                if (profile.role == 'Pi') {
                    style = { backgroundColor: 'rgb(200, 200, 250)' };
                }
                else if (profile.role == 'SuperAdmin') {
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
                        <div className='allProfilesActions hoverable' style={style} onClick={(e) => { editProfile(profile) }}>
                            <FaEdit size={20} />
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
            {loading ? <Loading position={'absolute'} /> :
                <div id='allProfilesContent'>
                    {profile ? <Popup reset={() => { setProfile(null); }} title='Edit Profile'>
                        <form style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '10px' }} onSubmit={(e) => handleEdit(e)} >
                            <label>Name:</label>
                            <input type='text' name='name' placeholder='Enter your name' required value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />

                            <label>Email: &#9993;</label>
                            <input type='email' name='email' placeholder='mayank@gmail.com' required value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} />

                            <label>Employee Id:</label>
                            <input type='number' name='id' placeholder="Enter Employee Id" required min={0} value={profile.id} readOnly />

                            <label>Role:</label>
                            <select value={profile.role} onChange={(e) => setProfile({ ...profile, role: e.target.value })}>
                                <option value="JRF">JRF</option>
                                <option value="SRF">SRF</option>
                                <option value="RA">RA</option>
                                <option value="Pi">PI</option>
                                <option value="SuperAdmin">SuperAdmin</option>
                            </select>

                            <label>Password: &#128274;</label>
                            <input type='password' name='password' placeholder="Enter Password" required pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{6,}$" title="Password must be 6 characters long and contain an Upper case, smaller case and a special character" value={profile.password} onChange={(e) => setProfile({ ...profile, password: e.target.value })} />

                            <label>Basic Salary:</label>
                            <input type='number' name='BasicSalary' placeholder="Enter Basic Salary" required min={0} step="0.01" value={profile.BasicSalary} onChange={(e) => setProfile({ ...profile, BasicSalary: e.target.value })} />

                            <label>HRA Percentage:</label>
                            <input type='number' name='HRA_Percentage' placeholder="Enter HRA Percentage" required min={0} step="0.01" value={profile.HRA_Percentage} onChange={(e) => setProfile({ ...profile, HRA_Percentage: e.target.value })} />

                            <input type="submit" value="Save" />
                        </form>
                    </Popup> : null}
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
                                <option value="JRK">JRF</option>
                                <option value="SRK">SRF</option>
                                <option value="RA">RA</option>
                                <option value="Pi">PI</option>
                                <option value="SuperAdmin">Techanican</option>
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