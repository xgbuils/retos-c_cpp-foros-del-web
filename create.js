
// create --testfiles
// create --makefiles
// create --binfiles
// -u user1 user2
// -t test01 test02
// -c challenge01 challenge02
var fs = require('fs');
var glob = require('glob');
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

var writeFile = scripts.writeFile

var options = getParamOptions(process.argv)
console.log(options)

function createMakeFile(dir, config, tests, user, solucion, emitter, endCondition) {
    var content = '';
    for(var key in config.vars) {
        content += key + '= ' + config.vars[key] + '\n';
    }
    content += '\n';
    content += 'all: ';
    tests.forEach(function (test) {
        content += '../bin/' + test + ' '
    })
    content += '\n\n';
    tests.forEach(function (test) {
        content += '../bin/' + test + ': ../../../tester/' + test + '.o ' + user + solucion + '.o\n'
        content += '\t$(CC) -o $@ ' + test + '.c $+ $(CFLAGS)\n\n'
    })
    
    content += '../../../tester/test01.o: ../../../tester/test01.c\n'
    content += '\t$(CC) $@ -c $< $(CFLAGS)\n\n'
    content += user + solucion + '.o: ' + user + solucion + '.c\n'
    content += '\t$(CC) -c $< $(CFLAGS)';
    fs.writeFile(path.join(dir, 'makefile'), content, function (err) {
        if (err) {
            throw err;
        } else if (endCondition) {
            console.log('createMakeFile')
            emitter.emit('end')
        }
    });
}

function createTests(dir, tests, emitter, endCondition) {
    tests.forEach(function (test) {
        var test_c = path.join(dir, test + '.c')
        fs.exists(test_c, function (exists) {
            if (!exists) {
                var content = '';
                content += '#include "../../../tester/' + test + '.h"\n';
                content += 'int main (void) {\n';
                content += '    ' + test + '();\n';
                content += '    return 0;\n';
                content += '}';
        
                writeFile(test_c, content, function (err) {
                    if (err) {
                        throw err;
                    } else if (endCondition) {
                        console.log('createTests')
                        emitter.emit('end')
                    }
                //console.log('It\'s saved!');
                });
            } else {
                console.log('up to date');
            }
        });
    })
}

function createTestHeaders(dir, tests, emitter) {
    tests.forEach(function (test, i) {
        var content = 'void ' + test + '();'

        fs.writeFile(path.join(dir, test + '.h'), content, function (err) {
            if (err) {
                throw err
            } else if (i >= tests.length - 1) {
                console.log('createTestHeaders')
                emitter.emit('end')
            }
        });
    })
}



function createFiles(options) {
    var emitter = new events.EventEmitter()
    var flag = 0
    emitter.on('end', function (data) {
        console.log('end!')
        ++flag;
        if (options.binfiles || options.makefiles) {
            if (flag === 3) {
                console.log('compilar!')
            }
        } else {
            if (flag === 2) {
                console.log('compilar!')
            }
        }

    })

    getChallenges(options.challenges, function (err, challenges) {
        challenges.forEach(function(challenge, i) {
            getTests(challenge, options.tests, function(err, tests) {
                var CHALLENGE_DIR = path.join(PATH_CHALLENGES, challenge)

                if (options.testfiles) {
                    createTestHeaders(path.join(CHALLENGE_DIR, PATH_TESTS), tests, emitter)
                }

                getUsers(challenge, options.users, function (err, users) {
                    users.forEach(function (user, j) {
                        getVersions(challenge, user, options.versions, function (err, versions) {
                            versions.forEach(function (version, k) {
                                var endCondition = i >= challenges.length - 1 
                                                && j >= users.length - 1
                                                && k >= versions.length - 1
                                if (endCondition) {
                                    console.log('endCondition')
                                }

                                var dir = path.join(
                                    CHALLENGE_DIR, PATH_USERS, user, version)

                                fs.readFile(path.join(dir, 'config.json'), 'utf8', function (err, data) {
                                    if (err) throw err;
                                    var config = JSON.parse(data);
                                    if (options.makefiles) {
                                        createMakeFile(dir, config, tests, user, version, emitter, endCondition)
                                    }
                                })


                                if (options.testfiles) {
                                    createTests(dir, tests, emitter, endCondition)
                                }                              

                            })
                        })
                    })
                })
            })
        })
    })
}

writeFile('exemple.txt', 'blablebli',
	function () {
		console.log('no existeix o s\'ha força la escritura')
	},
    function () {
    	console.log('ja existeix')
    }, 
    function () {
    	console.log('tant si com no')
    });

//createFiles(options);

function compileTests() {
    glob("*/participantes/*/[0-9]*/", function (err, files) {
        console.log(files)
        files.forEach(function (file) {
            exec('cd ' + file + '; make; cd ../../../..;', function(err){
                console.log(err);

            })
        })
        console.log(files)
    })
}

//compileTests();

//glob("*/participantes/*/!(bin)/",  function (er, files) {
/*    files.forEach(function (file) {
        var arr = file.split('/');
        var participante = arr[2];
        var solucion = arr[3];
        fs.readFile(path.join(file, 'config.json'), 'utf8', function (err, data) {
            if (err) throw err;
            var config = JSON.parse(data);
            createMakeFile(file, config, participante, solucion);
        });
        
    })
  // files is an array of filenames.
  // If the `nonull` option is set, and nothing

  // er is an error object or null.
  //console.log(files);
})*/

