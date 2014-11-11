# diff-ini

Compare two INI files for differences. This is both a library and a command-line tool.

[![npm version][3]][4] [![build status][1]][2]  [![dependencies][5]][6] [![devDependencies][7]][8]

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
-section/key = old
+section/key = new
```

When a `section` is erased:

```
-section/one/key = value
```

When a `section` is added:

```
+section/two/key = value
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

# License

[MIT License](https://github.com/mimetnet/node-diff-ini/blob/master/LICENSE)

[1]: https://api.travis-ci.org/mimetnet/node-diff-ini.svg
[2]: https://travis-ci.org/mimetnet/node-diff-ini
[3]: https://badge.fury.io/js/diff-ini.svg
[4]: https://badge.fury.io/js/diff-ini
[5]: https://david-dm.org/mimetnet/node-diff-ini.svg
[6]: https://david-dm.org/mimetnet/node-diff-ini
[7]: https://david-dm.org/mimetnet/node-diff-ini/dev-status.svg?#info=devDependencies
[8]: https://david-dm.org/mimetnet/node-diff-ini/#info=devDependencies
