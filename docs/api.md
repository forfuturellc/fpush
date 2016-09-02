# ftpush: API

The tool can be embedded in other applications.

```js
const ftpush = require('ftpush');
```


## ftpush.main(options)

This serves as the main entry point for ftpush.

* `options` (Object): see the [options section][options]

Returns the used [event-emitter](#event-emitter).


<a name="event-emitter"></a>
## event-emitter:

The library uses an event-emitter internally to broadcast status of the
process. This emitter is used by reporters to provide a visual display
of the corresponding status.

The event emitter has the following events:

* `Info(message)`: general information, such as `"loading configuration"`
* `Config(configObject)`: Configuration being used
* `DirInfo(dirpath)`: Directory has been queued up for pushing
* `DirDone(err, dirpath)`: done handling a (sub-)directory
    * `dirpath` (String): relative path to the (sub-)directory
* `ConfigError(err)`: error occurred handling configuration
* `FTPError(err)`: error occurred with the FTP connection
* `WalkerError(err)`: error occurred while walking the source directory
* `Exit(err)`: the entire process is complete

**Note:** The `(err, ...)` section above shows the parameters used. The actual
  event name does **not** include that section. For example, `DirDone`, `Exit`,
  etc.


## ftpush.defaults

This is an object containing the default values for the different options.
See the [section on options][options] for more information on this.

You may manipulate these values to your liking.


[options]:https://github.com/forfuturellc/ftpush/blob/master/docs/configuration.md#options
