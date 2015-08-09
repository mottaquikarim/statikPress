var util = require('util'),
    spawn = require('child_process').spawn,
    watch = spawn('./node_modules/.bin/watch', ['node app/index.js', 'content/']),
    config = require('./configs/config'),
    colors = require('colors');

console.log( ('Watching your ' + config.input + ' directory').green );
console.log( 'Press Ctrl+C to exit'.green );

watch.stdout.on('data', function (data) {
  console.log((""+data).green);
});

watch.stderr.on('data', function (data) {
  console.log((""+data).red);
});

watch.on('exit', function (code) {
  console.log(('child process exited with code ' + code).pink);
});

