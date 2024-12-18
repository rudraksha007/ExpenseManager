import FingerprintJS from '@fingerprintjs/fingerprintjs';

const mainUrl = '/api/';
let fpPromise = null;
let fingerPrint = null;
let data = {
    profiles: {
        profiles: [
            {
                id: 1,
                name: 'John Doe',
                role: 'Admin',
                email: 'john.doe@example.com',
                startDate: '2023-01-01',
                endDate: '2023-12-31',
                isActive: false
            },
            {
                id: 2,
                name: 'Jane Smith',
                role: 'Scientist',
                email: 'jane.smith@example.com',
                startDate: '2023-02-01',
                endDate: '',
                isActive: true
            },
            {
                id: 3,
                name: 'Alice Johnson',
                role: 'Manager',
                email: 'alice.johnson@example.com',
                startDate: '2023-03-01',
                endDate: '2023-10-31',
                isActive: false
            }
        ],
        total: 3
    },
    projects: {
        projects: [
            {
                "id": 1,
                "title": "Project A",
                "capital": 1000000,
                "fundedBy": "Investor A",
                "startDate": "2021-04-01",
                "endDate": "2021-09-30"
            },
            {
                "id": 2,
                "title": "Project B",
                "capital": 2000000,
                "fundedBy": "Investor B",
                "startDate": "2021-05-01",
                "endDate": "2021-10-30"
            },
            {
                "id": 3,
                "title": "Project C",
                "capital": 3000000,
                "fundedBy": "Investor C",
                "startDate": "2021-06-01",
                "endDate": "2021-11-30"
            }
        ],
        total: 3
    },
    indents: {
        indents: [
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
        ]
    },
    purchaseReqs: {
        purchaseReqs: [
            {
                id: 'req123',
                item: 'Laptop',
                quantity: '10',
                amount: '15000',
                status: 'Pending'
            },
            {
                id: 'req456',
                item: 'Monitor',
                quantity: '20',
                amount: '5000',
                status: 'Approved'
            },
            {
                id: 'req789',
                item: 'Keyboard',
                quantity: '50',
                amount: '2000',
                status: 'Rejected'
            }
        ]
    },
    purchaseOrders: {
        purchaseOrders: [
            {
                id: 'ord123',
                item: 'Laptop',
                quantity: '10',
                amount: '15000',
                status: 'Pending'
            },
            {
                id: 'ord456',
                item: 'Monitor',
                quantity: '20',
                amount: '5000',
                status: 'Approved'
            },
            {
                id: 'ord789',
                item: 'Keyboard',
                quantity: '50',
                amount: '2000',
                status: 'Rejected'
            }
        ]
    },
    projects_1: {
        id: "abc",
        title: "Project Title",
        totalIndent: 1000,
        fundedBy: "The fuuu",
        startDate: "Anytime",
        endDate: "Sometime",
        workers: [
            { id: "W001", name: "Worker 1" },
            { id: "W002", name: "Worker 2" },
            { id: "W003", name: "Worker 3" }
        ],
        manpower: [
            {
                id: "REQ001",
                indentId: "IND001",
                date: "2023-10-01",
                bill: 1000,
                action: "added",
                users: [
                    { id: "U001", name: "User 1", role: "Scientist" },
                    { id: "U002", name: "User 2", role: "Developer" }
                ]
            },
            {
                id: "REQ002",
                indentId: "IND002",
                date: "2023-10-02",
                bill: 2000,
                action: "removed",
                users: [
                    { id: "U001", name: "User 1", role: "Manager" },
                    { id: "U002", name: "User 2", role: "Admin" }
                ]
            },
            {
                id: "REQ003",
                indentId: "IND003",
                date: "2023-10-03",
                bill: 3000,
                billLink: "http://example.com/bill/REQ003",
                action: "added",
                users: [
                    { id: "U001", name: "User 1", role: "Manager" },
                    { id: "U002", name: "User 2", role: "Admin" }
                ]
            }
        ],
        travels: [
            {
                id: "REQ101",
                indentId: "IND101",
                date: "2023-10-11",
                bill: 1100,
                billLink: "http://example.com/bill/REQ101"
            },
            {
                id: "REQ102",
                indentId: "IND102",
                date: "2023-10-12",
                bill: 2200,
                billLink: "http://example.com/bill/REQ102"
            },
            {
                id: "REQ103",
                indentId: "IND103",
                date: "2023-10-13",
                bill: 3300,
                billLink: "http://example.com/bill/REQ103"
            }
        ],
        consumables: [
            {
                id: "REQ201",
                indentId: "IND201",
                date: "2023-10-21",
                bill: 2100,
                billLink: "http://example.com/bill/REQ201"
            },
            {
                id: "REQ202",
                indentId: "IND202",
                date: "2023-10-22",
                bill: 2200,
                billLink: "http://example.com/bill/REQ202"
            },
            {
                id: "REQ203",
                indentId: "IND203",
                date: "2023-10-23",
                bill: 2300,
                billLink: "http://example.com/bill/REQ203"
            }
        ],
        equipments: [
            {
                id: "REQ301",
                indentId: "IND301",
                date: "2023-10-31",
                bill: 3100,
                billLink: "http://example.com/bill/REQ301"
            },
            {
                id: "REQ302",
                indentId: "IND302",
                date: "2023-11-01",
                bill: 3200,
                billLink: "http://example.com/bill/REQ302"
            },
            {
                id: "REQ303",
                indentId: "IND303",
                date: "2023-11-02",
                bill: 3300,
                billLink: "http://example.com/bill/REQ303"
            }
        ],
        contingency: [
            {
                id: "REQ401",
                indentId: "IND401",
                date: "2023-11-11",
                bill: 4100,
                billLink: "http://example.com/bill/REQ401"
            },
            {
                id: "REQ402",
                indentId: "IND402",
                date: "2023-11-12",
                bill: 4200,
                billLink: "http://example.com/bill/REQ402"
            },
            {
                id: "REQ403",
                indentId: "IND403",
                date: "2023-11-13",
                bill: 4300,
                billLink: "http://example.com/bill/REQ403"
            }
        ],
        overhead: [
            {
                id: "REQ501",
                indentId: "IND501",
                date: "2023-11-21",
                bill: 5100,
                billLink: "http://example.com/bill/REQ501"
            },
            {
                id: "REQ502",
                indentId: "IND502",
                date: "2023-11-22",
                bill: 5200,
                billLink: "http://example.com/bill/REQ502"
            },
            {
                id: "REQ503",
                indentId: "IND503",
                date: "2023-11-23",
                bill: 5300,
                billLink: "http://example.com/bill/REQ503"
            }
        ],

        projectManager: "Mr. X"
    }
}
async function initialize() {
    fingerPrint = (await fpPromise.get()).visitorId;
    fpPromise = await FingerprintJS.load();
}
async function fetchData(url, method) {
    return (await fetchDataWithParams(url, method, {}));
}

