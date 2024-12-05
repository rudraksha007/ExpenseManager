
const mainUrl = 'http://localhost:8000/api/';

let data = {
    profiles: {
        profiles:[
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
        ]
    },
    projects:{
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
        ]
    },
    indents:{
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
    purchaseReqs:{
        purchaseReqs:[
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
    purchaseOrders:{
        purchaseOrders:[
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
    projects_1:{
        id: "abc",
        title: "Project Title",
        totalIndent: 1000,
        fundedBy: "The fuuu",
        startDate: "Anytime",
        endDate: "Sometime",
        manpower: [
            {
                id: "REQ001",
                indentId: "IND001",
                date: "2023-10-01",
                bill: 1000
            },
            {
                id: "REQ002",
                indentId: "IND002",
                date: "2023-10-02",
                bill: 2000
            },
            {
                id: "REQ003",
                indentId: "IND003",
                date: "2023-10-03",
                bill: 3000
            }
        ],
        travels: [
            {
                id: "REQ101",
                indentId: "IND101",
                date: "2023-10-11",
                bill: 1100
            },
            {
                id: "REQ102",
                indentId: "IND102",
                date: "2023-10-12",
                bill: 2200
            },
            {
                id: "REQ103",
                indentId: "IND103",
                date: "2023-10-13",
                bill: 3300
            }
        ],
        consumables: [
            {
                id: "REQ201",
                indentId: "IND201",
                date: "2023-10-21",
                bill: 2100
            },
            {
                id: "REQ202",
                indentId: "IND202",
                date: "2023-10-22",
                bill: 2200
            },
            {
                id: "REQ203",
                indentId: "IND203",
                date: "2023-10-23",
                bill: 2300
            }
        ],
        equipments: [
            {
                id: "REQ301",
                indentId: "IND301",
                date: "2023-10-31",
                bill: 3100
            },
            {
                id: "REQ302",
                indentId: "IND302",
                date: "2023-11-01",
                bill: 3200
            },
            {
                id: "REQ303",
                indentId: "IND303",
                date: "2023-11-02",
                bill: 3300
            }
        ],
        contingency: [
            {
                id: "REQ401",
                indentId: "IND401",
                date: "2023-11-11",
                bill: 4100
            },
            {
                id: "REQ402",
                indentId: "IND402",
                date: "2023-11-12",
                bill: 4200
            },
            {
                id: "REQ403",
                indentId: "IND403",
                date: "2023-11-13",
                bill: 4300
            }
        ],
        overhead: [
            {
                id: "REQ501",
                indentId: "IND501",
                date: "2023-11-21",
                bill: 5100
            },
            {
                id: "REQ502",
                indentId: "IND502",
                date: "2023-11-22",
                bill: 5200
            },
            {
                id: "REQ503",
                indentId: "IND503",
                date: "2023-11-23",
                bill: 5300
            }
        ],
        projectManager: "Mr. X"
    }
}
async function fetchData(url) {
    try {
        // const response = await fetch(mainUrl + url, {method: 'POST', headers: 'application/json', credentials: 'include'});
        // const data = await response.json();
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return data[url.replace('/', '_')];
    } catch (error) {
        // console.error('There has been a problem with your fetch operation:', error);
        console.log('There has been a problem with your fetch operation:');
        return null;
    }
}
let userProfile = {
    username: 'rudra',
    rank: 'superadmin',
    projects: {
        active: ['Project A', 'Project B', 'Project C'],
        completed: ['Project D', 'Project E', 'Project F']
    }

}
// let userProfile = null;
async function login(setProfile) {
    // const userProfile = await fetchData('login');
    // console.log(userProfile);
    if (!userProfile) {
        return false;
    }
    setProfile(userProfile);
    return true;
}

export { fetchData, login };