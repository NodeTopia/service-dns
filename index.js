const Jerkie = require('jerkie');
const path = require('path');
const Git = require('giting');
const http = require('http');

let service = new Jerkie({
    redis: process.env.REDIS_URI,
    name: 'repo',
    schema: path.resolve(__dirname, './schema'),
    services: path.resolve(__dirname, './services'),
    methods: {
        auth: path.resolve(__dirname, './methods/auth.js'),
        role: path.resolve(__dirname, './methods/role.js'),
        //format: path.resolve(__dirname, './methods/format')
    },
    start: async function () {

        let ctx = this;

        this.git = new Git({
            auth: this.methods.auth,
            autoCreate: await this.config.get('autoCreate') || true,
            dir: await this.config.get('dir') || path.resolve(__dirname, './repos')
        });

        this.git.perm(this.methods.role);


        this.server = http.createServer(function (req, res) {

            req.pause();
            ctx.git.handle(req, res, function () {
                res.statusCode = 403;
                return res.end('403 Forbidden');
            });
        });

        this.server.timeout = await this.config.get('timeout') || 120000;
        this.server.keepAliveTimeout = this.server.timeout;

        this.server.setTimeout(this.server.timeout, function () {
            console.log(new Error('Socket time out'));
        });

        this.server.listen(await this.config.get('server:port') || 8083,
            await this.config.get('git:server:host') || '0.0.0.0');
    },
    stop: function () {

    }
});

service.start();