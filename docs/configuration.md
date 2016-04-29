# ftpush: Configuration

The tool uses a Configuration file, named `.ftpush.toml`, by default.
The file should be written in [TOML][toml].

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

For each profile, there's property:

* **remoteDir**: destination directory in the remote server
* **ftp**: FTP connection configuration


[toml]:https://github.com/toml-lang/toml
