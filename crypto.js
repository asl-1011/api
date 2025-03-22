function decryptAES(encryptedText, passphrase) {
    return CryptoJS.AES.decrypt(encryptedText, passphrase).toString(CryptoJS.enc.Utf8);
}
