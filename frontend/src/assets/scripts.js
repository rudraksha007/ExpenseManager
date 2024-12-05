
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
    }
}
async function fetchData(url) {
    try {
        // const response = await fetch(mainUrl + url);
        // const data = await response.json();
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return data[url];
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