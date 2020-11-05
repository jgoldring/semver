const express =                     require('express');
const http =                        require('http')
const { createTerminus } =          require('@godaddy/terminus')
const { createHttpTerminator } =    require('http-terminator')
const Semver =                      require('../semver');
const path =                        require('path');
const cors =                        require('cors')

let semver = new Semver();

module.exports = class SemverApi {
    constructor(port) {
        this.port = port;

        this.app = express();

        this.app.use(cors());

        this.app.use(express.json({limit: '50kb'}));
        this.app.use(express.static(path.join(__dirname, '../..', "react-app/build")));
        this.app.use(express.static(path.join(__dirname, '../..', "react-app/public")));

        this.app.use((req, res, next) => {
            this.jsonCheck(req, res, next);
        });

        this.app.post('/compare', (req, res) => {
            let ver1 = req.body.ver1;
            let ver2 = req.body.ver2;

            if(!ver1 || typeof ver1 !== 'string' || !ver2 || typeof ver2 !== 'string') {
                return res.status(400).json({invalid: 'semvers'});
            }

            let output = semver.determinePrecedence(ver1, ver2);

            return res.status(200).json({precedence: output});

        });

        this.app.use((req, res, next) => {
            res.sendFile(path.join(__dirname, "../..", "react-app/build", "index.html"));
        });

        this.server = http.createServer(this.app)
    }

    jsonCheck(req, res, next) {
        if((req.method === 'POST' || req.method === 'PUT') && (!req.body || typeof req.body !== 'object' || Object.keys(req.body).length === 0)) {
            return res.status(400).json({invalid: 'json'})
        }
        next();
    }

    start() {
        let onSignal = this.onSignal;
        let onHealthCheck = this.onHealthCheck;
        let onShutdown = this.onShutdown;
        let server = this.server;
        createTerminus(server, {
            signals: ['SIGINT', 'SIGTERM'],
            healthChecks: { '/healthcheck': onHealthCheck },
            onSignal,
            onShutdown
        });

        server.listen(this.port, () => {
            console.log('App listening at http://localhost:' + this.port);
        });

        this.httpTerminator = createHttpTerminator({ server });
    }

    end() {
        this.httpTerminator.terminate();
    }
}
