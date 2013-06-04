var test = require('tap').test
    , diff = require('..')
;

test('require', function(t) {
    t.ok(diff, 'diff-ini exists');
    t.type(diff, 'function', 'diff is a function');
    t.type(diff.print, 'function', 'diff.print is a function');

    t.throws(function() {
        diff();
    }, {name:'TypeError', message:'oldFile must be a string'}, 'Throws TypeError');

    t.throws(function() {
        diff('old.ini');
    }, {name:'TypeError', message:'newFile must be a string'}, 'Throws TypeError');

    t.throws(function() {
        diff('old.ini', 'new.ini');
    }, {name:'TypeError', message:'done must be a function(error, diff)'}, 'Throws TypeError');

    t.doesNotThrow(function() {
        diff('old.ini', 'new.ini', function() {});
    }, 'Valid arguments');

    t.end();
});
