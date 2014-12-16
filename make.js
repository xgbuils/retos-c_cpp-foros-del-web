var fs     = require('fs')
var events = require('events')
var EventEmitter = events.EventEmitter


var jMake = {
    __rules: 0,
    __register: {},
    emitter: new EventEmitter(),
    target: function (target) {
        jMake.__target = target
    },
    register: function (target, dependencies, action) {
        if (jMake.__rules === 0) {
            jMake.__target = target
        }
        //console.log(target)
        if (jMake.__register[target]) {
            throw new Error('target redeclared')
        }
        jMake.__register[target] = {
            action: action,
            dependencies: []
        }    
        dependencies.forEach(function (d) {
            jMake.__register[target].dependencies.push(d)
        })

        jMake.__rules++;
    },
    run: function(emitter) {
        //console.log('target: ' + jMake.__target)
        var circularPrevent = {}
        //var trace = [jMake.__target]
        circularPrevent[jMake.__target] = true

        function listen(target, parent_emitter) {
            var action = function() {
                target.action.apply(
                    function(err) {
                        //console.log(target_name + ' emitting')
                        parent_emitter.emit('file', target.name, new Date())
                    },
                    //parent_emitter,
                    [target.name].concat(target.dependencies)
                )
            }

            //console.log('listen: ' + target.name)
            //console.log(target.exists, target.dependencies.length)
            if (!target.exists && target.dependencies.length === 0) {
                //console.log('eoe')
                action()
            }

            
            target.emitter.on('file', function (file_name, file_time) {
            	//console.log(target.name + ' receiving ' + file_name )
                ++target.n
                if (!target.time) {
                    //console.log(target.name + ' created <- ' + file_name)
                    target.modify = true
                } else if (target.time < file_time) {
                    target.modify = true
                }
                if (target.n >= target.dependencies.length) {
                	if (target.modify) {
                		console.log(target.name + ' updating')
                        //console.log(target.name + ' updated ' + target.n + ' >= ' + target.dependencies.length)
                        action()
                        /*target.action.apply(
                            function(err) {
                                //console.log(target_name + ' emitting')
                                parent_emitter.emit('file', target.name, new Date())
                            },
                            //parent_emitter,
                            [target.name].concat(target.dependencies)
                        )*/
                    } else {
                    	console.log(target.name + ' no changes')
                    	parent_emitter.emit('file', target.name, target.time)
                    }
                } 
            })
        }

        function recursive (target_name, parent_emitter) {
        	//console.log('eiii', target_name)
            fs.exists(target_name, function (exists) {
                var target = jMake.__register[target_name]
                if (exists) {

                    fs.stat(target_name, function (err, stats) {
                        var target_time = stats.mtime
                        if(target) {
                            target.emitter = new EventEmitter()
                            target.modify  = false
                            target.name    = target_name
                            target.time    = stats.mtime
                            target.n       = 0
                            target.exists  = true

                            listen(target, parent_emitter)

                            target.dependencies.forEach(function (d) {
                                if (circularPrevent[d])
                                    throw new Error('circular dependency in ' + target.name + ' -> ' + d)
                                circularPrevent[d] = true
                                recursive(d, target.emitter)
                                delete circularPrevent[d]
                            })
                        } else {
                            //console.log(target_name + ' emitting!')
                            fs.stat(target_name, function (err, stats) {
                            	//console.log(target_name + ' emiting')
                                parent_emitter.emit('file', target_name, stats.mtime)
                            })
                        }
                    })
                    
                } else {
                    if (target) {
                    	target.emitter = new EventEmitter()
                        target.modify  = false
                        target.name    = target_name
                        target.time    = undefined
                        target.n       = 0
                        target.exists  = false

                        listen(target, parent_emitter)

                        target.dependencies.forEach(function (d) {
                            if (circularPrevent[d])
                                throw new Error('circular dependency in ' + target.name + ' -> ' + d)
                            circularPrevent[d] = true
                            recursive(d, target.emitter)
                            delete circularPrevent[d]
                        })
                    } else {
                        throw new Error(target_name + ' doesn\'t exists')
                    }
                }
            })
        }
        //console.log(jMake.__target)
        recursive(jMake.__target, jMake.emitter)
    }
}

var target = process.argv[2]
console.log('arg: ' + target)

fs.exists('makefile.js', function (exists) {
    if (exists) {
        
        jMake.emitter.on('run', function() {
            if (jMake.__register[target])
                jMake.target(target)
            jMake.run()
        })
        var makefile = require('./makefile')
        makefile(jMake)
    }
})