import { db, getFromDb, updateAtDb } from "../dbUtils.js";
const compare = import('bcryptjs').compare;  // Normal import was not working so i imported it like this
import jwt from 'jsonwebtoken';
import { encrypt, Hash } from "../crypt.js";
import { log, sendFailedResponse } from "../utils.js";


/**
 * Handles user login.
 * Endpoint: POST /login
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
async function login(req, res) {
  const { email, password, fingerPrint, autoLogin } = req.body;
  if (autoLogin) return res.status(200).json(null).end();
  if (!email || !password || !fingerPrint) return res.status(200).json(null).end();
  let rootPass = Hash(process.env.ROOT_PASSWORD);
  console.log(process.env.ROOT_ID);
  console.log(process.env.ROOT_PASSWORD);

  if (email === process.env.ROOT_ID && password === rootPass) {
    console.log('root');
    let token = jwt.sign({ id: 0, role: 'root' }, process.env.SECRET_KEY, { expiresIn: '45m' });
    log(`Root logged in from ${req.ip}`);
    return res.cookie('token', encrypt(token, fingerPrint), { httpOnly: true }).json({
      profile: {
        role: 'root',
        name: 'root',
        id: 0,
        email: 'root'
      }
    }).status(200).end();
  }
  db.query('SELECT * FROM users WHERE email = ?', [email]).then(results => {
    if (results.length === 0) return sendFailedResponse(res, 'User not found', 404);
    const user = results[0][0];
    if (password == user.password) {
      let token = jwt.sign({ id: user.id, role: user.role }, process.env.SECRET_KEY, { expiresIn: '45m' });
      return res.cookie('token', encrypt(token, fingerPrint), { httpOnly: true }).status(200).json({
        profile: {
          role: user.role,
          name: user.name,
          id: user.id,
          email: user.email,
        }
      }).end();
    } else {
      return sendFailedResponse(res, 'Invalid password', 401);
    }
  }).catch(err => {
    return sendFailedResponse(res, err.message, 500);
  });
}

/**
 * Handles auto login.
 * Endpoint: POST /autoLogin
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
*/
function autoLogin(req, res) {
  const token = req.processed.token;
  if (token.id === 0) return res.status(200).json({ message: 'Auto login successful', role: 'root', name: 'root', id: 0, email: 'root' }).end();
  db.query('SELECT * FROM users WHERE id = ?', [token.id]).then(results => {

    if (results[0].length === 0) {
      return res.status(404).res.clearCookie('token').json({ message: 'User not found' }).end();
    }
    const user = results[0][0];
    res.status(200).json(
      {
        message: 'Login successful',
        role: user.role,
        name: user.name,
        id: user.id,
        email: user.email,
      }).end();
  }).catch(err => {
    return sendFailedResponse(res, err.message, 500);
  });
}

/**
 * Retrieves projects based on filters.
 * Endpoint: POST /getProjects
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
*/
function getProjects(req, res) {
  getFromDb('Projects', req.body.fields).then((results) => {  
    const { page, text, status, fundedBy, fromDate, toDate } = req.body.filters;
    const fundedByList = [...new Set(results.map(project => project.FundedBy))];
    results = results.filter(project => {
      if (!req.processed.allowedProjects.includes(project.ProjectNo)) return false;
      if (text || status || fundedBy || fromDate || toDate) {
        let isValid = true;
        if (text) isValid = isValid && project.ProjectTitle.toLowerCase().includes(text);
        if (status) {
          let s = new Date(project.ProjectEndDate) >= new Date() ? 'Active' : 'Inactive';
          isValid = isValid && status === s;
        }
        if (fundedBy) isValid = isValid && project.FundedBy === fundedBy;
        if (fromDate) isValid = isValid && new Date(project.ProjectStartDate) > new Date(fromDate);
        if (toDate) isValid = isValid && new Date(project.ProjectEndDate) < new Date(toDate);
        return isValid;
      }
      return true;
    });
    
    res.status(200).json({ projects: results, total: results.length, agencies: fundedByList }).end();
  }).catch((err) => {
    res.status(500).json({ message: 'Error fetching projects', err: err.message }).end();
    console.log(err);
    
  });
}

