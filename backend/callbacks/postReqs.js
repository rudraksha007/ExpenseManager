import { db, decrypt, encrypt } from "../dbUtils.js";
const compare = import('bcryptjs').compare;  // Normal import was not working so i imported it like this
import crypto from 'crypto';
// const 
import jwt from 'jsonwebtoken';


// autoLogin function is there in dbUtils, this is meant for manual signin page
function login(req, res) {
  const { email, password, fingerPrint } = req.body;
  db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' }).end();
    if (results.length === 0) return res.status(404).json({ message: 'User not found' }).end();
    const user = results[0];
    compare(password, user.password, (err, isValid) => {
      if (!isValid) return res.status(401).json({ message: 'Invalid password' }).end();
      let token = jwt.sign({ id: user.id, role: user.role }, process.env.SECRET_KEY, { expiresIn: '1h' });
      res.cookie('token', encrypt(token, fingerPrint), { httpOnly: true }).status(200).json(
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
  jwt.verify(decrypt(token, req.body.fingerPrint), process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      // If token is invalid=> delete token from client side since it's probably expired
      res.clearCookie('token');
      return res.status(401).json({ message: 'Access denied' }).redirect('/login');
    }
    token = JSON.parse(decoded);
    db.query('SELECT * FROM users WHERE id = ?', [token.id], (err, results) => {
      if (err) return res.status(500).json({ message: 'Database error' }).end();
      if (results.length === 0) {

        return res.status(404).json({ message: 'User not found' }).end();
      }
      const user = results[0];
      compare(password, user.password, (err, isValid) => {
        if (!isValid) return res.status(401).json({ message: 'Invalid password' }).end();
        let token = jwt.sign({ userId: user.id, role: user.role }, process.env.SECRET_KEY, { expiresIn: '1h' });
        res.cookie('token', encrypt(token, fingerPrint), { httpOnly: true }).status(200).json(
          {
            message: 'Login successful',
            role: user.role,
            name: user.name,
            id: user.id,
            email: user.email,
          }).end();
      });
    });
    return res.status(200).json({ message: 'Auto login successful', role: decoded.role });
  });
  return res.status(400).json({ message: 'Already logged in' });
}

function addUser(req, res) {
  const { id, name, email, password, designation, status } = req.body;
  const query = 'INSERT INTO users(id,name,email,password,designation,status) VALUES (?, ?, ?, ?, ?, ?)';
  db.query(query, [id, name, email, password, designation, status], (err, result) => {
    if (err) return res.status(500).json({ message: 'Error adding profile', err: err.message });
    res.status(201).json({ message: 'Profile added successfully' }).end();
  });
}
export { login, addUser, autoLogin };