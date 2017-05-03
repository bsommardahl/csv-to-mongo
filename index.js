'use strict';

const split = require('split');
const Hapi = require('hapi');

const server = new Hapi.Server();
server.connection({ port: process.env.POST || 10123 });

function insertIntoMongo(obj){
    console.log(obj);
}
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

            function buildObjectFromLine(header, line) {
                var fieldNames = header.split(',');
                var fieldValues = line.split(',');
                var obj = new Object();
                for(var i = 0; i<fieldNames.length; i++){
                    obj[fieldNames[i]] = fieldValues[i];
                }
                return obj;
            };
            var header;
            data.file.pipe(split())
                .on('data', function(line){
                    if(!header){
                        header = line;
                    }
                    else{
                        console.log("line: ", line);
                        var obj = buildObjectFromLine(header, line);
                        insertIntoMongo(obj);
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