/**
 * Logs out the user.
 * Endpoint: POST /logout
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
*/
function logout(req, res) {
  res.clearCookie('token').status(200).json({ message: 'Logged out', reqStatus: 'success' }).end();
}

/**
 * Retrieves users based on filters.
 * Endpoint: POST /getUsers
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
*/
function getUsers(req, res) {
  getFromDb('users', ['name', 'email', 'id', 'role', 'projects', 'status', 'TotalSalary', 'BasicSalary', 'HRA_Percentage'], "id != '0'").then((results) => {
    const { text, role } = req.body.filters;
    // console.log(results);
    
    if (text || role) {
      let actual = [];
      results.forEach(user => {
        if (text && role) {
          if (user.name.toLowerCase().includes(text) && user.role === role) {
            log('both');
            actual.push(user);
          }
        } else if (text && (user.name.startsWith(text) || user.email.startsWith(text))) {
          log('text');
          actual.push(user);
        } else if (role && user.role === role) {
          actual.push(user);
          log('role');
        }
      });
      results = actual;
    }
    res.status(200).json({ users: results, total: results.length });
  }).catch(err => sendFailedResponse(res, err.message, 500));
}

/**
 * Retrieves detailed information about a specific project.
 * Endpoint: GET /getProjectInfo/:projectNo
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
*/
function getProjectInfo(req, res) {
  try {
    let projectNo = req.path.split('api/projects/')[1];
    let payload = { data: {} };
    getFromDb('ProjectAllocationSummary', ['*'], `ProjectNo= '${projectNo}'`).then((results) => {
      payload.data = results[0];
    }).catch((err) => {
      sendFailedResponse(res, err.message, 500);
    });
    getFromDb('CombinedIndents', [
      'IndentType',
      'IndentID',
      'ProjectNo',
      'ProjectTitle',
      'EmployeeID',
      'Workers',
      'Source',
      'FromDate',
      'Destination',
      'DestinationDate',
      'Traveler',
      'Items',
      'RequestedAmt',
      'Reason',
      'Remark',
      'RequestedDate',
      'IndentStatus'
    ], `ProjectNo= '${projectNo}'`).then((results) => {
      payload.data.indents = results;
      res.status(200).json(payload).end();
    }).catch((err) => {
      sendFailedResponse(res, err.message, 500);
    });
  } catch (err) {
    sendFailedResponse(res, err.message, 404);
  }
}

/**
 * Retrieves the bill copy for a specific indent.
 * Endpoint: GET /getBillCopy/:table/:reqId
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
*/

function getBillCopy(req, res) {
  let path = req.path.split('/');
  const [table, reqId] = [path[3], path[4]];
  getFromDb(table, ['BillCopy'], `IndentID= ${reqId}`).then((results) => {
    if (results.length === 0) {
      return sendFailedResponse(res, 'Bill copy not found', 404);
    }
    const billCopyJson = results[0].BillCopy;
    res.status(200).json({ BillCopy: billCopyJson }).end();
  }).catch((err) => {
    sendFailedResponse(res, err.message, 500);
  });
}

/**
 * Retrieves indents based on filters.
 * Endpoint: POST /getIndents
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
*/

async function getIndents(req, res) {
  try {
    let results = await getFromDb('Indents', ['*']);
    const { text, status, upto, above, fromDate, toDate, fundedBy } = req.body.filters;
    const allowedProjects = req.processed.allowedProjects;

    const projectPromises = results.map(async indent => {
      const projectResults = await getFromDb('Projects', ['ProjectTitle'], `ProjectNo= '${indent.ProjectNo}'`);
      if (projectResults.length > 0) {
        indent.ProjectTitle = projectResults[0].ProjectTitle;
      }

    });
    await Promise.all(projectPromises);
    results = results.filter(indent => {
      if (!allowedProjects.includes(indent.ProjectNo)) return false;

      let isValid = true;
      if (text) isValid = isValid && (indent.ProjectTitle.toLowerCase().includes(text) || indent.IndentedPersonId.includes(text));
      if (status) {
        if (status == 'PR') {
          if (indent.IndentStatus == 'Approved') return true;
          else return false;
        }
        isValid = isValid && indent.IndentStatus === status;
      }
      if (upto) isValid = isValid && indent.IndentAmount <= upto;
      if (above) isValid = isValid && indent.IndentAmount >= above;
      if (fromDate) isValid = isValid && new Date(indent.IndentDate) > new Date(fromDate);
      if (toDate) isValid = isValid && new Date(indent.IndentDate) < new Date(toDate);
      return isValid;
    });

    res.status(200).json({ indents: results, total: results.length }).end();
  } catch (err) {
    sendFailedResponse(res, err.message, 500);
  }
}