async function fetchDataWithParams(url, method, data) {
    try {
        const response = await fetch('/api/' + url,
            {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ ...data, fingerPrint: fingerPrint })
            });
        const res = await response.json();
        if (!response.ok) {
            console.log('Fetch Failed');
            console.log(res.message);
            return { reqStatus: 'failed', message: res.message };
        }
        return {...res, reqStatus: 'success'};
    } catch (error) {
        console.log('There has been a problem with your fetch operation:');
        console.log(error);

        return null;
    }
}

async function fetchDataWithFileUpload(url, method, form, extraData) {
    const fileInput = Array.from(form.children).find(child => child.type === 'file');
    const formData = new FormData(form);
    if (fileInput && fileInput.files.length > 0) {
        formData.append('BillCopy', fileInput.files[0]);
    }
    if (extraData && typeof extraData === 'object') {
        Object.keys(extraData).forEach(key => {
            formData.append(key, extraData[key]);
        });
    }
    try {
        formData.append('fingerPrint', fingerPrint);
        console.log(Object.fromEntries(formData.entries()));
        
        const response = await fetch('/api/' + url, {
            method: method,
            body: formData,
        });
        const res = await response.json();
        if (!response.ok) {
            console.log('Fetch Failed');
            console.log(res.message);
            return { reqStatus: 'failed', message: res.message };
        }
        return {...res, reqStatus: 'success'};
    } catch (error) {
        console.log('There has been a problem with your fetch operation:');
        console.log(error);
        return null;
    }
}
async function autoLogin() {
    
    const res = await fetchDataWithParams('autoLogin', 'post', { fingerPrint: fingerPrint });
    if (res.reqStatus!='success') {
        return false;
    }
    return res;
}
async function login(setProfile) {
    if (!fingerPrint) {
        const fpPromise = await FingerprintJS.load();
        fingerPrint = (await fpPromise.get()).visitorId;
    }
    console.log(fingerPrint);

    const userProfile = await fetchData('login', 'post');
    if (!userProfile) {
        return false;
    }
    setProfile(userProfile);
    return true;
}

export { fetchData, login, fetchDataWithParams, autoLogin, fetchDataWithFileUpload, initialize };