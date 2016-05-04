# ftpush: API

The tool can be embedded in other applications.

```js
const ftpush = require('ftpush');
```


## ftpush.main(options)

This serves as the main entry point for ftpush.

* `options` (Object): see the [options section][options]

Return an `EventEmitter` with the following events:

* `DirDone(err, dirpath)`: done handling a (sub-)directory
    * `dirpath` (String): relative path to the (sub-)directory
* `FTPError(err)`: error occurred with the FTP connection
* `WalkerError(err)`: error occurred while walking the source directory
* `Exit(err)`: the process is complete

**Note:** The `(err, ...)` section above shows the parameters used. The actual
  event name does **not** include that section. For example, `DirDone`, `Exit`,
  etc.


## ftpush.defaults

This is an object containing the default values for the different options.
See the [section on options][options] for more information on this.

You may manipulate these values to your liking.


[options]:https://github.com/forfuturellc/ftpush/blob/master/docs/configuration.md#options
