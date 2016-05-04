# ftpush: Configuration

The tool uses different configuration mechanisms, if available. In order
of decreasing precedence:

1. [command-line options](#cli-options)
1. [configuration file](#config-file)
1. [default values](#defaults)

<a name="cli-options"></a>
## CLI options:

These are the options provided through the tool's CLI.

**Note: Since the CLI uses the API, any options passed by embedding
programs should consider this same precedence.**

To view help information in your terminal:

```bash
$ ftpush --help
```

Default values for the different options are displayed within the help
information in square brackets, i.e. `[<default-value>]`.


<a name="config-file"></a>
## Configuration file

The tool uses a Configuration file, named `.ftpush.toml`, by default.
The file should be written in [TOML][toml].

**Warning:** The current implementation requires the file end with the
`.toml` extension.

As a demonstration:

```toml
[default]
remoteDir = "public_html/"

    [default.ftp]
    host = "staging.example.com"
    port = 21
    user = "user"
    pass = "pass"

[production]
remoteDir = ""

    [production.ftp]
    host = "ftp.example.com"
    port = 21
    user = "production"
    pass = "1234"
```

In the example above, `default` and `production` are two different
**profiles**, that can be used to establish the FTP connection. By
default, the **default** profile is used.

For each profile, options as defined in the [options](#options)
section are used.


<a name="defaults"></a><a name="options"></a>
## Available Options:

These provide fallbacks, when values for most options are **not** provided.

* **sourceDir**: source directory. Defaults to the process' current working
  directory
* **remoteDir**: destination directory in the remote server. Defaults to
  the default directory in which the FTP connection is opened in
* **ftp**: FTP connection configuration
    * **host**: host name of the remote server, e.g. `'ftp.example.com'`. **No
    default for this option! You're required to provide one.**
    * **port**: port bound by the FTP service. Defaults to `21`
    * **user**: username to authenticate with. Defaults to `'anonymous'`
    * **pass**: password to authenticate with. Defaults to `'anonymous'`
* **stopOnError**: exit early, on the first error
* **ignoreDirs**: directories to ignore. Defaults to `['.git', '.hg', '.tmp']`
* **configfileName**: name of the configuration file. Defaults to
  `'.ftpush.toml'`
* **filelistName**: name of the file-list. Defaults to `'.ftpush.list'`
* **parallel**: number of directories to handle in parallel. Defaults to `1`.
* **skipDeletion**: whether to skip deletion of remote files. Defaults to
  `false`
* **ignoreFilelist**: whether to ignore the file-list. Defaults to `false`



[toml]:https://github.com/toml-lang/toml
