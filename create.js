var files = process.argv[2];
var challenge = process.argv[3];
var test = process.argv[4];
var user = process.argv[5];

var fs = require('fs');
var glob = require('glob');
var path = require('path');
var exec = require('child_process').exec;

function createMakeFile(dir, config, tests, participante, solucion) {
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
		content += '../bin/' + test + ': ../../../tester/' + test + '.o ' + participante + solucion + '.o\n'
		content += '\t$(CC) -o $@ ' + test + '.c $+ $(CFLAGS)\n\n'
	})
	
	content += '../../../tester/test01.o: ../../../tester/test01.c\n'
	content += '\t$(CC) $@ -c $< $(CFLAGS)\n\n'
    content += participante + solucion + '.o: ' + participante + solucion + '.c\n'
    content += '\t$(CC) -c $< $(CFLAGS)';
    fs.writeFile(path.join(dir, 'makefile'), content, function (err) {
        if (err) throw err;
        //console.log('It\'s saved!');
    });
}

function createTests(dir, tests) {
	tests.forEach(function (test) {
		var content = '';
		content += '#include "../../../tester/' + test + '.h"\n';
		content += 'int main (void) {\n';
		content += '    ' + test + '();\n';
		content += '    return 0;\n';
		content += '}';

		fs.writeFile(path.join(dir, test + '.c'), content, function (err) {
        if (err) throw err;
        //console.log('It\'s saved!');
        });
	})
}

function createTestHeaders(dir, tests) {
	tests.forEach(function (test) {
		var content = 'void ' + test + '();';

		fs.writeFile(path.join(dir, test + '.h'), content, function (err) {
            if (err) throw err;
        //console.log('It\'s saved!');
        });
	})
}

function createFiles() {
    glob("*/", function (err, files) {
    	files = files.filter(function (e) {
    		return e != 'node_modules/'
    	})
    
    	files.forEach(function(challenge) {
    		glob(path.join(challenge, 'tester', '*.c'), function(err, files) {
    			var tests = files.map(function (e) {
    				return e.split('/')[2].replace(/\.c$/, '');
    			})
                createTestHeaders(path.join(challenge, 'tester'), tests);

    			console.log(tests)
    			glob(path.join(challenge, 'participantes/*/!(bin)/'), function (err, files) {
                    
                	files.forEach(function (file) {
                		var arr = file.split('/');
                		var participante = arr[2];
                		var solucion = arr[3];
                		fs.readFile(path.join(file, 'config.json'), 'utf8', function (err, data) {
                            if (err) throw err;
                            var config = JSON.parse(data);
                            createMakeFile(file, config, tests, participante, solucion);

                        });
                        createTests(file, tests);
		                
                	})
                })
    		})
    	})
    	console.log(files);
    })
}

createFiles();

function compileTests() {
	glob("*/participantes/*/!(bin)/", function (err, files) {
		console.log(files)
		files.forEach(function (file) {
			exec('cd ' + file + '; make; cd ../../../..;', function(err){
				console.log(err);

			})
		})
		console.log(files);
	})
}

compileTests();

//glob("*/participantes/*/!(bin)/",  function (er, files) {
/*	files.forEach(function (file) {
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

console.log(challenge)
if (challenge === undefined) {
	//console.log('hjkdf')
	
} else {
	path += challenge;
	//console.log(path);
}
