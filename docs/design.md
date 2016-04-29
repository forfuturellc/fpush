# ftpush: Design

> Design of **ftpush**


## table of contents:

* [terminology](#terminology)
* [the push process](#process)
* [comparing local and remote files](#compare)
* [file-list](#filelist)
* [hooks](#hooks)
* [directory structure](#directory-structure)
* [dependencies](#deps)


<a name="terminology"></a>
### Terminology:

* **local machine**: the machine pushing the files
* **remote machine**: the machine receiving the files
* **file-list**: a tracking list of files, residing on the remote machine
* **local directory**: a directory residing on the local machine
* **remote directory**: a directory residing on the remote machine


<a name="process"></a>
### The push process:

The process can be viewed in stages, in order:

1. Stage I: [**Remote state**](#stage-remote-state)
2. Stage II: [**Local state**](#stage-local-state)
3. Stage III: [**Diffs**](#stage-diffs)
4. Stage IV: [**Update**](#stage-update)

The file-system walker traverses the source directory, firing the process
for each directory it encounters. Therefore, each directory, including
the source directory itself, goes through the above stages.

<a name="stage-remote-state"></a>
#### Stage I: Remote State

> Determining the state of the corresponding remote directory.

The state of the remote directory includes:

* files contained in the remote directory: in simpler terms, it's a `ls`
  through the FTP connection
* content of the file-list: the file-list is downloaded from the remote
  server


<a name="stage-local-state"></a>
#### Stage II: Local State

> Determining the state of the corresponding local directory.

The state of the local directory includes:

* contents of ALL the files in the directory: this involves reading the files
  into buffers


<a name="stage-diffs"></a>
#### Stage III: Diffs

> Generating Diffs between the remote and local directories

Using the [compare](#compare) algorithm in the process, the differences
between the remote and local directories are determined.

The diffs include:

* changed files: files in local and remote directories whose contents differ
* deleted files: files in remote directory, that are **not** existent in the
  local directory


<a name="stage-update"></a>
#### Stage IV: Update

> Update the remote directory

Using the diffs generated in the previous stage:

* the changed files are pushed to the remote server
* the deleted files are deleted from the remote server


<a name="compare"></a>
### comparing remote and local files:

Using a retrieved file-list, a local file is considered newer if:

* it is **not** listed in the file-list
* checksum of the remote file, as recorded in the file-list, is
  different from that of the local file



<a name="filelist"></a>
### file-list:

This is a file, named `.ftpush.list` by default, residing on the remote
server. Its main purpose is to **record the SHA checksum of pushed files**.

It is basically a text file, of zero or more lines in the format:

```
<filename>    <SHA Hash>
```

For example,

```
filename    e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
```


<a name="hooks"></a>
### hooks:

**<< NOT DONE >>**



<a name="directory-structure"></a>
### directory structure:

```
.
|-- bin/                      # runnable scripts i.e. "binaries"
|-- docs/                     # documentation on the tool
|-- lib/                      # the 'ftpush' library
    |-- stages/               # module containing the stages
    `-- main.js               # program's main entry point
`-- package.json              # manifest file
```

**Note:** The above illustration is **not** comprehensive


<a name="dependencies"></a>
### dependencies:

The main dependencies used are:

* [jsftp][jsftp]: client FTP library
* [walker][walker]: directory walker
* [async][async]: async utilities
* [toml-require][toml-require]: `require()` .toml files

[jsftp]:https://github.com/sergi/jsftp
[walker]:https://github.com/daaku/nodejs-walker
[async]:https://github.com/caolan/async
[toml-require]:https://github.com/BinaryMuse/toml-require

