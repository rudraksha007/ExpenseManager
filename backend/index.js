import { log } from './utils.js';
import express from 'express';
import dotenv from 'dotenv';
import { login, autoLogin, getProjects, logout, getUsers, getProjectInfo, getIndents, getBillCopy, getIndentInfo, updateIndentStatus, getPR, updatePRStatus, generateReport } from './callbacks/postReqs.js';
import cookieParser from 'cookie-parser';
import { db, authenticate, authorize, connectDb, projectWiseAuthorisation } from './dbUtils.js';
import cors from 'cors';
import { addPOrder, addProject,addProjectIndent,addPurchaseReq,addUser, editProject } from './callbacks/putReqs.js';
import fileUpload from 'express-fileupload';

const hash = import('bcryptjs').hash;
log('Starting Expense Manager Server');
dotenv.config();
const app = express();
app.use(cors({ origin: 'http://localhost:5173', credentials: true }), express.json(),fileUpload(), cookieParser(), authenticate);
await connectDb();

//Post requests (right click on supplied function-> goto source definition to view the code)
app.post('/api/login', (req, res) => login(req, res)); 
app.post('/api/logout', (req, res) => logout(req, res)); 
app.post('/api/autoLogin', (req, res) => autoLogin(req, res)); 
app.post('/api/projects', projectWiseAuthorisation, (req, res) => getProjects(req, res));
app.post('/api/users', authorize(['Pi','SuperAdmin']), (req, res) => getUsers(req, res));
app.post('/api/projects/*', (req, res)=>getProjectInfo(req, res));
app.post('/api/pdf/*', (req, res)=>getBillCopy(req, res));
app.post('/api/indents', projectWiseAuthorisation, (req, res) => getIndents(req, res));
app.post('/api/indents/*', projectWiseAuthorisation, (req, res) => getIndentInfo(req, res));
app.post('/api/purchaseReqs', authorize(['SuperAdmin']), (req,res)=>getPR(req, res));

app.post('/api/indentStatus', authorize(['SuperAdmin']), (req, res) => updateIndentStatus(req, res));
app.post('/api/purchaseReqStatus', authorize(['SuperAdmin']), (req, res) => updatePRStatus(req, res));
app.post('/api/report', authorize(['SuperAdmin']), (req, res) => generateReport(req, res));


//Put requests (right click on supplied function-> goto source definition to view the code)
app.put('/api/projects', authorize(['Pi','SuperAdmin']), (req, res) => addProject(req, res));
app.put('/api/users', authorize(['SuperAdmin']), (req, res) => addUser(req, res));
app.put('/api/travel', (req, res) => addProjectIndent(req, res));
app.put('/api/consumables', (req, res) => addProjectIndent(req, res));
app.put('/api/contingency', (req, res) => addProjectIndent(req, res));
app.put('/api/equipment', (req, res) => addProjectIndent(req, res));
app.put('/api/manpower', (req, res) => addProjectIndent(req, res));
app.put('/api/purchaseReqs', authorize(['SuperAdmin']), (req, res) => addPurchaseReq(req, res));
app.put('/api/purchaseOrders', authorize(['SuperAdmin']), (req, res) => addPOrder(req, res));
app.put('/api/editProject', authorize(['Pi','SuperAdmin']), (req, res) => editProject(req, res));


// app.put('/api/users', authorize(['SuperAdmin']), (req, res) => {
//   // const { id }  = req.params;
//   const { id, name, email, password, designation, status } = req.body;
//   db.query('UPDATE users SET id = ?, name = ?, email = ?, password = ?, designation = ?, status = ? WHERE id = ?', [id, name, email, password, designation, status, id], (err, result) => {
//     if (err) return res.status(500).json({ message: 'Error updating profile', message: err.message });
//     res.status(200).json({ message: 'Profile updated successfully' });
//   });
// });

app.delete('/api/users/', authorize(['SuperAdmin']), (req, res) => {
  const { id } = req.body;
  const query = 'DELETE FROM users WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Error deleting profile', message: err.message });
    res.status(200).json({ message: 'Profile deleted successfully' });
  });
});

