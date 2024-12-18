import mysql from 'mysql2/promise';
import jwt from 'jsonwebtoken';
import { log, sendFailedResponse } from './utils.js';
import { decrypt } from './crypt.js';
let db = null;
async function connectDb() {
    try {
        db = await mysql.createConnection({
            host: 'localhost',
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME
        });
        log('Connected to MySQL database');
        const tables = [
            {
                tableName: 'Projects',
                definition: `
                    ProjectTitle VARCHAR(255) NOT NULL,
                    ProjectNo INT PRIMARY KEY,
                    FundedBy VARCHAR(255) NOT NULL,
                    ProjectStartDate DATE NOT NULL,
                    ProjectEndDate DATE,
                    SanctionOrderNo VARCHAR(255) NOT NULL,
                    TotalSanctionAmount DOUBLE,
                    PIs JSON NOT NULL,
                    CoPIs JSON NOT NULL,
                    Workers JSON NOT NULL,
                    ManpowerAllocationAmt DOUBLE,
                    ConsumablesAllocationAmt DOUBLE,
                    ContingencyAllocationAmt DOUBLE,
                    OverheadAllocationAmt DOUBLE,
                    EquipmentAllocationAmt DOUBLE,
                    TravelAllocationAmt DOUBLE,
                    UNIQUE KEY (ProjectTitle)
                `
            },
            {
                tableName: 'users',
                definition: `
                    id INT PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    email VARCHAR(255) UNIQUE KEY,
                    password VARCHAR(255) NOT NULL,
                    projects JSON,
                    status INT,
                    role ENUM('Techanican', 'JRK', 'SRK', 'RA', 'Pi', 'SuperAdmin'),
                    BasicSalary DECIMAL(10, 2),
                    HRA_Percentage DECIMAL(5, 2),
                    TotalSalary DECIMAL(10, 2) GENERATED ALWAYS AS (BasicSalary + (BasicSalary * HRA_Percentage / 100)) VIRTUAL,
                    ProfilePic LONGBLOB
            `
            },
            {
                tableName: 'Indents',
                definition: `
                    IndentID INTEGER PRIMARY KEY AUTO_INCREMENT,
                    IndentCategory VARCHAR(255),
                    ProjectNo INTEGER,
                    IndentAmount DOUBLE,
                    IndentedPersonId INT,
                    IndentDate DATE,
                    IndentStatus ENUM('Pending', 'Approved', 'Rejected', 'Completed'),
                    FOREIGN KEY (ProjectNo) REFERENCES Projects(ProjectNo),
                    FOREIGN KEY (IndentedPersonId) REFERENCES users(id)
                `
            },
            {
                tableName: 'Manpower',
                definition: `
                    IndentID INTEGER PRIMARY KEY,
                    ProjectNo INTEGER,
                    ProjectTitle VARCHAR(255),
                    EmployeeID INT,
                    Workers JSON,
                    JoiningDate DATE,
                    EndDate DATE,
                    RequestedAmt DOUBLE,
                    FOREIGN KEY (EmployeeID) REFERENCES users(id),
                    FOREIGN KEY (ProjectNo) REFERENCES Projects(ProjectNo),
                    FOREIGN KEY (ProjectTitle) REFERENCES Projects(ProjectTitle),
                    FOREIGN KEY (IndentID) REFERENCES Indents(IndentID)
                `
            },
            {
                tableName: 'Travel',
                definition: `
                    IndentID INTEGER PRIMARY KEY,
                    ProjectNo INTEGER,
                    RequestedAmt DOUBLE,
                    EmployeeID INT,
                    Source VARCHAR(255),
                    FromDate DATE,
                    Destination VARCHAR(255),
                    DestinationDate DATE,
                    Reason VARCHAR(255),
                    Remark VARCHAR(1000),
                    RequestedDate DATE,
                    Traveler INT,
                    BillCopy JSON, 
                    FOREIGN KEY (EmployeeID) REFERENCES users(id),
                    FOREIGN KEY (Traveler) REFERENCES users(id),
                    FOREIGN KEY (ProjectNo) REFERENCES Projects(ProjectNo),
                    FOREIGN KEY (IndentID) REFERENCES Indents(IndentID)
                `
            },
            {
                tableName: 'Consumables',
                definition: `
                    IndentID INTEGER PRIMARY KEY,
                    ProjectNo INTEGER,
                    ProjectTitle VARCHAR(255),
                    RequestedAmt DOUBLE,
                    EmployeeID INT,
                    Reason VARCHAR(255),
                    Remark VARCHAR(1000),
                    RequestedDate DATE,
                    BillCopy JSON,
                    FOREIGN KEY (EmployeeID) REFERENCES users(id),
                    FOREIGN KEY (ProjectNo) REFERENCES Projects(ProjectNo),
                    FOREIGN KEY (ProjectTitle) REFERENCES Projects(ProjectTitle),
                    FOREIGN KEY (IndentID) REFERENCES Indents(IndentID)
                `
            },
            {
                tableName: 'Overhead',
                definition: `
                    RequestID INTEGER PRIMARY KEY,
                    ProjectNo INTEGER,
                    ProjectTitle VARCHAR(255),
                    RequestedAmt DOUBLE,
                    EmployeeID INT,
                    Reason VARCHAR(255),
                    IndentID INTEGER,
                    RequestedDate DATE,
                    BillCopy JSON,
                    FOREIGN KEY (EmployeeID) REFERENCES users(id),
                    FOREIGN KEY (ProjectNo) REFERENCES Projects(ProjectNo),
                    FOREIGN KEY (ProjectTitle) REFERENCES Projects(ProjectTitle),
                    FOREIGN KEY (IndentID) REFERENCES Indents(IndentID)
                `
            },
            {
                tableName: 'Equipment',
                definition: `
                    IndentID INTEGER PRIMARY KEY,
                    ProjectNo INTEGER,
                    ProjectTitle VARCHAR(255),
                    RequestedAmt DOUBLE,
                    EmployeeID INT,
                    Reason VARCHAR(255),
                    RequestedDate DATE,
                    Items JSON,
                    Remark VARCHAR(1000),
                    BillCopy JSON,
                    FOREIGN KEY (EmployeeID) REFERENCES users(id),
                    FOREIGN KEY (ProjectNo) REFERENCES Projects(ProjectNo),
                    FOREIGN KEY (ProjectTitle) REFERENCES Projects(ProjectTitle),
                    FOREIGN KEY (IndentID) REFERENCES Indents(IndentID)
                `
            },
            {
                tableName: 'Contingency',
                definition: `
                    IndentID INTEGER PRIMARY KEY,
                    ProjectNo INTEGER,
                    ProjectTitle VARCHAR(255),
                    RequestedAmt DOUBLE,
                    EmployeeID INT,
                    Reason VARCHAR(255),
                    RequestedDate DATE,
                    Remark VARCHAR(1000),
                    BillCopy JSON,
                    FOREIGN KEY (EmployeeID) REFERENCES users(id),
                    FOREIGN KEY (ProjectNo) REFERENCES Projects(ProjectNo),
                    FOREIGN KEY (ProjectTitle) REFERENCES Projects(ProjectTitle),
                    FOREIGN KEY (IndentID) REFERENCES Indents(IndentID)
                `
            }
        ];
        // Queries to create tables if they don't exist
        await (async () => { // async is required to print the logs in correct order
            for (const table of tables) {
                try {
                    await db.query(`CREATE TABLE IF NOT EXISTS ${table.tableName} (${table.definition})`).then(() => {
                        log(`Table binded: ${table.tableName}`);
                    });
                } catch (err) {
                    log(`Error binding table: ${err}`);
                    log('Exiting...');
                    process.exit(1);
                }
            }
            await db.query(`INSERT IGNORE INTO users (id, name, email, password, projects, status, role) VALUES (0, 'root', '${process.env.ROOT_ID}', '${process.env.ROOT_PASSWORD}', '[]', 1, 'root')`);
            await db.query('DROP VIEW IF EXISTS ProjectAllocationSummary;');
            await db.query(`
                CREATE VIEW ProjectAllocationSummary AS
                SELECT 
                    p.*,
                    p.ManpowerAllocationAmt - IFNULL(SUM(mp.RequestedAmt), 0) AS RemainingManpowerAmt,
                    p.TravelAllocationAmt - IFNULL(SUM(t.RequestedAmt), 0) AS RemainingTravelAmt,
                    p.ConsumablesAllocationAmt - IFNULL(SUM(c.RequestedAmt), 0) AS RemainingConsumablesAmt,
                    p.ContingencyAllocationAmt - IFNULL(SUM(ct.RequestedAmt), 0) AS RemainingContingencyAmt,
                    p.OverheadAllocationAmt - IFNULL(SUM(o.RequestedAmt), 0) AS RemainingOverheadAmt,
                    p.EquipmentAllocationAmt - IFNULL(SUM(e.RequestedAmt), 0) AS RemainingEquipmentAmt
                FROM 
                    Projects p
                LEFT JOIN 
                    Manpower mp ON p.ProjectNo = mp.ProjectNo
                LEFT JOIN 
                    Travel t ON p.ProjectNo = t.ProjectNo
                LEFT JOIN 
                    Consumables c ON p.ProjectNo = c.ProjectNo
                LEFT JOIN 
                    Contingency ct ON p.ProjectNo = ct.ProjectNo
                LEFT JOIN 
                    Overhead o ON p.ProjectNo = o.ProjectNo
                LEFT JOIN 
                    Equipment e ON p.ProjectNo = e.ProjectNo
                GROUP BY 
                    p.ProjectNo, p.ProjectTitle, 
                    p.ManpowerAllocationAmt, p.TravelAllocationAmt, 
                    p.ConsumablesAllocationAmt, p.ContingencyAllocationAmt, 
                    p.OverheadAllocationAmt, p.EquipmentAllocationAmt;
            `);
            log('ProjectAllocationSummary view created');
            log('SQL Binding Complete');
        })();
        return db;
    } catch (err) {
        log('Error connecting to MySQL database:' + err);
        process.exit(1);
    }
}

