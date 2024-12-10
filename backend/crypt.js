import crypto from 'crypto';
import { log } from './utils.js';

function Hash(text){
    return ( crypto.createHash('sha256').update(text).digest('hex'))
}

function encrypt(token, fingerPrint) {
    const key = crypto.createHash('sha256').update(fingerPrint).digest();   // 32-byte key for AES-256
    const cipher = crypto.createCipheriv('aes-256-cbc', key, process.env.SECRET_IV);
    return cipher.update(token, 'utf8', 'hex') + cipher.final('hex');
}

function decrypt(text, fingerPrint) {
    const key = crypto.createHash('sha256').update(fingerPrint).digest();   // 32-byte key for
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, process.env.SECRET_IV);
    return decipher.update(text, 'hex', 'utf8') + decipher.final('utf8');
}

export {Hash, encrypt, decrypt};