const uri = process.env.MONGODB_URI
const MongoClient = require('mongodb').MongoClient;

let col;
MongoClient.connect(uri, {
    connectTimeoutMS: 90000,
    socketTimeoutMS:90000,
    autoReconnect: true,
    poolSize: 30
}, (err, db) => {
    col = db.collection(process.env.COLLECTION_NAME);
});

module.exports = {
    insert: (batch) => {
        return new Promise((resolve, reject) => {
            col.insertMany(batch, (err, result) => {
                if(err){
                    reject(err);
                }
                else{
                    resolve(result);
                }
            });
        })
    },
    checkDb: () => {
        return new Promise((resolve, reject) => {
            col.findOne({}, (err, doc) => {
                if(err){
                    reject(err);
                }
                else{
                    resolve(doc);
                }
            });
        });
    }
};