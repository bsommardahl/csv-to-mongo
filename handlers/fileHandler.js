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
            })

            let header;
            var itemsToInsert = [];
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
                            itemsToInsert.push(tap);
                        }
                    }
                });

            data.file.on('end', (err) => {
                console.log(`Done loading file with ${itemsToInsert.length} items.`);

                db.insert(itemsToInsert)
                    .then(() => {
                        console.log(`Done inserting ${itemsToInsert.length} records.`);
                        const now = new Date();
                        const diff =  now - stopwatchStart;
                        const parseStats = {
                            durationSeconds: diff / 1000,
                            itemCount: itemsToInsert.length
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
    return Promise.all(promises);
};

const parseTheLineIntoAnObject = (header, line) => {
    return csvToObj.parse(header, line);
};

const buildTapObjectFromTheLineObject = (objFromLine) => {
    return tapBuilder.build(objFromLine);
};