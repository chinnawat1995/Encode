import * as crypto from 'crypto';

if (process.argv.length < 3) {
  console.log("Please provide a string to encode as a command line argument.");
  process.exit(1);
}

let input = process.argv[2];

const ENCRYPTION_KEY = Buffer.from('d02fb7d97c4a4d4a8ea47b3bd514305444fa3b89a6d8d2b12990016c403a39fb', 'hex');
const IV_LENGTH = 16; // For AES, this is always 16

function encrypt(text: string): string {
    let iv = crypto.randomBytes(IV_LENGTH);
    let cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
    let encrypted = cipher.update(text);

    encrypted = Buffer.concat([encrypted, cipher.final()]);

    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decrypt(text: string): string {
    let textParts = text.split(':');
    let iv = Buffer.from(textParts.shift(), 'hex');
    let encryptedText = Buffer.from(textParts.join(':'), 'hex');
    let decipher = crypto.createDecipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
    let decrypted = decipher.update(encryptedText);

    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted.toString();
}

let decrypted = decrypt(input);
console.log(`Decrypted: ${decrypted}`);
