//Checking the crypto module
const crypto = require('crypto');
const algorithm = 'aes-256-cbc'; //Using AES encryption

class Cryptography {
    constructor(key) {
        if (!key)
            key = Buffer.from(process.env.CRYPTO_MASTER_KEY, 'hex');
        this.key = Buffer.from(key);
    }

    //Encrypting text
    encrypt(text) {
        const iv = crypto.randomBytes(16);
        let cipher = crypto.createCipheriv(algorithm, this.key, iv);
        let encrypted = cipher.update(text);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return { iv: iv.toString('hex'), encryptedText: encrypted.toString('hex') };
    }

    // Decrypting text
    decrypt(data) {
        let iv = Buffer.from(data.iv, 'hex');
        let encryptedText = Buffer.from(data.encryptedText, 'hex');
        let decipher = crypto.createDecipheriv(algorithm, this.key, iv);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted;
    }

    static generateKey() {
        return crypto.randomBytes(32);
    }
}

module.exports = Cryptography