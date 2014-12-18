var glob = require('glob')
var path = require('path')
var fs = require('fs')

var PATH_TESTS = 'tests/'
var PATH_USERS = 'users/'
var PATH_CHALLENGES = 'challenges/'
var PATH_BINARIES = 'bin/'

function getParamOptions(argv) {
    var options = {}
      , prop

    var n = 2

    if (argv[2][0] !== '-') {
        options.first = argv[2]
        n = 3
    }

    argv = argv.slice(n)

    var prop
    argv.forEach(function (e) {
        if (e[0] === '-') {
            prop = e;
            if (!options[prop]) {
                options[prop] = []
            }
        } else if (prop) {
            options[prop].push(e);
        }
    })

    return options

}

function getFilteredArray(path_, index, replace, array, cb) {
    glob(path_, function(err, files) {
        if (err) {
            cb(err)
        } else {
            var returnArray = files
            .map(function (e) {
                e = e.split('/')[index]
                if(replace)
                    e = e.replace(replace[0], replace[1])
                return e
            })
            if (array instanceof Array) {
                returnArray = returnArray
                
                .filter(function (e) {
                    return array.indexOf(e) !== -1
                })
            }
            cb(null, returnArray)
        }
    })
}

function getChallenges (challenges, cb) {
    var dir = path.join(PATH_CHALLENGES, '*/')
    getFilteredArray(dir, 1, undefined, challenges, cb)
}

function getUsers (challenge, users, cb) {
    var dir = path.join(PATH_CHALLENGES, challenge, PATH_USERS, '*/')
    getFilteredArray(dir, 3, undefined, users, cb)
}

function getTests (challenge, tests, cb) {
    var dir = path.join(PATH_CHALLENGES, challenge, PATH_TESTS, '*.c')
    getFilteredArray(dir, 3, [/\.c$/, ''], tests, cb)
}

function getVersions (challenge, user, versions, cb) {
    var dir = path.join(PATH_CHALLENGES, challenge, PATH_USERS, user, '[0-9]*/')
    getFilteredArray(dir, 4, undefined, versions, cb)
}

function unlinkIfExists(path, cb) {
    fs.exists(path, function (exists) {
        if (exists) {
            fs.unlink(path, cb)
        }
    })
}

function writeFile(path, data) {
    var n = 3
      , options = arguments[2]
    if(options instanceof Function) {
        n = 2
    }
    var callbacks = Array.prototype.slice.call(arguments, n)

    fs.exists(path, function (exists) {
        if ((options && options.force) || !exists) {
            fs.writeFile(path, data, options, function(err) {
                if (callbacks[0])
                    callbacks[0](err)
            })
        } else {
            if (callbacks[1])
                callbacks[1]()
        }
        if (callbacks[2])
            callbacks[2]()
    })
}

module.exports = {
    getParamOptions: getParamOptions,
    PATH_TESTS: PATH_TESTS,
    PATH_USERS: PATH_USERS,
    PATH_CHALLENGES: PATH_CHALLENGES,
    PATH_BINARIES: PATH_BINARIES,
    getUsers: getUsers,
    getVersions: getVersions,
    getTests: getTests,
    getChallenges: getChallenges,
    unlinkIfExists: unlinkIfExists,
    writeFile: writeFile
}