// --- Projects CRUD Operations ---

app.put('/api/projects/:id', authorize(['SuperAdmin', 'Admin(PME)']), (req, res) => {
  const { id } = req.body;
  const { ProjectTitle, ProjectNo, ProjectStartDate, ProjectEndDate, SanctionOrderNo, TotalSanctionamount, PIname, CoPIs, ManpowerAllocationAmt, ConsumablesAllocationAmt, ContingencyAllocationAmt, OverheadAllocationAmt, EquipmentAllocationAmt, TravelAllocationAmt } = req.body;
  const query = 'UPDATE projects SET ProjectTitle = ?, ProjectNo = ?, ProjectStartDate = ?, ProjectEndDate = ?, SanctionOrderNo = ?, TotalSanctionamount = ?, PIname = ?, CoPIs = ?, ManpowerAllocationAmt = ?, ConsumablesAllocationAmt = ?, ContingencyAllocationAmt = ?, OverheadAllocationAmt = ?, EquipmentAllocationAmt = ?, TravelAllocationAmt = ? WHERE id = ?';
  db.query(query, [ProjectTitle, ProjectNo, ProjectStartDate, ProjectEndDate, SanctionOrderNo, TotalSanctionamount, PIname, CoPIs, ManpowerAllocationAmt, ConsumablesAllocationAmt, ContingencyAllocationAmt, OverheadAllocationAmt, EquipmentAllocationAmt, TravelAllocationAmt], (err, result) => {
    if (err) return res.status(500).json({ message: 'Error updating project' });
    res.status(200).json({ message: 'Project updated successfully' });
  });
});

app.delete('/api/projects/:id', authorize(['Super Admin', 'Admin(PME)']), (req, res) => {
  const { id } = req.body;
  const query = 'DELETE FROM projects WHERE ProjectNo = ?';
  db.query(query, [id], (err, result) => {
    if (err) {  return res.status(500).json({ message: 'Error deleting project' }) };
    res.status(200).json({ message: 'Project deleted successfully' });
  });
});

// --- Indents CRUD Operations ---// --- Indents CRUD Operations ---


// Endpoint to Add an Indent - Scientists (PIs) are not allowed
// app.post('/api/indents', authorize(['Super Admin', 'Admin(PME)']), (req, res) => {
//   const { title, description, amount } = req.body;
//   const query = 'INSERT INTO indents (title, description, amount) VALUES (?, ?, ?)';
//   db.query(query, [title, description, amount], (err, result) => {
//     if (err) return res.status(500).json({ message: 'Error adding indent' });
//     res.status(201).json({ message: 'Indent added successfully' });
//   });
// });

// Endpoint to Update an Indent - Scientists (PIs) are not allowed
app.put('/api/indents/:id', authorize(['Super Admin', 'Admin(PME)']), (req, res) => {
  const { id } = req.params;
  const { title, description, amount } = req.body;

  const query = 'UPDATE indents SET title = ?, description = ?, amount = ? WHERE id = ?';
  db.query(query, [title, description, amount, id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Error updating indent' });
    res.status(200).json({ message: 'Indent updated successfully' });
  });
});

// Endpoint to Delete an Indent - Scientists (PIs) are not allowed
app.delete('/api/indents/:id', authorize(['Super Admin', 'Admin(PME)']), (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM indents WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Error deleting indent' });
    res.status(200).json({ message: 'Indent deleted successfully' });
  });
});

// Endpoint to Upload a PDF for an Indent - Scientists (PIs) are not allowed
app.post('/api/indents/:id/uploadPdf', authorize(['Super Admin', 'Admin(PME)']), (req, res) => {
  const { id } = req.params;
  const { pdf } = req.body; // Assuming the PDF is sent as a base64 string

  if (!pdf) return res.status(400).json({ message: 'No PDF provided' });

  const query = 'UPDATE indents SET pdf = ? WHERE id = ?';
  db.query(query, [Buffer.from(pdf, 'base64'), id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Error uploading PDF' });
    res.status(200).json({ message: 'PDF uploaded successfully' });
  });
});

