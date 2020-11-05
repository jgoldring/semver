const SemverApi = require('../../lib/server/api');
const chai =        require('chai');
const axios =       require('axios');

let expect = chai.expect;
let api = new SemverApi(3001);

let timeout = (ms) => {
    return new Promise((resolve, reject) => {
        setTimeout(function () {
            resolve();
        }, ms);
    });
}

let url = 'http://localhost:3001/compare'

describe('Mocked API unit tests', () => {
    before(async () => {
        api.start();
        console.log('Waiting 5s for startup...');
        await timeout(5000);
        console.log('Started!');
    });

    it('No ver1 in request body', async() => {
        let res = await axios.post(url, {ver2: "1.1.1"}, {validateStatus: () => {return true}});

        expect(res).to.be.an('object');
        expect(res.status).to.equal(400);
        expect(res.data).to.deep.equal({invalid: 'semvers'});
    });

    it('Non string ver1 in request body', async() => {
        let res = await axios.post(url, {ver1: 1, ver2: "1.1.1"}, {validateStatus: () => {return true}});

        expect(res).to.be.an('object');
        expect(res.status).to.equal(400);
        expect(res.data).to.deep.equal({invalid: 'semvers'});
    });

    it('No ver2 in request body', async() => {
        let res = await axios.post(url, {ver1: "1.1.1"}, {validateStatus: () => {return true}});

        expect(res).to.be.an('object');
        expect(res.status).to.equal(400);
        expect(res.data).to.deep.equal({invalid: 'semvers'});
    });

    it('Non string ver2 in request body', async() => {
        let res = await axios.post(url, {ver1: "1.1.1", ver2: 1}, {validateStatus: () => {return true}});

        expect(res).to.be.an('object');
        expect(res.status).to.equal(400);
        expect(res.data).to.deep.equal({invalid: 'semvers'});
    });

    it('Ver1 has precedence over ver2', async() => {
        let res = await axios.post(url, {ver1: "2.0.0", ver2: "1.0.0"}, {validateStatus: () => {return true}});

        expect(res).to.be.an('object');
        expect(res.status).to.equal(200);
        expect(res.data).to.deep.equal({precedence: true});
    });

    it('Ver2 has precedence over ver1', async() => {
        let res = await axios.post(url, {ver1: "1.0.0", ver2: "2.0.0"}, {validateStatus: () => {return true}});

        expect(res).to.be.an('object');
        expect(res.status).to.equal(200);
        expect(res.data).to.deep.equal({precedence: false});
    });

    after(() => {
        api.end();
    });
});