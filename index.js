'use strict';

const Hapi = require('hapi');
const fileHandler = require('./handlers/fileHandler');
const Boom = require('boom');
const db = require('./utils/db');

const server = new Hapi.Server({
    debug: { request: ['error'] },
    connections: {
        routes: {
            payload: {
                timeout: 599999
            },
            timeout: {
                server: 599999,
                socket: 600000
            }
        }
    }
});

server.connection({ port: process.env.PORT || 10123 });

server.route({
    method: 'GET',
    path: '/',
    config: {
        handler: (request, reply) => {
            db.checkDb().then(()=>{
                reply({status: "alive"});
            }).catch((err)=>{
                reply(Boom.wrap(err));
            });
        }
    }
});

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
        handler: (request, reply) => {
            const data = request.payload;
            fileHandler.handle(data)
                .then((result) => reply(result))
                .catch((err)=> reply(Boom.wrap(err)));
        }
    }
});

server.start((err) => {
    if (err) {
        throw err;
    }
    console.log(`Server running at: ${server.info.uri}`);
});