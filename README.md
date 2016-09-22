# ftpush

> Simple, Super-powered FTP Push

> **NOTE! NOTE! NOTE!
> :construction: WORK IN PROGRESS :construction:
> NOTE! NOTE! NOTE!**

## introduction:

This is a developer tool that should make developer life easier;
greasing the gears. We adhere to a set of principles we believe
will direct its development to a better place.

**Table of Contents**

* [installation](#install)
* [project principles](#principles)
* [limitations](#limitations)
* [hacking](#hacking)


<a name="install"></a>
## installation:

```bash
$ npm install ftpush --global
$ ftpush --help
```

See also:

* [configuring the tool][config]

[config]:https://github.com/forfuturellc/ftpush/blob/master/docs/configuration.md


<a name="principles"></a>
## project principles:

* **No lock-in**: By using the tool, you do **not** get locked
  in. You have the freedom and choice to use another tool. It
  does **not** warrant you to change your workflow just to use the tool.
  The tool should just be a drop-in.
* **Mostly interruptible**: The working of the tool should allow the
  operation to be stopped at any time without requiring the operation to
  be re-executed in whole. This is in consideration to the slow internet
  connections in some remote areas we work in.
* **Minimal**: The tool just handles pushing files to the remote server.
  We should try as much as possible to reduce the code!
* **Embeddable**: The tool exposes an API that allows other programs to
  use. The CLI employs this API itself.


<a name="limitations"></a>
## limitations:

* **Mostly unaware**: The tool does **not** keep a history of the files.
  It simply compares files between the remote server and local machine.
  You will need to use other tools, such as Git, to track such revisions.


<a name="hacking"></a>
## hacking:

To start hacking on the application, read [HACKING.md][hacking] for
guidelines and other relevant information.

[hacking]:https://github.com/forfuturellc/ftpush/blob/master/HACKING.md


## license:


***The MIT License (MIT)***

*Copyright (c) 2016 GochoMugo <mugo@forfuture.co.ke><br>
Copyright (c) 2016 Forfuture LLC <we@forfuture.co.ke>*

**#P003**
