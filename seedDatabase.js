const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
dotenv.config();
const uri = process.env.MONGO_URI;
const dbName = process.env.DB_NAME;

const scholarshipsData = [
    {
        scholarshipName: "Global Excellence Scholarship",
        universityName: "Harvard University",
        universityImage: "https://i.ibb.co/BsLqXwz/harvard.jpg",
        image: "https://i.ibb.co/BsLqXwz/harvard.jpg",
        universityCountry: "USA",
        universityCity: "Cambridge",
        universityWorldRank: 1,
        subjectCategory: "Engineering",
        scholarshipCategory: "Full fund",
        degree: "Masters",
        tuitionFees: 55000,
        applicationFees: 100,
        serviceCharge: 20,
        applicationDeadline: "2026-12-31",
        scholarshipPostDate: new Date(),
        postedUserEmail: "admin@scholarstream.com"
    },
    {
        scholarshipName: "Merit Scholarship",
        universityName: "Stanford University",
        universityImage: "https://i.ibb.co/Y0qNdXP/stanford.jpg",
        image: "https://i.ibb.co/Y0qNdXP/stanford.jpg",
        universityCountry: "USA",
        universityCity: "Stanford",
        universityWorldRank: 2,
        subjectCategory: "Computer Science",
        scholarshipCategory: "Partial",
        degree: "Bachelor",
        tuitionFees: 52000,
        applicationFees: 80,
        serviceCharge: 15,
        applicationDeadline: "2026-11-30",
        scholarshipPostDate: new Date(),
        postedUserEmail: "admin@scholarstream.com"
    },
    {
        scholarshipName: "International Student Grant",
        universityName: "MIT",
        universityImage: "https://i.ibb.co/kBvZV6M/mit.jpg",
        image: "https://i.ibb.co/kBvZV6M/mit.jpg",
        universityCountry: "USA",
        universityCity: "Cambridge",
        universityWorldRank: 3,
        subjectCategory: "Science",
        scholarshipCategory: "Full fund",
        degree: "Masters",
        tuitionFees: 58000,
        applicationFees: 120,
        serviceCharge: 25,
        applicationDeadline: "2027-01-15",
        scholarshipPostDate: new Date(),
        postedUserEmail: "admin@scholarstream.com"
    },
    {
        scholarshipName: "Academic Excellence Award",
        universityName: "Oxford University",
        universityImage: "https://i.ibb.co/3RfLxYZ/oxford.jpg",
        image: "https://i.ibb.co/3RfLxYZ/oxford.jpg",
        universityCountry: "UK",
        universityCity: "Oxford",
        universityWorldRank: 4,
        subjectCategory: "Arts",
        scholarshipCategory: "Partial",
        degree: "Bachelor",
        tuitionFees: 45000,
        applicationFees: 90,
        serviceCharge: 18,
        applicationDeadline: "2026-10-31",
        scholarshipPostDate: new Date(),
        postedUserEmail: "admin@scholarstream.com"
    },
    {
        scholarshipName: "Research Fellowship",
        universityName: "Cambridge University",
        universityImage: "https://i.ibb.co/LPcgHXm/cambridge.jpg",
        image: "https://i.ibb.co/LPcgHXm/cambridge.jpg",
        universityCountry: "UK",
        universityCity: "Cambridge",
        universityWorldRank: 5,
        subjectCategory: "Medicine",
        scholarshipCategory: "Full fund",
        degree: "Diploma",
        applicationFees: 0,
        serviceCharge: 10,
        applicationDeadline: "2026-12-15",
        scholarshipPostDate: new Date(),
        postedUserEmail: "admin@scholarstream.com"
    },
    {
        scholarshipName: "Innovation Scholarship",
        universityName: "ETH Zurich",
        universityImage: "https://i.ibb.co/ZMTfR9v/eth.jpg",
        image: "https://i.ibb.co/ZMTfR9v/eth.jpg",
        universityCountry: "Switzerland",
        universityCity: "Zurich",
        universityWorldRank: 6,
        subjectCategory: "Engineering",
        scholarshipCategory: "Partial",
        degree: "Masters",
        tuitionFees: 40000,
        applicationFees: 70,
        serviceCharge: 15,
        applicationDeadline: "2027-02-28",
        scholarshipPostDate: new Date(),
        postedUserEmail: "admin@scholarstream.com"
    },
    {
        scholarshipName: "Diversity Scholarship",
        universityName: "University of Toronto",
        universityImage: "https://i.ibb.co/JCY3Wxz/toronto.jpg",
        image: "https://i.ibb.co/JCY3Wxz/toronto.jpg",
        universityCountry: "Canada",
        universityCity: "Toronto",
        universityWorldRank: 18,
        subjectCategory: "Business",
        scholarshipCategory: "Partial",
        degree: "Bachelor",
        tuitionFees: 35000,
        applicationFees: 60,
        serviceCharge: 12,
        applicationDeadline: "2026-11-15",
        scholarshipPostDate: new Date(),
        postedUserEmail: "admin@scholarstream.com"
    },
    {
        scholarshipName: "Future Leaders Program",
        universityName: "National University of Singapore",
        universityImage: "https://i.ibb.co/wMfGHcL/nus.jpg",
        image: "https://i.ibb.co/wMfGHcL/nus.jpg",
        universityCountry: "Singapore",
        universityCity: "Singapore",
        universityWorldRank: 11,
        subjectCategory: "Computer Science",
        scholarshipCategory: "Full fund",
        degree: "Masters",
        tuitionFees: 38000,
        applicationFees: 50,
        serviceCharge: 10,
        applicationDeadline: "2027-03-31",
        scholarshipPostDate: new Date(),
        postedUserEmail: "admin@scholarstream.com"
    },
    {
        scholarshipName: "Sports Excellence Scholarship",
        universityName: "University of Melbourne",
        universityImage: "https://i.ibb.co/WgzBYxf/melbourne.jpg",
        image: "https://i.ibb.co/WgzBYxf/melbourne.jpg",
        universityCountry: "Australia",
        universityCity: "Melbourne",
        universityWorldRank: 14,
        subjectCategory: "Sports Science",
        scholarshipCategory: "Self-fund",
        degree: "Bachelor",
        tuitionFees: 32000,
        applicationFees: 40,
        serviceCharge: 8,
        applicationDeadline: "2026-09-30",
        scholarshipPostDate: new Date(),
        postedUserEmail: "admin@scholarstream.com"
    },
    {
        scholarshipName: "Environmental Studies Grant",
        universityName: "Technical University of Munich",
        universityImage: "https://i.ibb.co/K5vNp7J/tum.jpg",
        image: "https://i.ibb.co.com/Kxsj0mpX/massachusetts-flag-with-banner.jpg",
        universityCountry: "Germany",
        universityCity: "Munich",
        universityWorldRank: 50,
        subjectCategory: "Environmental Science",
        scholarshipCategory: "Partial",
        degree: "Diploma",
        tuitionFees: 28000,
        applicationFees: 30,
        serviceCharge: 5,
        applicationDeadline: "2027-01-31",
        scholarshipPostDate: new Date(),
        postedUserEmail: "admin@scholarstream.com"
    }
];