/**
 * Retrieves detailed information about a specific indent.
 * Endpoint: GET /getIndentInfo/:indentId
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
*/
function getIndentInfo(req, res) {
  let indentId = parseInt(req.path.split('/').at(-1));

  let payload = { data: {} };
  getFromDb('Indents', ['*'], `IndentID= ${indentId}`).then((results) => {
    payload.data = results[0];
    const projectNo = results[0].ProjectNo;
    const allowedProjects = req.processed.allowedProjects;
    if (!allowedProjects.includes(projectNo)) {
      return sendFailedResponse(res, 'Not authorized to view this project', 403);
    }
    getFromDb('Projects', ['ProjectTitle'], `ProjectNo= '${projectNo}'`).then((projectResults) => {
      if (projectResults.length > 0) {
        payload.data.ProjectTitle = projectResults[0].ProjectTitle;
      }
      res.status(200).json(payload).end();
    }).catch((err) => {
      sendFailedResponse(res, err.message, 500);
    });
  }).catch((err) => {
    sendFailedResponse(res, err.message, 500);
  });
}

/**
 * Updates the status of a specific indent.
 * Endpoint: POST /updateIndentStatus
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
*/
async function updateIndentStatus(req, res) {
  const { Approved, IndentID } = req.body;
  try {
    await updateAtDb('Indents', { IndentStatus: Approved ? "Approved" : "Rejected" }, { IndentID: IndentID })
    res.status(200).json({ message: 'Indent updated' }).end();
  } catch (err) {
    sendFailedResponse(res, err.message, 500);
  }
}

/**
 * Retrieves purchase requests based on filters.
 * Endpoint: POST /getPR
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
*/
function getPR(req, res) {
  getFromDb('Indents', ['*'], `IndentStatus IN ('Approved', 'Completed')`).then((results) => {
    const { text, status, upto, above, fromDate, toDate } = req.body.filter;
    if (text || status || upto || above || fromDate || toDate) {
      results = results.filter(pr => {
        let isValid = true;
        if (text) {
          isValid = isValid && (pr.ProjectTitle.includes(text) || pr.PRRequestor.includes(text));
        }
        if (status) {
          isValid = isValid && pr.PRStatus === status;
        }
        if (upto) {
          isValid = isValid && pr.PurchaseRequestAmount <= upto;
        }
        if (above) {
          isValid = isValid && pr.PurchaseRequestAmount >= above;
        }
        if (fromDate) {
          isValid = isValid && new Date(pr.PRDate) > new Date(fromDate);
        }
        if (toDate) {
          isValid = isValid && new Date(pr.PRDate) < new Date(toDate);
        }
        return isValid;
      });
    }
    res.status(200).json({ purchaseReqs: results, total: results.length }).end();
  }).catch((err) => {
    sendFailedResponse(res, err.message, 500);
  });
}

