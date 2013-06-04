var fs = require('fs')
    , os = require('os')
    , ini = require('ini')
    , async = require('async')
    , diff = require('deep-diff').diff
    , concat = require('concat-stream')
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

function printO(log, pre, obj) {
    var str = ini.encode(obj);

    if (str) {
        str.split(/\r?\n/).forEach(function(line) {
            if (line && line.length) {
                log(pre + line + os.EOL);
            }
        });
    } else {
        log(pre + os.EOL);
    }
}

function printE(log, row) {
    var path = row.path.join('.');

    if ('object' !== typeof(row.lhs)) {
        log('-' + path + ' = ' + row.lhs + os.EOL);
    } else {
        printO(log, '-  ', row.lhs);
    }

    if ('object' !== typeof(row.rhs)) {
        log('+' + path + ' = ' + row.rhs + os.EOL);
    } else {
        printO(log, '+  ', row.rhs);
    }
}

function printM(log, op, row, key) {
    if ('object' !== typeof(row[key])) {
        var path = row.path.join('.');

        log(op + path + ' = ' + row[key] + os.EOL);
    } else {
        log(op + row.path.join('.') + os.EOL);
        printO(log, op + '   ', row[key]);
    }
}

function printN(log, row) {
    printM(log, '+', row, 'rhs');
}

function printD(log, row) {
    printM(log, '-', row, 'lhs');
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

        log(os.EOL);
    });
}
