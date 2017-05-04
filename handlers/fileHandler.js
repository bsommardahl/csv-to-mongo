const split = require('split');
const csvToObj = require('../utils/csvToObj');
const tapBuilder = require('../utils/tapBuilder');
const db = require('../utils/db');

module.exports = {
    handle(data) {
        return new Promise((resolve, reject) => {
            const stopwatchStart = new Date();
            console.log(data.file);
            data.file.on('error', (err) => {
                reject(err);
                return;
            });

            let header;
            const promisesToCompleteDbInsert = [];
            let recordCount = 0;

            data.file.pipe(split())
                .on('data', (lineFromStream) => {
                    if(!header){
                        header = lineFromStream;
                    }
                    else{
                        const objFromLine = parseTheLineIntoAnObject(header, lineFromStream);
                        const tap = buildTapObjectFromTheLineObject(objFromLine);
                        const isValidTap = tap.site_id;
                        if(isValidTap){
                            recordCount++;
                            const insertPromise = db.insert(tap);
                            promisesToCompleteDbInsert.push(insertPromise);
                        }
                    }
                });

            data.file.on('end', (err) => {
                console.log("Done reading file.");

                waitForAllTheInsertsToFinish(promisesToCompleteDbInsert)
                    .then(() => db.finishInsertingTheLastOfTheRecords())
                    .then(() => {
                        console.log("Done inserting records.");
                        const now = new Date();
                        const diff =  now - stopwatchStart;
                        const parseStats = {
                            start: stopwatchStart,
                            end: now,
                            diff: diff,
                            diffSeconds: diff / 1000,
                            records: recordCount
                        };
                        resolve(parseStats);
                    }).catch((err) => {
                        reject(err);
                    });
            });
        })
    }
};

const waitForAllTheInsertsToFinish = (promises) => {
    return db.waitFor(promises);
};

const parseTheLineIntoAnObject = (header, line) => {
    return csvToObj.parse(header, line);
};

const buildTapObjectFromTheLineObject = (objFromLine) => {
    return tapBuilder.build(objFromLine);
};