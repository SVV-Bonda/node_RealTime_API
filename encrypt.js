const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
const securitykey = crypto.randomBytes(32);
const initVector = crypto.randomBytes(16);
const message = 'Hello World';

const cipher = crypto.createCipheriv(algorithm, securitykey, initVector);

let encryptedData = cipher.update(message, 'utf-8', 'hex');

encryptedData += cipher.final('hex');

console.log('Encrypted Data : ', encryptedData);

const decipher = crypto.createDecipheriv(algorithm, securitykey, initVector);

let decryptedData = decipher.update(encryptedData, 'hex', 'utf-8');

decryptedData += decipher.final('utf-8');

console.log('Decrypted Message : ', decryptedData);
