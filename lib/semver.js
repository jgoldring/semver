class Semver {
    constructor() {}

    determinePrecedence(ver1, ver2) {
        if(!this.#sanitize(ver1) || !this.#sanitize(ver2)) {
            return false
        }

        //Split out pre-release and Major, Minor, Patch
        let pReleaseSplit1 = ver1.split('-');
        let pReleaseSplit2 = ver2.split('-');
        let mmp1 = pReleaseSplit1[0].split('.');
        let mmp2 = pReleaseSplit2[0].split('.');

        //Check Major, Minor, Patch
        for(let i=0; i<3; i++) {
            if(parseInt(mmp1[i]) > parseInt(mmp2[i])) {
                return true;
            }
            else if(parseInt(mmp1[i]) === parseInt(mmp2[i])) {
                continue;
            }
            else {
                return false;
            }
        }

        //At this point both Major, Minor, Patch are the same, and neither have pre-releases
        if(pReleaseSplit1.length === 1 && pReleaseSplit2.length === 1) {
            return false;
        }

        //Check pre-release existence
        if(pReleaseSplit1.length === 1 && pReleaseSplit2.length > 1) {
            return true;
        }
        else if(pReleaseSplit1.length > 1 && pReleaseSplit2.length === 1) {
            return false;
        }

        //Check pre-release

        //Quick check if they are the same
        if(pReleaseSplit1.slice(1).join('-') === pReleaseSplit2.slice(1).join('-')) {
            return false;
        }

        //Recombine the pre-release and then split into identifiers
        let pRelease1 = pReleaseSplit1.slice(1).join('-').split('.');
        let pRelease2 = pReleaseSplit2.slice(1).join('-').split('.');

        for(let i=0; i< Math.max(pRelease1.length, pRelease2.length); i++) {
            if(pRelease1.length === i) {
                //We've checked every segment, and ver2 has a bigger pre-release tag with all preceding equal
                return false;
            }
            else if(pRelease2.length === i) {
                //We've checked every segment and ver1 has a bigger pre-release tag with all preceding equal
                return true;
            }
            else if(pRelease1[i].match(/^\d+$/) && pRelease2[i].match(/^\d+$/)) {
                //Both identifiers are numbers, compare numerically
                if(parseInt(pRelease1[i]) > parseInt(pRelease2[i])) {
                    return true;
                }
                else if(parseInt(pRelease1[i]) === parseInt(pRelease2[i])) {
                    continue;
                }
                else {
                    return false;
                }
            }
            else if(pRelease1[i].match(/[a-zA-Z0-9-]/) && pRelease2[i].match(/[a-zA-Z0-9-]/)) {
                //Both identifiers are strings, compare lexically using ASCII sort order (default nodejs comparison)
                if(pRelease1[i] > pRelease2[i]) {
                    return true;
                }
                else if(pRelease1[i] === pRelease2[i]) {
                    continue;
                }
                else {
                    return false;
                }
            }
        }
    }

    #sanitize(ver) {
        if(typeof ver !== 'string' || ver === '' || ver == null) {
            return false
        }

        //Regex provided by semver.org
        let regex = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/
        if(!ver.match(regex)) {
            return false
        }

        return true;
    }

}

module.exports = Semver;