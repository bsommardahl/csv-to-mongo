'use strict';

const split = require('split');
const Hapi = require('hapi');
const db = require('./utils/db');
const csvToObj = require('./utils/csvToObj');
const tapBuilder = require('./utils/tapBuilder');

const server = new Hapi.Server();
server.connection({ port: process.env.PORT || 10123 });

server.route({
    method: 'POST',
    path: '/submit',
    config: {
        payload: {
            output: 'stream',
            parse: true,
            allow: 'multipart/form-data',
            maxBytes: 104857600
        },
        handler: function (request, reply) {
            var start = new Date();
            var data = request.payload;

            data.file.on('error', function (err) {
                console.error(err)
            });

            var header;
            var promises = [];
            data.file.pipe(split())
                .on('data', function(line){
                    if(!header){
                        header = line;
                    }
                    else{
                        var obj = csvToObj.parse(header, line);
                        var tap = tapBuilder.build(obj);
                        var insertPromise = db.insert(tap);
                        promises.push(insertPromise);
                    }
                });

            data.file.on('end', function (err) {
                console.log("Done reading file.");

                Promise.all(promises).then(() => {
                    db.finish();
                    var now = new Date();
                    var diff =  now - start;
                        reply({
                            start: start,
                            end: now,
                            diff: diff,
                            diffSeconds: diff / 1000
                        });
                    }).catch((err) => {
                        reply(err, 500);
                    });
            });
        }
    }
});

server.start((err) => {
    if (err) {
        throw err;
    }
    console.log(`Server running at: ${server.info.uri}`);
});