/**
 * Retrieves detailed information about a specific purchase request.
 * Endpoint: GET /getPRInfo/:prId
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
*/
function getPRInfo(req, res) {
  let prId = parseInt(req.path.split('/').at(-1));

  let payload = { data: {} };
  getFromDb('PurchaseRequests', ['*'], `PurchaseReqID= ${prId}`).then((results) => {
    payload.data = results[0];
    const projectNo = results[0].ProjectNo;
    const allowedProjects = req.processed.allowedProjects;
    if (!allowedProjects.includes(projectNo)) {
      return sendFailedResponse(res, 'Not authorized to view this project', 403);
    }
    getFromDb('Projects', ['ProjectTitle'], `ProjectNo= '${projectNo}'`).then((projectResults) => {
      if (projectResults.length > 0) {
        payload.data.ProjectTitle = projectResults[0].ProjectTitle;
      }
      getFromDb('Indents', ['IndentCategory'], `IndentID= ${payload.data.IndentID}`).then((indentResults) => {
        if (indentResults.length > 0) {
          payload.data.IndentCategory = indentResults[0].IndentCategory;
        }
        res.status(200).json(payload).end();
      }).catch((err) => {
        sendFailedResponse(res, err.message, 500);
      });
    }).catch((err) => {
      sendFailedResponse(res, err.message, 500);
    });
  }).catch((err) => {
    sendFailedResponse(res, err.message, 500);
  });
}

/**
 * Updates the status of a specific purchase request.
 * Endpoint: POST /updatePRStatus
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
*/
function updatePRStatus(req, res) {
  const { Approved, PurchaseReqID } = req.body;
  updateAtDb('Indents', { IndentStatus: Approved ? "Completed" : "Rejected" }, { IndentID: PurchaseReqID }).then(() => {
    res.status(200).json({ message: 'Purchase request updated' }).end();
  }).catch(err => {
    sendFailedResponse(res, err.message, 500);
  });
}

/**
 * Retrieves purchase orders based on filters.
 * Endpoint: POST /getPO
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
*/
function getPO(req, res) {
  getFromDb('PurchaseOrders', ['*']).then((results) => {

    const { text, status, upto, above, fromDate, toDate } = req.body.filter;
    if (text || status || upto || above || fromDate || toDate) {
      results = results.filter(po => {
        let isValid = true;
        if (text) {
          isValid = isValid && (po.ProjectTitle.includes(text) || po.PORequestor.includes(text));
        }
        if (status) {
          isValid = isValid && po.POStatus === status;
        }
        if (upto) {
          isValid = isValid && po.PurchaseOrderAmount <= upto;
        }
        if (above) {
          isValid = isValid && po.PurchaseOrderAmount >= above;
        }
        if (fromDate) {
          isValid = isValid && new Date(po.PODate) > new Date(fromDate);
        }
        if (toDate) {
          isValid = isValid && new Date(po.PODate) < new Date(toDate);
        }
        return isValid;
      });
    }
    res.status(200).json({ purchaseOrders: results, total: results.length }).end();
  }).catch((err) => {
    sendFailedResponse(res, err.message, 500);
  });
}

