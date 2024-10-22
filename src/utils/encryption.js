import forge from 'node-forge';

// ---------------------- Encryption Function ----------------------

// Encrypt message

export const encrypt = (message, recipientPublicKey, user) => {
    if (!recipientPublicKey || !message) return null;

    try {
        const symmetricKey = forge.random.getBytesSync(16);
        const cipher = forge.cipher.createCipher("AES-CBC", symmetricKey);
        const iv = forge.random.getBytesSync(16);
        cipher.start({ iv: iv });
        cipher.update(forge.util.createBuffer(message));
        cipher.finish();
        const encryptedData = cipher.output.getBytes();

        const recipientpublicKey =
            forge.pki.publicKeyFromPem(recipientPublicKey);
        const senderpublicKey = forge.pki.publicKeyFromPem(user.publicKey);
        const recipientEncryptedSymmetricKey =
            recipientpublicKey.encrypt(symmetricKey);
        const senderEncryptedSymmetricKey =
            senderpublicKey.encrypt(symmetricKey);

        return JSON.stringify({
            data: forge.util.encode64(encryptedData),
            recipientKey: forge.util.encode64(recipientEncryptedSymmetricKey),
            senderKey: forge.util.encode64(senderEncryptedSymmetricKey),
            iv: forge.util.encode64(iv),
        });
    } catch (error) {
        console.error("Encryption failed:", error);
        return null;
    }
}