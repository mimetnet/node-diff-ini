var test = require('tap').test
    , path = require('path')
    , diff = require('..')
    , oldFile = path.join(__dirname, 'old.ini')
    , newFile = path.join(__dirname, 'new.ini')
    , missing = path.join(__dirname, 'missing.ini')
;

test('old-file not found', function(t) {
    diff(missing, missing, function(error, result) {
        t.type(error, 'Error', 'oldFile not found');
        t.end();
    });
});

test('new-file not found', function(t) {
    diff(oldFile, missing, function(error, result) {
        t.type(error, 'Error', 'newFile not found');
        t.end();
    });
});

test('five differences', function(t) {
    diff(oldFile, newFile, function(error, result) {
        t.notOk(error, 'error is null');
        t.type(result, 'Array', 'result is an Array');
        t.equal(5, result.length, 'five differences');
        t.end();
    });
});
