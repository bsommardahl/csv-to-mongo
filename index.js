'use strict';

const split = require('split');
const Hapi = require('hapi');
const db = require('./db');
const tapHelper = require('./tapHelper');

const server = new Hapi.Server();
server.connection({ port: process.env.POST || 10123 });

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
            var data = request.payload;

            data.file.on('error', function (err) {
                console.error(err)
            });

            var header;
            data.file.pipe(split())
                .on('data', function(line){
                    if(!header){
                        header = line;
                    }
                    else{
                        db.insert(tapHelper.buildTapFromLine(header, line))
                            .then((res) => {
                                console.log("inserted");
                            });
                    }
                });

            data.file.on('end', function (err) {
                var ret = {
                    filename: data.file.hapi.filename,
                    headers: data.file.hapi.headers
                }
                reply(JSON.stringify(ret));
            })
        }
    }
});

server.start((err) => {

    if (err) {
        throw err;
    }
    console.log(`Server running at: ${server.info.uri}`);
});