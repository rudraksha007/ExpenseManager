import mysql from 'mysql2/promise';
import jwt from 'jsonwebtoken';
import { log } from './utils.js';
import { decrypt } from './crypt.js';
let db = null;
async function connectDb() {
    try {
        db = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'Aman@2006',
            database: 'ils_db'
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
                    PIName VARCHAR(255) NOT NULL,
                    CoPIs VARCHAR(255) NOT NULL,
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
                tableName: 'Indents',
                definition: `
                    IndentID INTEGER PRIMARY KEY,
                    IndentCategory VARCHAR(255),
                    ProjectNo INTEGER,
                    IndentAmount DOUBLE,
                    IndentedPerson VARCHAR(255),
                    IndentStatus VARCHAR(255),
                    FOREIGN KEY (ProjectNo) REFERENCES Projects(ProjectNo)
                `
            },
            {
                tableName: 'PurchaseRequests',
                definition: `
                    PurchaseReqID INT PRIMARY KEY,
                    PRDate DATE,
                    ProjectNo INT,
                    IndentID INT,
                    PurchaseRequestAmount DOUBLE,
                    PRRequestor VARCHAR(255),
                    PRStatus VARCHAR(255),
                    FOREIGN KEY (ProjectNo) REFERENCES Projects(ProjectNo),
                    FOREIGN KEY (IndentID) REFERENCES Indents(IndentID)
                `
            },
            {
                tableName: 'PurchaseOrders',
                definition: `
                    PurchaseOrderID INTEGER PRIMARY KEY,
                    PODate DATE,
                    ProjectNo INTEGER,
                    PurchaseReqID INTEGER,
                    PurchaseOrderAmount DOUBLE,
                    PORequestor VARCHAR(255),
                    POStatus VARCHAR(255),
                    FOREIGN KEY (ProjectNo) REFERENCES Projects(ProjectNo),
                    FOREIGN KEY (PurchaseReqID) REFERENCES PurchaseRequests(PurchaseReqID)
                `
            },
            {
                tableName: 'Manpower',
                definition: `
                    ManpowerID INT PRIMARY KEY,
                    ProjectNo INT,
                    ProjectTitle VARCHAR(255),
                    ManpowerRequestedAmt DOUBLE,
                    IndentID INT,
                    RequestedDate Date,
                    BillCopyManpower BLOB,
                    FOREIGN KEY (ProjectNo) REFERENCES Projects(ProjectNo),
                    FOREIGN KEY (ProjectTitle) REFERENCES Projects(ProjectTitle),
                    FOREIGN KEY (IndentID) REFERENCES Indents(IndentID)
                `
            },
            {
                tableName: 'Consumables',
                definition: `
                    ConsumablesID INT PRIMARY KEY,
                    ProjectNo INT,
                    ProjectTitle VARCHAR(255),
                    ConsumablesRequestedAmt DOUBLE,
                    IndentID INT,
                    RequestedDate Date,
                    BillCopy BLOB,
                    FOREIGN KEY (ProjectNo) REFERENCES Projects(ProjectNo),
                    FOREIGN KEY (ProjectTitle) REFERENCES Projects(ProjectTitle),
                    FOREIGN KEY (IndentID) REFERENCES Indents(IndentID)
                `
            },
            {
                tableName: 'Travel',
                definition: `
                    TravelID INTEGER PRIMARY KEY,
                    ProjectNo INTEGER,
                    ProjectTitle VARCHAR(255),
                    TravelRequestedAmt DOUBLE,
                    IndentID INTEGER,
                    RequestedDate Date,
                    BillCopy BLOB,
                    FOREIGN KEY (ProjectNo) REFERENCES Projects(ProjectNo),
                    FOREIGN KEY (ProjectTitle) REFERENCES Projects(ProjectTitle),
                    FOREIGN KEY (IndentID) REFERENCES Indents(IndentID)
                `
            },
            {
                tableName: 'Overhead',
                definition: `
                    OverheadID INTEGER PRIMARY KEY,
                    ProjectNo INTEGER,
                    ProjectTitle VARCHAR(255),
                    OverheadRequestedAmt DOUBLE,
                    IndentID INTEGER,
                    RequestedDate Date,
                    BillCopy BLOB,
                    FOREIGN KEY (ProjectNo) REFERENCES Projects(ProjectNo),
                    FOREIGN KEY (ProjectTitle) REFERENCES Projects(ProjectTitle),
                    FOREIGN KEY (IndentID) REFERENCES Indents(IndentID)
                `
            },
            {
                tableName: 'Equipment',
                definition: `
                    EquipmentID INTEGER PRIMARY KEY,
                    ProjectNo INTEGER,
                    ProjectTitle VARCHAR(255),
                    EquipmentRequestedAmt DOUBLE,
                    IndentID INTEGER,
                    RequestedDate Date,
                    BillCopy BLOB,
                    FOREIGN KEY (ProjectNo) REFERENCES Projects(ProjectNo),
                    FOREIGN KEY (ProjectTitle) REFERENCES Projects(ProjectTitle),
                    FOREIGN KEY (IndentID) REFERENCES Indents(IndentID)
                `
            },
            {
                tableName: 'Contingency',
                definition: `
                    ContingencyID INTEGER PRIMARY KEY,
                    ProjectNo INTEGER,
                    ProjectTitle VARCHAR(255),
                    ContingencyRequestedAmt DOUBLE,
                    IndentID INTEGER,
                    RequestedDate Date,
                    BillCopy BLOB,
                    FOREIGN KEY (ProjectNo) REFERENCES Projects(ProjectNo),
                    FOREIGN KEY (ProjectTitle) REFERENCES Projects(ProjectTitle),
                    FOREIGN KEY (IndentID) REFERENCES Indents(IndentID)
                `
            },
            {
                tableName: 'users',
                definition: `
                id INT PRIMARY KEY,
                name VARCHAR(255),
                email VARCHAR(255) UNIQUE KEY,
                password VARCHAR(255),
                projects JSON,
                status INT,
                role VARCHAR(255)
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
                }
            }
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
    if (!token && req.path === '/api/login' ) return next(); // If token is not present and path is for login
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

function authorize(allowedRoles) {
    return (req, res, next) => {
        console.log(req.processed.token.role);
        if (!allowedRoles.includes(req.processed.token.role)&& req.processed.token.role!=='root') {
            return res.status(403).json({ message: 'Permission denied' });
        }
        next();
    };
};

const projectWiseAuthorisation = (req, res, next) => {
    if (req.processed.token.role == 'root') {
        next();
        return;
    }
    
};
async function getFromDb(table, fields, where) {
    let query = `SELECT ${fields.join(',')} FROM ${table}`;
    if (where) query += ` WHERE ${where}`;
    return db.query(query).then(([rows]) => rows);

}
export { db, authenticate, authorize, connectDb,getFromDb };