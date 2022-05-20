var firebase = require('firebase-admin');
const serviceAccount = require('./waitlisthero-286510-firebase-adminsdk-e7vjj-f135d79958.json');
firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
});

module.exports = firebase;