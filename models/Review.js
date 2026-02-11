const { ObjectId } = require('mongodb');
const COLLECTION_NAME = 'reviews';

async function createReview(db, data) {
    data.reviewDate = new Date();
    return db.collection(COLLECTION_NAME).insertOne(data);
}

async function getReviewById(db, id) {
    return db.collection(COLLECTION_NAME).findOne({ _id: new ObjectId(id) });
}

async function getReviewsByScholarship(db, scholarshipId) {
    return db.collection(COLLECTION_NAME).find({ scholarshipId: new ObjectId(scholarshipId) }).toArray();
}

async function getReviewsByUser(db, userEmail) {
    return db.collection(COLLECTION_NAME).find({ userEmail }).toArray();
}

async function getAllReviews(db) {
    return db.collection(COLLECTION_NAME).find().toArray();
}

async function updateReview(db, id, data) {
    return db.collection(COLLECTION_NAME).updateOne(
        { _id: new ObjectId(id) },
        { $set: data }
    );
}

async function deleteReview(db, id) {
    return db.collection(COLLECTION_NAME).deleteOne({ _id: new ObjectId(id) });
}

module.exports = {
    createReview,
    getReviewById,
    getReviewsByScholarship,
    getReviewsByUser,
    getAllReviews,
    updateReview,
    deleteReview
};
