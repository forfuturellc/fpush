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
* `DirInfo(dirpath, info)`: Directory has been queued up for pushing
    * `dirpath`: [Directory Path](#dirpath)
    * `info`: [Directory Information](#dirinfo)
* `DirDone(err, dirpath, info)`: done handling a (sub-)directory
    * `dirpath`: [Directory Path](#dirpath)
    * `info`: [Directory Information](#dirinfo)
* `ConfigError(err)`: error occurred handling configuration
* `FTPError(err)`: error occurred with the FTP connection
* `WalkerError(err)`: error occurred while walking the source directory
* `Exit(err)`: the entire process is complete

**Note:** The `(err, ...)` section above shows the parameters used. The actual
  event name does **not** include that section. For example, `DirDone`, `Exit`,
  etc.


<a name="dirpath"></a>
#### Directory path:

This is a `String` representing the relative path to the directory being handled.


<a name="dirinfo"></a>
#### Directory information:

This is a `Object` providing information on the processing status of a directory.
It has the following properties:

* `status` (Number): the status of the directory, for example, the directory could be queued.
* `stage` (Number): the stage in the [push process][push-process] the directory is currently in.
    This is only available when `info.status === info.constants.status.push`
* `constants` (Object): contains the constants assigned to `status` and `stage` above
    * `status` (Object)
        * `queued`: Directory has been queued, waiting for further processing
        * `push`: Directory is being run through the [push process][push-process]
        * `done`: Directory has been successfully pushed
        * `error`: Error occurred handling the directory
    * `stage` (Object)
        * `remoteState`: Directory is in [stage I: Remote State][remote-state]
        * `localState`: Directory is in [stage II: Local State][local-state]
        * `diffs`: Directory is in [stage III: Diffs][diffs]
        * `update`: Directory is in [stage IV: update][update]

For example,

```js
emitter.on('DirInfo', function(dirpath, info) {
    // if the directory has been queued
    if (info.status === info.constants.status.queued) {
        console.log("%s: queued", dirpath);
        return;
    }

    // if the directory is being 'pushed'
    if (info.status === info.constants.status.push) {
        // if checking remote state right now
        if (info.stage === info.constants.stage.remoteState) {
            console.log("%s: pushing ... checking remote state");
            return;
        }
        // ... snip ...
    }

    // ... snip ....
});
```


## ftpush.defaults

This is an object containing the default values for the different options.
See the [section on options][options] for more information on this.

You may manipulate these values to your liking.


[options]:https://github.com/forfuturellc/ftpush/blob/master/docs/configuration.md#options
[push-process]:https://github.com/forfuturellc/ftpush/blob/master/docs/design.md#process
[remote-state]:https://github.com/forfuturellc/ftpush/blob/master/docs/design.md#stage-remote-state
[local-state]:https://github.com/forfuturellc/ftpush/blob/master/docs/design.md#stage-local-state
[diffs]:https://github.com/forfuturellc/ftpush/blob/master/docs/design.md#stage-diffs
[update]:https://github.com/forfuturellc/ftpush/blob/master/docs/design.md#stage-update