// Endpoint to Retrieve a PDF for an Indent - Scientists (PIs) are allowed
app.get('/api/indents/:id/downloadPdf', (req, res) => {
  const { id } = req.params;

  const query = 'SELECT pdf FROM indents WHERE id = ?';
  db.query(query, [id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (results.length === 0) return res.status(404).json({ message: 'Indent not found' });

    const pdf = results[0].pdf;

    if (!pdf) return res.status(404).json({ message: 'No PDF found for this indent' });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="indent.pdf"');
    res.send(pdf);
  });
});

// Endpoint to Upload a PDF for an Indent
app.post('/api/indents/:id/uploadPdf', authorize(['Super Admin', 'Admin(PME)']), (req, res) => {
  const { id } = req.params;
  const { pdf } = req.body; // Assuming the PDF is sent as a base64 string

  if (!pdf) return res.status(400).json({ message: 'No PDF provided' });

  const query = 'UPDATE indents SET pdf = ? WHERE id = ?';
  db.query(query, [Buffer.from(pdf, 'base64'), id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Error uploading PDF' });
    res.status(200).json({ message: 'PDF uploaded successfully' });
  });
});

// Endpoint to Retrieve a PDF for an Indent
app.get('/api/indents/:id/downloadPdf', (req, res) => {
  const { id } = req.params;

  const query = 'SELECT pdf FROM indents WHERE id = ?';
  db.query(query, [id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (results.length === 0) return res.status(404).json({ message: 'Indent not found' });

    const pdf = results[0].pdf;

    if (!pdf) return res.status(404).json({ message: 'No PDF found for this indent' });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="indent.pdf"');
    res.send(pdf);
  });
});

// --- Purchase Requests CRUD Operations ---

// Get all purchase requests
app.get('/api/purchaseRequests', (req, res) => {
  const query = 'SELECT * FROM purchase_requests';
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    res.status(200).json({ purchaseRequests: results });
  });
});

// Get a single purchase request by ID
app.get('/api/purchaseRequests/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM purchase_requests WHERE PurchaseReqID = ?';
  db.query(query, [id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (results.length === 0) return res.status(404).json({ message: 'Purchase request not found' });
    res.status(200).json({ purchaseRequest: results[0] });
  });
});

// Create a new purchase request
app.post('/api/purchaseRequests', (req, res) => {
  const { PRDate, ProjectNo, IndentID, PurchaseRequestAmount, PRRequestor, PRStatus } = req.body;
  const query = 'INSERT INTO purchase_requests (PRDate, ProjectNo, IndentID, PurchaseRequestAmount, PRRequestor, PRStatus) VALUES (?, ?, ?, ?, ?, ?)';
  db.query(query, [PRDate, ProjectNo, IndentID, PurchaseRequestAmount, PRRequestor, PRStatus], (err, result) => {
    if (err) return res.status(500).json({ message: 'Error adding purchase request' });
    res.status(201).json({ message: 'Purchase request added successfully' });
  });
});

// Update a purchase request
app.put('/api/purchaseRequests/:id', (req, res) => {
  const { id } = req.params;
  const { PRDate, ProjectNo, IndentID, PurchaseRequestAmount, PRRequestor, PRStatus } = req.body;
  const query = 'UPDATE purchase_requests SET PRDate = ?, ProjectNo = ?, IndentID = ?, PurchaseRequestAmount = ?, PRRequestor = ?, PRStatus = ? WHERE PurchaseReqID = ?';
  db.query(query, [PRDate, ProjectNo, IndentID, PurchaseRequestAmount, PRRequestor, PRStatus, id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Error updating purchase request' });
    res.status(200).json({ message: 'Purchase request updated successfully' });
  });
});

// Delete a purchase request
app.delete('/api/purchaseRequests/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM purchase_requests WHERE PurchaseReqID = ?';
  db.query(query, [id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Error deleting purchase request' });
    res.status(200).json({ message: 'Purchase request deleted successfully' });
  });
});

