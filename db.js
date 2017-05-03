const uri = process.env.MONGODB_URI
var MongoClient = require('mongodb').MongoClient;

module.exports = {
    insert: (obj) => {
        return new Promise((resolve, reject) => {
            MongoClient.connect(uri, function(err, db) {
                db.collection('taps').insertOne( obj, function(err, res){
                    db.close();
                    if(err){
                        reject(err);
                    }
                    else{
                        resolve(res);
                    }
                });
            });
        });
    }
};