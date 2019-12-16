
'use strict';
const uuid = require('node-uuid');
const tld = require('tldjs');
/**
 * Routes
 */

let routes = [];


routes.push({
    meta: {
        method: 'POST',
        path: 'record.create',
        version: 1,
        concurrency: 100
    },
    service: async function (resolve, reject) {


        let ctx = this;
        let data = ctx.data;
        let schema = ctx.schema;

        var name = data.name.toLowerCase();
        var type = data.type.toUpperCase();

        var stringifiedRecord = JSON.stringify(data);

        var recordKey = type + ':' + name;

        Redis.getDB('dns', function(next) {
            var db = this;

            db.rpush(recordKey, stringifiedRecord, function() {
                db.lrange(recordKey, 0, -1, next);
            });
        }, done);


    },
    events: {}
});


/**
 * Export
 */

module.exports = routes;