// --- Purchase Orders CRUD Operations ---

// Get all purchase orders
app.get('/api/purchaseOrders', (req, res) => {
  const query = 'SELECT * FROM purchase_orders';
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    res.status(200).json({ purchaseOrders: results });
  });
});

// Get a single purchase order by ID
app.get('/api/purchaseOrders/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM purchase_orders WHERE PurchaseOrderID = ?';
  db.query(query, [id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (results.length === 0) return res.status(404).json({ message: 'Purchase order not found' });
    res.status(200).json({ purchaseOrder: results[0] });
  });
});

// Create a new purchase order
app.post('/api/purchaseOrders', (req, res) => {
  const { PODate, ProjectNo, PurchaseReqID, PurchaseOrderAmount, PORequestor, POStatus } = req.body;
  const query = 'INSERT INTO purchase_orders (PODate, ProjectNo, PurchaseReqID, PurchaseOrderAmount, PORequestor, POStatus) VALUES (?, ?, ?, ?, ?, ?)';
  db.query(query, [PODate, ProjectNo, PurchaseReqID, PurchaseOrderAmount, PORequestor, POStatus], (err, result) => {
    if (err) return res.status(500).json({ message: 'Error adding purchase order' });
    res.status(201).json({ message: 'Purchase order added successfully' });
  });
});

// Update a purchase order
app.put('/api/purchaseOrders/:id', (req, res) => {
  const { id } = req.params;
  const { PODate, ProjectNo, PurchaseReqID, PurchaseOrderAmount, PORequestor, POStatus } = req.body;
  const query = 'UPDATE purchase_orders SET PODate = ?, ProjectNo = ?, PurchaseReqID = ?, PurchaseOrderAmount = ?, PORequestor = ?, POStatus = ? WHERE PurchaseOrderID = ?';
  db.query(query, [PODate, ProjectNo, PurchaseReqID, PurchaseOrderAmount, PORequestor, POStatus, id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Error updating purchase order' });
    res.status(200).json({ message: 'Purchase order updated successfully' });
  });
});

// Delete a purchase order
app.delete('/api/purchaseOrders/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM purchase_orders WHERE PurchaseOrderID = ?';
  db.query(query, [id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Error deleting purchase order' });
    res.status(200).json({ message: 'Purchase order deleted successfully' });
  });
});

// --- Manpower CRUD Operations ---

// Get all manpower records
app.get('/api/manpower', (req, res) => {
  const query = 'SELECT * FROM manpower';
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    res.status(200).json({ manpower: results });
  });
});

// Get a specific manpower record by ID
app.get('/api/manpower/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM manpower WHERE ManpowerId = ?';
  db.query(query, [id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (results.length === 0) return res.status(404).json({ message: 'Manpower record not found' });
    res.status(200).json({ manpower: results[0] });
  });
});

// Create a new manpower record
app.post('/api/manpower', (req, res) => {
  const { ProjectNo, ProjectTitle, ManPowerRequestedAmt, IndentID, RequestedMonth, RequestedYear, BillCopy } = req.body;
  const query = 'INSERT INTO manpower (ProjectNo, ProjectTitle, ManPowerRequestedAmt, IndentID, RequestedMonth, RequestedYear, BillCopy) VALUES (?, ?, ?, ?, ?, ?, ?)';
  db.query(query, [ProjectNo, ProjectTitle, ManPowerRequestedAmt, IndentID, RequestedMonth, RequestedYear, BillCopy], (err, result) => {
    if (err) return res.status(500).json({ message: 'Error adding manpower record' });
    res.status(201).json({ message: 'Manpower record added successfully' });
  });
});

