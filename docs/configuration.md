# fpush: Configuration

The tool uses different configuration mechanisms, if available. In order
of decreasing precedence:

1. [command-line options](#cli-options)
1. [configuration file](#config-file)
1. [default values](#defaults)

<a name="cli-options"></a>
## CLI options:

These are the options provided through the tool's CLI.

**Note:** Since the CLI uses the API, any options passed by embedding
programs should consider this same precedence.

To view help information in your terminal:

```bash
$ fpush --help
```

Default values for the different options are displayed within the help
information in square brackets, i.e. `[<default-value>]`.


<a name="config-file"></a>
## Configuration file

The tool uses a Configuration file, named `.fpush.toml`, by default.
The file should be written in [TOML][toml].

If `--config-path <path>` is used, the file pointed to by `<path>` is used.
Otherwise, the file is expected to exist in the current working directory
of the process.

**Warning:** The current implementation requires the file end with the
`.toml` extension.

**Note:** Embedding developers do **not** need to use the configuration
file as they can provide all the necessary options through the
[exposed API][api].

As a demonstration:

```toml
[default]
sourceDir = "dist/"
remoteDir = "public_html/"

    [default.ftp]
    host = "staging.example.com"
    port = 21
    user = "user"
    pass = "pass"

[production]
sourceDir = "dist/"
remoteDir = ""
driver    = "sftp"

    # configuration for the SFTP driver
    # the above section, used FTP driver
    [production.sftp]
    host = "ftp.example.com"
    port = 21
    user = "production"
    pass = "1234"
```

In the example above, `default` and `production` are two different
**profiles**, that can be used to run the process.
By default, the **default** profile is used.
For example, in the terminal, to use the `'production'` profile, you run
`fpush --profile production`.

For each profile, options as defined in the [options](#options)
section can be used.


<a name="defaults"></a><a name="options"></a>
## Available Options:

These provide fallbacks, when values for most options are **not** provided.

* **sourceDir**: source directory. Defaults to the process' current working
  directory
* **remoteDir**: destination directory in the remote server. Defaults to
  the default directory in which the FTP connection is opened in
* **stopOnError**: exit early, on the first error
* **ignoreDirs**: directories to ignore. Defaults to `['.git', '.hg', '.tmp']`
* **filelistName**: name of the file-list. Defaults to `'.fpush.list'`
* **parallel**: number of directories to handle in parallel. Defaults to `1`.
  Unlimited parallelism is triggered if this value is equal or less than `0`.
  See [how parallelism works][parallelism] for more information.
* **skipDeletion**: whether to skip deletion of remote files. Defaults to
  `false`
* **ignoreFilelist**: whether to ignore the file-list. Defaults to `false`
* **reporter**: *optional* function to receive the
  [event-emitter][event-emitter] as its sole argument. This is particularly
  of interest to those developing new reporters. Otherwise, if using the
  CLI, provide the relevant name of your preferred reporter, which defaults
  to `'default'` for the default reporter
* **driver**: *optional* string identifying the driver to be used.
  Defaults to `'ftp'`. Available options: `'ftp'`, `'sftp'`.
* **ftp**: FTP connection configuration, necessary if **driver** is set to
  `'ftp'`
    * **host**: host name of the remote server, e.g. `'ftp.example.com'`. **No
    default for this option! You're required to provide one.**
    * **port**: port bound by the FTP service. Defaults to `21`
    * **user**: username to authenticate with. Defaults to `'anonymous'`
    * **pass**: password to authenticate with. Defaults to `'anonymous'`
* **sftp**: SFTP connection configuration, necessary if **driver** is set to
  `'sftp'`
    * **host**: host name of the remote server, e.g. `'sftp.example.com'`. **No
    default for this option! You're required to provide one.**
    * **port**: port bound by the SFTP service. Defaults to `22`
    * **user**: username to authenticate with. Defaults to `'anonymous'`
    * **pass**: password to authenticate with. Defaults to `'anonymous'`

The following options can **not** be provided in the configuration file
(for obvious reasons):

* **profile**: name of profile to use. Defaults to `'default'`.
* **configFilename**: name of the configuration file. Defaults to
  `'.fpush.toml'`
* **configFilepath**: path to the configuration file.


[api]:https://github.com/forfuturellc/fpush/blob/master/docs/api.md
[event-emitter]:https://github.com/forfuturellc/fpush/blob/master/docs/api.md#event-emitter
[parallelism]:https://github.com/forfuturellc/fpush/blob/master/docs/design.md#parallelism
[toml]:https://github.com/toml-lang/toml
