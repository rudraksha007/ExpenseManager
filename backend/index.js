import { log } from './utils.js';
import express from 'express';
import dotenv from 'dotenv';
import { login, autoLogin, getProjects, logout, getUsers, getProjectInfo, getIndents, getBillCopy, getIndentInfo, updateIndentStatus, getPR, getPO, getPRInfo, updatePRStatus } from './callbacks/postReqs.js';
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


if (process.env.NODE_ENV === 'production') {
  // Serve static files from React app
  app.use(express.static(__dirname + '/../frontend/dist'));

  // Handle all other routes and serve index.html for React Router
  app.get('*', (req, res) => {
    res.sendFile(__dirname + '/../frontend/dist/index.html');
  });
} else {
  // In development, you don't serve static files from Express
  console.log("Running in development mode. React is being served by Vite.");
}

app.listen(3000, () => {
  log('Server running on port 3000');
});