// Update a manpower record by ID
app.put('/api/manpower/:id', (req, res) => {
  const { id } = req.params;
  const { ProjectNo, ProjectTitle, ManPowerRequestedAmt, IndentID, RequestedMonth, RequestedYear, BillCopy } = req.body;
  const query = 'UPDATE manpower SET ProjectNo = ?, ProjectTitle = ?, ManPowerRequestedAmt = ?, IndentID = ?, RequestedMonth = ?, RequestedYear = ?, BillCopy = ? WHERE ManpowerId = ?';
  db.query(query, [ProjectNo, ProjectTitle, ManPowerRequestedAmt, IndentID, RequestedMonth, RequestedYear, BillCopy, id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Error updating manpower record' });
    res.status(200).json({ message: 'Manpower record updated successfully' });
  });
});

// Delete a manpower record by ID
app.delete('/api/manpower/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM manpower WHERE ManpowerId = ?';
  db.query(query, [id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Error deleting manpower record' });
    res.status(200).json({ message: 'Manpower record deleted successfully' });
  });
});

app.post('/api/consumables', async (req, res) => {
  const {
    ProjectNo,
    ProjectTitle,
    ConsumablesRequestedAmt,
    RequestedMonth,
    RequestedYear,
    BillCopy,
    IndentDate,
    IndentAmount,
    PurchaseOrderDate,
    PurchaseOrderAmount,
    Remark
  } = req.body;

  // Validate required fields
  if (!ProjectNo || !ProjectTitle || !ConsumablesRequestedAmt || !RequestedMonth || !RequestedYear || !IndentDate || !IndentAmount) {
    return res.status(400).json({ message: 'Required fields are missing' });
  }

  const IndentID = generateIndentID();
  const query = `
    INSERT INTO consumables (
      ProjectNo, ProjectTitle, ConsumablesRequestedAmt, IndentID, RequestedMonth, RequestedYear, 
      BillCopy, IndentDate, IndentAmount, PurchaseOrderDate, PurchaseOrderAmount, Remark
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  try {
    const [result] = await db.promise().query(query, [
      ProjectNo,
      ProjectTitle,
      ConsumablesRequestedAmt,
      IndentID,
      RequestedMonth,
      RequestedYear,
      BillCopy,
      IndentDate,
      IndentAmount,
      PurchaseOrderDate,
      PurchaseOrderAmount,
      Remark
    ]);
    res.status(201).json({
      message: 'Consumables record added successfully',
      indentId: IndentID
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding consumables record' });
  }
});

// --- Get all consumables records ---
app.get('/api/consumables', async (req, res) => {
  const query = 'SELECT * FROM consumables';
  try {
    const [results] = await db.promise().query(query);
    res.status(200).json({ consumables: results });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Database error' });
  }
});

// --- Get a specific consumable record by ID ---
app.get('/api/consumables/:id', async (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM consumables WHERE ConsumablesId = ?';
  try {
    const [results] = await db.promise().query(query, [id]);
    if (results.length === 0) {
      return res.status(404).json({ message: 'Consumables record not found' });
    }
    res.status(200).json({ consumable: results[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Database error' });
  }
});

// --- Update a consumable record by ID ---
app.put('/api/consumables/:id', async (req, res) => {
  const { id } = req.params;
  const {
    ProjectNo,
    ProjectTitle,
    ConsumablesRequestedAmt,
    RequestedMonth,
    RequestedYear,
    BillCopy,
    IndentDate,
    IndentAmount,
    PurchaseOrderDate,
    PurchaseOrderAmount,
    Remark
  } = req.body;

  const query = `
    UPDATE consumables SET 
      ProjectNo = ?, ProjectTitle = ?, ConsumablesRequestedAmt = ?, 
      RequestedMonth = ?, RequestedYear = ?, BillCopy = ?, 
      IndentDate = ?, IndentAmount = ?, PurchaseOrderDate = ?, 
      PurchaseOrderAmount = ?, Remark = ?
    WHERE ConsumablesId = ?
  `;

  try {
    const [result] = await db.promise().query(query, [
      ProjectNo,
      ProjectTitle,
      ConsumablesRequestedAmt,
      RequestedMonth,
      RequestedYear,
      BillCopy,
      IndentDate,
      IndentAmount,
      PurchaseOrderDate,
      PurchaseOrderAmount,
      Remark,
      id
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Consumables record not found' });
    }

    res.status(200).json({ message: 'Consumables record updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating consumables record' });
  }
});

// --- Delete a consumable record by ID ---
app.delete('/api/consumables/:id', async (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM consumables WHERE ConsumablesId = ?';

  try {
    const [result] = await db.promise().query(query, [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Consumables record not found' });
    }

    res.status(200).json({ message: 'Consumables record deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting consumables record' });
  }
});


// --- Contingency CRUD Operations ---

// Get all contingency records
app.get('/api/contingency', (req, res) => {
  const query = 'SELECT * FROM contingency';
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    res.status(200).json({ contingency: results });
  });
});

// Get a specific contingency record by ID
app.get('/api/contingency/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM contingency WHERE ContingencyId = ?';
  db.query(query, [id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (results.length === 0) return res.status(404).json({ message: 'Contingency record not found' });
    res.status(200).json({ contingency: results[0] });
  });
});

// Create a new contingency record
app.post('/api/contingency', (req, res) => {
  const { ProjectNo, ProjectTitle, ContingencyRequestedAmt, IndentID, RequestedMonth, RequestedYear, BillCopy } = req.body;
  const query = 'INSERT INTO contingency (ProjectNo, ProjectTitle, ContingencyRequestedAmt, IndentID, RequestedMonth, RequestedYear, BillCopy) VALUES (?, ?, ?, ?, ?, ?, ?)';
  db.query(query, [ProjectNo, ProjectTitle, ContingencyRequestedAmt, IndentID, RequestedMonth, RequestedYear, BillCopy], (err, result) => {
    if (err) return res.status(500).json({ message: 'Error adding contingency record' });
    res.status(201).json({ message: 'Contingency record added successfully' });
  });
});

// Update a contingency record by ID
app.put('/api/contingency/:id', (req, res) => {
  const { id } = req.params;
  const { ProjectNo, ProjectTitle, ContingencyRequestedAmt, IndentID, RequestedMonth, RequestedYear, BillCopy } = req.body;
  const query = 'UPDATE contingency SET ProjectNo = ?, ProjectTitle = ?, ContingencyRequestedAmt = ?, IndentID = ?, RequestedMonth = ?, RequestedYear = ?, BillCopy = ? WHERE ContingencyId = ?';
  db.query(query, [ProjectNo, ProjectTitle, ContingencyRequestedAmt, IndentID, RequestedMonth, RequestedYear, BillCopy, id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Error updating contingency record' });
    res.status(200).json({ message: 'Contingency record updated successfully' });
  });
});

// Delete a contingency record by ID
app.delete('/api/contingency/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM contingency WHERE ContingencyId = ?';
  db.query(query, [id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Error deleting contingency record' });
    res.status(200).json({ message: 'Contingency record deleted successfully' });
  });
});

// --- Equipment CRUD Operations ---

// Get all equipment records
app.post('/api/equipment', async (req, res) => {
  const {
    ProjectNo,
    ProjectTitle,
    EquipmentRequestedAmt,
    RequestedMonth,
    RequestedYear,
    BillCopy,
    IndentDate,
    IndentAmount,
    PurchaseOrderDate,
    PurchaseOrderAmount,
    Remark,
    EquipmentDetails // Array of { EquipmentName, Quantity }
  } = req.body;

  if (!ProjectNo || !ProjectTitle || !EquipmentRequestedAmt || !RequestedMonth || !RequestedYear || !IndentDate || !IndentAmount || !EquipmentDetails) {
    return res.status(400).json({ message: 'Required fields are missing' });
  }

  const IndentID = generateIndentID();
  const connection = db.promise();

  try {
    // Start transaction
    await connection.beginTransaction();

    // Insert into equipment table
    const [equipmentResult] = await connection.query(
      `INSERT INTO equipment (
        ProjectNo, ProjectTitle, EquipmentRequestedAmt, IndentID, RequestedMonth, RequestedYear,
        BillCopy, IndentDate, IndentAmount, PurchaseOrderDate, PurchaseOrderAmount, Remark
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        ProjectNo, ProjectTitle, EquipmentRequestedAmt, IndentID, RequestedMonth, RequestedYear,
        BillCopy, IndentDate, IndentAmount, PurchaseOrderDate, PurchaseOrderAmount, Remark
      ]
    );

    const EquipmentId = equipmentResult.insertId;

    // Insert into equipment_details table
    const equipmentDetailsData = EquipmentDetails.map(detail => [EquipmentId, detail.EquipmentName, detail.Quantity]);
    await connection.query(
      `INSERT INTO equipment_details (EquipmentId, EquipmentName, Quantity) VALUES ?`,
      [equipmentDetailsData]
    );

    // Commit transaction
    await connection.commit();

    res.status(201).json({ message: 'Equipment record added successfully', indentId: IndentID });
  } catch (error) {
    // Rollback transaction on error
    await connection.rollback();
    console.error(error);
    res.status(500).json({ message: 'Error adding equipment record' });
  }
});