function authenticate(req, res, next) {
    const token = req.cookies.token;
    if (!token && req.path !== '/api/login')
        return res.status(401).json({ message: 'Access denied' }); // If token is not present and path is not for login
    if (!token && req.path === '/api/login') return next(); // If token is not present and path is for login
    jwt.verify(decrypt(token, req.body.fingerPrint), process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
            // If token is invalid=> delete token from client side since it's probably expired
            res.clearCookie('token');
            return res.status(401).json({ message: 'Access denied' });
        }
        req.processed = { token: decoded };
        next();
    });
};

async function generateReport(reportType) {
    let query = '';

    if (reportType === 'general') {
        query = `
            SELECT 
                p.ProjectNo, 
                p.ProjectTitle,
                p.TotalSanctionAmount,
                COALESCE(SUM(i.IndentAmount), 0) AS TotalIndentAmount,
                (p.TotalSanctionAmount - COALESCE(SUM(i.IndentAmount), 0)) AS RemainingAmount
            FROM 
                Projects p
            LEFT JOIN 
                Indents i ON p.ProjectNo = i.ProjectNo
            GROUP BY 
                p.ProjectNo, p.ProjectTitle, p.TotalSanctionAmount;
        `;
    } else if (reportType === 'category') {
        query = `
            SELECT 
                p.ProjectNo, 
                p.ProjectTitle,
                p.TotalSanctionAmount,
                COALESCE(SUM(p.ManpowerAllocationAmt), 0) AS ManpowerUsed,
                COALESCE(SUM(p.ConsumablesAllocationAmt), 0) AS ConsumablesUsed,
                COALESCE(SUM(p.ContingencyAllocationAmt), 0) AS ContingencyUsed,
                COALESCE(SUM(p.OverheadAllocationAmt), 0) AS OverheadUsed,
                COALESCE(SUM(p.EquipmentAllocationAmt), 0) AS EquipmentUsed,
                COALESCE(SUM(p.TravelAllocationAmt), 0) AS TravelUsed,
                (p.TotalSanctionAmount - (
                    COALESCE(SUM(p.ManpowerAllocationAmt), 0) + 
                    COALESCE(SUM(p.ConsumablesAllocationAmt), 0) + 
                    COALESCE(SUM(p.ContingencyAllocationAmt), 0) + 
                    COALESCE(SUM(p.OverheadAllocationAmt), 0) + 
                    COALESCE(SUM(p.EquipmentAllocationAmt), 0) + 
                    COALESCE(SUM(p.TravelAllocationAmt), 0)
                )) AS RemainingAmount
            FROM 
                Projects p
            GROUP BY 
                p.ProjectNo, p.ProjectTitle, p.TotalSanctionAmount;
        `;
    }

    return db.query(query).then(([rows]) => rows);
}

