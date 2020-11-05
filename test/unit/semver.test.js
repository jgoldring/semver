const Semver = require('../../lib/semver');
const chai = require('chai');
const crypto = require('crypto');

let semver = new Semver();
let expect = chai.expect;

describe('Semver unit tests', () => {

    it('Undefined semvers', () => {
        let ver1, ver2;

        let result = semver.determinePrecedence(ver1, '1.1.1');
        expect(result).to.be.false;

        result = semver.determinePrecedence('1.1.1', ver2);
        expect(result).to.be.false;
    });

    it('Null semvers', () => {
        let result = semver.determinePrecedence(null, '1.1.1');
        expect(result).to.be.false;

        result = semver.determinePrecedence('1.1.1', null);
        expect(result).to.be.false;
    });

    it('Empty semvers', () => {
        let result = semver.determinePrecedence('', '1.1.1');
        expect(result).to.be.false;

        result = semver.determinePrecedence('1.1.1', '');
        expect(result).to.be.false;
    });

    it('Non string semvers', () => {
        let result = semver.determinePrecedence(1, '1.1.1');
        expect(result).to.be.false;

        result = semver.determinePrecedence('1.1.1', 1);
        expect(result).to.be.false;
    });

    it('Missing Major', () => {
        let result = semver.determinePrecedence('.1.1', '1.1.1');
        expect(result).to.be.false;

        result = semver.determinePrecedence('1.1.1', '.1.1');
        expect(result).to.be.false;
    });

    it('Missing Minor', () => {
        let result = semver.determinePrecedence('1..1', '1.1.1');
        expect(result).to.be.false;

        result = semver.determinePrecedence('1.1.1', '1..1');
        expect(result).to.be.false;
    });

    it('Missing Patch', () => {
        let result = semver.determinePrecedence('1.1.', '1.1.1');
        expect(result).to.be.false;

        result = semver.determinePrecedence('1.1.1', '1.1.');
        expect(result).to.be.false;
    });

    it('Non integer Major, Minor, and Patch', () => {
        let result = semver.determinePrecedence('a.1.1', '1.1.1');
        expect(result).to.be.false;

        result = semver.determinePrecedence('1.a.1', '1.1.1');
        expect(result).to.be.false;

        result = semver.determinePrecedence('1.1.a', '1.1.1');
        expect(result).to.be.false;

        result = semver.determinePrecedence('1.1.1', 'a.1.1');
        expect(result).to.be.false;

        result = semver.determinePrecedence('1.1.1', '1.a.1');
        expect(result).to.be.false;

        result = semver.determinePrecedence('1.1.1', '1.1.a');
        expect(result).to.be.false;
    });

    it('Random n-length, non integer identifier', () => {
        let ver1 = crypto.randomBytes(255).toString('hex').slice(Math.floor(Math.random() * (255 - 1) + 1), 255) + '.' +
            crypto.randomBytes(255).toString('hex').slice(Math.floor(Math.random() * (255 - 1) + 1), 255) + '.' +
            crypto.randomBytes(255).toString('hex').slice(Math.floor(Math.random() * (255 - 1) + 1), 255)

        let result = semver.determinePrecedence(ver1, '1.1.1');
        expect(result).to.be.false;

        let ver2 = crypto.randomBytes(255).toString('hex').slice(Math.floor(Math.random() * (255 - 1) + 1), 255) + '.' +
            crypto.randomBytes(255).toString('hex').slice(Math.floor(Math.random() * (255 - 1) + 1), 255) + '.' +
            crypto.randomBytes(255).toString('hex').slice(Math.floor(Math.random() * (255 - 1) + 1), 255)

        result = semver.determinePrecedence('1.1.1', ver2);
        expect(result).to.be.false;
    });

    it('Leading zeros Major, Minor, and Patch', () => {
        let result = semver.determinePrecedence('02.1.1', '1.1.1');
        expect(result).to.be.false;

        result = semver.determinePrecedence('1.010.1', '1.1.1');
        expect(result).to.be.false;

        result = semver.determinePrecedence('1.1.0000003', '1.1.1');
        expect(result).to.be.false;

        result = semver.determinePrecedence('1.1.1', '02.1.1');
        expect(result).to.be.false;

        result = semver.determinePrecedence('1.1.1', '1.09.1');
        expect(result).to.be.false;

        result = semver.determinePrecedence('1.1.1', '1.1.01');
        expect(result).to.be.false;
    });

    it('Non ASCII-alphanumerics in pre-release', () => {
        let result = semver.determinePrecedence('1.1.1-!.#.$', '1.1.1');
        expect(result).to.be.false;

        result = semver.determinePrecedence('1.10.1', '1.1.1-ab.%.^');
        expect(result).to.be.false;

        result = semver.determinePrecedence('1.1.3-(>")>', '1.1.1-<("<)');
        expect(result).to.be.false;

        result = semver.determinePrecedence('1.1.1-¯\_(ツ)_/¯', '02.1.1');
        expect(result).to.be.false;

        result = semver.determinePrecedence('1.1.1', '1.09.1-_-_-_');
        expect(result).to.be.false;

        result = semver.determinePrecedence('1.1.1-!@#$%^&*()_+=[{}]<>/?', '1.1.01');
        expect(result).to.be.false;
    });

    it('Empty identifiers in pre-release', () => {
        let result = semver.determinePrecedence('1.1.1-.', '1.1.1');
        expect(result).to.be.false;

        result = semver.determinePrecedence('1.10.1', '1.1.1-alpha..beta');
        expect(result).to.be.false;

        result = semver.determinePrecedence('1.1.3', '1.1.1-rc.');
        expect(result).to.be.false;

        result = semver.determinePrecedence('1.1.1-foo-.-..', '02.1.1');
        expect(result).to.be.false;
    });

    it('Leading zeros in numeric identifiers - pre-release', () => {
        let result = semver.determinePrecedence('2.1.1-01', '1.1.1');
        expect(result).to.be.false;

        result = semver.determinePrecedence('1.10.1-rc01.02', '1.1.1');
        expect(result).to.be.false;

        result = semver.determinePrecedence('1.1.3-1.2.3.04', '1.1.1');
        expect(result).to.be.false;

        result = semver.determinePrecedence('1.1.1', '2.1.1--.010.foo');
        expect(result).to.be.false;

        result = semver.determinePrecedence('1.1.1', '1.9.1-01');
        expect(result).to.be.false;

        result = semver.determinePrecedence('1.1.1', '1.1.1-0foo');
        expect(result).to.be.true;
    });

    it('First semver Major > second semver Major', () => {
        let result = semver.determinePrecedence('2.0.0', '1.0.0');
        expect(result).to.be.true;

        result = semver.determinePrecedence('20.0.0', '15.0.0');
        expect(result).to.be.true;
    });

    it('First semver Major < second semver Major', () => {
        let result = semver.determinePrecedence('1.0.0', '2.0.0');
        expect(result).to.be.false;

        result = semver.determinePrecedence('15.0.0', '20.0.0');
        expect(result).to.be.false;
    });

    it('First semver Major.Minor > second semver Major.Minor', () => {
        let result = semver.determinePrecedence('2.1.0', '2.0.0');
        expect(result).to.be.true;

        result = semver.determinePrecedence('2.31.0', '2.22.0');
        expect(result).to.be.true;
    });

    it('First semver Major.Minor < second semver Major.Minor', () => {
        let result = semver.determinePrecedence('2.0.0', '2.1.0');
        expect(result).to.be.false;

        result = semver.determinePrecedence('2.22.0', '2.31.0');
        expect(result).to.be.false;
    });

    it('First semver Major.Minor.Patch > second semver Major.Minor.Patch', () => {
        let result = semver.determinePrecedence('2.0.1', '2.0.0');
        expect(result).to.be.true;

        result = semver.determinePrecedence('2.0.10', '2.0.9');
        expect(result).to.be.true;
    });

    it('First semver Major.Minor.Patch < second semver Major.Minor.Patch', () => {
        let result = semver.determinePrecedence('2.0.0', '2.0.1');
        expect(result).to.be.false;

        result = semver.determinePrecedence('2.0.9', '2.0.10');
        expect(result).to.be.false;
    });

    it('Semver Major, Minor, and Patch are all equal - first semver has pre-release', () => {
        let result = semver.determinePrecedence('2.0.1-alpha', '2.0.1');
        expect(result).to.be.false;

        result = semver.determinePrecedence('100.52.6-x.92-rc1', '100.52.6');
        expect(result).to.be.false;
    });

    it('Semver Major, Minor, and Patch are all equal - second semver has pre-release', () => {
        let result = semver.determinePrecedence('2.0.1', '2.0.1-alpha');
        expect(result).to.be.true;

        result = semver.determinePrecedence('100.52.6', '100.52.6-x.92-rc1');
        expect(result).to.be.true;
    });

    it('Semver Major, Minor, and Patch are all equal', () => {
        let result = semver.determinePrecedence('2.0.1', '2.0.1');
        expect(result).to.be.false;
    });

    it('Semver Major, Minor, Patch, and pre-release are all equal', () => {
        let result = semver.determinePrecedence('2.0.1-alpha.beta.foo', '2.0.1-alpha.beta.foo');
        expect(result).to.be.false;
    });

    it('Semver Major, Minor, and Patch are all equal - Numeric pre-release comparison', () => {
        let result = semver.determinePrecedence('2.0.1-100', '2.0.1-99');
        expect(result).to.be.true;

        result = semver.determinePrecedence('2.0.1-1', '2.0.1-50');
        expect(result).to.be.false;

        result = semver.determinePrecedence('2.0.1-100.2.75', '2.0.1-100.2.74');
        expect(result).to.be.true;

        result = semver.determinePrecedence('2.0.1-100.2.999', '2.0.1-100.2.5000');
        expect(result).to.be.false;
    });

    it('Semver Major, Minor, and Patch are all equal - Lexical pre-release comparison', () => {
        let result = semver.determinePrecedence('2.0.1-beta', '2.0.1-alpha');
        expect(result).to.be.true;

        result = semver.determinePrecedence('2.0.1-beta', '2.0.1-rc');
        expect(result).to.be.false;

        result = semver.determinePrecedence('2.0.1-foo-.bar-.baz-', '2.0.1-foo-.bar-.aaz-');
        expect(result).to.be.true;

        result = semver.determinePrecedence('2.0.1-a.b.c.d.e.f', '2.0.1-a.b.c.d.e.g');
        expect(result).to.be.false;
    });

    it('Semver Major, Minor, and Patch are all equal - Numbers & non-numberic pre-release comparison', () => {
        let result = semver.determinePrecedence('2.0.1-alpha.beta', '2.0.1-alpha.1');
        expect(result).to.be.true;

        result = semver.determinePrecedence('2.0.1-1', '2.0.1-rc');
        expect(result).to.be.false;

        result = semver.determinePrecedence('2.0.1-foo-.bar-.bam', '2.0.1-foo-.bar-.1337');
        expect(result).to.be.true;

        result = semver.determinePrecedence('2.0.1-a.b.c.d.e.100', '2.0.1-a.b.c.d.e.g');
        expect(result).to.be.false;
    });

    it('Semver Major, Minor, and Patch are all equal - Mixed Numbers & non-numberic pre-release comparison', () => {
        let result = semver.determinePrecedence('2.0.1-alpha.1zeta', '2.0.1-alpha.1beta');
        expect(result).to.be.true;

        result = semver.determinePrecedence('2.0.1-r1', '2.0.1-r2');
        expect(result).to.be.false;

        result = semver.determinePrecedence('2.0.1-foo2-.bar3-.bamz', '2.0.1-foo2-.bar3-.bam4');
        expect(result).to.be.true;

        result = semver.determinePrecedence('2.0.1-100abc.1-1.b100', '2.0.1-100abc.1-1.b101');
        expect(result).to.be.false;
    });

    it('Semver Major, Minor, and Patch are all equal - Semver1 has larger set', () => {
        let result = semver.determinePrecedence('2.0.1-alpha.beta.gamma', '2.0.1-alpha.beta');
        expect(result).to.be.true;

        result = semver.determinePrecedence('2.0.1-rc.5.go', '2.0.1-rc.5');
        expect(result).to.be.true;

        result = semver.determinePrecedence('2.0.1--.-.-.-', '2.0.1--.-.-');
        expect(result).to.be.true;
    });

    it('Semver Major, Minor, and Patch are all equal - Semver2 has larger set', () => {
        let result = semver.determinePrecedence('2.0.1-alpha.beta', '2.0.1-alpha.beta.-');
        expect(result).to.be.false;

        result = semver.determinePrecedence('2.0.1-rc.5.go', '2.0.1-rc.5.go.a.b.c');
        expect(result).to.be.false;

        result = semver.determinePrecedence('2.0.1--.-.-.-', '2.0.1--.-.-.-.x');
        expect(result).to.be.false;
    });

});

