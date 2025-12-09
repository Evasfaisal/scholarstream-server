
const { ObjectId } = require('mongodb');
const COLLECTION_NAME = 'users';

async function createUser(db, data) {
    data.role = data.role || 'Student';
    return db.collection(COLLECTION_NAME).insertOne(data);
}

async function getUserByEmail(db, email) {
    return db.collection(COLLECTION_NAME).findOne({ email });
}

async function updateUserRole(db, email, role) {
    return db.collection(COLLECTION_NAME).updateOne({ email }, { $set: { role } });
}

module.exports = { createUser, getUserByEmail, updateUserRole };
