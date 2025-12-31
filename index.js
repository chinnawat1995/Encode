"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var crypto = require("crypto");
// if (process.argv.length < 3) {
//   console.log("Please provide a string to encode as a command line argument.");
//   process.exit(1);
// }
var input = "";
var ENCRYPTION_KEY = Buffer.from("d02fb7d97c4a4d4a8ea47b3bd514305444fa3b89a6d8d2b12990016c403a39fb", "hex");
var IV_LENGTH = 16; // For AES, this is always 16
function encrypt(text) {
    var iv = crypto.randomBytes(IV_LENGTH);
    var cipher = crypto.createCipheriv("aes-256-cbc", ENCRYPTION_KEY, iv);
    var encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString("hex") + ":" + encrypted.toString("hex");
}
function decrypt(text) {
    var textParts = text.split(":");
    var ivHex = textParts.shift();
    if (!ivHex) {
        throw new Error("Invalid encrypted text format: missing IV");
    }
    var iv = Buffer.from(ivHex, "hex");
    var encryptedText = Buffer.from(textParts.join(":"), "hex");
    var key = typeof ENCRYPTION_KEY === "string"
        ? Buffer.from(ENCRYPTION_KEY, "hex")
        : ENCRYPTION_KEY;
    var decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
    var decrypted = Buffer.concat([
        decipher.update(encryptedText),
        decipher.final(),
    ]);
    return decrypted.toString();
}
// let encrypted = encrypt(input);
// console.log(`Encrypted: ${encrypted}`);
var decrypted = decrypt(input);
console.log("Decrypted: ".concat(decrypted));
