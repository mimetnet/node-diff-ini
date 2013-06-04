# diff-ini

Compare two INI files for differences. This is both a library and a command-line tool.

[![npm version][3]][4] [![dependencies][5]][6]

## Command-Line

#### Install

```
npm install -g diff-ini
```

#### Usage

```
diff-ini path/to/old.ini path/to/new.ini
```

When a `key` changes:

```
-key = bad
+key = bar
```

When a `key` changes inside of a `section`:

```
-Section.Key = Key Route
+Section.Key = Key
```

When a `section` is erased:

```
-Section.B
-  Name = Foo and Bar
```

When a `section` is added:

```
+Section.C
+  Name = Foo and Bar
```


## Library

#### Install as a Library

```
npm install diff-ini
```

#### Usage

```javascript
var diff = require('diff-ini');

diff(process.argv[2], process.argv[3], function(error, result) {
    if (error) {
        console.error('File not found: "%s"', error.path);
    } else {
        diff.print(result);
    }
});
```

#### API

###### diff(strOldFile, strNewFile, fnDone)
Calculate the differences between strOldFile and strNewFile. Call `fnDone(error, resultArray)` when done, or an error occurs.

###### diff.print(result, [log])
Print the differences in a somewhat useful way. Output is sent to `process.stdout` or `log(str)` if you define one.

# TODO
Probably tons! It's working the way I need it to right now, so let me know if you need something.

# Credits
- [async](https://github.com/caolan/async)
- [concat-stream](https://github.com/maxogden/node-concat-stream)
- [deep-diff](https://github.com/flitbit/diff)
- [ini](https://github.com/isaacs/ini)

  [1]: https://api.travis-ci.org/mimetnet/node-diff-ini.png
  [2]: https://travis-ci.org/mimetnet/node-diff-ini
  [3]: https://badge.fury.io/js/diff-ini.png
  [4]: https://badge.fury.io/js/diff-ini
  [5]: https://david-dm.org/mimetnet/node-diff-ini.png
  [6]: https://david-dm.org/mimetnet/node-diff-ini