async function seedDatabase() {
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log('✅ Connected to MongoDB');

        const db = client.db(dbName);
        const collection = db.collection('scholarships');

        // Delete all old scholarships
        const deleteResult = await collection.deleteMany({});
        console.log(`🗑️ Deleted ${deleteResult.deletedCount} old scholarships.`);

        // Prepare image links
        const imageLinks = [
            "https://i.ibb.co.com/QF8kQDJw/54.jpg",
            "https://i.ibb.co.com/WW7WrC79/121566-OQ6-ZM8-173.jpg",
            "https://i.ibb.co.com/4gRw1rnR/124493-OQIKUM-358.jpg",
            "https://i.ibb.co.com/1tjFYBBj/330668-P9-SJW6-863.jpg",
            "https://i.ibb.co.com/6RMxzgwN/7598133.jpg",
            "https://i.ibb.co.com/Kxsj0mpX/massachusetts-flag-with-banner.jpg"
        ];

        // Assign random images to 10 scholarships
        let newScholarships = scholarshipsData.slice(0, 10).map((sch, idx) => ({
            ...sch,
            image: imageLinks[idx % imageLinks.length]
        }));

        const result = await collection.insertMany(newScholarships);
        console.log(`✅ Successfully inserted ${result.insertedCount} scholarships!`);

    } catch (err) {
        console.error('❌ Error seeding database:', err);
    } finally {
        await client.close();
        console.log('👋 Connection closed');
    }
}

async function updateImages() {
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const db = client.db(dbName);
        const scholarships = db.collection('scholarships');
        // image ফিল্ডে image || photo || universityImage বসান
        const result = await scholarships.updateMany(
            {},
            [
                {
                    $set: {
                        image: {
                            $ifNull: [
                                "$image",
                                { $ifNull: ["$photo", "$universityImage"] }
                            ]
                        }
                    }
                }
            ]
        );
        console.log(`Updated ${result.modifiedCount} scholarships.`);
    } catch (err) {
        console.error('Error updating images:', err);
    } finally {
        await client.close();
    }
}

seedDatabase();
updateImages();
