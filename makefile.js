// create --testfiles
// create --makefiles
// create --binfiles
// -u user1 user2
// -t test01 test02
// -c challenge01 challenge02
var fs = require('fs');
var glob = require('glob');
var async = require('async')
var path = require('path');
var exec = require('child_process').exec;
var events = require('events')

var scripts = require('./scripts/scripts')

var getChallenges = scripts.getChallenges
var getTests = scripts.getTests
var getUsers = scripts.getUsers
var getVersions = scripts.getVersions

var getParamOptions = scripts.getParamOptions

var PATH_TESTS      = scripts.PATH_TESTS
var PATH_USERS      = scripts.PATH_USERS
var PATH_CHALLENGES = scripts.PATH_CHALLENGES
var PATH_BINARIES   = scripts.PATH_BINARIES

function createHeader (test_h, funct_name, callback) {
    var content = 'void ' + funct_name + '();'

    fs.writeFile(test_h, content, function (err) {
        if (err) {
            throw err
        } else {
            // success
            callback()
        }                            
    });
}

function createUserTest (user_test_c, test_name, callback) {
    var content = ''
    content += '#include "../../../../' + PATH_TESTS + test_name + '.h"\n'
    content += 'int main (void) {\n'
    content += '    ' + test_name + '();\n'
    content += '    return 0;\n'
    content += '}'

    fs.writeFile(user_test_c, content, function (err) {
        if (err) {
            throw err
        } else {
            console.log('createTests')
            callback()
        }
    //console.log('It\'s saved!');
    });
}

function remove(files, callback) {
    async.each(files, function(file, end) {
        fs.exists(file, function (exists) {
            fs.unlink(file, function (err) {
                console.log(file + ' removed')
                end()
            })
        })
    }, function (err) {
        callback()
    })
}

function ranking(files, callback) {
    var rank = {}
    console.log(files)
    async.eachSeries(files, function (file, endFile) {
        fs.exists(file, function(exists) {
            var arr = file.split('/')
            var user_version = arr[3] + '-' + arr[4]
            var test = arr[6]
            if (!rank[test]) {
                rank[test] = []
            }
            if (exists) {
                var cmd = '(time timeout 60 ./' + file + ') >&1'
                console.log(cmd)
                exec(cmd, function (err, stdout, stderr) {
                    if (err) {
                        //console.log(err)
                        console.log('err')
                    } else {
                        //console.log(stdout)
                        var x = /(\d+\.\d*)user.*(\d+\.\d*)system/g.exec(stderr)
                        .slice(1, 3)
                        .map(function (e) {
                            return Number(e)
                        })
                        rank[test].push({
                            time: x[0] + x[1],
                            user: user_version

                        })
                        console.log(stdout)
                    }
                    endFile()
                })
            } else {
                endFile()
            }
        })
    }, function (err) {
        if(err) {
            console.log('hay un error')
        }
        console.log(rank)
        callback()
    })
}

function compile(target, dependencies, config, callback) {
    fs.readFile(config, 'utf8', function (err, content) {
        if (err) throw err;
        var config = JSON.parse(content).vars;
        var flag = ' '
        if (/\.o$/.test(target)) {
            flag = ' -c '
        }
        var cmd = config.CC + ' -o ' + target + flag + dependencies.join(' ') + ' ' + config.CFLAGS
        console.log(cmd)
        exec(cmd, function(err) {
            if (err) throw new Error(err.toString())
            callback()
        })
    })
} 

