
const { ObjectId } = require('mongodb');
const COLLECTION_NAME = 'applications';

async function createApplication(db, data) {
    data.applicationStatus = data.applicationStatus || 'pending';
    data.paymentStatus = data.paymentStatus || 'unpaid';
    data.applicationDate = data.applicationDate || new Date();
    return db.collection(COLLECTION_NAME).insertOne(data);
}

async function getApplicationById(db, id) {
    return db.collection(COLLECTION_NAME).findOne({ _id: new ObjectId(id) });
}

module.exports = { createApplication, getApplicationById };
