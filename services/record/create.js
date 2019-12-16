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
        path: 'create',
        version: 1,
        concurrency: 100
    },
    service: async function (resolve, reject) {

        let ctx = this;
        let data = ctx.data;
        let schema = ctx.schema;

        let {domain, email} = data;

        domain = tld.getDomain(domain.replace('*.', ''));

        let zone;

        try {
            zone = await schema.Zone.find({
                domain: domain
            });
            if (zone)
                return reject(zone);
        } catch (e) {
            return reject(e)
        }
        zone = new schema.Zone({
            domain: domain,
            email: email
        });

        try {
            await zone.save()
        } catch (e) {
            return reject(e)
        }

        resolve(zone)

    },
    events: {}
});


/**
 * Export
 */

module.exports = routes;