
const { ObjectId } = require('mongodb');
const COLLECTION_NAME = 'scholarships';

async function createScholarship(db, data) {
    return db.collection(COLLECTION_NAME).insertOne(data);
}

async function getScholarshipById(db, id) {
    return db.collection(COLLECTION_NAME).findOne({ _id: new ObjectId(id) });
}

module.exports = { createScholarship, getScholarshipById };
