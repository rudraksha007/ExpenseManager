import mysql from 'mysql2/promise';
import jwt from 'jsonwebtoken';
import { log, sendFailedResponse } from './utils.js';
import { decrypt } from './crypt.js';
let db = null;
/**
 * Connects to the MySQL database and initializes the required tables and views.
 * 
 * @async
 * @function connectDb
 * @returns {Promise<mysql.Connection>} The MySQL database connection.
 * @throws Will throw an error if unable to connect to the database or create tables/views.
 * 
 * @description
 * This function establishes a connection to the MySQL database using the credentials
 * provided in the environment variables. It then creates the necessary tables and views
 * if they do not already exist. The tables include Projects, users, Indents, Manpower,
 * Travel, Consumables, Overhead, Equipment, and Contingency. Additionally, it creates
 * a view named ProjectAllocationSummary to summarize project allocations.
 * 
 * The function logs the progress of table creation and view creation. If any error occurs
 * during the process, it logs the error and exits the process.
 * 
 * Environment Variables:
 * - DB_USER: The database user.
 * - DB_PASS: The database password.
 * - DB_NAME: The database name.
 * - ROOT_ID: The root user email.
 * - ROOT_PASSWORD: The root user password.
 */
async function connectDb() {
    try {
        db = mysql.createPool({
            connectionLimit: 1,
            host: 'localhost',
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
            waitForConnections: true,
            idleTimeout: 0
        });
        db = await db.getConnection();
        log('Connected to MySQL database');
        const tables = [
            {
                tableName: 'Projects',
                definition: `
                    ProjectTitle VARCHAR(255) NOT NULL,
                    ProjectNo Varchar(255) PRIMARY KEY,
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
                    role ENUM('Techanican', 'JRF', 'SRF', 'RA', 'Pi', 'SuperAdmin'),
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
                    ProjectNo Varchar(255),
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
                    ProjectNo Varchar(255),
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
                    ProjectNo Varchar(255),
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
                    ProjectNo Varchar(255),
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
                    ProjectNo Varchar(255),
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
                    ProjectNo Varchar(255),
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
                    ProjectNo Varchar(255),
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
            await db.query('DROP VIEW IF EXISTS CombinedIndents;');
            await db.query(`
                CREATE VIEW CombinedIndents AS
                SELECT 
                    'Manpower' AS IndentType,
                    i.IndentID,
                    i.ProjectNo,
                    m.ProjectTitle,
                    m.EmployeeID,
                    m.Workers,
                    NULL AS Source,
                    m.JoiningDate AS FromDate,
                    NULL AS Destination,
                    m.EndDate AS DestinationDate,
                    NULL AS Traveler,
                    NULL AS Items,
                    m.RequestedAmt,
                    NULL AS Reason,
                    NULL AS Remark,
                    m.JoiningDate AS RequestedDate,
                    NULL AS BillCopy,
                    i.IndentStatus
                FROM Indents i
                JOIN Manpower m ON i.IndentID = m.IndentID

                UNION ALL

                SELECT 
                    'Travel' AS IndentType,
                    i.IndentID,
                    i.ProjectNo,
                    NULL AS ProjectTitle,
                    t.EmployeeID,
                    NULL AS Workers,
                    t.Source,
                    t.FromDate,
                    t.Destination,
                    t.DestinationDate,
                    t.Traveler,
                    NULL AS Items,
                    t.RequestedAmt,
                    t.Reason,
                    t.Remark,
                    t.RequestedDate,
                    t.BillCopy,
                    i.IndentStatus
                FROM Indents i
                JOIN Travel t ON i.IndentID = t.IndentID

                UNION ALL

                SELECT 
                    'Consumables' AS IndentType,
                    i.IndentID,
                    i.ProjectNo,
                    c.ProjectTitle,
                    c.EmployeeID,
                    NULL AS Workers,
                    NULL AS Source,
                    NULL AS FromDate,
                    NULL AS Destination,
                    NULL AS DestinationDate,
                    NULL AS Traveler,
                    NULL AS Items,
                    c.RequestedAmt,
                    c.Reason,
                    c.Remark,
                    c.RequestedDate,
                    c.BillCopy,
                    i.IndentStatus
                FROM Indents i
                JOIN Consumables c ON i.IndentID = c.IndentID

                UNION ALL

                SELECT 
                    'Overhead' AS IndentType,
                    i.IndentID,
                    i.ProjectNo,
                    o.ProjectTitle,
                    o.EmployeeID,
                    NULL AS Workers,
                    NULL AS Source,
                    NULL AS FromDate,
                    NULL AS Destination,
                    NULL AS DestinationDate,
                    NULL AS Traveler,
                    NULL AS Items,
                    o.RequestedAmt,
                    o.Reason,
                    NULL AS Remark,
                    o.RequestedDate,
                    o.BillCopy,
                    i.IndentStatus
                FROM Indents i
                JOIN Overhead o ON i.IndentID = o.IndentID

                UNION ALL

                SELECT 
                    'Equipment' AS IndentType,
                    i.IndentID,
                    i.ProjectNo,
                    e.ProjectTitle,
                    e.EmployeeID,
                    NULL AS Workers,
                    NULL AS Source,
                    NULL AS FromDate,
                    NULL AS Destination,
                    NULL AS DestinationDate,
                    NULL AS Traveler,
                    e.Items,
                    e.RequestedAmt,
                    e.Reason,
                    e.Remark,
                    e.RequestedDate,
                    e.BillCopy,
                    i.IndentStatus
                FROM Indents i
                JOIN Equipment e ON i.IndentID = e.IndentID

                UNION ALL

                SELECT 
                    'Contingency' AS IndentType,
                    i.IndentID,
                    i.ProjectNo,
                    c.ProjectTitle,
                    c.EmployeeID,
                    NULL AS Workers,
                    NULL AS Source,
                    NULL AS FromDate,
                    NULL AS Destination,
                    NULL AS DestinationDate,
                    NULL AS Traveler,
                    NULL AS Items,
                    c.RequestedAmt,
                    c.Reason,
                    c.Remark,
                    c.RequestedDate,
                    c.BillCopy,
                    i.IndentStatus
                FROM Indents i
                JOIN Contingency c ON i.IndentID = c.IndentID;
            `);
            log('SQL Binding Complete');
        })();
        return db;
    } catch (err) {
        log('Error connecting to MySQL database:' + err);
        process.exit(1);
    }
}
/**
 * Middleware to authenticate the user based on the JWT token.
 * 
 * @function authenticate
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {void}
 * 
 * @description
 * This function checks for the presence of a JWT token in the request cookies.
 * If the token is not present and the request path is not for login, it returns a 401 status.
 * If the token is present, it verifies the token using the secret key and the decrypted token.
 * If the token is invalid, it clears the token from the client side and returns a 401 status.
 * If the token is valid, it adds the decoded token to the request object and calls the next middleware.
 */
function authenticate(req, res, next) {
    if (req.method === 'GET') return next();
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


/**
 * Middleware to authorize the user based on their role.
 * 
 * @function authorize
 * @param {Array<string>} allowedRoles - The roles that are allowed to access the resource.
 * @returns {Function} The middleware function.
 * 
 * @description
 * This function checks if the user's role is included in the allowed roles or if the user is a root user.
 * If the user's role is not allowed, it returns a 403 status.
 * If the user's role is allowed, it calls the next middleware.
 */

function authorize(allowedRoles) {
    return (req, res, next) => {
        if (!allowedRoles.includes(req.processed.token.role) && req.processed.token.role !== 'root') {
            return res.status(403).json({ message: 'Permission denied' });
        }
        next();
    };
};

/**
 * Middleware to authorize the user based on their project access.
 * 
 * @function projectWiseAuthorisation
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {void}
 * 
 * @description
 * This function checks if the user's role is root or SuperAdmin. If not, it retrieves the user's projects
 * from the database and adds them to the request object. If the user has no projects, it returns a 403 status.
 * If the user's role is root or SuperAdmin, it retrieves all project numbers from the database and adds them
 * to the request object. It then calls the next middleware.
 */
const projectWiseAuthorisation = (req, res, next) => {
    if (req.processed.token.role != 'root' && req.processed.token.role != 'SuperAdmin') {

        getFromDb('users', ['projects'], `id=${req.processed.token.id}`).then((projects) => {
            if (projects.length == 0) {
                return sendFailedResponse(res, 'Permission denied', 403);
            }

            projects = projects[0].projects;
            let arr = [];
            projects.forEach(ele => arr.push(ele));
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
            next();
        }).catch((err) => {
            return sendFailedResponse(res, err.message, 500);
        });
    }

};


/**
 * Retrieves data from the specified table in the database.
 * 
 * @async
 * @function getFromDb
 * @param {string} table - The name of the table to retrieve data from.
 * @param {Array<string>} fields - The fields to retrieve from the table.
 * @param {string} [where] - The optional WHERE clause to filter the data.
 * @returns {Promise<Array<Object>>} The retrieved data.
 * 
 * @description
 * This function constructs a SELECT query based on the provided table, fields, and optional WHERE clause.
 * It executes the query and returns the retrieved data as an array of objects.
 */
async function getFromDb(table, fields, where) {
    let query = `SELECT ${fields.join(',')} FROM ${table}`;
    if (where) query += ` WHERE ${where}`;    
    return db.query(query).then(([rows]) => rows);

}

/**
 * Updates data in the specified table in the database.
 * 
 * @async
 * @function updateAtDb
 * @deprecated This function is marked as deprecated due to instability issues.
 * @param {string} table - The name of the table to update data in.
 * @param {Object} fieldsDictionary - The fields and their new values to update.
 * @param {Object} where - The WHERE clause to filter the rows to update.
 * @returns {Promise<void>}
 * 
 * @description
 * This function constructs an UPDATE query based on the provided table, fields, and WHERE clause.
 * It executes the query to update the specified rows in the table.
 * 
 * This is used at some places but many times, it proves to be unsable, hance marked deprecated
 */
async function updateAtDb(table, fieldsDictionary, where) {
    let fields = Object.entries(fieldsDictionary).map(([key, value]) => `${key}='${value}'`).join(', ');
    let wheres = Object.entries(where).map(([key, value]) => `${key}='${value}'`).join(' AND ');
    return db.query(`UPDATE ${table} SET ${fields} WHERE ${wheres}`);
}
export { db, authenticate, authorize, connectDb, getFromDb, projectWiseAuthorisation, updateAtDb }; 
