

const serviceAccountJSON = JSON.parse(
    Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64, 'base64').toString('utf8')
);

module.exports = serviceAccountJSON;