app.get('/api/equipment', async (req, res) => {
  try {
    const [equipment] = await db.promise().query('SELECT * FROM equipment');
    const [details] = await db.promise().query('SELECT * FROM equipment_details');

    // Combine details with main equipment data
    const data = equipment.map(record => ({
      ...record,
      EquipmentDetails: details.filter(detail => detail.EquipmentId === record.EquipmentId)
    }));

    res.status(200).json({ equipment: data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Database error' });
  }
});


// Create a new equipment record
app.get('/api/equipment/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [equipment] = await db.promise().query('SELECT * FROM equipment WHERE EquipmentId = ?', [id]);
    if (equipment.length === 0) {
      return res.status(404).json({ message: 'Equipment record not found' });
    }

    const [details] = await db.promise().query('SELECT * FROM equipment_details WHERE EquipmentId = ?', [id]);

    res.status(200).json({
      ...equipment[0],
      EquipmentDetails: details
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Database error' });
  }
});


// Update an equipment record by ID
app.put('/api/equipment/:id', async (req, res) => {
  const { id } = req.params;
  const {
    ProjectNo,
    ProjectTitle,
    EquipmentRequestedAmt,
    RequestedMonth,
    RequestedYear,
    BillCopy,
    IndentDate,
    IndentAmount,
    PurchaseOrderDate,
    PurchaseOrderAmount,
    Remark,
    EquipmentDetails
  } = req.body;

  const connection = db.promise();

  try {
    // Start transaction
    await connection.beginTransaction();

    // Update equipment table
    await connection.query(
      `UPDATE equipment SET 
        ProjectNo = ?, ProjectTitle = ?, EquipmentRequestedAmt = ?, RequestedMonth = ?, RequestedYear = ?, 
        BillCopy = ?, IndentDate = ?, IndentAmount = ?, PurchaseOrderDate = ?, PurchaseOrderAmount = ?, Remark = ?
      WHERE EquipmentId = ?`,
      [
        ProjectNo, ProjectTitle, EquipmentRequestedAmt, RequestedMonth, RequestedYear,
        BillCopy, IndentDate, IndentAmount, PurchaseOrderDate, PurchaseOrderAmount, Remark, id
      ]
    );

    // Delete existing details
    await connection.query('DELETE FROM equipment_details WHERE EquipmentId = ?', [id]);

    // Insert new details
    const equipmentDetailsData = EquipmentDetails.map(detail => [id, detail.EquipmentName, detail.Quantity]);
    await connection.query(
      `INSERT INTO equipment_details (EquipmentId, EquipmentName, Quantity) VALUES ?`,
      [equipmentDetailsData]
    );

    // Commit transaction
    await connection.commit();

    res.status(200).json({ message: 'Equipment record updated successfully' });
  } catch (error) {
    // Rollback transaction on error
    await connection.rollback();
    console.error(error);
    res.status(500).json({ message: 'Error updating equipment record' });
  }
});


app.delete('/api/equipment/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.promise().query('DELETE FROM equipment WHERE EquipmentId = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Equipment record not found' });
    }

    res.status(200).json({ message: 'Equipment record deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting equipment record' });
  }
});


