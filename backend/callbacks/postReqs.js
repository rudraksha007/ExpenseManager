import { db, getFromDb } from "../dbUtils.js";
const compare = import('bcryptjs').compare;  // Normal import was not working so i imported it like this
import jwt from 'jsonwebtoken';
import { encrypt, Hash } from "../crypt.js";
import { log } from "../utils.js";


// autoLogin function is there in dbUtils, this is meant for manual signin page
async function login(req, res) {
  const { email, password, fingerPrint, autoLogin } = req.body;
  if (autoLogin) return res.status(200).json(null).end();
  if (!email || !password || !fingerPrint) return res.status(200).json(null).end();
  let rootPass = Hash(process.env.ROOT_PASSWORD);
  if (email === process.env.ROOT_ID && password === rootPass) {
    let token = jwt.sign({ id: 'root', role: 'root' }, process.env.SECRET_KEY, { expiresIn: '45m' });
    log('Root login successful');
    return res.cookie('token', encrypt(token, fingerPrint), { httpOnly: true }).json(
      {
        message: 'Login successful',
        role: 'root',
        name: 'root',
        id: 'root',
        email: 'root',
      }).status(200).end();
  }
  db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' }).end();
    if (results.length === 0) return res.status(404).json({ message: 'User not found' }).end();
    const user = results[0];
    compare(password, user.password, (err, isValid) => {
      if (!isValid) return res.status(401).json({ message: 'Invalid password' }).end();
      let token = jwt.sign({ id: user.id, role: user.role }, process.env.SECRET_KEY, { expiresIn: '45m' });
      return res.cookie('token', encrypt(token, fingerPrint), { httpOnly: true }).status(200).json(
        {
          message: 'Login successful',
          role: user.role,
          name: user.name,
          id: user.id,
          email: user.email,
        }).end();
    });
  });
}

function autoLogin(req, res) {
  const token = req.processed.token;
  if (token.id === 'root') return res.status(200).json({ message: 'Auto login successful', role: 'root', name: 'root', id:'root',email:'root' }).end();
  db.query('SELECT * FROM users WHERE id = ?', [token.id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' }).end();
    if (results.length === 0) {
      return res.status(404).res.clearCookie('token').json({ message: 'User not found' }).end();
    }
    const user = results[0];
    compare(password, user.password, (err, isValid) => {
      if (!isValid) return res.status(401).json({ message: 'Invalid password' }).end();
      res.status(200).json(
        {
          message: 'Login successful',
          role: user.role,
          name: user.name,
          id: user.id,
          email: user.email,
        }).end();
    });
  });
  return res.status(200).json({ message: 'Auto login successful', role: token.role });
}

function addUser(req, res) {
  const { id, name, email, password, designation, status } = req.body;
  const query = 'INSERT INTO users(id,name,email,password,designation,status) VALUES (?, ?, ?, ?, ?, ?)';
  db.query(query, [id, name, email, password, designation, status], (err, result) => {
    if (err) return res.status(500).json({ message: 'Error adding profile', err: err.message });
    res.status(201).json({ message: 'Profile added successfully' }).end();
  });
}

function getProjects(req, res) {
  getFromDb('projects', req.body.fields).then((results) => {
    res.status(200).json({ projects: results, total: results.length }).end();
  }).catch((err) => {
    res.status(500).json({ message: 'Error fetching projects', err: err.message }).end();
  });
}
export { login, addUser, autoLogin, getProjects };