module.exports = function (jMake) {
    var source_files = []
    var obj_files = []
    var bin_files = []
    var clean_files = []
    getChallenges(undefined, function (err, challenges) {
        async.each(challenges, function (challenge, endChallenge) {
            var test_dir = path.join(PATH_CHALLENGES, challenge, PATH_TESTS)


            async.parallel([
                function (callback) {
                    getUsers(challenge, undefined, function (err, users) {
                        async.each(users, function (user, endUser) {

                            getVersions(challenge, user, undefined, function (err, versions) {
                                versions.forEach(function (version) {
                                    var user_test_dir = path.join(PATH_CHALLENGES, challenge, PATH_USERS, user, version)
                                    var user_c      = path.join(user_test_dir, 'src', user + version + '.c')
                                    var user_o      = path.join(user_test_dir, 'bin', user + version + '.o')
                                    var config      = path.join(user_test_dir, 'src', 'config.json')
        
                                    obj_files.push(user_o)
                                    clean_files.push(user_o)
        
                                    jMake.register(user_o, [user_c], function (user_o, user_c) {
                                        compile(user_o, [user_c], config, this)
                                    })
                                })
                                endUser()
                            })
                        }, callback)
                    })                    
                }, 
                function (callback) {
                    getTests(challenge, undefined, function (err, tests) {
                        var test_paths = tests.map(function (test) {
                            return path.join(test_dir, test + '.h')
                        })
        
                        //console.log(tests)
                        tests.forEach(function (test) {
                            var test_h = path.join(test_dir, test + '.h')
                            var test_c = path.join(test_dir, test + '.c')
                            //console.log(test_h, '<-', test_c)
                            jMake.register(test_h, [test_c], function (test_h, test_c) {
                                createHeader(test_h, test, this)
                            })
                        })
        
                        getUsers(challenge, undefined, function (err, users) {
                            async.each(tests, function (test, endTest) {

                                var test_dir = path.join(PATH_CHALLENGES, challenge, PATH_TESTS)
                                var test_h = path.join(test_dir, test + '.h')
                                var test_c = path.join(test_dir, test + '.c')
                                var test_o = path.join(test_dir, test + '.o')
                                var config = path.join(test_dir, test + '.json')
                                source_files.push(test_h)
                                obj_files.push(test_o)
                                clean_files.push(test_h, test_o)
                                
                                jMake.register(test_o, [test_c], function (test_o, test_c) {
                                    compile(test_o, [test_c], config, this)
                                })
        
                                async.each(users, function (user, endUser) {
        
                                    getVersions(challenge, user, undefined, function(err, versions) {
        
                                        versions.forEach(function (version) {
                                            var user_test_dir = path.join(PATH_CHALLENGES, challenge, PATH_USERS, user, version)
                                            var user_c      = path.join(user_test_dir, 'src', user + version + '.c')
                                            var user_o      = path.join(user_test_dir, 'bin', user + version + '.o')
                                            var config      = path.join(user_test_dir, 'src', 'config.json')
        
                                            var user_test_c = path.join(user_test_dir, 'src', test + '.c')
                                            //var user_test_o = path.join(user_test_dir, 'bin', test + '.o')
                                            var user_test   = path.join(user_test_dir, 'bin', test)
                                            
                                            source_files.push(user_test_c)
                                            bin_files.push(user_test)
                                            clean_files.push(user_test_c, user_test)
        
                                            ;(function (test) {
                                                jMake.register(user_test_c, [test_h], function (user_test_c, test_h) {
                                                    console.log(test)
                                                    createUserTest(user_test_c, test, this)
                                                })
                                            }(test))
                                            var dependencies = [user_test_c, user_o, test_o]
                                            jMake.register(user_test, dependencies, function (user_test, user_test_c, user_o, test_o) {
                                                compile(user_test, dependencies, config, this)
                                            })
                                        })
                                        endUser()
                                    })
                                }, function (err) {
                                    endTest(err)
                                })
                                
                            }, function (err) {
                                if (err) {
                                    throw new Error('error each')
                                } else {
                                    callback()
                                }
                            })
                        })
                    })
                }
            ], function(err) {
                endChallenge()
            })
            
        }, function(err) {
            if (err) {
                throw new Error('error each')
            } else {
                console.log(bin_files)
                jMake.register('src', source_files, function(){})
                jMake.register('bin', bin_files, function(){})
                jMake.register('ranking', bin_files, function () {
                    console.log('haciendo ranking')
                    console.log(bin_files)
                    ranking(bin_files, this)
                })
                jMake.register('clean', [], function(){
                    console.log('borrando')
                    remove(clean_files, this)
                })
                jMake.target('bin')
                jMake.emitter.emit('run')
            }
        })
    })
}
