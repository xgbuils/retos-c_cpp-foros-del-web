var fs = require('fs')
var glob = require('glob')
var path = require('path')

var scripts = require('./scripts/scripts')

var PATH_TESTS      = scripts.PATH_TESTS
var PATH_USERS      = scripts.PATH_USERS
var PATH_CHALLENGES = scripts.PATH_CHALLENGES
var PATH_BINARIES   = scripts.PATH_BINARIES


var getParamOptions = scripts.getParamOptions

var getChallenges = scripts.getChallenges
var getTests = scripts.getTests
var getUsers = scripts.getUsers
var getVersions = scripts.getVersions

var unlinkIfExists = scripts.unlinkIfExists

var options = getParamOptions(process.argv)



function removeFiles (options) {
    getChallenges(options.challenges, function (err, challenges) {
        challenges.forEach(function (challenge) {
        	console.log(challenge)
        	console.log(options.tests)
            getTests(challenge, options.tests, function(err, tests) {
            	tests.forEach(function (test) {
            		console.log(test)
                    getUsers(challenge, options.users, function (err, users) {
                        users.forEach(function (user) {
                            getVersions(challenge, user, options.versions, function (err, versions) {
                            	versions.forEach( function (version) {
                            		var dir = path.join(PATH_CHALLENGES, challenge, PATH_USERS, user)

                            		// borrando ficheros compilacion
                            		var compiletest = 
                            		    path.join(dir, PATH_BINARIES, test)
                                    unlinkIfExists(compiletest, function (err) {
                                       console.log('Error: no se borró ' + compiletest )
                                    })
                                    // borrar fichero fuente test
                                    var sourcetest =
                                        path.join(dir, version, test + '.c')
                                    unlinkIfExists(sourcetest, function (err) {
                                       console.log('Error: no se borró ' + sourcetest )
                                    })
                                    var makefile =
                                        path.join(dir, version, 'makefile')
                                    unlinkIfExists(makefile, function (err) {
                                       console.log('Error: no se borró ' + makefile )
                                    })

                            	})
                            })
                        })
                    })
                    var dir = path.join(PATH_CHALLENGES, challenge, PATH_TESTS)
                    // borrar headers
                    var headertest = path.join(dir, test + '.h')
                    unlinkIfExists(headertest, function (err) {
                        console.log('Error: no se borró ' + headertest )
                    })
                    // borra objeto test
                    var objecttest = path.join(dir, test + '.o')
                    unlinkIfExists(objecttest, function (err) {
                        console.log('Error: no se borró ' + objecttest )
                    })
                })
            })
        })
    })
}
/*
getTests('esVampiro', undefined, function (err, tests) {
	console.log(tests)
})*/

removeFiles(options)