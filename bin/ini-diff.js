#!/usr/bin/env node

var path = require('path')
    , diff = require(path.join(__dirname, '..', 'index.js'));

function help() {
    console.log('Usage: ini-diff old.ini new.ini');
}

function hasHelp(argv) {
    var reg = /^-?-?help$/i;

    return argv.some(reg.test.bind(reg));
}

process.title = 'ini-diff';

if (4 !== process.argv.length || hasHelp(process.argv)) {
    help();
} else {
    diff(process.argv[2], process.argv[3], function(error, result) {
        if (error) {
            if ('ENOENT' === error.code && 'string' === typeof(error.path)) {
                console.error('File not found: "%s"', error.path);
            } else {
                console.error(error);
            }
            return;
        }

        diff.print(result);
    });
}