/**
* Generates a report based on the specified report type.
 * Endpoint: POST /generateReport
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
async function generateReport(req, res) {
  const { reportType } = req.body;
  if (!reportType) return sendFailedResponse(res, 'Report type not specified', 500);
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
  else if (reportType === 'yearly') {
    const { year, ProjectNo } = req.body;
    if (!year || !ProjectNo) return sendFailedResponse(res, 'Year or ProjectNo not specified', 500);
    query = `SELECT 
    ci.IndentType AS Category,
    pa.ManpowerAllocationAmt + pa.TravelAllocationAmt + pa.ConsumablesAllocationAmt + 
    pa.ContingencyAllocationAmt + pa.OverheadAllocationAmt + pa.EquipmentAllocationAmt AS Allocation,
    SUM(ci.RequestedAmt) AS IndentedProposed,
    SUM(CASE WHEN ci.IndentStatus = 'Completed' THEN ci.RequestedAmt ELSE 0 END) AS Paid,
    SUM(CASE WHEN ci.IndentStatus IN ('Approved', 'Pending') THEN ci.RequestedAmt ELSE 0 END) AS Committed,
    (pa.ManpowerAllocationAmt + pa.TravelAllocationAmt + pa.ConsumablesAllocationAmt + 
     pa.ContingencyAllocationAmt + pa.OverheadAllocationAmt + pa.EquipmentAllocationAmt - 
     SUM(ci.RequestedAmt)) AS Available
FROM 
    CombinedIndents ci
LEFT JOIN 
    ProjectAllocationSummary pa ON ci.ProjectNo = pa.ProjectNo
WHERE 
    ci.ProjectNo = '${ProjectNo}'
    AND ci.RequestedDate BETWEEN '${year}-04-01' AND '${parseInt(year)+1}-03-31'
GROUP BY 
    ci.IndentType, pa.ManpowerAllocationAmt, pa.TravelAllocationAmt, 
    pa.ConsumablesAllocationAmt, pa.ContingencyAllocationAmt, pa.OverheadAllocationAmt, 
    pa.EquipmentAllocationAmt;
`
  }

  else if (reportType === 'quarterly'){
    let { year, ProjectNo, quarter } = req.body;
    if (!year || !ProjectNo || !quarter) return sendFailedResponse(res, 'Year, ProjectNo or quarter not specified', 500);

    let startMonth, endMonth;
    if (quarter === 1) {
      startMonth = '04';
      endMonth = '06';
    } else if (quarter === 2) {
      startMonth = '07';
      endMonth = '09';
    } else if (quarter === 3) {
      startMonth = '10';
      endMonth = '12';
    } else if (quarter === 4) {
      startMonth = '01';
      endMonth = '03';
      year = parseInt(year) + 1; // Adjust year for Q4
    } else {
      return sendFailedResponse(res, 'Invalid quarter specified', 500);
    }

    query = `
      SELECT 
        ci.IndentType AS Category,
        pa.ManpowerAllocationAmt + pa.TravelAllocationAmt + pa.ConsumablesAllocationAmt + 
        pa.ContingencyAllocationAmt + pa.OverheadAllocationAmt + pa.EquipmentAllocationAmt AS Allocation,
        SUM(ci.RequestedAmt) AS IndentedProposed,
        SUM(CASE WHEN ci.IndentStatus = 'Completed' THEN ci.RequestedAmt ELSE 0 END) AS Paid,
        SUM(CASE WHEN ci.IndentStatus IN ('Approved', 'Pending') THEN ci.RequestedAmt ELSE 0 END) AS Committed,
        (pa.ManpowerAllocationAmt + pa.TravelAllocationAmt + pa.ConsumablesAllocationAmt + 
         pa.ContingencyAllocationAmt + pa.OverheadAllocationAmt + pa.EquipmentAllocationAmt - 
         SUM(ci.RequestedAmt)) AS Available
      FROM 
        CombinedIndents ci
      LEFT JOIN 
        ProjectAllocationSummary pa ON ci.ProjectNo = pa.ProjectNo
      WHERE 
        ci.ProjectNo = '${ProjectNo}'
        AND ci.RequestedDate BETWEEN '${year}-${startMonth}-01' AND '${year}-${endMonth}-31'
      GROUP BY 
        ci.IndentType, pa.ManpowerAllocationAmt, pa.TravelAllocationAmt, 
        pa.ConsumablesAllocationAmt, pa.ContingencyAllocationAmt, pa.OverheadAllocationAmt, 
        pa.EquipmentAllocationAmt;
    `;
  }
  if (!query) return sendFailedResponse(res, 'Invalid Report Type', 500);

  const data = await db.query(query);
  res.status(200).json({ data: data[0] }).end();
}

/**
* Retrieves remaining allocation amounts for a specific project.
 * Endpoint: POST /getRemaining
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
*/
async function getRemaining(req, res) {
  const { ProjectNo } = req.body;
  let query = `SELECT 
                    RemainingManpowerAmt,RemainingTravelAmt,
                    RemainingConsumablesAmt,RemainingContingencyAmt,
                    RemainingOverheadAmt,RemainingEquipmentAmt
              FROM
                  ProjectAllocationSummary
              WHERE
                  ProjectNo='${ProjectNo}'`
  const data = await db.query(query);
  res.status(200).json({ data: data[0][0] }).end();
}


export { login, getRemaining, updateIndentStatus, autoLogin, getProjects, logout, getUsers, getProjectInfo, getIndents, getBillCopy, getIndentInfo, getPR, getPRInfo, getPO, updatePRStatus, generateReport };