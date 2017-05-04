const uri = process.env.MONGODB_URI
var MongoClient = require('mongodb').MongoClient;
const batchSize = 500;

var col;
MongoClient.connect(uri, {
    connectTimeoutMS: 90000,
    socketTimeoutMS:90000,
    autoReconnect: true,
    poolSize: 30
}, function(err, db) {
    col = db.collection(process.env.COLLECTION_NAME);
});

function insertBatch(batch, resolve, reject) {
    col.insertMany(batch, function(err, result){
        if(err){
            reject(err);
        }
        else{
            resolve(result);
        }
    });
};

var items = [];
module.exports = {
    insert: (obj) => {
        return new Promise((resolve, reject) => {
            items.push(obj);
            const hasReachedTheBatchSize = items.length % batchSize === 0;
            if(hasReachedTheBatchSize){
                var batch = items;
                items = [];
                insertBatch(batch, resolve, reject);
            }
            else{
                resolve();
            }
        });
    },
    finish: () => {
        return new Promise((resolve, reject)=>{
            insertBatch(items, resolve, reject);
        });
    }
};