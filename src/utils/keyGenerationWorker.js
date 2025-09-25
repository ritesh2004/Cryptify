import forge from 'node-forge';


export const generateKeyPairSync = async () => {
    try {
        console.log('Generating RSA key pair...');
        const { publicKey, privateKey } = forge.pki.rsa.generateKeyPair(512);
        console.log('Key pair generated successfully');
        return {
            privateKey: forge.pki.privateKeyToPem(privateKey),
            publicKey: forge.pki.publicKeyToPem(publicKey)
        };
    } catch (error) {
        console.error('Key generation failed:', error);
        throw error;
    }
};