function authorize(allowedRoles) {
    return (req, res, next) => {
        if (!allowedRoles.includes(req.processed.token.role) && req.processed.token.role !== 'root') {
            return res.status(403).json({ message: 'Permission denied' });
        }
        console.log(req.processed.token.role);
        next();
    };
};

const projectWiseAuthorisation = (req, res, next) => {
    if (req.processed.token.role != 'root' && req.processed.token.role != 'SuperAdmin') {

        getFromDb('users', ['projects'], `id=${req.processed.token.id}`).then((projects) => {
            if (projects.length == 0) {
                return sendFailedResponse(res, 'Permission denied', 403);
            }

            projects = projects[0].projects;
            let arr = [];
            projects.forEach(ele => arr.push(Number(ele)))
            req.processed.allowedProjects = arr;
            next();
            return;
        }).catch((err) => {
            return sendFailedResponse(res, err.message, 500);
        });
    }
    else {

        getFromDb('Projects', ['ProjectNo']).then((projects) => {
            let arr = [];
            projects.forEach(project => {
                arr.push(project.ProjectNo);
            });
            req.processed.allowedProjects = arr;
            console.log(arr);

            next();
        }).catch((err) => {
            return sendFailedResponse(res, err.message, 500);
        });
    }

};
async function getFromDb(table, fields, where) {
    let query = `SELECT ${fields.join(',')} FROM ${table}`;
    if (where) query += ` WHERE ${where}`;
    return db.query(query).then(([rows]) => rows);

}

async function updateAtDb(table, fieldsDictionary, where) {
    let fields = Object.entries(fieldsDictionary).map(([key, value]) => `${key}='${value}'`).join(', ');
    let wheres = Object.entries(where).map(([key, value]) => `${key}='${value}'`).join(' AND ');
    console.log(fields + ' WHERE ' + wheres);
    return db.query(`UPDATE ${table} SET ${fields} WHERE ${wheres}`);
}
export { db, authenticate, authorize, connectDb, getFromDb, projectWiseAuthorisation, updateAtDb };