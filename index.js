var fs = require('fs')
    , os = require('os')
    , ini = require('ini')
    , async = require('async')
    , diff = require('deep-diff').diff
    , concat = require('concat-stream')
    , pointer = require('json-pointer')
;

module.exports = iniDiff;
module.exports.print = printDiff;

function loadIni(file, done) {
    var oldFile = fs.createReadStream(file);

    oldFile.on('error', function(error) {
        done(error);
    });

    oldFile.pipe(concat(function(data) {
        done(null, ini.decode(data.toString()));
    })).on('error', function(error) {
        done(error);
    });
}

function iniDiff(oldFile, newFile, done) {
    var list = [];

    if ('string' !== typeof(oldFile))
        throw new TypeError('oldFile must be a string');
    if ('string' !== typeof(newFile))
        throw new TypeError('newFile must be a string');
    if ('function' !== typeof(done))
        throw new TypeError('done must be a function(error, diff)');

    list.push(loadIni.bind(this, oldFile));
    list.push(loadIni.bind(this, newFile));

    async.parallel(list, function(error, results) {
        var res;

        try {
            if (!error)
                res = diff(results[0], results[1]);
        } catch (e) {
            error = e;
        }

        done(error, res);
    });
}

function printO(log, op, path, obj) {
    var k, dict;

    dict = pointer.dict(obj);

    for (k in dict) {
        if ('/' !== k) {
            log(op + path + k + ' = ' + dict[k] + os.EOL);
        } else {
            log(op + path + ' = ' + dict[k] + os.EOL);
        }
    }
}

function printE(log, row) {
    var path = row.path.join('/');

    if ('object' !== typeof(row.lhs)) {
        log('-' + path + ' = ' + row.lhs + os.EOL);
    } else {
        printO(log, '+', path, row.lhs);
    }

    if ('object' !== typeof(row.rhs)) {
        log('+' + path + ' = ' + row.rhs + os.EOL);
    } else {
        printO(log, '+', path, row.rhs);
    }
}

function printN(log, row) {
    var path = row.path.join('/');
    printO(log, '+', path, row.rhs);
}

function printD(log, row) {
    var path = row.path.join('/');
    printO(log, '-', path, row.lhs);
}

function printDiff(rows, log) {
    if (!Array.isArray(rows))
        throw new TypeError('rows must be an Array');

    log = log || process.stdout.write.bind(process.stdout);

    if ('function' !== typeof(log))
        throw new TypeError('log must be a function(str)');

    rows.forEach(function(row) {
        switch (row.kind) {
            case 'E':
                printE(log, row);
                break;
            case 'N':
                printN(log, row);
                break;
            case 'D':
                printD(log, row);
                break;

            default:
                log('Unknown:', row.kind + os.EOL);
                break;
        }
    });
}