// --- Overheads CRUD Operations ---

// Get all overhead records
app.get('/api/overheads', (req, res) => {
  const query = 'SELECT * FROM overheads';
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    res.status(200).json({ overheads: results });
  });
});

// Get a specific overhead record by ID
app.get('/api/overheads/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM overheads WHERE OverheadId = ?';
  db.query(query, [id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (results.length === 0) return res.status(404).json({ message: 'Overhead record not found' });
    res.status(200).json({ overhead: results[0] });
  });
});

// Create a new overhead record
app.post('/api/overheads', (req, res) => {
  const { ProjectNo, ProjectTitle, OverheadRequestedAmt, IndentID, RequestedMonth, RequestedYear, BillCopy } = req.body;
  const query = 'INSERT INTO overheads (ProjectNo, ProjectTitle, OverheadRequestedAmt, IndentID, RequestedMonth, RequestedYear, BillCopy) VALUES (?, ?, ?, ?, ?, ?, ?)';
  db.query(query, [ProjectNo, ProjectTitle, OverheadRequestedAmt, IndentID, RequestedMonth, RequestedYear, BillCopy], (err, result) => {
    if (err) return res.status(500).json({ message: 'Error adding overhead record' });
    res.status(201).json({ message: 'Overhead record added successfully' });
  });
});

