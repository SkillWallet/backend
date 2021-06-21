// var EC = require('elliptic').ec;
// var keccak256 = require('keccak256');
var eccryptoJS = require('eccrypto-js');
var axios = require('axios');
async function test() {
    function hexToBytes(hex) {
        for (var bytes = [], c = 0; c < hex.length; c += 2)
            bytes.push(parseInt(hex.substr(c, 2), 16));
        return bytes;
    }
    const key = eccryptoJS.generateKeyPair();
    const hex = key.publicKey.toString('hex');
    console.log("PUBLIC KEY HEX", hex);

    const hashed = eccryptoJS.keccak256(Buffer.from(hex));
    console.log("PUBLIC KEY HASHED", eccryptoJS.bufferToHex(hashed));
    const pubKey = eccryptoJS.bufferToHex(hashed);
    const nonce = await axios.post('https://api.skillwallet.id/api/skillwallet/6/nonces?action=0');
    const str = nonce.data.nonce.toString();
    const msg = eccryptoJS.utf8ToBuffer(str);
    eccryptoJS.sha256(msg).then(async hash => {
        const signed = eccryptoJS.sign(key.privateKey, hash, true);
        console.log("SIGNED STRING", eccryptoJS.bufferToHex(signed));
        const signature = eccryptoJS.bufferToHex(signed);

        const signatureBytes = hexToBytes(signature);
        const buf = Buffer.from(signatureBytes);
        const h = await eccryptoJS.sha256(msg);
        console.log(h);
        const pub = eccryptoJS.recover(h, buf);
        console.log(pub);
        const recoveredHexPub = pub.toString('hex');
        const hashedRecoveredPub = eccryptoJS.keccak256(Buffer.from(recoveredHexPub));

        if (pubKey === eccryptoJS.bufferToHex(hashedRecoveredPub)) {
            foundValidNonce = true;
            console.log('found valid nonce');
        }
    });

}
test();
