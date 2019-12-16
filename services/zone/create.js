'use strict';
const uuid = require('node-uuid');
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


        let organizations = [];

        if (data.id) {
            try {
                organizations = await schema.Organization.find({
                    'membership.user': data.id
                }, 'name membership.user membership.role quota')
            } catch (e) {
                return reject(e)
            }
        } else if (data.name) {
            try {
                organizations = [await schema.Organization.findOne({
                    name: name
                })]
            } catch (e) {
                return reject(e)
            }
        }


        resolve(organizations)

    },
    events: {}
});


/**
 * Export
 */

module.exports = routes;