// Update an overhead record by ID
app.put('/api/overheads/:id', (req, res) => {
  const { id } = req.params;
  const { ProjectNo, ProjectTitle, OverheadRequestedAmt, IndentID, RequestedMonth, RequestedYear, BillCopy } = req.body;
  const query = 'UPDATE overheads SET ProjectNo = ?, ProjectTitle = ?, OverheadRequestedAmt = ?, IndentID = ?, RequestedMonth = ?, RequestedYear = ?, BillCopy = ? WHERE OverheadId = ?';
  db.query(query, [ProjectNo, ProjectTitle, OverheadRequestedAmt, IndentID, RequestedMonth, RequestedYear, BillCopy, id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Error updating overhead record' });
    res.status(200).json({ message: 'Overhead record updated successfully' });
  });
});

// Delete an overhead record by ID
app.delete('/api/overheads/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM overheads WHERE OverheadId = ?';
  db.query(query, [id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Error deleting overhead record' });
    res.status(200).json({ message: 'Overhead record deleted successfully' });
  });
});

// --- Travel CRUD Operations ---

// Get all travel records
app.get('/api/travel', (req, res) => {
  const query = 'SELECT * FROM travel';
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    res.status(200).json({ travel: results });
  });
});

// Get a specific travel record by ID
app.get('/api/travel/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM travel WHERE TravelId = ?';
  db.query(query, [id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (results.length === 0) return res.status(404).json({ message: 'Travel record not found' });
    res.status(200).json({ travel: results[0] });
  });
});

// Create a new travel record


// Update a travel record by ID
// app.put('/api/travel/:id', (req, res) => {
//   const { id } = req.params;
//   const { ProjectNo, ProjectTitle, TravelRequestedAmt, IndentID, RequestedMonth, RequestedYear, BillCopy } = req.body;
//   const query = 'UPDATE travel SET ProjectNo = ?, ProjectTitle = ?, TravelRequestedAmt = ?, IndentID = ?, RequestedMonth = ?, RequestedYear = ?, BillCopy = ? WHERE TravelId = ?';
//   db.query(query, [ProjectNo, ProjectTitle, TravelRequestedAmt, IndentID, RequestedMonth, RequestedYear, BillCopy, id], (err, result) => {
//     if (err) return res.status(500).json({ message: 'Error updating travel record' });
//     res.status(200).json({ message: 'Travel record updated successfully' });
//   });
// });

// Delete a travel record by ID
app.delete('/api/travel/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM travel WHERE TravelId = ?';
  db.query(query, [id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Error deleting travel record' });
    res.status(200).json({ message: 'Travel record deleted successfully' });
  });
});

// Start the server
app.listen(3000, () => {
  log('Server running on port 3000');
});