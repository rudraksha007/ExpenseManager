import mysql from 'mysql2/promise';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { log } from './utils.js';
import { autoLogin } from './callbacks/postReqs.js';
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
                    ProjectTitle VARCHAR(255),
                    ProjectNo INT PRIMARY KEY,
                    ProjectStartDate DATE,
                    ProjectEndDate DATE,
                    SanctionOrderNo VARCHAR(255),
                    TotalSanctionAmount DOUBLE,
                    PIName VARCHAR(255),
                    CoPIs VARCHAR(255),
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
                    RequestedMonth VARCHAR(255),
                    RequestedYear VARCHAR(255),
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
                    RequestedMonth VARCHAR(255),
                    RequestedYear VARCHAR(255),
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
                    RequestedMonth VARCHAR(255),
                    RequestedYear VARCHAR(255),
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
                    RequestedMonth VARCHAR(255),
                    RequestedYear VARCHAR(255),
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
                    RequestedMonth VARCHAR(255),
                    RequestedYear VARCHAR(255),
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
                    RequestedMonth VARCHAR(255),
                    RequestedYear VARCHAR(255),
                    BillCopy BLOB,
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
function encrypt(token, fingerPrint) {
    const key = crypto.createHash('sha256').update(fingerPrint).digest();   // 32-byte key for AES-256
    const cipher = crypto.createCipheriv(algorithm, key, process.env.SECRET_IV);
    return cipher.update(token, 'utf8', 'hex') + cipher.final('hex');
}

function decrypt(text, fingerPrint) {
    const key = crypto.createHash('sha256').update(fingerPrint).digest();
    const decipher = crypto.createDecipheriv(algorithm, key, process.env.SECRET_IV);
    return decipher.update(text, 'hex', 'utf8') + decipher.final('utf8');
}

function authenticate(req, res, next) {
    log(`Authenticating ${req.ip} for ${req.path}`);
    const token = req.cookies.token;
    log(`Token: ${token}`);
    if (!token && req.path !== '/api/login')
        return res.status(401).json({ message: 'Access denied' }); // If token is not present and path is not for login
    if (token && req.path === '/api/login') {
        //Auto login since token is already present (client can't access login page if token is present, so this is only client side autoLogin script)
        autoLogin(req, res);
    }
    else{
        res.status(200).json(null).end();
    }
    try {
        const decoded = jwt.decode(token, process.env.SECRET_KEY);
        if (!decoded) return res.status(400).json({ message: 'Invalid token' }).end();
        req.user = decoded;
        next();
    } catch (err) {
        console.log(err);
        return res.status(400).json({ message: 'Invalid token' });
    }
};

function authorize(allowedRoles) {
    return (req, res, next) => {
        console.log(req.body.role);
        if (!allowedRoles.includes(req.body.role)) {
            return res.status(403).json({ message: 'Permission denied' });
        }
        next();
    };
};

export { db, authenticate, authorize, encrypt, decrypt, connectDb };