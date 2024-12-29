import express from "express";
import ViteExpress from "vite-express";
import { log } from './utils.js';
import dotenv from 'dotenv';
import { login, autoLogin, getProjects, logout, getUsers, getProjectInfo, getIndents, getBillCopy, getIndentInfo, updateIndentStatus, getPR, updatePRStatus, generateReport, getRemaining } from './callbacks/postReqs.js';
import cookieParser from 'cookie-parser';
import { authenticate, authorize, connectDb, projectWiseAuthorisation } from './dbUtils.js';
import { addPOrder, addProject,addProjectIndent,addPurchaseReq,addUser, editProject, editUser } from './callbacks/putReqs.js';
import fileUpload from 'express-fileupload';

const app = express();
const hash = import('bcryptjs').hash;
log('Starting Expense Manager Server');
dotenv.config();
app.use( express.json(),fileUpload(), cookieParser(), authenticate);
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
app.post('/api/editProject', authorize(['SuperAdmin']), (req, res) => getRemaining(req, res));


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
app.put('/api/editProfile', authorize(['Pi','SuperAdmin']), (req, res) => editUser(req, res));

ViteExpress.listen(app, 80, () =>
  console.log("Server is listening on port 80..."),
);
