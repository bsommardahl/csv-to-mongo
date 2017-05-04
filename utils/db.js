const ThrottledPromise = require('throttled-promise');
const uri = process.env.MONGODB_URI
const MongoClient = require('mongodb').MongoClient;
const batchSize = parseInt(process.env.INSERT_BATCH_SIZE || 500);

let col;
MongoClient.connect(uri, {
    connectTimeoutMS: 90000,
    socketTimeoutMS:90000,
    autoReconnect: true,
    poolSize: 30
}, (err, db) => {
    col = db.collection(process.env.COLLECTION_NAME);
});

var insertCounter = 0;
const insertBatch = (batch, resolve, reject) => {
    col.insertMany(batch, (err, result) => {
        if(err){
            reject(err);
        }
        else{
            insertCounter ++;
            console.log(`${insertCounter}: Inserted batch of ${batch.length} records.`);
            resolve(result);
        }
    });
};

let items = [];
module.exports = {
    insert: (obj) => {
        return new ThrottledPromise((resolve, reject) => {
            items.push(obj);
            const hasReachedTheBatchSize = items.length % batchSize === 0;
            if(hasReachedTheBatchSize){
                const batch = items;
                items = [];
                insertBatch(batch, resolve, reject);
            }
            else{
                resolve();
            }
        });
    },
    finishInsertingTheLastOfTheRecords: () => {
        return new Promise((resolve, reject)=>{
            insertBatch(items, resolve, reject);
        });
    },
    waitFor: (promises) => {
        return ThrottledPromise.all(promises, parseInt(process.env.PROMISE_THROTTLE || 20));
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