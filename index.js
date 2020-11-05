const Semver = require('./lib/semver');
const SemverApi = require('./lib/server/api');
const fs = require('fs');
const readline = require('readline');

let semver = new Semver();
let arguments = process.argv;

let type = arguments[2];

console.log('')
console.log('######################');
console.log('#      Results       #')
console.log('######################');

switch(type) {
    case 'comparefile':
        let file = arguments[3];

        const rl = readline.createInterface({
            input: fs.createReadStream(file),
            output: process.stdout,
            terminal: false
        });

        rl.on('line', (line) => {
            let split = line.split(' ');
            if(split.length !== 2) {
                console.log('INAVLID LINE: ' + line);
            }
            else {
                let ver1 = split[0];
                let ver2 = split[1];
                let output = semver.determinePrecedence(ver1, ver2);
                console.log("Does: " + ver1 + " have precedence over: " + ver2);
                console.log("- " + output)
                console.log('');
            }
        });
        break;
    case 'api':
        let port = arguments[3];
        let api = new SemverApi(port);
        api.start();
        break;
    case 'compare':
    default:
        let ver1 = arguments[3];
        let ver2 = arguments[4];

        let output = semver.determinePrecedence(ver1, ver2);
        console.log("Does: " + ver1 + " have precedence over: " + ver2);
        console.log("- " + output)
}